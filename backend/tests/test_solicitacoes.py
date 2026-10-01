from datetime import date, datetime, timezone
from zoneinfo import ZoneInfo

from app.models.solicitacao import Solicitacao


def criar_solicitacao(client, auth_headers, **overrides):
    payload = {
        "titulo": "Solicitação de teste",
        "descricao": "Descrição de teste com detalhes suficientes.",
        "categoria": "TI",
    }
    payload.update(overrides)
    return client.post("/api/solicitacoes", json=payload, headers=auth_headers)


def test_criar_solicitacao(client, auth_headers):
    resposta = criar_solicitacao(client, auth_headers)
    assert resposta.status_code == 201
    corpo = resposta.json()
    assert corpo["status"] == "Aberto"
    assert corpo["codigo"].startswith("SOL-")
    assert corpo["solicitante"]["email"] == "teste@portal.com"


def test_listar_solicitacoes(client, auth_headers):
    criar_solicitacao(client, auth_headers)
    resposta = client.get("/api/solicitacoes", headers=auth_headers)
    assert resposta.status_code == 200
    assert len(resposta.json()) == 1


def test_filtro_por_categoria(client, auth_headers):
    criar_solicitacao(client, auth_headers, categoria="RH")
    criar_solicitacao(client, auth_headers, categoria="TI")
    resposta = client.get("/api/solicitacoes?categoria=RH", headers=auth_headers)
    assert resposta.status_code == 200
    dados = resposta.json()
    assert len(dados) == 1
    assert dados[0]["categoria"] == "RH"


def test_nao_permite_editar_solicitacao_nao_aberta(client, auth_headers):
    criada = criar_solicitacao(client, auth_headers).json()
    solicitacao_id = criada["id"]

    client.patch(
        f"/api/solicitacoes/{solicitacao_id}/status",
        json={"status": "Em Atendimento"},
        headers=auth_headers,
    )

    resposta = client.put(
        f"/api/solicitacoes/{solicitacao_id}",
        json={"titulo": "Novo título"},
        headers=auth_headers,
    )
    assert resposta.status_code == 400


def test_transicao_de_status_invalida(client, auth_headers):
    criada = criar_solicitacao(client, auth_headers).json()
    solicitacao_id = criada["id"]

    resposta = client.patch(
        f"/api/solicitacoes/{solicitacao_id}/status",
        json={"status": "Concluído"},
        headers=auth_headers,
    )
    assert resposta.status_code == 400


def test_fluxo_completo_de_status(client, auth_headers):
    criada = criar_solicitacao(client, auth_headers).json()
    solicitacao_id = criada["id"]

    r1 = client.patch(
        f"/api/solicitacoes/{solicitacao_id}/status",
        json={"status": "Em Atendimento"},
        headers=auth_headers,
    )
    assert r1.status_code == 200
    assert r1.json()["status"] == "Em Atendimento"

    r2 = client.patch(
        f"/api/solicitacoes/{solicitacao_id}/status",
        json={"status": "Concluído"},
        headers=auth_headers,
    )
    assert r2.status_code == 200
    assert r2.json()["status"] == "Concluído"


def test_excluir_solicitacao_aberta(client, auth_headers):
    criada = criar_solicitacao(client, auth_headers).json()
    resposta = client.delete(f"/api/solicitacoes/{criada['id']}", headers=auth_headers)
    assert resposta.status_code == 204


def test_filtro_por_data_considera_fuso_horario_brasil(client, auth_headers, db_session):
    """
    Regressão: uma solicitação criada às 21h (horário de Brasília) já é
    23h59-00h+ em UTC no dia seguinte. Filtrar pela data "local" em que o
    usuário efetivamente criou o registro precisa continuar encontrando-o,
    mesmo que o timestamp armazenado (UTC) já esteja no próximo dia.
    """
    criada = criar_solicitacao(client, auth_headers).json()

    # Simula criação às 23h de horário de Brasília (02h UTC do dia seguinte)
    data_local = date(2026, 9, 29)
    momento_brasil = datetime(2026, 9, 29, 23, 0, tzinfo=ZoneInfo("America/Sao_Paulo"))
    momento_utc = momento_brasil.astimezone(timezone.utc).replace(tzinfo=None)

    solicitacao = db_session.query(Solicitacao).filter(Solicitacao.id == criada["id"]).first()
    solicitacao.criado_em = momento_utc
    db_session.commit()

    resposta = client.get(
        f"/api/solicitacoes?data_inicio={data_local.isoformat()}&data_fim={data_local.isoformat()}",
        headers=auth_headers,
    )
    assert resposta.status_code == 200
    codigos = [s["codigo"] for s in resposta.json()]
    assert criada["codigo"] in codigos


def test_dashboard_agrega_indicadores(client, auth_headers):
    criar_solicitacao(client, auth_headers)
    criada = criar_solicitacao(client, auth_headers).json()
    client.patch(
        f"/api/solicitacoes/{criada['id']}/status",
        json={"status": "Em Atendimento"},
        headers=auth_headers,
    )

    resposta = client.get("/api/solicitacoes/dashboard", headers=auth_headers)
    assert resposta.status_code == 200
    dados = resposta.json()
    assert dados["total"] == 2
    assert dados["abertas"] == 1
    assert dados["em_atendimento"] == 1
    assert dados["concluidas"] == 0