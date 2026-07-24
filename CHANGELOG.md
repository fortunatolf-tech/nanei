# Registro de progresso — Nanei

Diário de bordo do desenvolvimento. Cada entrada resume o que foi entregue,
testado e publicado. Formato inspirado em [Keep a Changelog](https://keepachangelog.com/pt-BR/).
Ambiente de produção: **https://www.nanei.com.br** (PWA) e `…/v1` (API).

## [Não lançado]

### 2026-07-24 — S2: convite de cuidadores por link (RF-FAM-02/03)
- **Compartilhamento em família:** administrador pode convidar cuidadores por
  **link com token de uso único (48h)**, escolhendo o papel (Editor,
  Registrador, Visualizador ou Administrador) conforme a matriz §7.3. O
  convidado abre o link, cria/entra na própria conta (F1 reduzido) e passa a
  ver os registros compartilhados do bebê.
- **Segurança:** o token é guardado apenas como hash (só o link tem o valor);
  aceite exige que o e-mail da conta corresponda ao do convite; convites
  expiram, são de uso único e podem ser revogados; apenas admin gerencia
  cuidadores (403 para os demais). Toda ação gera log de auditoria
  (`invite_create/accept/revoke`).
- **PWA:** nova tela **Família e cuidadores** (menu da barra) com lista de
  membros, formulário de convite, cópia do link e revogação de pendentes;
  tela de aceite acessada por `?convite=<token>` que mostra família e papel
  antes de confirmar. Fecha o RF-FAM-03 (gestão de papéis).
- **Banco:** novo modelo `Invite` + migração `add_invite` aplicada no
  PostgreSQL de produção.
- **Testes:** por HTTP na API — fluxo completo (convite → preview → aceite →
  bebê visível ao cuidador) e casos de segurança (não-admin 403, e-mail
  divergente 403, papel inválido 400, e-mail já membro 400, reuso de token
  400, não-membro lendo a família 403); typecheck, testes e build verdes.

### 2026-07-24 — S1: termos e política versionados com re-consentimento (RF-ACC-08/09)
- **Documentos legais:** novo pacote `@nanei/legal` com **Termos de Uso** e
  **Política de Privacidade** versionados (data ISO) — fonte única consumida
  pela API e pela web. Inclui a cláusula obrigatória de caráter informativo
  ("não substitui orientação médica"), protegendo os módulos MED/DEV/EDU
  (RF-ACC-09).
- **Cadastro:** aceite explícito de termos e política agora é obrigatório
  (checkbox com links que abrem os documentos para leitura); a versão aceita é
  registrada como consentimento auditável no servidor.
- **Re-consentimento (RF-ACC-08):** ao publicar uma versão nova, a API detecta
  a divergência (`GET /legal/status`) e o PWA bloqueia o app com um diálogo de
  re-aceite (`POST /legal/aceite`) até o usuário aceitar; falha de rede não
  bloqueia (revalida na próxima abertura). Cada aceite gera log de auditoria.
- **Arquitetura:** o pacote é resolvido por `exports` condicionais — a web
  (bundler) usa o fonte TS direto e a API (runtime Node) usa o `dist`
  compilado; só a API precisa buildar o pacote.
- **Testes:** por HTTP na API — cadastro bloqueado sem aceite (400), cadastro
  com aceite (201), status sem pendências pós-cadastro, e o ciclo completo de
  re-consentimento com bump de versão (pendência detectada → aceite → limpa);
  typecheck, testes e build verdes.

### 2026-07-23 — S2: gráficos de tendência e navegação por abas (RF-ANA-02)
- **PWA:** nova aba **Análises** com gráficos dos últimos 7 dias (sono por dia,
  mamadas por dia, fraldas por dia) via Recharts, mais tiles de médias semanais
  (estende RF-ANA-01 para a semana). Navegação inferior MD3 (Início/Análises)
  conforme o wireframe W1; a home foi reorganizada num shell com abas.
- **Desempenho:** a aba Análises (Recharts, ~112 KB gzip) é carregada sob
  demanda por code-splitting, mantendo o carregamento inicial leve (RNF-02).
- **Qualidade:** configurado o **Vitest**; a agregação diária tem testes
  unitários (5 casos) e o `pnpm test` passou a rodar no CI (RNF-13).
- **Testes:** unitários da agregação (janela de 7 dias, somas, exclusão de
  eventos fora da janela) verdes; typecheck, build e auditoria ok.

### 2026-07-23 — S1: múltiplos bebês com troca em 1 toque (RF-FAM-01)
- **PWA:** seletor de bebês na barra (troca em 1 toque), fluxo "Adicionar
  bebê" e estado vazio que exige cadastrar o primeiro bebê. O bebê ativo é
  persistido entre sessões.
- **Offline:** fila e cache de eventos passaram a ser segregados por bebê —
  cada um tem seus próprios registros, independentes; o `eventStore` agora é
  consciente do bebê ativo.
- **Testes:** por HTTPS — criação de segundo bebê, isolamento dos eventos
  entre bebês e bloqueio (403) de acesso a bebê de outra conta; typecheck e
  build verdes.

### 2026-07-23 — S1: registro retroativo e edição de data/hora (RF-TRK-14)
- **API:** `PATCH /v1/babies/:id/events/:eventId` edita início, fim e payload;
  grava `editadoEm`, respeita a matriz de permissões (§7.3) e gera AuditLog.
- **PWA:** todos os registros manuais (mamadeira, fralda, sono) ganham campo
  de data/hora, permitindo lançamento retroativo; tocar num item da linha do
  tempo abre a edição de horário (o fim é deslocado preservando a duração).
- **Offline:** a fila de sincronização passou a suportar edições — uma edição
  feita sem conexão vira um `PATCH` pendente e é indicada como "aguardando
  sincronização".
- **Testes:** PATCH validado por HTTPS (edição, 404, data inválida) e o fluxo
  create→PATCH que o sync executa; typecheck e build verdes.

### 2026-07-23 — S1: onboarding no PWA e app conectado à API (RF-ACC-01/02/04/08)
- Telas de cadastro/login com consentimentos granulares (fluxo F1);
  "dados do bebê" obrigatório.
- Cliente HTTP com renovação automática de token; `eventStore` offline-first
  (fila com idempotency-key, RNF-03).
- Testado por HTTPS: cadastro com bebê, evento idempotente e deduplicação.

### 2026-07-23 — S1: fundação do backend (RF-ACC-01/02/04/07, RF-FAM-03 parcial)
- PostgreSQL 16 + Prisma 7; entidades do §4.3 (subconjunto S1).
- Autenticação Argon2id + JWT RS256, refresh com rotação e detecção de reuso.
- Consentimento obrigatório no cadastro; AuditLog append-only; autorização
  papel × família nas rotas de bebê.
- API publicada como serviço systemd atrás do nginx em `…/v1`.

### 2026-07-23 — S1: registro rápido, linha do tempo e resumo (RF-TRK-01/02/05/06/15, RF-ANA-01)
- Registro em 2 toques (cronômetro de amamentação, mamadeira, fralda, sono),
  linha do tempo do dia e resumo automático. Persistência local (vira sync no S4).

### 2026-07-23 — S0: fundação do projeto
- Monorepo pnpm + Turborepo; PWA React/Vite/MUI; API NestJS; 13 pacotes por
  equipe; CI no GitHub Actions (typecheck, build, auditoria de dependências).
- PWA publicado em https://www.nanei.com.br com TLS Let's Encrypt.

---

Convenções: [Conventional Commits](https://www.conventionalcommits.org/pt-br/);
fluxo de branches na [Parte 8](docs/08-gestao-colaborativa-e-git.md); status por
sprint na [Parte 10](docs/10-sprints.md#progresso).
