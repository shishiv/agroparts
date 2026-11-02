// Leitura de CSV do cadastro de material, toda no navegador. Aceita vírgula ou ponto e vírgula,
// aspas com vírgula e quebra de linha dentro, BOM, e texto em UTF-8 (ou Windows-1252 como último recurso).

export interface Tabela {
  separador: "," | ";";
  cabecalho: string[];
  linhas: string[][];
}

export function decodificar(bytes: ArrayBuffer): string {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes).replace(/^\uFEFF/, "");
  } catch {
    return new TextDecoder("windows-1252").decode(bytes);
  }
}

/** O separador é o que aparece mais vezes, fora de aspas, na primeira linha. */
function descobrirSeparador(texto: string): "," | ";" {
  let aspas = false;
  let virgulas = 0;
  let pontoVirgulas = 0;
  for (const c of texto) {
    if (c === '"') aspas = !aspas;
    else if (!aspas && (c === "\n" || c === "\r")) break;
    else if (!aspas && c === ",") virgulas++;
    else if (!aspas && c === ";") pontoVirgulas++;
  }
  return pontoVirgulas > virgulas ? ";" : ",";
}

export function lerCsv(texto: string): Tabela {
  const separador = descobrirSeparador(texto);
  const registros: string[][] = [];
  let campo = "";
  let registro: string[] = [];
  let aspas = false;
  const fecharCampo = () => {
    registro.push(campo);
    campo = "";
  };
  const fecharRegistro = () => {
    fecharCampo();
    if (registro.some((c) => c.trim() !== "")) registros.push(registro);
    registro = [];
  };
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (aspas) {
      if (c === '"' && texto[i + 1] === '"') {
        campo += '"';
        i++;
      } else if (c === '"') aspas = false;
      else campo += c;
    } else if (c === '"') aspas = true;
    else if (c === separador) fecharCampo();
    else if (c === "\n") fecharRegistro();
    else if (c === "\r") {
      if (texto[i + 1] === "\n") i++;
      fecharRegistro();
    } else campo += c;
  }
  if (campo !== "" || registro.length) fecharRegistro();
  const [cabecalho = [], ...linhas] = registros;
  return { separador, cabecalho: cabecalho.map((c) => c.trim()), linhas };
}

const semAcento = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

/** Chute inicial das colunas de código e de descrição; a pessoa pode trocar na tela. */
export function adivinharColunas(t: Tabela): { codigo: number; descricao: number } {
  const nomes = t.cabecalho.map(semAcento);
  const achar = (re: RegExp, fora = -1) => nomes.findIndex((n, i) => i !== fora && re.test(n));
  let descricao = achar(/descri|denomin|texto|especifica|nome/);
  let codigo = achar(/codigo|\bcod\b|material|sku|^item$|numero|^id$/, descricao);
  if (descricao < 0) {
    const media = (c: number) => t.linhas.reduce((s, l) => s + (l[c]?.length ?? 0), 0) / Math.max(1, t.linhas.length);
    descricao = t.cabecalho.map((_, i) => i).sort((a, b) => media(b) - media(a))[0] ?? 0;
  }
  if (codigo < 0) codigo = t.cabecalho.findIndex((_, i) => i !== descricao);
  return { codigo: Math.max(codigo, 0), descricao: Math.max(descricao, 0) };
}
