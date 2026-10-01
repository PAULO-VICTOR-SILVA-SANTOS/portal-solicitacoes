from pydantic import BaseModel, EmailStr, ConfigDict


class UsuarioBase(BaseModel):
    nome: str
    email: EmailStr


class UsuarioOut(UsuarioBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    ativo: bool


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: UsuarioOut


class LoginRequest(BaseModel):
    email: EmailStr
    senha: str
