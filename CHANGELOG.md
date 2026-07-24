# Registro de progresso — Nanei

Diário de bordo do desenvolvimento. Cada entrada resume o que foi entregue,
testado e publicado. Formato inspirado em [Keep a Changelog](https://keepachangelog.com/pt-BR/).
Ambiente de produção: **https://www.nanei.com.br** (PWA) e `…/v1` (API).

## [Não lançado]

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
