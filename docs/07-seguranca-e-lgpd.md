# Parte 7 — Segurança e LGPD (detalhamento)

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
