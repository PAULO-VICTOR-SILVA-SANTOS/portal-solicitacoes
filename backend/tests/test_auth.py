def test_login_com_credenciais_validas(client, usuario_teste):
    resposta = client.post(
        "/api/auth/login", json={"email": "teste@portal.com", "senha": "Teste@123"}
    )
    assert resposta.status_code == 200
    corpo = resposta.json()
    assert "access_token" in corpo
    assert corpo["usuario"]["email"] == "teste@portal.com"


def test_login_com_senha_invalida(client, usuario_teste):
    resposta = client.post(
        "/api/auth/login", json={"email": "teste@portal.com", "senha": "senhaerrada"}
    )
    assert resposta.status_code == 401


def test_acesso_a_rota_protegida_sem_token(client):
    resposta = client.get("/api/solicitacoes")
    assert resposta.status_code == 401


def test_me_com_token_valido(client, auth_headers):
    resposta = client.get("/api/auth/me", headers=auth_headers)
    assert resposta.status_code == 200
    assert resposta.json()["email"] == "teste@portal.com"
