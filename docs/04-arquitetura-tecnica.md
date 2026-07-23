# Parte 4 — Arquitetura Técnica

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
| Billing | Gateway de pagamento com tokenização (fornecedor a definir no Gate 0); dupla origem de tokens de IA (plataforma × BYOK) | RF-BIL; Parte 12 |

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
Subscription(id, user_id, plano[gratuito|premium], ciclo[mensal|anual], status,
      gateway_ref, inicio, fim?)  -- sem dados de cartão (tokenização no gateway)
TokenUsage(id, user_id, periodo[AAAA-MM], tokens_consumidos, quota_plano)
ByokKey(id, user_id, provedor, chave_criptografada[pgcrypto/KMS], ultimos4,
      validada_em, criado_em)  -- nunca logada nem enviada ao frontend
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
