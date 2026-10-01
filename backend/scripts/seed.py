"""
Script de seed: cria as tabelas (caso ainda não existam) e um usuário
de teste para permitir o primeiro login no sistema.

Uso:
    python -m scripts.seed
"""
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.core.database import Base, SessionLocal, engine
from app.core.security import get_password_hash
from app.models.usuario import Usuario
from app.models import solicitacao  # noqa: F401  (garante registro do model no metadata)


def run():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existente = db.query(Usuario).filter(Usuario.email == "teste@portal.com").first()
        if existente:
            print("Usuário de teste já existe: teste@portal.com")
            return

        usuario = Usuario(
            nome="Usuário de Teste",
            email="teste@portal.com",
            senha_hash=get_password_hash("Teste@123"),
            ativo=True,
        )
        db.add(usuario)
        db.commit()
        print("Usuário de teste criado com sucesso:")
        print("  E-mail: teste@portal.com")
        print("  Senha:  Teste@123")
    finally:
        db.close()


if __name__ == "__main__":
    run()
