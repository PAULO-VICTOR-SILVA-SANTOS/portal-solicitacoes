# Portal de Solicitações Internas

Sistema para que colaboradores registrem demandas internas (TI, RH, Compras, Financeiro, Infraestrutura) e acompanhem sua evolução do abertura até a conclusão.

Projeto desenvolvido para o processo seletivo **Desenvolvedor(a) de Sistemas Júnior — bit Soluções**.

## Stack utilizada

| Camada     | Tecnologia                                              |
|------------|------------------------------------------------------------|
| Backend    | Python 3.11 + FastAPI + SQLAlchemy 2.0                     |
| Banco      | PostgreSQL 16                                               |
| Autenticação | JWT (python-jose) + bcrypt (passlib)                      |
| Frontend   | React 18 + TypeScript + Vite + Tailwind CSS                |
| Testes     | Pytest + FastAPI TestClient (backend, banco em SQLite in-memory) |
| Infra      | Docker + Docker Compose                                     |

A stack foi escolhida por ser a mesma que já utilizo em projetos reais (incluindo um sistema de emissão de tickets com autenticação JWT e PostgreSQL), garantindo domínio genuíno das ferramentas — ver `MEMORIAL_TECNICO.md`.

---

## Pré-requisitos

**Opção A — com Docker (recomendado, mais rápido):**
- Docker e Docker Compose instalados (nesse caso, os itens abaixo já vêm prontos dentro dos containers — não é preciso instalar nada localmente)

**Opção B — execução manual:**
- **Linguagem utilizada:** Python 3.11+ (backend) e Node.js 20+ (frontend)
- **Banco de dados:** PostgreSQL 16 rodando localmente (ou acessível remotamente)
- **Dependências:** listadas em `backend/requirements.txt` (Python) e `frontend/package.json` (Node) — instaladas nos passos de Instalação abaixo

---

## Instalação

### Opção A — com Docker (recomendado)

Na raiz do projeto:

```bash
docker compose up --build
```

Isso instala e sobe as três partes automaticamente: banco de dados, backend e frontend (ver detalhes em Execução, abaixo).

### Opção B — instalação manual

**Banco de dados**

Crie o banco PostgreSQL:

```sql
CREATE DATABASE portal_solicitacoes;
```

Você pode aplicar a estrutura de duas formas:
- Deixar o script de seed criar as tabelas automaticamente via SQLAlchemy (ver seed no passo de Backend abaixo), **ou**
- Executar manualmente `backend/scripts/schema.sql` no banco.

**Backend**

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Frontend**

```bash
cd frontend
npm install
```

---

## Configuração

**Variáveis de ambiente**

Backend (`backend/.env`, a partir de `backend/.env.example`):

```bash
cd backend
cp .env.example .env
# edite o .env com a DATABASE_URL e SECRET_KEY corretas
```

Frontend (`frontend/.env`, a partir de `frontend/.env.example`):

```bash
cd frontend
cp .env.example .env
# VITE_API_URL=http://localhost:8000
```

Ao usar Docker (Opção A), essas variáveis já vêm configuradas automaticamente pelo `docker-compose.yml` — não é preciso criar os `.env` manualmente.

**Credenciais de demonstração**

| Campo  | Valor              |
|--------|---------------------|
| E-mail | `teste@portal.com`  |
| Senha  | `Teste@123`         |

Criadas automaticamente pelo script `backend/scripts/seed.py` (executado no passo de Execução do backend, ou automaticamente ao subir via Docker).

---

## Execução

### Opção A — com Docker (recomendado)

```bash
docker compose up --build
```

Isso vai:
1. Subir o PostgreSQL
2. Criar as tabelas e o usuário de teste automaticamente (seed)
3. Subir a API em `http://localhost:8000`
4. Subir o frontend em `http://localhost:4173`

### Opção B — execução manual

**Backend**

Rode o seed (cria tabelas + usuário de teste):

```bash
python -m scripts.seed
```

Suba a API:

```bash
uvicorn app.main:app --reload --port 8000
```

A documentação interativa (Swagger) fica em `http://localhost:8000/docs`.

**Frontend**

Em outro terminal:

```bash
cd frontend
npm run dev
```

---

## Acesso

| Modo de execução      | URL                            |
|------------------------|---------------------------------|
| Docker (Opção A)       | `http://localhost:4173`         |
| Manual (Opção B)       | `http://localhost:5173`         |

Faça login com as credenciais de demonstração listadas na seção Configuração acima (`teste@portal.com` / `Teste@123`).

---

## Testes automatizados

```bash
cd backend
pytest -v
```

13 testes cobrindo autenticação, CRUD, regras de transição de status, filtro de período (incluindo o fuso horário de Brasília) e o endpoint de dashboard (banco SQLite em memória, isolado do PostgreSQL de produção).

---

## Estrutura do projeto

```
portal-solicitacoes/
├── backend/
│   ├── app/
│   │   ├── core/         # configuração, banco de dados, segurança/JWT
│   │   ├── models/        # modelos SQLAlchemy (Usuario, Solicitacao)
│   │   ├── schemas/       # schemas Pydantic (validação/serialização)
│   │   ├── routers/       # endpoints da API (auth, solicitacoes)
│   │   └── main.py        # entrypoint FastAPI
│   ├── scripts/
│   │   ├── schema.sql             # script SQL de criação da estrutura
│   │   ├── DICIONARIO_DE_DADOS.md # dicionário de dados
│   │   └── seed.py                # cria tabelas + usuário de teste
│   ├── tests/              # testes automatizados (pytest)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/          # Login, Dashboard, Solicitações
│   │   ├── components/     # componentes reutilizáveis de UI
│   │   ├── contexts/        # AuthContext (estado de autenticação)
│   │   ├── services/        # chamadas à API (axios)
│   │   └── types/            # tipos TypeScript compartilhados
│   └── package.json
├── docker-compose.yml
├── MEMORIAL_TECNICO.md
└── README.md
```

## Funcionalidades implementadas

- **Autenticação**: login com e-mail/senha, sessão via JWT, logout, todas as rotas de dados protegidas.
- **Cadastro de solicitações**: título, descrição, categoria (TI/RH/Compras/Financeiro/Infraestrutura); código, data e solicitante gerados automaticamente; status inicial "Aberto".
- **Edição e exclusão**: permitidas somente enquanto a solicitação está "Aberto".
- **Gerenciamento de status**: fluxo Aberto → Em Atendimento → Concluído, com transições validadas no backend.
- **Listagem**: código, título, categoria, solicitante, data de abertura e status.
- **Filtros**: período (data início/fim), categoria, status e busca textual por título.
- **Dashboard**: indicadores de total, abertas, em atendimento e concluídas.
- **Responsividade**: layout adaptado para desktop e mobile.
- **Tema claro/escuro**: alternável pelo usuário.

## Diferenciais implementados

- ✅ Docker + Docker Compose (sobe banco, API e frontend com um único comando)
- ✅ Testes automatizados (13 testes, backend)
- ✅ Responsividade (mobile-first)
- ⬜ CI/CD — não implementado neste MVP (ver `MEMORIAL_TECNICO.md`, seção de análise crítica)