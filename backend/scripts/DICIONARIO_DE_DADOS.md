# Dicionário de Dados — Portal de Solicitações Internas

## Tabela: `usuarios`

| Campo        | Tipo          | Nulo | Padrão  | Descrição                                   |
|--------------|---------------|------|---------|----------------------------------------------|
| id           | SERIAL (PK)   | Não  | auto    | Identificador único do usuário               |
| nome         | VARCHAR(120)  | Não  | —       | Nome completo do colaborador                 |
| email        | VARCHAR(150)  | Não  | —       | E-mail usado para login (único)               |
| senha_hash   | VARCHAR(255)  | Não  | —       | Hash bcrypt da senha (nunca texto puro)       |
| ativo        | BOOLEAN       | Não  | TRUE    | Indica se o usuário pode autenticar-se        |
| criado_em    | TIMESTAMPTZ   | Não  | NOW()   | Data/hora de criação do registro              |

## Tabela: `solicitacoes`

| Campo           | Tipo               | Nulo | Padrão    | Descrição                                                                 |
|-----------------|--------------------|------|-----------|-----------------------------------------------------------------------------|
| id              | SERIAL (PK)        | Não  | auto      | Identificador único interno                                                |
| codigo          | VARCHAR(20)        | Não  | —         | Código legível gerado no padrão `SOL-AAAA-NNNN` (único)                   |
| titulo          | VARCHAR(150)       | Não  | —         | Título/resumo da solicitação                                              |
| descricao       | TEXT               | Não  | —         | Detalhamento da demanda                                                    |
| categoria       | categoria_enum     | Não  | —         | Uma de: TI, RH, Compras, Financeiro, Infraestrutura                       |
| status          | status_enum        | Não  | 'Aberto'  | Uma de: Aberto, Em Atendimento, Concluído                                  |
| solicitante_id  | INTEGER (FK)       | Não  | —         | Referência a `usuarios.id` — usuário que abriu a solicitação (automático) |
| criado_em       | TIMESTAMPTZ        | Não  | NOW()     | Data de criação (automático)                                              |
| atualizado_em   | TIMESTAMPTZ        | Não  | NOW()     | Atualizado automaticamente via trigger a cada UPDATE                      |

### Enumerações

**categoria_enum**: `TI`, `RH`, `Compras`, `Financeiro`, `Infraestrutura`

**status_enum**: `Aberto`, `Em Atendimento`, `Concluído`

### Regras de negócio aplicadas no banco/aplicação

- `codigo` é gerado automaticamente pela aplicação no formato `SOL-{ano}-{sequencial 4 dígitos}` (ex.: `SOL-2026-0001`).
- Toda solicitação nasce com `status = 'Aberto'` e `solicitante_id` preenchido a partir do usuário autenticado (JWT) — nunca informado pelo cliente.
- Edição e exclusão só são permitidas pela API quando `status = 'Aberto'`.
- Transições de status permitidas: `Aberto → Em Atendimento → Concluído` (e retorno `Em Atendimento → Aberto`). `Concluído` é estado final.
- O schema cria um índice GIN (`to_tsvector`) em `titulo`, pensado para busca textual eficiente; a implementação atual do filtro de "texto livre" usa `ILIKE` (não aproveita esse índice ainda), para manter a mesma query compatível com o SQLite usado nos testes automatizados — ver limitação documentada no `MEMORIAL_TECNICO.md`.

### Relacionamento

`solicitacoes.solicitante_id` → `usuarios.id` (N:1 — um usuário pode ter várias solicitações).