# Parte 10 — Sprints ("Dayles")

Pré-requisito de todos: **Gate 0 aprovado** ([Parte 11](11-criterios-de-finalizacao.md)). Duração: 2 semanas cada.

| Sprint | Core | Tracking | Insights | Conteúdo |
|---|---|---|---|---|
| **S0 — Fundação** | Monorepo, CI/CD, design system MD3, auth (RF-ACC-01/02), TLS/infra | Modelo `Event` + contrato | Esqueleto analytics | Esqueleto conteúdo |
| **S1** | Consentimento + termos + política (RF-ACC-04/08/09), papéis (RF-FAM-03) | RF-TRK-01/02/05/06 + linha do tempo (RF-TRK-15) | Resumo diário (RF-ANA-01) | Redação original do conteúdo dos saltos (R3) |
| **S2** | Famílias + convites + WS (RF-FAM-01/02/04) | RF-TRK-03/04/08/14 | Gráficos de tendência (RF-ANA-02) | Marcos (RF-DEV-05/06) |
| **S3** | MFA + WebAuthn (RF-ACC-01/03), notificações push | RF-TRK-09/10/11/13, lembretes (RF-NTF-01→03) | Percentis OMS/CDC (RF-ANA-03) | Saltos (RF-DEV-01/02) |
| **S4** | Portal LGPD + AuditLog (RF-ACC-05/06/07), backup/DR (RNF-15) | RF-TRK-07/12/16, offline/PWA + instalação guiada (RNF-16) | **SweetSpot** (RF-SLP-01→04) | Fármacos — gateway de fontes (RF-MED-01/02/05/06) |
| **S5** | Notif. de atividade (RF-FAM-05) + fallback e-mail + **billing/planos + origem de tokens (RF-BIL-01→06)** | Polimento + acessibilidade | Export PDF/CSV (RF-ANA-04) + **voz: extração de eventos (RF-AIA-01/05)** | Atividades (RF-DEV-07/08) |
| **S6 — Hardening** | Pentest (incl. fluxo BYOK), revisão RIPD, teste de restauração de backup, resposta a incidentes + **RF-BIL-07/08** | Testes E2E | Modo recém-nascido (RF-SLP-05) + **consulta IA (RF-AIA-02/03/04)** | Fármacos: classes/listas (RF-MED-03) + revisão de conteúdo dos saltos |
| **S7 — Release 1.0** | Release branch, conformidade final, go-live | — | — | — |
| **Pós-1.0** | Modo Ao vivo (RF-FAM-06); **empacotamento Capacitor p/ lojas ([§4.5](04-arquitetura-tecnica.md#45-estratégia-de-plataforma--decisão-apenas-pwa-na-10-site-único-responsivo))** | **Módulo MOM** (após RF-MOM-04) | Insights (RF-ANA-05), modo criança (RF-SLP-06) | **Módulo SND completo**; **módulo EDU** (condicionado ao plano de moderação — R7); DEV-09 |

---

## Progresso

Status real da execução (atualizado a cada entrega). Log detalhado no
[CHANGELOG](../CHANGELOG.md). Legenda: ✅ concluído · 🚧 em andamento · ⬜ pendente.

> **Nota:** o desenvolvimento está adiantado em relação ao cronograma original
> por rodar em modo solo, sem a dependência entre 4 equipes. O Gate 0 segue
> formalmente pendente (preço/quotas e validações jurídico/DPO), mas a
> construção foi liberada para acelerar a validação de conceito.

### S0 — Fundação ✅
- ✅ Monorepo pnpm + Turborepo, CI/CD (GitHub Actions), design system MD3 base
- ✅ Auth RF-ACC-01/02 (Argon2id, JWT RS256, refresh com rotação)
- ✅ Modelo `Event` + contratos (`packages/contracts`)
- ✅ TLS/infra: PWA e API em produção (https://www.nanei.com.br)

### S1 — em andamento 🚧
| RF | Descrição | Status |
|---|---|---|
| RF-ACC-01/02 | Cadastro, login, sessão com refresh | ✅ |
| RF-ACC-04 | Consentimento granular no cadastro (F1) | ✅ |
| RF-ACC-07 | AuditLog append-only | ✅ |
| RF-ACC-08/09 | Política/termos versionados e re-consentimento | ✅ |
| RF-FAM-01 | Múltiplos bebês, troca em 1 toque, dados independentes | ✅ |
| RF-FAM-03 | Papéis e matriz de permissões (§7.3) | 🚧 (autorização aplicada; convites no S2) |
| RF-TRK-01 | Amamentação com cronômetro | ✅ |
| RF-TRK-02/05/06 | Mamadeira, fralda, sono | ✅ |
| RF-TRK-14 | Registro retroativo + edição de data/hora | ✅ |
| RF-TRK-15 | Linha do tempo diária | ✅ |
| RF-ANA-01 | Resumo automático do dia (+ semanal na aba Análises) | ✅ |
| RF-ANA-02 | Gráficos de tendência (sono, mamadas, fraldas) | ✅ (antecipado do S2) |
| RNF-03 | Funcionamento offline (fila + sync) | ✅ (base; refino no S4) |
| RNF-13 | Testes automatizados + CI | 🚧 (Vitest configurado; cobertura crescendo) |

**Próximo no S1/S2:** convites de cuidadores (RF-FAM-02), curvas de percentil
OMS/CDC (RF-ANA-03).
