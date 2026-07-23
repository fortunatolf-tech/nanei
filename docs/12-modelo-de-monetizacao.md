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

- [ ] Aprovar preço do Nanei+ e quotas de tokens — **proposta detalhada na §12.6**
- [ ] Selecionar gateway de pagamento (tokenização, PIX + cartão, conformidade PCI via gateway)
- [ ] Jurídico: cláusula de BYOK nos termos de uso (responsabilidade do contrato usuária × provedor)
- [ ] DPO: validar fluxo BYOK no RIPD (a pseudonimização mantém-se aplicável em ambas as origens)

## 12.6 Proposta de preço e quotas (análise de mercado — 23/07/2026)

**Status:** proposta para aprovação no Gate 0.

### 12.6.1 Benchmark de mercado

Preços de apps concorrentes de rastreamento de bebês, levantados em 23/07/2026 (App Store BR quando disponível; demais em moeda de origem):

| App | Mensal | Anual | IA incluída? |
|---|---|---|---|
| **Huckleberry Plus** (App Store BR) | R$ 59,90 | R$ 299,90 | ❌ (só previsão de sono) |
| **Huckleberry Premium** (App Store BR) | R$ 79,90 | R$ 599,90 | ✅ (chat "Berry" + consultoria de sono) |
| **Napper** (App Store BR) | R$ 22,90–44,90 | R$ 99,90–169,90 | ❌ |
| Glow Baby (EUA) | ~US$ 9,99 | — | ❌ |
| Baby Connect (EUA) | US$ 4,99 | — | ❌ |
| Baby Daybook (EUA) | — | US$ 29,99 | ❌ |
| Pebbi (Reino Unido) | £ 2,49 | £ 19,99 | ❌ |

**Leitura do mercado:**
- No Brasil, o mercado se divide em uma faixa **premium** (Huckleberry: R$ 59,90–79,90/mês, único com IA) e uma faixa **acessível** (Napper: R$ 22,90–44,90/mês, foco em sono).
- A média dos planos anuais no Brasil fica entre **R$ 100 e R$ 300** (excluindo o outlier Huckleberry Premium).
- Nenhum concorrente oferece BYOK nem o pacote completo do Nanei 1.0 (rastreamento + sono + desenvolvimento + medicamentos + família + IA) — o gratuito do Nanei já cobre mais que o pago de vários concorrentes.

### 12.6.2 Preço proposto

| Plano | Preço | Racional |
|---|---|---|
| **Nanei Grátis** | R$ 0 | Aquisição e rede de indicação entre mães; produto completo (princípio "zero cobrança emocional") |
| **Nanei+ mensal** | **R$ 24,90/mês** | Entrada no patamar do Napper (R$ 22,90–44,90) e ~60% abaixo do Huckleberry Plus — posição de desafiante com mais funcionalidades |
| **Nanei+ anual** | **R$ 149,90/ano** (≈ R$ 12,49/mês, −50% vs. mensal) | Dentro da faixa anual do Napper (R$ 99,90–169,90) e metade do Huckleberry Plus anual; desconto agressivo para priorizar receita anual (menor churn no 1º ano do bebê) |

Vantagem estrutural de distribuição: como a 1.0 é PWA sem lojas (§4.5), não há taxa de 15–30% da Apple/Google — o preço menor mantém margem igual ou superior à dos concorrentes.

### 12.6.3 Custo de IA e dimensionamento das quotas

Modelos e preços da API Anthropic (tabela oficial, jul/2026; câmbio de referência R$ 5,50/US$ — revalidar no Gate 0):

| Uso no Nanei | Modelo | Input /1M tokens | Output /1M tokens |
|---|---|---|---|
| Extração de eventos por voz (RF-AIA-01) — tarefa estruturada e curta | Claude Haiku 4.5 | US$ 1,00 | US$ 5,00 |
| Consulta ao histórico (RF-AIA-02) — raciocínio sobre dados | Claude Sonnet 5 | US$ 3,00 (US$ 2,00 promocional até 31/08/2026) | US$ 15,00 (US$ 10,00 promocional) |

Custo estimado por interação (com prompt caching do system prompt — leitura de cache custa ~0,1× o input):

| Interação | Tokens típicos (in / out) | Custo | Em R$ |
|---|---|---|---|
| Registro por voz (Haiku 4.5) | ~1.500 / ~300 | ~US$ 0,003 | ~R$ 0,02 |
| Consulta ao histórico (Sonnet 5) | ~3.000 / ~500 | ~US$ 0,017 | ~R$ 0,09 |
| **Média ponderada** (≈ 70% registros / 30% consultas) | — | ~US$ 0,007 | **~R$ 0,04** |

### 12.6.4 Quotas propostas

| Plano | Quota mensal de interações de IA* | Custo máximo/usuária | Custo realista** |
|---|---|---|---|
| **Grátis** | **50/mês** (~1–2/dia) | R$ 4,50 | < R$ 1,00 |
| **Nanei+** | **300/mês** (~10/dia) | R$ 27,00 | R$ 4–9 |
| **BYOK** (qualquer plano) | Sem quota da plataforma (fair use técnico: 1.000/mês contra abuso) | R$ 0 (custo no provedor da usuária) | R$ 0 |

\* 1 interação = 1 registro por voz ou 1 consulta; a quota é exibida como medidor simples, sem expor "tokens" à usuária (RF-BIL-05).
\*\* Considera utilização média de 20–30% da quota e cache hit no system prompt. O custo máximo do Nanei+ (R$ 27) só ocorre com 100% de uso e 100% de consultas — cenário coberto pela margem do anual + mensalidades e pela válvula de escape do BYOK.

**Regras de operação:**
1. Quota esgotada → oferta de upgrade **ou** ativação de BYOK; o fallback por toque (RF-AIA-05) segue ilimitado e gratuito.
2. Aviso proativo a 80% da quota (RF-BIL-05).
3. Quotas e modelo de IA são parâmetros de configuração (feature flags — RF-BIL-06), reajustáveis sem release.
4. Revisar quotas após o beta com dados reais de uso (gatilho: custo médio de IA por usuária ativa > 25% da receita média por usuária).

### 12.6.5 Sanidade econômica (cenário de referência)

Para cada 1.000 usuárias ativas, assumindo conversão de 5% para o Nanei+ (benchmark de apps freemium de parentalidade) e receita média de R$ 15/assinante/mês (mix mensal + anual):

- Receita: 50 assinantes × R$ 15 ≈ **R$ 750/mês**
- Custo de IA: 950 grátis × R$ 1 + 50 premium × R$ 9 ≈ **R$ 1.400/mês**... ⚠️ **no pior cenário realista alto**; no cenário médio (uso de 20% das quotas): 950 × R$ 0,40 + 50 × R$ 4 ≈ **R$ 580/mês**

**Conclusão:** o modelo fecha no cenário médio e fica exposto se o uso de IA do plano grátis for alto. Alavancas já embutidas: quota grátis conservadora (50/mês), Haiku 4.5 para a maioria das interações, prompt caching, BYOK como válvula de escape e quotas ajustáveis por feature flag. Meta de conversão ≥ 5% e monitoramento do custo de IA por usuária ativa desde o beta.

## 12.7 Gateway de pagamento — comparação e recomendação (23/07/2026)

**Status:** recomendação para aprovação no Gate 0.

Critérios (derivados de RF-BIL-02/07/08 e §7.2.1): assinatura recorrente mensal/anual, tokenização de cartão (sem armazenar dados — PCI no gateway), PIX, portal self-service de cancelamento/recibos, webhooks confiáveis e qualidade de documentação/API.

| Critério | **Stripe** | Mercado Pago | Asaas | Pagar.me |
|---|---|---|---|---|
| Assinaturas recorrentes | ✅ Billing maduro (mensal/anual, trial, proration) | ✅ | ✅ (régua de cobrança) | ✅ |
| Tokenização / PCI | ✅ referência de mercado | ✅ | ✅ | ✅ |
| PIX | ✅ | ✅ nativo | ✅ nativo | ✅ nativo |
| PIX Automático (recorrência, previsto pleno em 2026) | Em rollout | Em rollout | Em rollout | Em rollout |
| Portal do assinante pronto (atende RF-BIL-07/08 sem código) | ✅ Customer Portal | Parcial | Parcial | Parcial |
| Documentação / DX | ✅ excelente | Boa | Boa | Boa |
| Perfil típico | SaaS/assinaturas | E-commerce/checkout pronto | SaaS nacional (boleto/régua) | Marketplaces/split |

**Recomendação:**
1. **Stripe Billing** como gateway da 1.0: é o mais forte exatamente no que o Nanei precisa (assinaturas + tokenização + Customer Portal, que entrega RF-BIL-07 e RF-BIL-08 quase sem código), com PIX suportado no Brasil.
2. **Mercado Pago** como alternativa/plano B nacional caso a negociação de taxas ou o suporte a PIX Automático do Stripe atrase — a camada de billing deve ser isolada atrás de uma interface em `/packages/billing` (RF-BIL-06) para permitir troca de gateway sem tocar nos demais módulos.
3. Adotar **PIX Automático** para a recorrência assim que estiver disponível no gateway escolhido (previsão de disponibilidade plena do BC em 2026) — reduz custo por transação e churn involuntário de cartão.
4. Taxas exatas variam por volume e são negociáveis: cotação formal com os dois finalistas é a última pendência antes do Gate 0.
