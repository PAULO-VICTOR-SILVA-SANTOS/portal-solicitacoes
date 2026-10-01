import enum

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class CategoriaEnum(str, enum.Enum):
    TI = "TI"
    RH = "RH"
    COMPRAS = "Compras"
    FINANCEIRO = "Financeiro"
    INFRAESTRUTURA = "Infraestrutura"


class StatusEnum(str, enum.Enum):
    ABERTO = "Aberto"
    EM_ATENDIMENTO = "Em Atendimento"
    CONCLUIDO = "Concluído"


class Solicitacao(Base):
    __tablename__ = "solicitacoes"

    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String(20), unique=True, index=True, nullable=False)
    titulo = Column(String(150), nullable=False)
    descricao = Column(Text, nullable=False)
    categoria = Column(Enum(CategoriaEnum, name="categoria_enum"), nullable=False)
    status = Column(
        Enum(StatusEnum, name="status_enum"), nullable=False, default=StatusEnum.ABERTO
    )

    solicitante_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    solicitante = relationship("Usuario", back_populates="solicitacoes")

    criado_em = Column(DateTime(timezone=True), server_default=func.now())
    atualizado_em = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
