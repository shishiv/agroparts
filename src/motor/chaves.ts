// F4: o arquivo de chaves que a equipe do ERP da usina carrega, qualquer que seja o ERP.
// Só entra o que já é SAME_AS em `lote.grupos_duplicidade`. Nenhum campo apaga, funde ou reescreve registro (ADR 0001).
// Colunas do CSV, nesta ordem: grupo, codigo, texto_original, relacao, chave, designacao, descricao_por_regra, evidencias, motivos, versao_regras.
// Dentro de uma célula, as evidências vão como "fonte (url)" e os motivos como texto, uns e outros separados por " | ", como no mapa de códigos.
// As linhas saem por grupo e, dentro do grupo, pelo código comparado como texto: o arquivo é o mesmo em qualquer navegador.
import { especificar } from "./especificacao";
import { celulaCsv, type ResultadoLote } from "./lote";
import type { Evidencia, TipoRelacao } from "./tipos";

/** Uma linha por código legado de cada grupo de duplicidade, com a evidência que sustenta a chave. */
export interface LinhaChave {
  grupo: number;
  codigo: string;
  texto_original: string;
  relacao: Extract<TipoRelacao, "SAME_AS">;
  chave: string;
  designacao: string;
  descricao_por_regra: string;
  evidencias: Evidencia[];
  motivos: string[];
  versao_regras: string;
}

export interface ArquivoDeChaves {
  linhas: LinhaChave[];
  grupos: number;
  /** Cadastros de algum grupo que vieram sem código. Ficam fora do arquivo, porque o ERP não tem como achá-los. */
  sem_codigo: number;
}

const antes = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

/**
 * Lê os grupos de duplicidade do lote e monta uma linha por código.
 * A chave e a designação vêm do lote. A evidência vem de `especificar` sobre o mesmo texto,
 * então não existe segunda regra de identidade.
 * Recebe o lote inteiro: a visão por tipo de F2 não tem por onde entrar.
 */
export function arquivoDeChaves(lote: ResultadoLote): ArquivoDeChaves {
  const linhas: LinhaChave[] = [];
  let sem_codigo = 0;
  for (const l of lote.linhas) {
    if (l.grupo_duplicidade === null) continue;
    const codigo = l.original.codigo;
    if (!codigo) {
      sem_codigo++;
      continue;
    }
    linhas.push({
      grupo: l.grupo_duplicidade,
      codigo,
      texto_original: l.original.texto,
      relacao: "SAME_AS",
      chave: l.chave!,
      designacao: l.designacao!,
      descricao_por_regra: l.descricao_por_regra!,
      evidencias: especificar(l.original.texto).evidencias,
      motivos: l.motivos,
      versao_regras: lote.versao_regras,
    });
  }
  linhas.sort((a, b) => a.grupo - b.grupo || antes(a.codigo, b.codigo));
  return { linhas, grupos: lote.grupos_duplicidade.length, sem_codigo };
}

const CABECALHO = ["grupo", "codigo", "texto_original", "relacao", "chave", "designacao", "descricao_por_regra", "evidencias", "motivos", "versao_regras"];

/**
 * CSV genérico, com cabeçalho e separador vírgula, que qualquer ERP importa.
 * O texto original vai intacto. Formato próprio de SAP, de TOTVS ou de outro ERP só depois de ver o modelo de carga de uma usina.
 */
export function chavesParaCsv(a: ArquivoDeChaves): string {
  const linhas = a.linhas.map((l) =>
    [
      l.grupo,
      l.codigo,
      l.texto_original,
      l.relacao,
      l.chave,
      l.designacao,
      l.descricao_por_regra,
      l.evidencias.map((e) => `${e.fonte} (${e.url})`).join(" | "),
      l.motivos.join(" | "),
      l.versao_regras,
    ]
      .map(celulaCsv)
      .join(","),
  );
  return [CABECALHO.join(","), ...linhas].join("\n") + "\n";
}
