/**
 * @nanei/legal — documentos legais versionados (RF-ACC-08/09).
 *
 * Fonte única de verdade: a API usa a `versao` para detectar quando um
 * usuário precisa reconsentir (RF-ACC-08) e a web renderiza o mesmo texto.
 * Ao publicar uma nova redação, incremente a `versao` (data ISO) — usuários
 * que aceitaram uma versão anterior serão solicitados a reconsentir.
 *
 * A versão do documento é uma data ISO (AAAA-MM-DD) para ordenação e leitura.
 */

export type DocumentoLegalId = "termos_uso" | "politica_privacidade";

export interface SecaoLegal {
  titulo: string;
  paragrafos: string[];
}

export interface DocumentoLegal {
  id: DocumentoLegalId;
  titulo: string;
  /** Versão vigente — data ISO (AAAA-MM-DD). Base do re-consentimento. */
  versao: string;
  resumo: string;
  secoes: SecaoLegal[];
}

/** Cláusula obrigatória (RF-ACC-09) — protege os módulos MED, DEV e EDU. */
export const CLAUSULA_INFORMATIVA =
  "O Nanei tem caráter exclusivamente informativo e organizacional e não " +
  "substitui a orientação, o diagnóstico ou o tratamento de um profissional " +
  "de saúde. Em caso de dúvida ou emergência, procure sempre um médico.";

export const TERMOS_USO: DocumentoLegal = {
  id: "termos_uso",
  titulo: "Termos de Uso",
  versao: "2026-07-24",
  resumo:
    "Regras de uso do Nanei. Ao criar sua conta você concorda com estes termos.",
  secoes: [
    {
      titulo: "1. Sobre o serviço",
      paragrafos: [
        "O Nanei é um aplicativo para acompanhar o dia a dia de bebês — " +
          "registros de amamentação, sono, fraldas, crescimento e afins — e " +
          "compartilhar esses registros entre cuidadores de uma mesma família.",
      ],
    },
    {
      titulo: "2. Caráter informativo",
      paragrafos: [
        CLAUSULA_INFORMATIVA,
        "Os conteúdos sobre desenvolvimento, medicamentos e cuidados são " +
          "referências gerais e podem não se aplicar ao seu caso específico.",
      ],
    },
    {
      titulo: "3. Sua conta",
      paragrafos: [
        "Você é responsável por manter a confidencialidade das suas " +
          "credenciais e por toda atividade realizada na sua conta.",
        "Você declara ter idade e capacidade civil para aceitar estes termos " +
          "e autorização para registrar dados dos bebês da sua família.",
      ],
    },
    {
      titulo: "4. Uso adequado",
      paragrafos: [
        "É vedado usar o Nanei para fins ilícitos, inserir dados de terceiros " +
          "sem autorização ou tentar comprometer a segurança do serviço.",
      ],
    },
    {
      titulo: "5. Alterações",
      paragrafos: [
        "Podemos atualizar estes termos. Mudanças relevantes exigirão novo " +
          "aceite antes de você continuar usando o aplicativo.",
      ],
    },
  ],
};

export const POLITICA_PRIVACIDADE: DocumentoLegal = {
  id: "politica_privacidade",
  titulo: "Política de Privacidade",
  versao: "2026-07-24",
  resumo:
    "Como tratamos seus dados e os do seu bebê, conforme a LGPD (Lei 13.709/2018).",
  secoes: [
    {
      titulo: "1. Dados que coletamos",
      paragrafos: [
        "Dados de conta (e-mail) e os registros que você insere sobre o bebê " +
          "(nome, nascimento, eventos de rotina e, se você autorizar, fotos).",
      ],
    },
    {
      titulo: "2. Finalidade e base legal",
      paragrafos: [
        "Tratamos dados do bebê com base no seu consentimento (LGPD art. 14 " +
          "§1º), exclusivamente para prestar o serviço de acompanhamento.",
        "Cada finalidade adicional (notificações, fotos) é consentida " +
          "separadamente e pode ser revogada a qualquer momento.",
      ],
    },
    {
      titulo: "3. Compartilhamento",
      paragrafos: [
        "Seus registros são compartilhados apenas com os cuidadores que você " +
          "convidar para a sua família. Não vendemos seus dados.",
      ],
    },
    {
      titulo: "4. Seus direitos",
      paragrafos: [
        "Você pode acessar, corrigir, exportar e excluir seus dados, além de " +
          "revogar consentimentos, diretamente no aplicativo ou mediante " +
          "solicitação ao nosso encarregado (DPO).",
      ],
    },
    {
      titulo: "5. Segurança",
      paragrafos: [
        "Adotamos medidas técnicas como criptografia em trânsito, hashing de " +
          "senhas e registro auditável de acessos a dados pessoais.",
      ],
    },
    {
      titulo: "6. Alterações",
      paragrafos: [
        "Ao atualizar esta política de forma relevante, solicitaremos seu " +
          "novo consentimento antes de continuar.",
      ],
    },
  ],
};

export const DOCUMENTOS_LEGAIS: Record<DocumentoLegalId, DocumentoLegal> = {
  termos_uso: TERMOS_USO,
  politica_privacidade: POLITICA_PRIVACIDADE,
};

export const DOCUMENTOS_LEGAIS_LISTA: DocumentoLegal[] = [
  TERMOS_USO,
  POLITICA_PRIVACIDADE,
];

/** Versão vigente de um documento — usada no aceite e no re-consentimento. */
export function versaoVigente(id: DocumentoLegalId): string {
  return DOCUMENTOS_LEGAIS[id].versao;
}
