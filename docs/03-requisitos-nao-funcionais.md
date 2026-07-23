# Parte 3 — Requisitos Não Funcionais (RNF)

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
