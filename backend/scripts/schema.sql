-- =====================================================================
-- Portal de Solicitações Internas — Script de criação da estrutura
-- Banco de dados: PostgreSQL
-- =====================================================================

-- Extensão não é necessária; usamos SERIAL/IDENTITY padrão do Postgres.

CREATE TABLE IF NOT EXISTS usuarios (
    id            SERIAL PRIMARY KEY,
    nome          VARCHAR(120)        NOT NULL,
    email         VARCHAR(150)        NOT NULL UNIQUE,
    senha_hash    VARCHAR(255)        NOT NULL,
    ativo         BOOLEAN             NOT NULL DEFAULT TRUE,
    criado_em     TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE TYPE categoria_enum AS ENUM ('TI', 'RH', 'Compras', 'Financeiro', 'Infraestrutura');
CREATE TYPE status_enum    AS ENUM ('Aberto', 'Em Atendimento', 'Concluído');

CREATE TABLE IF NOT EXISTS solicitacoes (
    id              SERIAL PRIMARY KEY,
    codigo          VARCHAR(20)     NOT NULL UNIQUE,
    titulo          VARCHAR(150)    NOT NULL,
    descricao       TEXT            NOT NULL,
    categoria       categoria_enum  NOT NULL,
    status          status_enum     NOT NULL DEFAULT 'Aberto',
    solicitante_id  INTEGER         NOT NULL REFERENCES usuarios(id),
    criado_em       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    atualizado_em   TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_solicitacoes_status     ON solicitacoes (status);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_categoria  ON solicitacoes (categoria);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_criado_em  ON solicitacoes (criado_em);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_titulo     ON solicitacoes USING gin (to_tsvector('portuguese', titulo));

-- Trigger para manter atualizado_em sempre corrente
CREATE OR REPLACE FUNCTION atualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_solicitacoes_atualizado_em ON solicitacoes;
CREATE TRIGGER trg_solicitacoes_atualizado_em
    BEFORE UPDATE ON solicitacoes
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_timestamp();
