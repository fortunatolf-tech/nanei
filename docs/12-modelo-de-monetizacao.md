# Parte 12 — Modelo de Monetização (resolução do risco R6)

**Decisão registrada em 23/07/2026:** modelo **freemium** com dupla origem de tokens para as funcionalidades de IA — a usuária escolhe entre **usar os próprios tokens (BYOK — Bring Your Own Key)** ou **usar os tokens da plataforma**.

## 12.1 Estrutura de planos

| | **Nanei Grátis** | **Nanei+ (premium)** |
|---|---|---|
| Módulos essenciais 1.0 (TRK, SLP, DEV, MED, FAM, ANA, NTF, ACC) | ✅ completo | ✅ completo |
| IA (AIA) com **tokens da plataforma** | ✅ quota mensal limitada* | ✅ quota ampliada* |
| IA (AIA) com **BYOK** (chave própria) | ✅ sem quota da plataforma (fair use) | ✅ idem |
| Conteúdo premium (`Article.nivel = premium`) | ❌ | ✅ |
| Preço | R$ 0 | mensal/anual — *valor a definir no Gate 0* |

\* Quotas exatas a definir no Gate 0 com base no custo por interação do provedor validado pelo DPO (R9).

**Princípios preservados:**

1. **Zero cobrança emocional:** nenhum registro essencial (mamada, fralda, sono, vacina) fica atrás de paywall. O gratuito é um produto completo, não uma demonstração.
2. **A IA nunca fica indisponível:** esgotada a quota da plataforma, a usuária pode continuar via BYOK ou aguardar a renovação mensal — o fallback por toque (RF-AIA-05) segue sempre gratuito.
3. **Transparência de consumo:** medidor visível de quota antes do limite, sem surpresas.

## 12.2 Dupla origem de tokens de IA

```
Perfil → "Assistente de IA" → Origem dos tokens:
  (●) Tokens do Nanei   [barra de quota: ▓▓▓░░ 62% do mês]
  ( ) Minha própria chave (BYOK)
       → campo de chave (validada com chamada de teste)
       → aviso: "Com sua chave, os dados são enviados ao provedor
          sob a SUA conta e contrato. A pseudonimização do Nanei
          (RF-AIA-04) continua sendo aplicada."
```

| Aspecto | Tokens da plataforma | BYOK |
|---|---|---|
| Contrato com o provedor de LLM | Nanei (DPA assinado, sem treinamento — RF-AIA-04) | Da própria usuária (termos dela com o provedor) |
| Pseudonimização (nome do bebê → token) | ✅ | ✅ (aplicada igualmente) |
| Registro no AuditLog | ✅ | ✅ |
| Custo para a usuária | Quota do plano | Cobrança direta do provedor na conta dela |
| Consentimento opt-in de IA | ✅ obrigatório | ✅ obrigatório + aviso específico de BYOK |

**Segurança da chave BYOK:**

- Armazenada com criptografia em nível de coluna (`pgcrypto`, chaves no KMS — mesmo padrão dos dados de saúde, §7.1).
- Nunca exibida após o cadastro (apenas últimos 4 caracteres), nunca logada, nunca enviada ao frontend.
- Validação no cadastro por chamada de teste mínima; remoção com efeito imediato e registro no AuditLog.
- Purga junto com a exclusão da conta (ciclo de 30 dias, §7.2.1).

## 12.3 Requisitos funcionais — Módulo BIL (monetização e planos)

Incluído na **Release 1.0** (a escolha de origem de tokens é pré-requisito do módulo AIA). Propriedade: equipe **Core** (`/packages/billing`).

| ID | Requisito | Prio |
|---|---|---|
| RF-BIL-01 | Plano gratuito com todos os módulos essenciais da 1.0, sem paywall em registros | E |
| RF-BIL-02 | Assinatura premium mensal/anual via gateway de pagamento com tokenização (sem armazenar dados de cartão — §7.2.1) | E |
| RF-BIL-03 | Seleção da origem de tokens de IA por usuário: plataforma ou BYOK, alternável a qualquer momento | E |
| RF-BIL-04 | Gestão de chave BYOK: cadastro com validação, criptografia de coluna, exibição mascarada, remoção imediata; operações registradas no AuditLog | E |
| RF-BIL-05 | Medição de consumo de tokens da plataforma com quota mensal por plano, medidor visível e aviso proativo a 80% do limite | E |
| RF-BIL-06 | Feature flags por plano (conteúdo premium, quotas) resolvidas no backend — nunca apenas ocultadas no frontend | E |
| RF-BIL-07 | Upgrade/downgrade/cancelamento self-service no portal, com efeito no ciclo seguinte e sem retenção forçada | E |
| RF-BIL-08 | Recibos e histórico de pagamentos acessíveis no portal | I |

## 12.4 Impactos nos demais artefatos

| Artefato | Impacto | Onde |
|---|---|---|
| Requisitos funcionais | Novo módulo BIL | [Parte 2 §BIL](02-requisitos-funcionais.md#módulo-bil--monetização-e-planos) |
| Arquitetura — entidades | `Subscription`, `TokenUsage`, `ByokKey` | [§4.3](04-arquitetura-tecnica.md#43-modelo-de-dados-entidades-principais) |
| Arquitetura — decisões | Gateway de pagamento com tokenização (fornecedor a definir no Gate 0) | [§4.2](04-arquitetura-tecnica.md#42-decisões) |
| Segurança | Controle específico para chaves BYOK | [§7.1](07-seguranca-e-lgpd.md#71-controles-de-segurança) |
| Retenção LGPD | Linha para chave BYOK | [§7.2.1](07-seguranca-e-lgpd.md#721-tabela-de-retenção-de-dados-por-categoria) |
| Riscos | R6 resolvido; novo risco R11 (BYOK) registrado | [§9.3](09-verificacao-de-coerencia.md#93-riscos-e-inconsistências-identificados-a-resolver-antes-da-codificação) |
| Sprints | Billing/planos na S5 (Core); RF-BIL-03/04 junto à IA na S5/S6 | [Parte 10](10-sprints.md) |
| Gate 0 | Item R6 destravado; novos itens: gateway de pagamento e quotas | [Parte 11](11-criterios-de-finalizacao.md) |

## 12.5 Pendências para o Gate 0 (derivadas desta decisão)

- [ ] Definir preço do Nanei+ (mensal/anual) e quotas de tokens (grátis e premium)
- [ ] Selecionar gateway de pagamento (tokenização, PIX + cartão, conformidade PCI via gateway)
- [ ] Jurídico: cláusula de BYOK nos termos de uso (responsabilidade do contrato usuária × provedor)
- [ ] DPO: validar fluxo BYOK no RIPD (a pseudonimização mantém-se aplicável em ambas as origens)
