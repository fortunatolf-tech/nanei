# Parte 6 — Wireframes (baixa fidelidade, 360px)

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

## W6–W10

W6–W10 (login/MFA, monografia de fármaco, player de sons, família/permissões, lembretes) seguem os mesmos padrões MD3: app bar + conteúdo em cards + bottom nav; especificação de alta fidelidade será derivada destes após aprovação.
