from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.solicitacao import CategoriaEnum, StatusEnum
from app.schemas.usuario import UsuarioOut


class SolicitacaoCreate(BaseModel):
    titulo: str = Field(min_length=3, max_length=150)
    descricao: str = Field(min_length=5)
    categoria: CategoriaEnum


class SolicitacaoUpdate(BaseModel):
    titulo: Optional[str] = Field(default=None, min_length=3, max_length=150)
    descricao: Optional[str] = Field(default=None, min_length=5)
    categoria: Optional[CategoriaEnum] = None


class SolicitacaoStatusUpdate(BaseModel):
    status: StatusEnum


class SolicitacaoOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    codigo: str
    titulo: str
    descricao: str
    categoria: CategoriaEnum
    status: StatusEnum
    solicitante: UsuarioOut
    criado_em: datetime
    atualizado_em: datetime


class SolicitacaoListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    codigo: str
    titulo: str
    categoria: CategoriaEnum
    status: StatusEnum
    solicitante: UsuarioOut
    criado_em: datetime


class DashboardOut(BaseModel):
    total: int
    abertas: int
    em_atendimento: int
    concluidas: int
