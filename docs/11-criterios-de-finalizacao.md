# Parte 11 — Critérios de Finalização (Gates)

## Gate 0 — Aprovação dos artefatos (bloqueia a codificação)

Assinaturas obrigatórias de: product owner, tech leads das 4 equipes, DPO/jurídico, design.

Checklist:

- [ ] Matriz de rastreabilidade ([§9.1](09-verificacao-de-coerencia.md#91-matriz-de-rastreabilidade-amostra-do-método--completa-em-planilha-na-aprovação)) completa e sem lacunas
- [ ] Riscos R1–R10 com decisão registrada (**R6 — monetização — pendente e bloqueante**)
- [ ] Provedor de LLM validado pelo DPO: DPA assinado, sem treinamento com dados de usuários (R9)
- [ ] Termos de uso redigidos e revisados pelo jurídico (RF-ACC-09)
- [ ] Marca "Nanei": busca e depósito no INPI (classes 9 e 42) + reserva dos handles @nanei nas redes e lojas
- [ ] Fluxos F1–F8 validados com ao menos 3 usuárias-alvo (teste de conceito)
- [ ] RIPD elaborado e aprovado pelo DPO
- [ ] Contratos entre módulos (`/packages/contracts`) definidos

## Gate por PR (bloqueia merge em `develop`)

Itens 1–5 da [§8.3](08-gestao-colaborativa-e-git.md#83-regras-de-merge-branch-protection), automatizados como branch protection.

## Gate de release (bloqueia merge em `main`)

- [ ] Testes funcionais E2E dos fluxos F1–F8 verdes
- [ ] Testes de segurança: SAST/DAST sem alta/crítica; pentest sem achado crítico aberto
- [ ] Roteiro de conformidade LGPD ([§9.2](09-verificacao-de-coerencia.md#92-verificações-executadas)) executado e aprovado pelo DPO
- [ ] RNF-02 verificado (teste de carga p95 < 300ms)
- [ ] Aprovação do tech lead + PO

## Definition of Done (tarefa)

Código + testes (≥80%) + validação/autorização implementadas + i18n + acessibilidade AA + documentação do endpoint/componente + review aprovado.

---

**Próximo passo:** revisão deste documento pelas partes envolvidas e decisão dos riscos R1–R3 para liberação do Gate 0.
