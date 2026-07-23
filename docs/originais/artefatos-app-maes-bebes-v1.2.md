# Nanei — Sistema Web Mobile-First para Mães e Bebês
## Documento Único de Artefatos — 1ª Etapa (Estruturação e Validação)

**Produto:** Nanei (verbo-marca: "nanei!" = dormiu/missão cumprida) | **Domínio:** www.nanei.com.br (registrado)

**Versão:** 1.2 | **Data:** 23/07/2026 | **Status:** Aguardando aprovação das partes envolvidas
**Stack:** Node.js + React + Material Design (MUI) | **Plataforma:** PWA único responsivo (todas as telas) na 1.0; Capacitor p/ lojas no pós-1.0 (§4.5). **Release 1.0** = TRK + SLP + DEV + MED (gateway) + AIA + FAM + ANA + NTF + ACC. **Pós-1.0** = MOM, EDU e SND (ver §10).

---

# PARTE 1 — VISÃO DO PRODUTO

## 1.1 Objetivo
Plataforma web mobile-first que centraliza, em um único produto, o rastreamento diário do bebê, previsão inteligente de sono, desenvolvimento infantil (saltos e marcos), consulta de medicamentos na lactação, sons para dormir, conteúdo educativo e colaboração familiar em tempo real — com segurança de nível clínico e conformidade total à LGPD.

## 1.2 Público-alvo e personas

| Persona | Perfil | Necessidade principal |
|---|---|---|
| **P1 — Mãe primípara** | 25–38 anos, celular como dispositivo principal, privação de sono | Registro rápido com 1–2 toques, previsão de soneca, orientação confiável |
| **P2 — Pai/parceiro(a)** | Cuidador secundário | Sincronização em tempo real, notificações do que já foi feito |
| **P3 — Avó/babá** | Menor familiaridade digital | Interface simples, permissões limitadas (registrar sem editar histórico) |
| **P4 — Mãe lactante em tratamento** | Usa medicamentos | Consulta de compatibilidade fármaco × amamentação |
| **P5 — Pediatra (indireto)** | Recebe relatórios | Exportação PDF/CSV padronizada com curvas de percentil |

## 1.3 Princípios de design
1. **Mobile-first real:** breakpoint base 360px; desktop é progressão, não origem.
2. **Material Design 3 (via MUI):** componentes, elevação, motion e theming tokens do Google.
3. **Uso noturno:** modo escuro por padrão entre 20h–7h (configurável), alvos de toque ≥ 48dp.
4. **1 mão, 2 toques:** qualquer registro frequente (mamada, fralda, sono) em no máximo 2 toques a partir da home.
5. **Zero cobrança emocional:** marcos são "podem surgir", nunca checklist obrigatório.

---

# PARTE 2 — REQUISITOS FUNCIONAIS (RF)

Notação: `RF-<módulo>-<nº>`. Prioridade: **E**ssencial / **I**mportante / **D**esejável.

## Módulo TRK — Rastreamento diário
| ID | Requisito | Prio |
|---|---|---|
| RF-TRK-01 | Registrar amamentação com cronômetro, lado (E/D), duração total e por seio | E |
| RF-TRK-02 | Registrar mamadeira: quantidade (ml/oz), tipo (fórmula/leite ordenhado), horário | E |
| RF-TRK-03 | Registrar alimentação sólida: alimento, quantidade, reações, preferências | E |
| RF-TRK-04 | Registrar bombeamento: volume, lado, duração | E |
| RF-TRK-05 | Registrar fralda: tipo (xixi/cocô/ambos), cor, consistência (escala de Bristol) | E |
| RF-TRK-06 | Registrar sono (soneca/noturno) via cronômetro ou entrada manual, com qualidade | E |
| RF-TRK-07 | Registrar banho e higiene (coto umbilical, curativos) | I |
| RF-TRK-08 | Registrar medicamentos/vitaminas: nome, dosagem, via, horário | E |
| RF-TRK-09 | Registrar vacinas: tipo, data, lote, local de aplicação, reações, próximas doses | E |
| RF-TRK-10 | Registrar temperatura com método de medição | I |
| RF-TRK-11 | Registrar crescimento: peso, altura, perímetro cefálico | E |
| RF-TRK-12 | Registrar humor/sintomas do bebê (emojis/escala) | I |
| RF-TRK-13 | Notas livres com anexo de fotos em qualquer registro | I |
| RF-TRK-14 | Registro retroativo com edição de data/hora em qualquer evento | E |
| RF-TRK-15 | Linha do tempo diária cronológica com todos os eventos | E |
| RF-TRK-16 | Registro de locais (casa, creche, consultório) — opcional por evento | D |

## Módulo SLP — Sono inteligente (SweetSpot)
| ID | Requisito | Prio |
|---|---|---|
| RF-SLP-01 | Algoritmo de previsão da janela ideal da próxima soneca (idade + padrões registrados) | E |
| RF-SLP-02 | Faixa colorida na linha do tempo indicando a janela prevista | E |
| RF-SLP-03 | Notificação push quando a janela se aproxima/começa | E |
| RF-SLP-04 | Recálculo automático do dia ao registrar sono fora da previsão | E |
| RF-SLP-05 | Modo recém-nascido (0–3 meses) com janelas de vigília curtas | I |
| RF-SLP-06 | Modo criança (2–6 anos): rotina noturna guiada com passos (banho, livro, canção) | D |

## Módulo DEV — Desenvolvimento (saltos + marcos + atividades)
| ID | Requisito | Prio |
|---|---|---|
| RF-DEV-01 | Calendário de 10 saltos calculado pela **data prevista do parto** (não nascimento), com ajuste para prematuros | E |
| RF-DEV-02 | Linha do tempo de saltos: fases nubladas (irritabilidade) e ensolaradas | E |
| RF-DEV-03 | Conteúdo por salto: mudanças cerebrais, sinais, novas habilidades, como ajudar | I |
| RF-DEV-04 | Alertas: "salto N em X dias" e resumo semanal da fase | I |
| RF-DEV-05 | Checklist interativo de marcos por área (motor grosso/fino, cognitivo, social, linguagem) com padrões OMS/CDC/AAP | E |
| RF-DEV-06 | Registro de marcos com foto e nota | I |
| RF-DEV-07 | Sugestões diárias de atividades/brincadeiras por idade e área, com filtro por material | I |
| RF-DEV-08 | Mapa de habilidades: atingidas × previstas, com relatório de progresso nas 5 áreas | I |
| RF-DEV-09 | Diário do salto com anotações guiadas e galeria de fotos | D |

## Módulo MED — Medicamentos e lactação (gateway para fontes especializadas)
**Modelo:** o sistema **não produz conteúdo clínico próprio**. Atua como buscador/indexador que direciona à monografia na fonte especializada, com atribuição e data de consulta. Elimina o risco de responsabilidade editorial clínica (antigo R1).

| ID | Requisito | Prio |
|---|---|---|
| RF-MED-01 | Busca por nome genérico/comercial com autocomplete sobre índice local de nomes (mapeado às fontes) | E |
| RF-MED-02 | Tela do fármaco: resumo de risco extraído da fonte (quando licença permitir) + **link direto para a monografia original** | E |
| RF-MED-03 | Navegação por classe terapêutica e listas especiais, apontando para as seções correspondentes das fontes | I |
| RF-MED-04 | Favoritos e histórico de buscas | D |
| RF-MED-05 | Banner fixo obrigatório: "Conteúdo informativo de fontes externas. Não substitui prescrição médica." + atribuição da fonte e data de acesso | E |
| RF-MED-06 | Fontes de referência oficiais: **LactMed®** (NIH/NLM — <https://www.ncbi.nlm.nih.gov/books/NBK501922/>, domínio público, atualização mensal), **e-lactancia.org** (APILAM, ES/EN), manual **"Amamentação e uso de medicamentos e outras substâncias"** (Ministério da Saúde, PT-BR) | E |

**Notas de implementação:**
- LactMed é obra do governo dos EUA (domínio público): o conteúdo pode ser reproduzido/indexado com atribuição; disponível também via NCBI E-utilities/Bookshelf para indexação automatizada.
- e-lactancia possui termos próprios: usar apenas **link direto** (deep link por fármaco), sem reprodução, salvo autorização da APILAM.
- Conteúdo do LactMed é em inglês: exibir aviso de idioma; tradução automática **não** será aplicada a conteúdo clínico (risco de erro).
- Sincronização mensal do índice de nomes de fármacos, com registro de versão/data da base.

## Módulo SND — Sons e monitor — **PÓS-1.0**
| ID | Requisito | Prio |
|---|---|---|
| RF-SND-01 | Biblioteca de sons: ruído branco/rosa/marrom, natureza, útero, ninar | E |
| RF-SND-02 | Loop contínuo sem emendas, reprodução em segundo plano (Media Session API) | E |
| RF-SND-03 | Mixagem de camadas com volume independente | D |
| RF-SND-04 | Timer com fade-out gradual | I |
| RF-SND-05 | Modo escuta: dispositivo do bebê detecta choro (Web Audio) e notifica os pais; opção de iniciar som automaticamente; sensibilidade ajustável; processamento 100% local, sem gravação | I |
| RF-SND-06 | Luz noturna: tela como luz de presença com cor ajustável | D |
| RF-SND-07 | Favoritos e uso offline (sons em cache via Service Worker) | I |

## Módulo AIA — Assistente de IA (registro por voz e consulta ao histórico)
| ID | Requisito | Prio |
|---|---|---|
| RF-AIA-01 | Registro por voz: usuária fala naturalmente ("mamou 15 min no esquerdo e fez cocô às 8h") e o sistema extrai **múltiplos eventos estruturados** (Web Speech API + LLM), exibindo cartão de confirmação editável antes de salvar | E |
| RF-AIA-02 | Consulta ao histórico em linguagem natural: "quando foi a última mamada?", "quanto dormiu essa semana?" — respostas calculadas sobre os dados reais do bebê, com os registros-fonte linkados | E |
| RF-AIA-03 | Guardrails obrigatórios: o assistente **não dá orientação médica** (redireciona ao pediatra + banner padrão); nunca inventa registros; toda resposta cita os eventos usados | E |
| RF-AIA-04 | Privacidade da IA: dados enviados ao provedor de LLM com DPA assinado, **sem uso para treinamento**, pseudonimização (nome do bebê → token), processamento registrado no AuditLog e coberto por consentimento específico opt-in | E |
| RF-AIA-05 | Fallback total por toque: nenhuma funcionalidade depende exclusivamente da voz (acessibilidade + ambientes ruidosos) | E |

## Módulo MOM — Acompanhamento da mãe (pós-parto) — **PÓS-1.0**
| ID | Requisito | Prio |
|---|---|---|
| RF-MOM-01 | Registro diário opcional da mãe: humor, sono, dor, recuperação, amamentação (mastite, fissuras), com gráficos próprios | I |
| RF-MOM-02 | Triagem EPDS (Escala de Edimburgo) **opt-in**, com pontuação e, em resultado indicativo, encaminhamento acolhedor a ajuda profissional (CVV 188, lista de serviços) — nunca diagnóstico | I |
| RF-MOM-03 | Dados da mãe = dado de saúde de titular adulto: consentimento específico separado, visibilidade **exclusiva da mãe** (invisível aos demais cuidadores por padrão), criptografia de coluna | E |
| RF-MOM-04 | Condicionantes: aditivo ao RIPD aprovado pelo DPO + revisão de responsável clínico do fluxo EPDS antes do desenvolvimento | E |

## Módulo EDU — Conteúdo educativo e comunidade — **PÓS-1.0**
| ID | Requisito | Prio |
|---|---|---|
| RF-EDU-01 | Biblioteca de artigos por tema (sono, amamentação, introdução alimentar, desfralde) — conteúdo original | I |
| RF-EDU-02 | Cursos estruturados em vídeo com aulas curtas | D |
| RF-EDU-03 | Fórum anônimo por comunidades temáticas — **condicionado a plano de moderação aprovado**: moderação ativa, regras de conduta, canal de denúncia com SLA, retenção de registros de aplicação (Marco Civil da Internet, art. 15) e resposta a ordens judiciais | D |
| RF-EDU-04 | Plano pré-natal: conteúdo semanal de gravidez e transição para pós-parto | D |

## Módulo FAM — Família, perfis e permissões
| ID | Requisito | Prio |
|---|---|---|
| RF-FAM-01 | Múltiplos bebês por conta com alternância em 1 toque; dados e gráficos independentes | E |
| RF-FAM-02 | Convite de cuidadores por e-mail/link, cada um com login próprio | E |
| RF-FAM-03 | Papéis: Administrador / Editor / Registrador / Visualizador (matriz na §7.3) | E |
| RF-FAM-04 | Sincronização em tempo real (WebSocket) entre cuidadores | E |
| RF-FAM-05 | Notificação de atividade: "Papai registrou mamadeira de 120 ml" | I |
| RF-FAM-06 | Modo "Ao vivo": status atual do bebê (dormindo/mamando) visível aos cuidadores | D |

## Módulo ANA — Análises e relatórios
| ID | Requisito | Prio |
|---|---|---|
| RF-ANA-01 | Resumos automáticos diário/semanal/mensal (totais e médias) | E |
| RF-ANA-02 | Gráficos de tendência: sono, mamadas, fraldas, vigília | E |
| RF-ANA-03 | Curvas de percentil OMS/CDC: peso, altura, PC, IMC, com histórico | E |
| RF-ANA-04 | Exportação PDF formatado para pediatra e CSV bruto por período | E |
| RF-ANA-05 | Insights automáticos de padrões (ex.: "sonecas encurtando há 5 dias") | D |

## Módulo NTF — Lembretes
| ID | Requisito | Prio |
|---|---|---|
| RF-NTF-01 | Lembretes por tipo de evento: mamada, medicamento, bombeamento, vacina, consulta, soneca | E |
| RF-NTF-02 | Configuração por intervalo fixo ou horário exato; independente por cuidador | E |
| RF-NTF-03 | Ativação/desativação granular por categoria | E |

## Módulo ACC — Conta, autenticação e LGPD
| ID | Requisito | Prio |
|---|---|---|
| RF-ACC-01 | Cadastro/login com e-mail+senha; MFA opcional (TOTP) | E |
| RF-ACC-02 | Sessão com expiração; refresh token com rotação; logout de todos os dispositivos | E |
| RF-ACC-03 | Bloqueio do app por PIN/biometria (WebAuthn) | I |
| RF-ACC-04 | Consentimento explícito e granular na coleta (finalidade por categoria de dado) | E |
| RF-ACC-05 | Portal do titular: acessar, exportar (JSON/CSV), corrigir e excluir dados próprios e do bebê | E |
| RF-ACC-06 | Exclusão de conta com purga completa em até 30 dias e confirmação | E |
| RF-ACC-07 | Registro auditável de todas as operações com dados pessoais (quem, o quê, quando) | E |
| RF-ACC-08 | Política de privacidade acessível em linguagem clara, versionada, com re-consentimento em mudanças | E |
| RF-ACC-09 | **Termos de uso** separados da política de privacidade, com aceite no cadastro e cláusula explícita: "o serviço tem caráter informativo e não substitui orientação médica" (protege MED, DEV e EDU) | E |

---

# PARTE 3 — REQUISITOS NÃO FUNCIONAIS (RNF)

| ID | Categoria | Requisito |
|---|---|---|
| RNF-01 | Usabilidade | Mobile-first (base 360px); Material Design 3/MUI; modo escuro; toque ≥ 48dp |
| RNF-02 | Desempenho | LCP < 2,5s em 4G; interação de registro < 100ms; API p95 < 300ms |
| RNF-03 | Disponibilidade | 99,5% mensal; funcionamento offline dos registros (fila local + sync) via PWA |
| RNF-04 | Segurança — trânsito | TLS 1.3 obrigatório; HSTS; certificados renovados automaticamente |
| RNF-05 | Segurança — repouso | AES-256 no banco e nos backups; campos sensíveis (saúde) com criptografia em nível de coluna |
| RNF-06 | Autenticação | JWT assinado (RS256), access token ≤ 15 min, refresh com rotação e revogação; MFA TOTP opcional |
| RNF-07 | Entrada de dados | Validação e sanitização em todas as entradas (schema validation no backend); proteção XSS (CSP + escape), SQL Injection (queries parametrizadas/ORM), CSRF (tokens + SameSite) |
| RNF-08 | Monitoramento | Logs de acesso centralizados; alertas de atividade suspeita (força bruta, exfiltração, acesso anômalo); retenção de logs 12 meses |
| RNF-09 | LGPD | Base legal documentada por tratamento; minimização de dados; DPO designado; RIPD para dados de saúde de menores (art. 14 — consentimento específico de um dos pais/responsável) |
| RNF-10 | Escalabilidade | Arquitetura horizontal (stateless API + Redis para sessões/filas); WebSocket com adapter Redis |
| RNF-11 | Acessibilidade | WCAG 2.1 AA; navegação por teclado; contraste mínimo 4,5:1 |
| RNF-12 | Internacionalização | i18n com pt-BR padrão; unidades métrico/imperial configuráveis |
| RNF-13 | Qualidade | Cobertura de testes ≥ 80% em módulos E; pipeline CI obrigatório |
| RNF-14 | Compatibilidade | Últimas 2 versões de Chrome, Safari, Firefox, Edge (mobile e desktop) |
| RNF-15 | **Backup e DR** | Backup criptografado (AES-256) diário e automático; **RPO ≤ 24h, RTO ≤ 4h**; réplicas em zona distinta; teste de restauração **trimestral** documentado; backups incluídos na purga LGPD (ciclo máximo de 30 dias após exclusão) |
| RNF-16 | **Push no iOS** | Web Push no iOS exige PWA instalado (iOS ≥ 16.4). Mitigação: instalação guiada do PWA no onboarding (F1) + fallback por e-mail para lembretes críticos (vacinas, medicamentos). Limitação registrada nos termos de uso |

---

# PARTE 4 — ARQUITETURA TÉCNICA

## 4.1 Visão geral
```
[React PWA (MUI/MD3)] ──HTTPS/TLS1.3──> [API Gateway/Nginx]
        │ WebSocket (wss)                       │
        └───────────────────────────> [Node.js API (Express/NestJS)]
                                          │            │
                                   [PostgreSQL]   [Redis]
                                   (AES-256)      (sessões, filas, pub/sub WS)
                                          │
                                   [S3-compatível] (fotos, criptografadas)
```

## 4.2 Decisões
| Decisão | Escolha | Justificativa |
|---|---|---|
| Frontend | React 18 + MUI (Material 3) + Vite + PWA | Mobile-first, offline, Material nativo |
| Backend | Node.js (NestJS) | Modularidade por equipe, DI, validação por decorators |
| Banco | PostgreSQL 16 | Relacional forte para dados clínicos; RLS por família |
| Tempo real | Socket.IO + Redis adapter | RF-FAM-04/05/06 |
| Estado offline | IndexedDB + fila de sync com resolução last-write-wins por evento | RNF-03 |
| Gráficos | Recharts | Percentis e tendências |
| Auth | JWT RS256 + refresh rotativo; TOTP (otplib); WebAuthn | RNF-06, RF-ACC |
| IA (voz/consulta) | Web Speech API (captura) + LLM via API com DPA, saída estruturada validada por schema | RF-AIA; RNF-09 |

## 4.5 Estratégia de plataforma — decisão: **apenas PWA na 1.0** (site único responsivo)

**Pergunta:** app nativo + site, ou só site que rode em todas as telas?

| Critério | Só PWA (site responsivo instalável) | PWA + apps nativos |
|---|---|---|
| Custo/prazo | 1 codebase, 4 equipes como planejado | +40–60% (builds iOS/Android, revisão de lojas, releases paralelos) |
| Todas as telas | ✅ Celular, tablet, desktop, TV — breakpoints 360/600/905/1240px (MD3) | ✅ idem, com 3 produtos para manter |
| Push | ✅ Android/desktop nativo; iOS exige PWA instalado (RNF-16, mitigado no F1) | ✅ pleno |
| Offline | ✅ Service Worker + IndexedDB (já na RNF-03) | ✅ |
| Registro por voz (RF-AIA-01) | ✅ Web Speech API | ✅ |
| Apple Watch / Live Activities | ❌ inviável | ✅ |
| Modo escuta em 2º plano (RF-SND-05) | ⚠️ limitado (tela ativa) | ✅ |
| Distribuição | Link direto, sem lojas, atualização instantânea | Lojas (visibilidade + 15–30% de taxa sobre assinaturas) |

**Decisão registrada:**
1. **Release 1.0 = PWA único** (React responsivo, mobile-first 360px → tablet → desktop). Atende "rodar em todos os tipos de tela" com 1 codebase e sem atrasar o cronograma. As únicas perdas reais (Watch, escuta em 2º plano) pertencem a módulos já movidos para pós-1.0.
2. **Pós-1.0:** empacotar o mesmo código com **Capacitor** (reaproveitamento ~95%) para publicar nas lojas — resolve push pleno no iOS, áudio em 2º plano (SND) e presença nas stores, sem reescrever nada. Reavaliar Watch nessa fase.
3. Gatilho para antecipar o Capacitor: se a taxa de instalação do PWA no iOS (F1) ficar < 40% no beta.

## 4.3 Modelo de dados (entidades principais)
```
User(id, email, senha_hash[argon2id], mfa_secret?, criado_em)
Family(id, nome)
FamilyMember(user_id, family_id, papel[admin|editor|registrador|visualizador])
Baby(id, family_id, nome, nascimento, data_prevista_parto, sexo, foto?)
Consent(id, user_id, categoria, finalidade, versao_politica, aceito_em, revogado_em?)
Event(id, baby_id, tipo[mamada|mamadeira|solido|bombeamento|fralda|sono|banho|
      medicamento|vacina|temperatura|crescimento|humor|atividade|nota],
      inicio, fim?, payload JSONB, local?, criado_por, criado_em, editado_em?)
Milestone(id, baby_id, categoria, descricao, atingido_em?, foto?, nota?)
Leap(id, baby_id, numero, inicio_previsto, fim_previsto)  -- derivado, cacheado
Reminder(id, user_id, baby_id, tipo, regra[intervalo|horario], config JSONB, ativo)
Drug(id, nome_generico, nomes_comerciais[], classe, monografia JSONB, fontes[])
Article(id, tema, titulo, corpo, nivel[gratuito|premium])
AuditLog(id, user_id, acao, entidade, entidade_id, ip, user_agent, timestamp)  -- imutável
```
`Event.payload` JSONB permite campos específicos por tipo sem migrações por equipe (ex.: mamada → `{lado, duracao_e, duracao_d}`; fralda → `{tipo, cor, bristol}`).

## 4.4 API (padrão REST — exemplos)
```
POST   /auth/register | /auth/login | /auth/refresh | /auth/mfa/verify
GET    /babies/:id/events?tipo=&de=&ate=            (paginado)
POST   /babies/:id/events                            (idempotency-key p/ sync offline)
GET    /babies/:id/sweetspot                         (previsão do dia)
GET    /babies/:id/leaps
GET    /babies/:id/growth/percentiles
GET    /drugs?q=ibuprofeno
POST   /families/:id/invites
GET    /me/data-export                               (LGPD — JSON/CSV assíncrono)
DELETE /me                                           (LGPD — exclusão com confirmação)
GET    /me/audit-log
```
Erros: RFC 7807. Autorização: middleware papel × família em toda rota de `baby`.

---

# PARTE 5 — FLUXOS DE USUÁRIO

## F1 — Onboarding e consentimento (RF-ACC-01, 04, 08)
```
Início → Tela boas-vindas → Criar conta (e-mail/senha)
→ Aceite dos Termos de Uso (RF-ACC-09)
→ Política de privacidade (resumo em linguagem clara + link íntegra)
→ Consentimentos granulares [dados do bebê: obrigatório p/ uso |
   notificações: opcional | fotos: opcional | analytics: opcional]
→ (opcional) Ativar MFA → Cadastrar bebê (nome, nascimento, data prevista do parto)
→ (iOS/Android) Instalação guiada do PWA na tela inicial — essencial p/ push no iOS (RNF-16)
→ Home com tour de 3 passos
```
**Regra:** sem consentimento da categoria "dados do bebê" o cadastro não prossegue (base legal: consentimento do responsável, LGPD art. 14 §1º).

## F2 — Registro rápido de mamada (RF-TRK-01, princípio "2 toques")
```
Home → toque no card "Amamentar" → cronômetro inicia no último lado sugerido
→ (alternar lado com 1 toque) → toque "Parar" → registro salvo + toast desfazer
→ linha do tempo atualiza → WebSocket notifica demais cuidadores (RF-FAM-05)
```
Alternativa: pressão longa no card → entrada manual retroativa (RF-TRK-14).

## F3 — SweetSpot (RF-SLP-01→04)
```
Bebê acorda (registro de fim de sono) → backend calcula janela de vigília por idade
→ ajusta pela média móvel dos últimos 7 dias → faixa verde na linha do tempo
→ push 15 min antes da janela → usuária registra soneca
→ se fora da janela: recálculo do restante do dia
```

## F4 — Convite de cuidador e permissões (RF-FAM-02, 03)
```
Admin → Família → "Convidar" → e-mail + papel → link com token (48h, uso único)
→ convidado cria conta própria (F1 reduzido: consente pela própria conta,
   não pelos dados do bebê — já consentidos pelo responsável)
→ entra na família com o papel definido → sync em tempo real ativa
```

## F5 — Consulta de medicamento na lactação (RF-MED)
```
Home → "Medicamentos" → busca "ibupro..." → autocomplete (índice local de nomes)
→ tela do fármaco: [banner: "Fonte externa. Não substitui orientação médica."]
→ resumo de risco (LactMed, domínio público, com atribuição + data + aviso de idioma EN)
→ botões: [Ver no LactMed ↗] [Ver no e-lactancia ↗] [Manual MS (PT) ↗]
→ favoritar / compartilhar link da fonte
```

## F6 — Direitos do titular LGPD (RF-ACC-05, 06)
```
Perfil → "Meus dados e privacidade" →
  [Ver dados] → visão consolidada por categoria
  [Exportar] → job assíncrono → e-mail com link (24h) p/ JSON/CSV
  [Corrigir] → edição direta ou ticket p/ dados não editáveis
  [Revogar consentimento] → por categoria, efeito imediato
  [Excluir conta] → aviso de irreversibilidade → confirmação por senha + e-mail
   → purga em 30 dias (soft delete imediato, anonimização de logs obrigatórios)
Toda ação acima → AuditLog (RF-ACC-07)
```

## F7 — Exportar relatório para pediatra (RF-ANA-04)
```
Análises → "Relatório" → período + seções (sono/alimentação/crescimento/vacinas)
→ gerar PDF (curvas de percentil incluídas) → compartilhar/baixar
```

## F8 — Modo escuta (RF-SND-05) — pós-1.0
```
Dispositivo A (junto ao bebê): Sons → "Modo escuta" → escolher som + sensibilidade
→ processamento local do microfone (sem gravação/transmissão de áudio)
Dispositivo B (pais): recebe push "choro detectado" → opção de aumentar som remoto
```

## F9 — Registro por voz e consulta com IA (RF-AIA)
```
Home → toque no 🎤 (FAB) → [1º uso: consentimento específico de IA (RF-AIA-04)]
→ fala: "mamou 15 minutos no esquerdo e depois trocei fralda de cocô"
→ transcrição em tela → LLM extrai eventos estruturados
→ cartão de confirmação: [Mamada E 15min ✏️] [Fralda cocô ✏️]
→ "Confirmar" → salva → sync familiar (idêntico ao registro manual)
Consulta: 🎤 ou texto → "quanto ela dormiu essa semana?"
→ resposta calculada sobre os dados + links para os registros usados
→ pergunta de cunho médico → "Isso é com o pediatra 💙" + banner padrão
```

---

# PARTE 6 — WIREFRAMES (baixa fidelidade, 360px)

## W1 — Home / Linha do tempo
```
┌────────────────────────────┐
│ ☰  [foto] Alice ▾    🔔 👤 │  ← app bar MD3; ▾ troca de bebê (RF-FAM-01)
├────────────────────────────┤
│ ▒▒▒ SweetSpot 14:10–14:40 ▒│  ← faixa de previsão (RF-SLP-02)
├────────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐    │
│ │ 🤱  │ │ 🍼  │ │ 💤  │    │  ← cards de ação rápida (2 toques)
│ │Peito│ │Mamad│ │Sono │    │
│ └─────┘ └─────┘ └─────┘    │
│ ┌─────┐ ┌─────┐ ┌─────┐    │
│ │ 🧷  │ │ 💊  │ │ ➕  │    │
│ │Frald│ │Medic│ │Mais │    │
│ └─────┘ └─────┘ └─────┘    │
├─ HOJE ─────────────────────┤
│ 13:02 🤱 Mamada E 12min    │
│ 11:40 🧷 Fralda (xixi)     │
│ 09:15 💤 Soneca 1h05       │
│        [registrado: Papai] │  ← autoria (FAM)
├────────────────────────────┤
│ [Home][Análises][Dev][Sons][+]│ ← bottom nav MD3 (5 destinos)
└────────────────────────────┘
```

## W2 — Cronômetro de amamentação
```
┌────────────────────────────┐
│ ←  Amamentação             │
│        ⏱ 07:42             │
│   (anel de progresso MD3)  │
│  [ Esquerdo ● ] [ Direito ]│  ← segmented buttons
│  E: 07:42      D: 00:00    │
│  ┌──────────────────────┐  │
│  │      ■ PARAR         │  │  ← FAB estendido
│  └──────────────────────┘  │
│  + nota  + foto  🕐 manual │
└────────────────────────────┘
```

## W3 — Análises
```
┌────────────────────────────┐
│ Análises        [Dia|Sem|Mês]│ ← tabs
│ Sono total: 13h20 (↑ 4%)   │
│ ▁▃▅▆▅▇▆  (gráfico barras)  │
│ Mamadas: 8 | Fraldas: 6    │
│ ── Crescimento ──          │
│ Peso: 6,4kg — P62 (OMS)    │
│ [curva de percentil]       │
│ [ Exportar PDF ] [ CSV ]   │
└────────────────────────────┘
```

## W4 — Desenvolvimento (saltos + marcos)
```
┌────────────────────────────┐
│ Desenvolvimento            │
│ ☁️ Salto 4 — dia 3 de 5    │
│ [linha do tempo: ☀☁☀☁☀]   │
│ "O mundo dos eventos"      │
│ ▸ Sinais desta fase        │
│ ▸ Como ajudar              │
│ ── Marcos (4–5 meses) ──   │
│ ◉ Rola de bruços p/ costas │
│ ○ Transfere objeto de mão  │
│ ── Atividade de hoje ──    │
│ 🎲 "Cadê? Achou!" (social) │
└────────────────────────────┘
```

## W5 — Portal LGPD
```
┌────────────────────────────┐
│ ← Meus dados e privacidade │
│ 📄 Política de privacidade │
│ ✅ Consentimentos          │
│    Dados do bebê    [ON ]  │
│    Fotos            [ON ]  │
│    Notificações     [OFF]  │
│ ⬇ Exportar meus dados      │
│ ✏ Corrigir dados           │
│ 📜 Histórico de acesso     │
│ 🗑 Excluir conta (irrevers.)│
└────────────────────────────┘
```

W6–W10 (login/MFA, monografia de fármaco, player de sons, família/permissões, lembretes) seguem os mesmos padrões MD3: app bar + conteúdo em cards + bottom nav; especificação de alta fidelidade será derivada destes após aprovação.

---

# PARTE 7 — SEGURANÇA E LGPD (detalhamento)

## 7.1 Controles de segurança
| Camada | Controle | Implementação |
|---|---|---|
| Trânsito | TLS 1.3 | Nginx `ssl_protocols TLSv1.3`; HSTS `max-age=63072000; includeSubDomains; preload` |
| Repouso | AES-256 | Criptografia de volume + `pgcrypto` para colunas de saúde; chaves em KMS/vault, rotação anual |
| Senhas | Argon2id | Custo alinhado a OWASP; verificação contra senhas vazadas |
| Sessão | JWT RS256 | Access 15 min; refresh 30 dias com rotação e detecção de reuso (revoga família de tokens) |
| MFA | TOTP opcional | Códigos de recuperação; obrigatório para papel Admin (recomendado) |
| XSS | CSP estrita | `default-src 'self'`; React escapa por padrão; sanitização de rich text (DOMPurify) |
| SQLi | ORM parametrizado | Prisma/TypeORM; proibido SQL concatenado (regra de lint + review) |
| CSRF | Token + cookies | `SameSite=Strict`, `HttpOnly`, `Secure`; double-submit nos POSTs de sessão cookie |
| Validação | Schema no backend | class-validator/zod em 100% dos endpoints; whitelist, nunca blacklist |
| Rate limit | Redis | 5 tentativas de login/15 min por IP+conta; alerta em anomalia |
| Logs | Centralizados | Acesso, auth, operações LGPD; alertas: força bruta, export em massa, acesso fora de padrão; retenção 12 meses |
| Uploads | Fotos | Validação de MIME real, strip EXIF/GPS, antivírus, URLs assinadas de curta duração |

## 7.2 Mapa LGPD
| Obrigação | Implementação | RF |
|---|---|---|
| Consentimento explícito e granular | Fluxo F1; registro versionado em `Consent` | RF-ACC-04 |
| Dados de menores (art. 14) | Consentimento específico do responsável; sem uso para marketing; mínimo necessário | RF-ACC-04 |
| Acesso/portabilidade (art. 18) | Export JSON/CSV assíncrono | RF-ACC-05 |
| Correção | Edição no portal + fluxo de ticket | RF-ACC-05 |
| Eliminação | Exclusão com purga em 30 dias; anonimização de logs de retenção obrigatória | RF-ACC-06 |
| Registro de operações (art. 37) | `AuditLog` imutável (append-only) | RF-ACC-07 |
| Transparência | Política clara, versionada, re-consentimento em mudança material | RF-ACC-08 |
| Segurança (art. 46) | §7.1 completa | RNF-04→08 |
| Governança | DPO designado; RIPD antes do go-live (dados de saúde de menores = alto risco); plano de resposta a incidentes com notificação ANPD | RNF-09 |
| Termos de uso | Documento próprio, aceite no cadastro, cláusula de caráter informativo | RF-ACC-09 |

## 7.2.1 Tabela de retenção de dados (por categoria)
| Categoria | Retenção | Após o prazo / exclusão de conta |
|---|---|---|
| Eventos de rastreamento (TRK) | Enquanto a conta existir | Purga total em 30 dias após exclusão |
| Fotos | Enquanto a conta existir | Purga total em 30 dias (incl. backups no ciclo) |
| Dados de conta (e-mail, nome) | Enquanto a conta existir | Purga em 30 dias |
| Consentimentos (`Consent`) | Conta + **5 anos** | Retido como prova de conformidade (base legal: obrigação legal/exercício de direitos) |
| `AuditLog` | **12 meses** rolling | Anonimizado (user_id → hash irreversível) na exclusão de conta |
| Logs de acesso/segurança | 12 meses (RNF-08); 6 meses mínimos de registros de acesso (Marco Civil, art. 15) | Anonimização na exclusão |
| Backups | Ciclo máximo de 30 dias | Dados excluídos saem naturalmente ao fim do ciclo |
| Dados de pagamento (se premium) | Não armazenados (tokenização no gateway de pagamento) | N/A — apenas referência de transação por 5 anos (fiscal) |

## 7.3 Matriz de permissões (RF-FAM-03)
| Ação | Admin | Editor | Registrador | Visualizador |
|---|---|---|---|---|
| Ver linha do tempo/análises | ✅ | ✅ | ✅ | ✅ |
| Criar registros | ✅ | ✅ | ✅ | ❌ |
| Editar/excluir registros de terceiros | ✅ | ✅ | ❌ | ❌ |
| Gerenciar cuidadores/papéis | ✅ | ❌ | ❌ | ❌ |
| Exportar dados / LGPD do bebê | ✅ | ❌ | ❌ | ❌ |
| Excluir bebê/família | ✅ | ❌ | ❌ | ❌ |

---

# PARTE 8 — GESTÃO COLABORATIVA E GIT

## 8.1 Equipes e propriedade de módulos
| Equipe | Módulos | Diretórios (CODEOWNERS) |
|---|---|---|
| **Core** | ACC, FAM, infra, design system | `/packages/auth`, `/packages/families`, `/packages/ui` |
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

Merge em `main`: apenas de `release/*` ou `hotfix/*`, com aprovação do tech lead + suíte E2E completa + teste de conformidade LGPD (roteiro §9.2).

## 8.4 Cerimônias
Sprints de 2 semanas; planning por equipe + sync de dependências entre equipes (30 min, 2×/semana); review conjunta ao fim do sprint; retro por equipe.

---

# PARTE 9 — VERIFICAÇÃO DE COERÊNCIA DOS ARTEFATOS

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
- **RF × RNF sem conflito:** offline (RNF-03) × sync em tempo real (RF-FAM-04) resolvido por fila com idempotency-key e last-write-wins por evento — documentado em §4.2. ✅
- **RF × LGPD:** todo RF que cria dado pessoal tem consentimento mapeado (§7.2) e gera AuditLog. ✅
- **Wireframes × Material Design:** todos os componentes citados existem no MUI/MD3 (app bar, bottom nav, FAB, segmented buttons, cards). ✅
- **Roteiro de teste de conformidade** (gate de `main`): exportar dados → conferir completude; revogar consentimento → conferir cessação; excluir conta → conferir purga/anonimização; conferir AuditLog das 3 ações.

## 9.3 Riscos e inconsistências identificados (a resolver antes da codificação)
| ID | Risco/Inconsistência | Decisão / Status |
|---|---|---|
| R1 | Base de fármacos (RF-MED) | ✅ **Resolvido (v1.1):** modelo gateway — indexação do LactMed (domínio público, com atribuição) + deep links para e-lactancia e manual do MS. Sem produção de conteúdo clínico próprio (RF-MED-06) |
| R2 | Modo escuta (RF-SND-05) em web: detecção de choro exige aba ativa/PWA instalado; confiabilidade menor que app nativo | ✅ Módulo SND movido para **pós-1.0**; limitação será documentada nos termos |
| R3 | Conteúdo dos saltos (RF-DEV-03) é propriedade intelectual de terceiros (Wonder Weeks) | Produzir conteúdo original com base em literatura científica; **proibido copiar**. Redação inicia em S1 |
| R4 | Curvas OMS/CDC | Usar tabelas LMS oficiais publicadas (dado aberto) — sem bloqueio, registrar fonte |
| R5 | Fotos de menores | Consentimento específico (já em F1); armazenamento em região Brasil; retenção definida em §7.2.1 |
| R6 | **Modelo de monetização indefinido** | Decidir antes do Gate 0: gratuito total vs. freemium. Afeta feature flags, billing, arquitetura e LGPD (dados de pagamento). **Bloqueia Gate 0** |
| R7 | **Fórum sem moderação** (RF-EDU-03) | Movido para pós-1.0 e condicionado a plano de moderação aprovado (Marco Civil) |
| R8 | Push no iOS (RNF-16) | ✅ Mitigado: instalação guiada do PWA em F1 + fallback por e-mail para lembretes críticos |
| R9 | **IA com dados de menores** (RF-AIA): envio de dados a provedor de LLM | Mitigação definida em RF-AIA-04 (DPA sem treinamento, pseudonimização, opt-in, AuditLog). DPO valida o provedor no Gate 0 |
| R10 | **Triagem EPDS** (RF-MOM-02): risco clínico e emocional se mal conduzida | Pós-1.0, bloqueado por RF-MOM-04 (aditivo RIPD + revisão de responsável clínico). Nunca apresentar como diagnóstico |

---

# PARTE 10 — SPRINTS ("DAYLES")

Pré-requisito de todos: **Gate 0 aprovado** (§11). Duração: 2 semanas cada.

| Sprint | Core | Tracking | Insights | Conteúdo |
|---|---|---|---|---|
| **S0 — Fundação** | Monorepo, CI/CD, design system MD3, auth (RF-ACC-01/02), TLS/infra | Modelo `Event` + contrato | Esqueleto analytics | Esqueleto conteúdo |
| **S1** | Consentimento + termos + política (RF-ACC-04/08/09), papéis (RF-FAM-03) | RF-TRK-01/02/05/06 + linha do tempo (RF-TRK-15) | Resumo diário (RF-ANA-01) | Redação original do conteúdo dos saltos (R3) |
| **S2** | Famílias + convites + WS (RF-FAM-01/02/04) | RF-TRK-03/04/08/14 | Gráficos de tendência (RF-ANA-02) | Marcos (RF-DEV-05/06) |
| **S3** | MFA + WebAuthn (RF-ACC-01/03), notificações push | RF-TRK-09/10/11/13, lembretes (RF-NTF-01→03) | Percentis OMS/CDC (RF-ANA-03) | Saltos (RF-DEV-01/02) |
| **S4** | Portal LGPD + AuditLog (RF-ACC-05/06/07), backup/DR (RNF-15) | RF-TRK-07/12/16, offline/PWA + instalação guiada (RNF-16) | **SweetSpot** (RF-SLP-01→04) | Fármacos — gateway de fontes (RF-MED-01/02/05/06) |
| **S5** | Notif. de atividade (RF-FAM-05) + fallback e-mail | Polimento + acessibilidade | Export PDF/CSV (RF-ANA-04) + **voz: extração de eventos (RF-AIA-01/05)** | Atividades (RF-DEV-07/08) |
| **S6 — Hardening** | Pentest, revisão RIPD, teste de restauração de backup, resposta a incidentes | Testes E2E | Modo recém-nascido (RF-SLP-05) + **consulta IA (RF-AIA-02/03/04)** | Fármacos: classes/listas (RF-MED-03) + revisão de conteúdo dos saltos |
| **S7 — Release 1.0** | Release branch, conformidade final, go-live | — | — | — |
| **Pós-1.0** | Modo Ao vivo (RF-FAM-06); **empacotamento Capacitor p/ lojas (§4.5)** | **Módulo MOM** (após RF-MOM-04) | Insights (RF-ANA-05), modo criança (RF-SLP-06) | **Módulo SND completo**; **módulo EDU** (condicionado ao plano de moderação — R7); DEV-09 |

---

# PARTE 11 — CRITÉRIOS DE FINALIZAÇÃO (GATES)

## Gate 0 — Aprovação dos artefatos (bloqueia a codificação)
Assinaturas obrigatórias de: product owner, tech leads das 4 equipes, DPO/jurídico, design.
Checklist:
- [ ] Matriz de rastreabilidade (§9.1) completa e sem lacunas
- [ ] Riscos R1–R10 com decisão registrada (**R6 — monetização — pendente e bloqueante**)
- [ ] Provedor de LLM validado pelo DPO: DPA assinado, sem treinamento com dados de usuários (R9)
- [ ] Termos de uso redigidos e revisados pelo jurídico (RF-ACC-09)
- [ ] Marca "Nanei": busca e depósito no INPI (classes 9 e 42) + reserva dos handles @nanei nas redes e lojas
- [ ] Fluxos F1–F8 validados com ao menos 3 usuárias-alvo (teste de conceito)
- [ ] RIPD elaborado e aprovado pelo DPO
- [ ] Contratos entre módulos (`/packages/contracts`) definidos

## Gate por PR (bloqueia merge em `develop`)
Itens 1–5 da §8.3, automatizados como branch protection.

## Gate de release (bloqueia merge em `main`)
- [ ] Testes funcionais E2E dos fluxos F1–F8 verdes
- [ ] Testes de segurança: SAST/DAST sem alta/crítica; pentest sem achado crítico aberto
- [ ] Roteiro de conformidade LGPD (§9.2) executado e aprovado pelo DPO
- [ ] RNF-02 verificado (teste de carga p95 < 300ms)
- [ ] Aprovação do tech lead + PO

## Definition of Done (tarefa)
Código + testes (≥80%) + validação/autorização implementadas + i18n + acessibilidade AA + documentação do endpoint/componente + review aprovado.

---
**Próximo passo:** revisão deste documento pelas partes envolvidas e decisão dos riscos R1–R3 para liberação do Gate 0.
