// F3: classificar a família (grupo, classe e PDM do CATMAT) de um texto de fornecedor, e medir o classificador.
// Fica em scripts/ porque só a medição usa. Entra em src/motor/ só quando o site ou a API precisarem.
// A família é visibilidade e cobertura. Ela não decide identidade nem relação (ADR 0006 e ADR 0013).
import { tokens } from "../src/motor/identidade";

/** Árvore pública do CATMAT nos grupos do benchmark. O PDM é a folha. */
export interface ArvoreCatmat {
  versao: string;
  grupos: { codigo: number; nome: string; classes: { codigo: number; nome: string; pdms: { codigo: number; nome: string }[] }[] }[];
}

export type Nivel = "grupo" | "classe" | "pdm";

/** "nenhum" é resposta válida em qualquer nível, e `ate` guarda o caminho escolhido antes dele. */
export type ClassificacaoFamilia =
  | { tipo: "pdm"; grupo: number; classe: number; pdm: number; confianca: number }
  | { tipo: "nenhum"; nivel: Nivel; ate: { grupo?: number; classe?: number }; confianca: number };

/** A régua não depende da ordem das opções. O Jev depende, e a medição roda as duas ordens. */
export type OrdemDasOpcoes = "direta" | "inversa";

declare const publico: unique symbol;

/**
 * Texto de dado público, já lido do benchmark. Só `carregarBenchmarkFamilia` cria este tipo.
 * O classificador do Jev só aceita `TextoPublico`: cadastro de cliente não chega à TypeSafe (escolha D4, ADR 0018).
 */
export type TextoPublico = string & { readonly [publico]: true };

export interface ClassificadorFamilia<T extends string = string> {
  /** Nome e versão fixa, gravados em cada linha da medição. O Jev vai fixado por versão, nunca por alias. */
  nome: string;
  versao: string;
  classificar(texto: T, ordem: OrdemDasOpcoes): Promise<ClassificacaoFamilia>;
}

/** Um caso do benchmark: o texto que o fornecedor digitou, rotulado pelo PDM do item em que ele cotou. */
export interface CasoFamilia {
  id: string;
  texto: TextoPublico;
  rotulo: { grupo: number; classe: number; pdm: number };
}

/** O que o pré-registro congela antes de qualquer medição. */
export interface PreregistroFamilia {
  versao: string;
  /**
   * Confiança mínima de cada classificador, pelo `nome`, para a resposta entrar na faixa medida.
   * A régua e o Jev dão confiança em escalas diferentes, então cada um tem o seu limiar.
   * O relatório compara o erro com a cobertura da faixa ao lado, e o Jev não vence com uma faixa mais estreita que a da régua.
   */
  limiar_por_classificador: Record<string, number>;
  /** Erro máximo na faixa, por estrato, e a margem que o Jev precisa abrir sobre a régua. */
  erro_maximo: number;
  margem_sobre_a_regua: number;
  /** Estratos com menos casos que isto dão INCONCLUSIVE. */
  minimo_por_estrato: number;
}

/** Uma linha por classificador e por grupo do CATMAT. Números absolutos (ADR 0014). */
export interface MedicaoFamilia {
  classificador: string;
  versao: string;
  estrato: string;
  casos: number;
  na_faixa: number;
  corretos_na_faixa: number;
  nenhum: number;
  /** Casos em que a ordem inversa das opções mudou a resposta. Zero para a régua. */
  mudou_com_a_ordem: number;
}

/**
 * A régua em código: compara as palavras do texto com o nome de cada PDM e escolhe o de maior cobertura.
 * No empate, fica o PDM com mais palavras em comum, depois o de menor código, para a resposta ser determinística.
 * Sem nenhuma palavra em comum com um PDM, responde "nenhum" no nível PDM. É o número que o Jev precisa vencer.
 */
export function regua(arvore: ArvoreCatmat): ClassificadorFamilia {
  const pdms = arvore.grupos.flatMap((g) =>
    g.classes.flatMap((c) => c.pdms.map((p) => ({ grupo: g.codigo, classe: c.codigo, pdm: p.codigo, palavras: [...tokens(p.nome)] }))),
  );
  return {
    nome: "regua",
    versao: "1",
    async classificar(texto) {
      const doTexto = tokens(texto);
      let melhor: { p: (typeof pdms)[number]; comuns: number; confianca: number } | undefined;
      for (const p of pdms) {
        const comuns = p.palavras.filter((t) => doTexto.has(t)).length;
        if (!comuns) continue;
        const confianca = comuns / p.palavras.length;
        if (
          !melhor ||
          confianca > melhor.confianca ||
          (confianca === melhor.confianca && (comuns > melhor.comuns || (comuns === melhor.comuns && p.pdm < melhor.p.pdm)))
        ) {
          melhor = { p, comuns, confianca };
        }
      }
      if (!melhor) return { tipo: "nenhum", nivel: "pdm", ate: {}, confianca: 0 };
      return { tipo: "pdm", grupo: melhor.p.grupo, classe: melhor.p.classe, pdm: melhor.p.pdm, confianca: melhor.confianca };
    },
  };
}

/** Mede um classificador contra o benchmark, por grupo. Roda cada caso nas duas ordens e compara as respostas. */
export async function medirFamilia<T extends string>(
  casos: readonly (CasoFamilia & { texto: T })[],
  classificador: ClassificadorFamilia<T>,
  pre: PreregistroFamilia,
): Promise<MedicaoFamilia[]> {
  const limiar = pre.limiar_por_classificador[classificador.nome];
  if (limiar === undefined) throw new Error(`o pré-registro ${pre.versao} não tem limiar para o classificador ${classificador.nome}`);
  const porEstrato = new Map<string, MedicaoFamilia>();
  for (const caso of casos) {
    const estrato = String(caso.rotulo.grupo);
    const linha = porEstrato.get(estrato) ?? {
      classificador: classificador.nome,
      versao: classificador.versao,
      estrato,
      casos: 0,
      na_faixa: 0,
      corretos_na_faixa: 0,
      nenhum: 0,
      mudou_com_a_ordem: 0,
    };
    porEstrato.set(estrato, linha);
    const a = await classificador.classificar(caso.texto, "direta");
    const b = await classificador.classificar(caso.texto, "inversa");
    linha.casos++;
    if (a.tipo === "nenhum") linha.nenhum++;
    else if (a.confianca >= limiar) {
      linha.na_faixa++;
      if (a.pdm === caso.rotulo.pdm) linha.corretos_na_faixa++;
    }
    if (a.tipo !== b.tipo || (a.tipo === "pdm" && b.tipo === "pdm" && a.pdm !== b.pdm)) linha.mudou_com_a_ordem++;
  }
  return [...porEstrato.values()].sort((x, y) => Number(x.estrato) - Number(y.estrato));
}
