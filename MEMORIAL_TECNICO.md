# Memorial Técnico de Desenvolvimento

**Projeto:** Portal de Solicitações Internas
**Candidato:** Paulo Victor Silva Santos
**Processo:** Desenvolvedor(a) de Sistemas Júnior — bit Soluções

---

## 1. Tecnologias utilizadas

- **Linguagem backend:** Python 3.11.
- **Framework backend:** FastAPI.
- **ORM:** SQLAlchemy 2.0.
- **Validação:** Pydantic v2.
- **Autenticação:** python-jose (JWT) + passlib/bcrypt (hash de senha).
- **Banco de dados:** PostgreSQL 16.
- **Framework frontend:** React 18 + TypeScript + Vite.
- **Roteamento frontend:** React Router.
- **Estilização:** Tailwind CSS.
- **Cliente HTTP:** Axios.
- **Testes:** Pytest + FastAPI TestClient.
- **Containerização:** Docker e Docker Compose.
- **Serviços cloud:** nenhum utilizado — projeto roda localmente via Docker, sem dependência de serviço externo pago, o que simplifica a avaliação (não exige credenciais de terceiros).

---

## 2. Justificativa técnica

Para cada tecnologia: motivo da escolha, benefícios para o cenário proposto, vantagens em relação a alternativas conhecidas, e impacto em manutenção/escalabilidade/produtividade.

**Python 3.11 + FastAPI**
- *Motivo:* linguagem e framework que uso em projetos reais fora deste teste (ex.: um sistema de emissão de ingressos com JWT e webhooks de pagamento), garantindo domínio genuíno, não aprendizado "de última hora" sob prazo apertado.
- *Benefícios:* tipagem via Pydantic reduz bugs de contrato de API; documentação Swagger/OpenAPI gerada automaticamente (`/docs`), útil tanto para mim quanto para quem for avaliar a API sem precisar ler o código.
- *Vantagens vs. alternativas (Flask, Django):* Flask exigiria montar manualmente validação e serialização que o FastAPI já resolve via Pydantic; Django traria um ORM e um admin que não são necessários para uma API deste porte, além de mais peso conceitual para um MVP.
- *Impacto:* validação automática e tipos explícitos reduzem tempo de manutenção — erros de contrato (campo faltando, tipo errado) são pegos antes de chegar à lógica de negócio.

**SQLAlchemy 2.0 (ORM) + PostgreSQL 16**
- *Motivo:* PostgreSQL é o banco relacional mais robusto de uso gratuito para modelar dados com integridade forte (enums nativos, constraints); SQLAlchemy é o ORM Python mais maduro para isso.
- *Benefícios:* `enum` nativo do Postgres (`categoria_enum`, `status_enum`) garante integridade no nível do banco, não só na aplicação.
- *Vantagens vs. alternativas (SQLite em produção, MongoDB):* o domínio é claramente relacional (usuário → solicitações, categorias e status fixos) — um banco de documentos (Mongo) adicionaria complexidade sem benefício; SQLite não sustenta acesso concorrente real de múltiplos colaboradores.
- *Impacto:* regras de integridade garantidas pelo próprio banco tornam o sistema mais seguro contra dados inconsistentes, mesmo se uma futura camada de código pular alguma validação.

**Pydantic v2**
- *Motivo:* validação declarativa de entrada/saída da API, nativa ao FastAPI.
- *Benefícios:* mensagens de erro de validação já formatadas e padronizadas, sem código manual de verificação campo a campo.
- *Vantagens vs. alternativas (validação manual, Marshmallow):* validação manual é repetitiva e sujeita a esquecimento; Marshmallow exigiria integração extra não nativa ao FastAPI.
- *Impacto:* menos código boilerplate de validação, reduzindo superfície de bugs e tempo de manutenção.

**python-jose (JWT) + passlib/bcrypt**
- *Motivo:* JWT é o padrão de mercado para autenticação stateless em APIs REST; bcrypt é o algoritmo de hash de senha recomendado (custo computacional ajustável contra força bruta).
- *Benefícios:* não exige armazenar sessão em servidor (stateless), simplificando escalabilidade horizontal futura.
- *Vantagens vs. alternativas (sessão em banco/Redis):* sessão em banco exigiria infraestrutura extra (tabela de sessões ou Redis) só para um MVP; JWT resolve com uma biblioteca e uma `SECRET_KEY`.
- *Impacto:* menor custo de infraestrutura agora, com o trade-off documentado na Análise Crítica (sem refresh token nesta versão).

**React 18 + TypeScript + Vite**
- *Motivo:* TypeScript reduz bugs de tipo em tempo de desenvolvimento, especialmente relevante num projeto com contrato de API bem definido (os tipos do `types/` espelham os schemas Pydantic do backend); Vite tem build e hot-reload muito mais rápidos que Create React App/Webpack.
- *Benefícios:* autocomplete e checagem de tipos em toda a comunicação com a API; build de produção em segundos.
- *Vantagens vs. alternativas (JavaScript puro, Next.js):* JavaScript puro perderia a segurança de tipos; Next.js traria roteamento server-side e API routes desnecessários para uma SPA consumindo uma API já pronta.
- *Impacto:* menos bugs de integração frontend-backend (campo renomeado ou tipo trocado quebra o build, não a produção), o que importa diretamente para produtividade de manutenção.

**Tailwind CSS**
- *Motivo:* permite construir uma interface consistente e responsiva sem escrever CSS customizado espalhado em vários arquivos.
- *Benefícios:* classes utilitárias tornam o responsivo (`sm:`, `md:`) direto no JSX, o que facilitou corrigir rapidamente os bugs de layout mobile encontrados durante o teste real (ver seção 4).
- *Vantagens vs. alternativas (CSS puro, styled-components):* CSS puro cresce descontroladamente em projetos com várias telas; styled-components adiciona overhead de runtime desnecessário para este escopo.
- *Impacto:* manutenção de estilo mais previsível — mudar o design system é uma questão de configuração (`tailwind.config`), não caça a arquivos `.css` espalhados.

**Docker + Docker Compose**
- *Motivo:* garantir que o avaliador consiga rodar o projeto com um único comando, sem instalar Python, Node ou PostgreSQL manualmente na máquina.
- *Benefícios:* ambiente isolado e reprodutível; elimina o clássico "funciona na minha máquina".
- *Vantagens vs. alternativas (execução manual documentada apenas em texto):* documentação de instalação manual é propensa a divergir da realidade (versão de dependência, SO diferente); Docker fixa o ambiente de forma determinística.
- *Impacto:* foi exatamente a ferramenta usada no teste end-to-end real deste projeto — e os 3 bugs documentados na seção 4 só foram descobertos porque o Docker tornou viável rodar a stack completa de forma realista antes da entrega.

**Pytest**
- *Motivo:* framework de testes padrão do ecossistema Python, com boa integração ao `TestClient` do FastAPI.
- *Benefícios:* testes isolados contra SQLite em memória, rápidos de rodar a cada mudança.
- *Vantagens vs. alternativas (testes manuais apenas):* testes automatizados pegam regressões de forma consistente; foi um teste automatizado (não manual) que impediu a regressão do bug de fuso horário durante a correção.
- *Impacto:* manutenção futura mais segura — qualquer alteração nas regras de status ou filtros quebra um teste antes de chegar à produção.

Decisões específicas de implementação:

- **Geração de código da solicitação no backend** (`SOL-{ano}-{sequencial}`), nunca aceito do cliente, evitando duplicidade e manipulação indevida.
- **Validação de transição de status no backend** (dicionário de transições válidas em `routers/solicitacoes.py`), impedindo, por exemplo, que uma solicitação "Concluída" volte a ser editada via chamada direta à API, mesmo que a interface não ofereça esse caminho.
- **Regra de edição/exclusão restrita a status "Aberto"** aplicada tanto no backend (fonte da verdade) quanto refletida na UI (botões só aparecem quando aplicável) — nunca confiando apenas no frontend para essa restrição.
- **Login por e-mail em vez de "usuário" genérico:** o enunciado pede campos "Usuário e Senha"; optei por usar o e-mail como identificador de login porque é um padrão mais robusto (naturalmente único, sem precisar de validação extra de disponibilidade de "nome de usuário") e é o que já uso em projetos reais — mantendo a mesma semântica de "identificador + senha" pedida.

---

## 3. Justificativa conceitual

**Estrutura geral da aplicação:** arquitetura cliente-servidor clássica — um frontend SPA (React) consumindo uma API REST stateless (FastAPI) via JSON, com PostgreSQL como única fonte de persistência. Sem camadas adicionais (gateway, filas, cache) porque o volume e a complexidade do domínio não justificam esse custo num MVP avaliado em ~5 dias.

**Organização das camadas (backend):** separação em `models` → `schemas` → `routers`, padrão usual de aplicações FastAPI: os `models` descrevem a persistência (SQLAlchemy), os `schemas` descrevem os contratos de entrada/saída da API (Pydantic — nunca expondo o modelo do banco diretamente ao cliente), e os `routers` concentram a lógica de negócio e validação de regras (transições de status, permissões de edição). Essa separação facilita tanto a leitura do código por terceiros quanto a evolução futura (trocar o banco ou adicionar um novo cliente da API sem tocar a camada de persistência).

**Estratégia de modelagem de dados:** duas entidades principais, `Usuario` e `Solicitacao`, unidas por uma relação 1:N (um usuário pode abrir várias solicitações). Optei por não superdimensionar o modelo — por exemplo, não criei uma tabela separada de "histórico de status" porque o enunciado não pede rastreabilidade de auditoria, e adicionar isso agora seria resolver um problema que não foi colocado, às custas de complexidade desnecessária para um MVP (esse trade-off está detalhado na Análise Crítica, seção 4).

**Padrões de projeto utilizados:** Repository implícito via camada de `routers` acessando o ORM diretamente (sem repositório explícito adicional, por ser desnecessário nesta escala); Dependency Injection nativa do FastAPI (`Depends`) para injetar sessão de banco (`get_db`) e usuário autenticado (`get_current_user`) em cada endpoint, evitando acoplamento e duplicação de código de autenticação/conexão; DTO/Schema pattern via Pydantic, separando o modelo de persistência do contrato público da API.

**Estratégia de autenticação:** JWT (JSON Web Token) stateless — o backend nunca guarda sessão em memória ou banco; o token, assinado com `SECRET_KEY`, carrega a identidade do usuário e expira em tempo configurável. Toda rota de dados depende de `get_current_user`, que decodifica e valida o token, além de checar se o usuário ainda está ativo.

**Estratégia de comunicação entre frontend e backend:** REST sobre HTTP/JSON, consumido no frontend via Axios com um interceptor central que injeta o token JWT em toda requisição e trata automaticamente o caso de token expirado (redirecionando para o login em vez de deixar a tela travada com erro 401 silencioso).

**Organização do código-fonte:** monorepo simples com duas pastas de topo (`backend/`, `frontend/`) e um `docker-compose.yml` orquestrando ambas mais o banco — ver a árvore completa no `README.md`. Dentro do frontend, separação por responsabilidade (`pages/`, `components/`, `contexts/`, `services/`, `types/`), evitando que lógica de chamada de API se misture com componentes de UI.

No frontend, a decisão de usar Context API para autenticação (em vez de uma lib de state management maior) reflete o tamanho real do projeto: o estado global necessário é pequeno (usuário logado), e trazer Redux ou Zustand seria complexidade não justificada pelo escopo.

---

## 4. Análise crítica

Sendo honesto sobre o que foi de fato construído e testado neste projeto, dentro do prazo:

**O que funciona e foi validado:**
- Backend importa e todas as rotas registram corretamente (validado via execução direta do app).
- 13 testes automatizados cobrindo login, proteção de rotas, CRUD completo, regras de transição de status, filtro de período e o endpoint de dashboard — todos passando.
- Frontend compila sem erros de TypeScript e o build de produção (`vite build`) é gerado com sucesso.
- Lógica de negócio (código automático, status inicial, regras de edição/exclusão, transições de status) implementada e coberta por teste no nível de backend.
- **Fluxo completo executado de ponta a ponta contra um PostgreSQL real via `docker compose up --build`**: login, criação de solicitações, filtros, transições de status, edição/exclusão bloqueadas fora do status "Aberto", dashboard e responsividade mobile — todos testados manualmente após a subida dos três containers (banco, API e frontend).

**Bugs encontrados e corrigidos durante o teste end-to-end** (documentados aqui de propósito, porque é exatamente esse tipo de verificação que separa "parece pronto" de "está pronto"):

1. **CORS bloqueando o frontend em produção.** O backend só liberava requisições de `http://localhost:5173` (porta do modo desenvolvimento do Vite), mas o build de produção servido pelo Docker roda em `http://localhost:4173`. Login falhava silenciosamente com erro genérico. Corrigido adicionando as duas origens em `app/main.py`.
2. **Filtro de período com bug de fuso horário.** O filtro de data comparava a data escolhida pelo usuário direto contra o timestamp armazenado em UTC. Como o horário de Brasília é UTC-3, uma solicitação criada à noite já registra como o dia seguinte em UTC — então filtrar por "hoje" não encontrava registros criados horas antes. Corrigido convertendo os limites do filtro para UTC considerando o fuso `America/Sao_Paulo` (`_limite_dia_em_utc` em `routers/solicitacoes.py`), com um teste de regressão específico (`test_filtro_por_data_considera_fuso_horario_brasil`) para garantir que não volte a acontecer.
3. **Layout mobile "vazando" para o lado.** A tabela de solicitações (6 colunas) empurrava a página inteira para a direita no mobile, escondendo o botão "+ Nova solicitação" fora da área visível — um clássico problema de containers flex sem `min-width: 0` em cadeia. Primeira correção: `min-w-0` e `overflow-x-hidden` em `Layout.tsx`, e cabeçalhos de `Dashboard.tsx`/`Solicitacoes.tsx` empilhando título e botão no mobile. Isso resolveu o vazamento, mas um segundo teste mostrou que a tabela de 6 colunas ainda ficava cortada na largura da tela, sem indicação visual de que dava para arrastar o dedo para o lado. Correção final: em telas `< sm`, a tabela vira uma lista de cards (um por solicitação, com todos os dados legíveis, sem corte e sem scroll horizontal); a partir de `sm`, continua como tabela completa.

Nenhum desses três bugs apareceria rodando só os testes automatizados de backend ou o `vite build` — só surgiram ao testar de verdade, no navegador, em condições reais (Docker + Postgres + tela de celular). Isso reforça por que o item "teste end-to-end contra banco real", listado como pendência numa versão anterior deste documento, era uma lacuna real e não apenas formalidade.

**Limitações conhecidas e o que eu faria com mais tempo:**
- **Não há testes automatizados de frontend** (ex.: Testing Library/Vitest) — apenas verificação de tipos e build. Backend tem cobertura; frontend não. O bug de layout mobile listado acima é justamente o tipo de regressão que um teste de frontend (ou visual snapshot) teria pego antes do teste manual.
- **Não implementei CI/CD** (diferencial opcional do enunciado) — priorizei os requisitos obrigatórios e os diferenciais de menor custo/maior impacto (Docker, testes, responsividade) dentro do tempo disponível.
- **Não há paginação na listagem de solicitações** — para o volume esperado de um MVP interno isso não é um problema prático, mas seria o primeiro ponto a tratar antes de um uso em produção com muitos registros.
- **Refresh token não implementado** — o JWT expira em 60 minutos e, ao expirar, o usuário é redirecionado ao login (tratado no interceptor do Axios); não há renovação silenciosa de sessão.
- **Sem rate limiting ou logging estruturado** no backend — adequado para um MVP avaliado por um teste técnico, insuficiente para produção real.
- **Índice GIN (`to_tsvector`) criado no schema mas não aproveitado pela busca atual** — o filtro de texto usa `ILIKE`, que não utiliza esse índice; optei por isso para manter a mesma query funcionando tanto no PostgreSQL (produção) quanto no SQLite em memória (testes automatizados), já que a sintaxe de full-text search do Postgres não é portável para SQLite. Com mais tempo, o caminho correto seria usar `to_tsvector`/`plainto_tsquery` em produção e um fallback equivalente nos testes.

Optei por documentar essas lacunas e os bugs corrigidos explicitamente em vez de omiti-los: prefiro entregar um projeto honesto sobre seu processo real de construção — incluindo o que quebrou e como foi corrigido — a um projeto que pareça ter saído perfeito de primeira.

**O que eu faria diferente em um ambiente corporativo de produção:** as limitações listadas acima não são acidentais — são recortes conscientes de escopo para um MVP avaliado em poucos dias. Num contexto de produção real, antes de ir ao ar eu implementaria, nesta ordem de prioridade: (1) CI/CD rodando os testes automaticamente a cada push, para nenhuma regressão chegar à branch principal sem ser detectada; (2) refresh token, para não derrubar a sessão do usuário a cada 60 minutos; (3) rate limiting e logging estruturado, essenciais para observabilidade e proteção contra abuso em um sistema com usuários reais; (4) testes automatizados de frontend, cobrindo especificamente o tipo de bug visual (layout mobile) que só foi pego manualmente neste projeto; e (5) trocar a busca textual por `ILIKE` pela busca via `to_tsvector`/`plainto_tsquery`, aproveitando o índice GIN já criado no schema, com um fallback equivalente para os testes automatizados em SQLite. Também adicionaria paginação na listagem de solicitações, que hoje não é um problema prático pelo volume de dados de um MVP, mas seria o primeiro requisito a revisitar diante de um volume real de uso corporativo.