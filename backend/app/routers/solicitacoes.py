from datetime import date, datetime, timedelta, timezone
from typing import Optional
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.solicitacao import CategoriaEnum, Solicitacao, StatusEnum
from app.models.usuario import Usuario
from app.schemas.solicitacao import (
    DashboardOut,
    SolicitacaoCreate,
    SolicitacaoListItem,
    SolicitacaoOut,
    SolicitacaoStatusUpdate,
    SolicitacaoUpdate,
)

router = APIRouter(prefix="/api/solicitacoes", tags=["Solicitações"])

# Fuso horário de referência da empresa (Brasil). Os filtros de período são
# informados pelo usuário como datas "de calendário" no seu fuso local, mas
# criado_em é armazenado em UTC — por isso convertemos os limites do filtro
# para UTC considerando esse fuso, em vez de comparar datas ingênuas direto
# contra timestamps UTC (o que causava exclusão indevida de registros
# criados à noite, quando a data em UTC já virou o dia seguinte).
BR_TZ = ZoneInfo("America/Sao_Paulo")


def _gerar_codigo(db: Session) -> str:
    ano = datetime.utcnow().year
    total_ano = (
        db.query(func.count(Solicitacao.id))
        .filter(func.extract("year", Solicitacao.criado_em) == ano)
        .scalar()
        or 0
    )
    return f"SOL-{ano}-{total_ano + 1:04d}"


def _limite_dia_em_utc(dia: date) -> datetime:
    """
    Converte a meia-noite de `dia` no fuso de Brasília para um datetime UTC
    "ingênuo" (sem tzinfo), no mesmo formato em que criado_em é comparado —
    evitando divergência entre bancos que tratam DateTime(timezone=True) de
    forma diferente (Postgres em produção vs. SQLite nos testes).
    """
    meia_noite_local = datetime.combine(dia, datetime.min.time(), tzinfo=BR_TZ)
    return meia_noite_local.astimezone(timezone.utc).replace(tzinfo=None)


def _buscar_ou_404(db: Session, solicitacao_id: int) -> Solicitacao:
    solicitacao = db.query(Solicitacao).filter(Solicitacao.id == solicitacao_id).first()
    if not solicitacao:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Solicitação não encontrada")
    return solicitacao


@router.post("", response_model=SolicitacaoOut, status_code=status.HTTP_201_CREATED)
def criar_solicitacao(
    payload: SolicitacaoCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    nova = Solicitacao(
        codigo=_gerar_codigo(db),
        titulo=payload.titulo,
        descricao=payload.descricao,
        categoria=payload.categoria,
        status=StatusEnum.ABERTO,
        solicitante_id=current_user.id,
    )
    db.add(nova)
    db.commit()
    db.refresh(nova)
    return nova


@router.get("", response_model=list[SolicitacaoListItem])
def listar_solicitacoes(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    categoria: Optional[CategoriaEnum] = None,
    status_: Optional[StatusEnum] = Query(default=None, alias="status"),
    texto: Optional[str] = None,
    data_inicio: Optional[date] = None,
    data_fim: Optional[date] = None,
):
    query = db.query(Solicitacao)

    if categoria:
        query = query.filter(Solicitacao.categoria == categoria)
    if status_:
        query = query.filter(Solicitacao.status == status_)
    if texto:
        query = query.filter(Solicitacao.titulo.ilike(f"%{texto}%"))
    if data_inicio:
        inicio_utc = _limite_dia_em_utc(data_inicio)
        query = query.filter(Solicitacao.criado_em >= inicio_utc)
    if data_fim:
        fim_utc = _limite_dia_em_utc(data_fim + timedelta(days=1))
        query = query.filter(Solicitacao.criado_em < fim_utc)

    return query.order_by(Solicitacao.criado_em.desc()).all()


@router.get("/dashboard", response_model=DashboardOut)
def dashboard(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    total = db.query(func.count(Solicitacao.id)).scalar() or 0
    abertas = (
        db.query(func.count(Solicitacao.id))
        .filter(Solicitacao.status == StatusEnum.ABERTO)
        .scalar()
        or 0
    )
    em_atendimento = (
        db.query(func.count(Solicitacao.id))
        .filter(Solicitacao.status == StatusEnum.EM_ATENDIMENTO)
        .scalar()
        or 0
    )
    concluidas = (
        db.query(func.count(Solicitacao.id))
        .filter(Solicitacao.status == StatusEnum.CONCLUIDO)
        .scalar()
        or 0
    )
    return DashboardOut(
        total=total, abertas=abertas, em_atendimento=em_atendimento, concluidas=concluidas
    )


@router.get("/{solicitacao_id}", response_model=SolicitacaoOut)
def detalhar_solicitacao(
    solicitacao_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    return _buscar_ou_404(db, solicitacao_id)


@router.put("/{solicitacao_id}", response_model=SolicitacaoOut)
def editar_solicitacao(
    solicitacao_id: int,
    payload: SolicitacaoUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    solicitacao = _buscar_ou_404(db, solicitacao_id)
    if solicitacao.status != StatusEnum.ABERTO:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Apenas solicitações com status 'Aberto' podem ser editadas",
        )

    dados = payload.model_dump(exclude_unset=True)
    for campo, valor in dados.items():
        setattr(solicitacao, campo, valor)

    db.commit()
    db.refresh(solicitacao)
    return solicitacao


@router.delete("/{solicitacao_id}", status_code=status.HTTP_204_NO_CONTENT)
def excluir_solicitacao(
    solicitacao_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    solicitacao = _buscar_ou_404(db, solicitacao_id)
    if solicitacao.status != StatusEnum.ABERTO:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Apenas solicitações com status 'Aberto' podem ser excluídas",
        )
    db.delete(solicitacao)
    db.commit()
    return None


@router.patch("/{solicitacao_id}/status", response_model=SolicitacaoOut)
def alterar_status(
    solicitacao_id: int,
    payload: SolicitacaoStatusUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    solicitacao = _buscar_ou_404(db, solicitacao_id)

    transicoes_validas = {
        StatusEnum.ABERTO: {StatusEnum.EM_ATENDIMENTO},
        StatusEnum.EM_ATENDIMENTO: {StatusEnum.CONCLUIDO, StatusEnum.ABERTO},
        StatusEnum.CONCLUIDO: set(),
    }
    if payload.status not in transicoes_validas[solicitacao.status]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Transição de status inválida: {solicitacao.status.value} → {payload.status.value}",
        )

    solicitacao.status = payload.status
    db.commit()
    db.refresh(solicitacao)
    return solicitacao