// Contrato de saída do motor: entidades e relações tipadas do ADR 0013,
// com a especificação técnica na forma canônica do ADR 0003.

export type Decisao = "resolve" | "revisa" | "recusa";

export type TipoRelacao =
  | "SAME_AS"
  | "CROSS_REFERENCE"
  | "INTERCHANGEABLE_FOR"
  | "COMPATIBLE_WITH"
  | "SIMILAR_TO";

export type Protecao =
  | "aberto"
  | "blindagem_simples"
  | "blindagem_dupla"
  | "vedacao_simples"
  | "vedacao_dupla"
  | "vedacao_sem_contato_simples"
  | "vedacao_sem_contato_dupla";

export type Folga = "C2" | "CN" | "C3" | "C4" | "C5";

/** Fonte auditável de uma afirmação (entidade Evidence). */
export interface Evidencia {
  fonte: string;
  url: string;
  trecho: string;
  licenca: string;
  consultado_em?: string;
}

/** Propriedade tipada com origem rastreável. */
export interface AtributoTipado {
  nome: string;
  valor: string | number | boolean;
  unidade?: string;
  origem: "designacao" | "texto" | "tabela DIN 625-1" | "convencao";
  trecho?: string;
}

/** Forma canônica do item (TechnicalSpecification). */
export interface EspecificacaoTecnica {
  substantivo: string;
  modificador: string;
  familia: string;
  serie: string;
  designacao_basica: string;
  protecao: Protecao;
  folga: Folga;
  inox: boolean;
  atributos: AtributoTipado[];
  descricao_por_regra: string;
}

/** Material como chegou do cadastro (CustomerMaterial). Nunca é alterado. */
export interface MaterialOriginal {
  origem: "CATMAT" | "Compras.gov.br" | "entrada manual" | "OCR";
  codigo?: string;
  texto: string;
  url?: string;
}

export interface Relacao {
  tipo: TipoRelacao;
  decisao: Decisao;
  alvo: string;
  alvo_texto?: string;
  nota: number;
  motivos: string[];
  condicoes?: string[];
  evidencias: Evidencia[];
}

/** Saída da resolução (ResolutionDecision proposta pelo motor). */
export interface Resposta {
  versao_regras: string;
  original: MaterialOriginal;
  decisao: Decisao;
  nota: number;
  motivos: string[];
  especificacao: EspecificacaoTecnica | null;
  relacoes: Relacao[];
  aplicabilidade: string;
  evidencias: Evidencia[];
}

/** Registro da decisão humana sobre uma resposta (ResolutionDecision humana). */
export interface DecisaoHumana {
  id: string;
  registrado_em: string;
  revisor: string;
  original: MaterialOriginal;
  sha256_original: string;
  decisao_motor: Decisao;
  motivos_motor: string[];
  decisao_humana: Decisao;
  especificacao_aceita: string | null;
  justificativa: string;
  versao_regras: string;
}
