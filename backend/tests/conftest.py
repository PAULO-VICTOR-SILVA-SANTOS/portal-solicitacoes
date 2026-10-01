import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from app.core.database import Base, get_db
from app.core.security import get_password_hash
from app.main import app
from app.models.usuario import Usuario

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="function", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db_session():
    db = TestingSessionLocal()
    yield db
    db.close()


@pytest.fixture
def usuario_teste(db_session):
    usuario = Usuario(
        nome="Usuário Teste",
        email="teste@portal.com",
        senha_hash=get_password_hash("Teste@123"),
        ativo=True,
    )
    db_session.add(usuario)
    db_session.commit()
    db_session.refresh(usuario)
    return usuario


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def auth_headers(client, usuario_teste):
    resposta = client.post(
        "/api/auth/login", json={"email": "teste@portal.com", "senha": "Teste@123"}
    )
    token = resposta.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
