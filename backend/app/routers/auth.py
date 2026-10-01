from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import (
    create_access_token,
    get_current_user,
    verify_password,
)
from app.models.usuario import Usuario
from app.schemas.usuario import LoginRequest, Token, UsuarioOut

router = APIRouter(prefix="/api/auth", tags=["Autenticação"])


@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == payload.email).first()
    if not usuario or not verify_password(payload.senha, usuario.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha inválidos",
        )
    if not usuario.ativo:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Usuário inativo")

    token = create_access_token(data={"sub": str(usuario.id)})
    return Token(access_token=token, usuario=UsuarioOut.model_validate(usuario))


@router.post("/logout")
def logout(current_user: Usuario = Depends(get_current_user)):
    # Logout é tratado no cliente (descarte do token). Endpoint mantido
    # para simetria da API e possível blacklist futura de tokens.
    return {"detail": "Logout realizado com sucesso"}


@router.get("/me", response_model=UsuarioOut)
def me(current_user: Usuario = Depends(get_current_user)):
    return current_user
