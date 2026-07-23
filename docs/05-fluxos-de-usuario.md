# Parte 5 — Fluxos de Usuário

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
