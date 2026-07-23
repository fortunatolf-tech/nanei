# Parte 9 — Verificação de Coerência dos Artefatos

## 9.1 Matriz de rastreabilidade (amostra do método — completa em planilha na aprovação)

| RF | Fluxo | Wireframe | Entidade | RNF relacionados | Viável? |
|---|---|---|---|---|---|
| RF-TRK-01 | F2 | W1, W2 | Event | RNF-02, 03 | ✅ |
| RF-SLP-01→04 | F3 | W1 | Event, Baby | RNF-02 | ✅ (algoritmo próprio, dados locais) |
| RF-FAM-02→05 | F4 | W1 | FamilyMember | RNF-10 (WS+Redis) | ✅ |
| RF-ACC-04→08 | F1, F6 | W5 | Consent, AuditLog | RNF-09 | ✅ |
| RF-MED-01→05 | F5 | W6* | Drug | RNF-01 | ⚠️ ver risco R1 |
| RF-SND-05 | F8 | W8* | — | RNF-01 | ⚠️ ver risco R2 |

## 9.2 Verificações executadas

- **Fluxos × personas:** F1–F8 cobrem P1–P5; P3 (avó) atendida por papel Registrador + interface de 2 toques. ✅
- **RF × RNF sem conflito:** offline (RNF-03) × sync em tempo real (RF-FAM-04) resolvido por fila com idempotency-key e last-write-wins por evento — documentado em [§4.2](04-arquitetura-tecnica.md#42-decisões). ✅
- **RF × LGPD:** todo RF que cria dado pessoal tem consentimento mapeado ([§7.2](07-seguranca-e-lgpd.md#72-mapa-lgpd)) e gera AuditLog. ✅
- **Wireframes × Material Design:** todos os componentes citados existem no MUI/MD3 (app bar, bottom nav, FAB, segmented buttons, cards). ✅
- **Roteiro de teste de conformidade** (gate de `main`): exportar dados → conferir completude; revogar consentimento → conferir cessação; excluir conta → conferir purga/anonimização; conferir AuditLog das 3 ações.

## 9.3 Riscos e inconsistências identificados (a resolver antes da codificação)

| ID | Risco/Inconsistência | Decisão / Status |
|---|---|---|
| R1 | Base de fármacos (RF-MED) | ✅ **Resolvido (v1.1):** modelo gateway — indexação do LactMed (domínio público, com atribuição) + deep links para e-lactancia e manual do MS. Sem produção de conteúdo clínico próprio (RF-MED-06) |
| R2 | Modo escuta (RF-SND-05) em web: detecção de choro exige aba ativa/PWA instalado; confiabilidade menor que app nativo | ✅ Módulo SND movido para **pós-1.0**; limitação será documentada nos termos |
| R3 | Conteúdo dos saltos (RF-DEV-03) é propriedade intelectual de terceiros (Wonder Weeks) | Produzir conteúdo original com base em literatura científica; **proibido copiar**. Redação inicia em S1 |
| R4 | Curvas OMS/CDC | Usar tabelas LMS oficiais publicadas (dado aberto) — sem bloqueio, registrar fonte |
| R5 | Fotos de menores | Consentimento específico (já em F1); armazenamento em região Brasil; retenção definida em [§7.2.1](07-seguranca-e-lgpd.md#721-tabela-de-retenção-de-dados-por-categoria) |
| R6 | **Modelo de monetização indefinido** | Decidir antes do Gate 0: gratuito total vs. freemium. Afeta feature flags, billing, arquitetura e LGPD (dados de pagamento). **Bloqueia Gate 0** |
| R7 | **Fórum sem moderação** (RF-EDU-03) | Movido para pós-1.0 e condicionado a plano de moderação aprovado (Marco Civil) |
| R8 | Push no iOS (RNF-16) | ✅ Mitigado: instalação guiada do PWA em F1 + fallback por e-mail para lembretes críticos |
| R9 | **IA com dados de menores** (RF-AIA): envio de dados a provedor de LLM | Mitigação definida em RF-AIA-04 (DPA sem treinamento, pseudonimização, opt-in, AuditLog). DPO valida o provedor no Gate 0 |
| R10 | **Triagem EPDS** (RF-MOM-02): risco clínico e emocional se mal conduzida | Pós-1.0, bloqueado por RF-MOM-04 (aditivo RIPD + revisão de responsável clínico). Nunca apresentar como diagnóstico |
