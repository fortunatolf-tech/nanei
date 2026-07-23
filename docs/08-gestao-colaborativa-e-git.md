# Parte 8 — Gestão Colaborativa e Git

## 8.1 Equipes e propriedade de módulos

| Equipe | Módulos | Diretórios (CODEOWNERS) |
|---|---|---|
| **Core** | ACC, FAM, BIL, infra, design system | `/packages/auth`, `/packages/families`, `/packages/billing`, `/packages/ui` |
| **Tracking** | TRK, NTF | `/packages/tracking`, `/packages/reminders` |
| **Insights** | SLP, ANA | `/packages/sleep`, `/packages/analytics` |
| **Conteúdo** | DEV, MED, EDU, SND | `/packages/development`, `/packages/drugs`, `/packages/content`, `/packages/sounds` |

Monorepo (pnpm workspaces + Turborepo): equipes independentes por pacote; contratos entre módulos definidos por interfaces versionadas em `/packages/contracts` (mudança em contrato exige aprovação da Core).

## 8.2 Fluxo de branches

```
main ──────────●───────────●──────────●──> (sempre implantável; protegida)
                \         /            \
develop ─────●──●───●────●──●───●───────●─> (integração contínua; protegida)
              \     /        \  /
feature/trk-05-fraldas    feature/slp-01-sweetspot   ← 1 branch = 1 RF/tarefa
hotfix/acc-token-reuse ──> main + develop
release/v1.0 ──> main (tag) + develop
```

**Convenções**

- Branch: `feature/<módulo>-<nº-RF>-<slug>` | `hotfix/...` | `release/vX.Y`
- Commits: Conventional Commits (`feat(trk): ...`, `fix(acc): ...`) — changelog automático.
- Vida máxima de feature branch: 5 dias úteis (rebase diário sobre `develop`).

## 8.3 Regras de merge (branch protection)

Merge em `develop` **somente** via Pull Request com:

1. ✅ **2 aprovações**: 1 do CODEOWNER do módulo + 1 de qualquer revisor; auto-aprovação proibida.
2. ✅ **CI verde**: lint + typecheck + testes unitários (cobertura ≥ 80% no pacote) + testes de integração.
3. ✅ **Segurança**: SAST (Semgrep), auditoria de dependências (`npm audit`/Snyk) sem vulnerabilidade alta/crítica, secret scanning.
4. ✅ **Checklist de review** respondido no PR: validação de entrada? autorização por papel? dado pessoal novo → consentimento e AuditLog? query parametrizada? erro sem vazamento de detalhes?
5. ✅ Branch atualizada com `develop` (squash merge; histórico linear).

Merge em `main`: apenas de `release/*` ou `hotfix/*`, com aprovação do tech lead + suíte E2E completa + teste de conformidade LGPD (roteiro [§9.2](09-verificacao-de-coerencia.md#92-verificações-executadas)).

## 8.4 Cerimônias

Sprints de 2 semanas; planning por equipe + sync de dependências entre equipes (30 min, 2×/semana); review conjunta ao fim do sprint; retro por equipe.
