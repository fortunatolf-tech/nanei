# Nanei — Sistema Web Mobile-First para Mães e Bebês

> **nanei!** = dormiu / missão cumprida 💤

**Domínio:** [www.nanei.com.br](https://www.nanei.com.br) (registrado)
**Stack:** Node.js + React + Material Design 3 (MUI)
**Plataforma:** PWA único responsivo (todas as telas) na 1.0; Capacitor para lojas no pós-1.0

## Sobre o projeto

Plataforma web mobile-first que centraliza, em um único produto, o rastreamento diário do bebê, previsão inteligente de sono, desenvolvimento infantil (saltos e marcos), consulta de medicamentos na lactação, sons para dormir, conteúdo educativo e colaboração familiar em tempo real — com segurança de nível clínico e conformidade total à LGPD.

## Status da documentação

| | |
|---|---|
| **Versão** | 1.3 |
| **Data** | 23/07/2026 |
| **Etapa** | 1ª Etapa — Estruturação e Validação |
| **Status** | Aguardando aprovação das partes envolvidas (Gate 0) |

**Release 1.0** = TRK + SLP + DEV + MED (gateway) + AIA + FAM + ANA + NTF + ACC + BIL
**Pós-1.0** = MOM, EDU e SND

**Modelo de negócio (v1.3):** freemium com dupla origem de tokens de IA — a usuária escolhe entre a própria chave (BYOK) ou os tokens da plataforma (quota por plano). Ver [Parte 12](docs/12-modelo-de-monetizacao.md).

## Documentação

| # | Documento | Conteúdo |
|---|---|---|
| 1 | [Visão do Produto](docs/01-visao-do-produto.md) | Objetivo, personas, princípios de design |
| 2 | [Requisitos Funcionais](docs/02-requisitos-funcionais.md) | RFs por módulo (TRK, SLP, DEV, MED, SND, AIA, MOM, EDU, FAM, ANA, NTF, ACC) |
| 3 | [Requisitos Não Funcionais](docs/03-requisitos-nao-funcionais.md) | Desempenho, segurança, LGPD, acessibilidade, backup/DR |
| 4 | [Arquitetura Técnica](docs/04-arquitetura-tecnica.md) | Visão geral, decisões, modelo de dados, API, estratégia de plataforma |
| 5 | [Fluxos de Usuário](docs/05-fluxos-de-usuario.md) | F1–F9: onboarding, registro rápido, SweetSpot, LGPD, IA |
| 6 | [Wireframes](docs/06-wireframes.md) | Baixa fidelidade, 360px (W1–W10) |
| 7 | [Segurança e LGPD](docs/07-seguranca-e-lgpd.md) | Controles, mapa LGPD, retenção, matriz de permissões |
| 8 | [Gestão Colaborativa e Git](docs/08-gestao-colaborativa-e-git.md) | Equipes, branches, regras de merge, cerimônias |
| 9 | [Verificação de Coerência](docs/09-verificacao-de-coerencia.md) | Rastreabilidade, verificações, riscos R1–R10 |
| 10 | [Sprints](docs/10-sprints.md) | Planejamento S0–S7 + pós-1.0 por equipe |
| 11 | [Critérios de Finalização (Gates)](docs/11-criterios-de-finalizacao.md) | Gate 0, gate por PR, gate de release, Definition of Done |
| 12 | [Modelo de Monetização](docs/12-modelo-de-monetizacao.md) | Freemium, dupla origem de tokens de IA (plataforma × BYOK), módulo BIL |

O documento original consolidado está preservado em [`docs/originais/artefatos-app-maes-bebes-v1.2.md`](docs/originais/artefatos-app-maes-bebes-v1.2.md).

## Desenvolvimento

Monorepo pnpm workspaces + Turborepo (Node.js ≥ 22, pnpm 11):

```bash
pnpm install        # instala todas as dependências
pnpm typecheck      # typecheck de todos os pacotes
pnpm build          # build do PWA (apps/web) e da API (apps/api)
pnpm dev            # modo de desenvolvimento
```

| Diretório | Conteúdo |
|---|---|
| `apps/web` | PWA React 18 + Vite + MUI (MD3), mobile-first 360px, modo escuro padrão |
| `apps/api` | API NestJS (prefixo `/v1`, health check em `/v1/health`) |
| `packages/contracts` | Entidades e contratos entre módulos (§4.3) — mudanças exigem aprovação da Core |
| `packages/*` | 12 pacotes de módulo com propriedade por equipe (ver `CODEOWNERS` e §8.1) |

Fluxo de branches: `main` (implantável) ← `develop` (integração) ← `feature/<módulo>-<nº-RF>-<slug>`. Detalhes na [Parte 8](docs/08-gestao-colaborativa-e-git.md).

### Produção

O PWA está publicado em **https://www.nanei.com.br** — o nginx do servidor serve `apps/web/dist` diretamente (vhost em `/www/server/panel/vhost/nginx/www.nanei.com.br.conf`, TLS Let's Encrypt com renovação automática via acme.sh). Para publicar uma nova versão:

```bash
git pull && pnpm install && pnpm --filter @nanei/web build
```

## Contribuindo

O fluxo de trabalho (branches, Conventional Commits, regras de merge e branch protection) está descrito em [Gestão Colaborativa e Git](docs/08-gestao-colaborativa-e-git.md).

## Próximo passo

Revisão deste documento pelas partes envolvidas para liberação do **Gate 0**. O risco R6 (monetização) foi resolvido na v1.3; restam as pendências operacionais da [§12.5](docs/12-modelo-de-monetizacao.md#125-pendências-para-o-gate-0-derivadas-desta-decisão) (preço, quotas, gateway de pagamento, cláusula BYOK nos termos) e a validação do risco R11 (BYOK) pelo jurídico/DPO.
