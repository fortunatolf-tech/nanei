# Parte 2 — Requisitos Funcionais (RF)

Notação: `RF-<módulo>-<nº>`. Prioridade: **E**ssencial / **I**mportante / **D**esejável.

**Release 1.0** = TRK + SLP + DEV + MED (gateway) + AIA + FAM + ANA + NTF + ACC. **Pós-1.0** = MOM, EDU e SND.

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
| RF-FAM-03 | Papéis: Administrador / Editor / Registrador / Visualizador (matriz na [§7.3](07-seguranca-e-lgpd.md#73-matriz-de-permissões-rf-fam-03)) | E |
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
