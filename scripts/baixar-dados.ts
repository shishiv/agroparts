// Baixa os corpora públicos usados pelo protótipo e grava snapshots versionados em dados/publico/.
// Uso: bun run dados            (todos)
//      bun run dados v1         (só os snapshots do protótipo)
//      bun run dados familia    (só o benchmark de família de F3)
// Fontes e licenças: docs/pesquisa/fontes-do-prototipo.md.
import { existsSync, readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import preregistroFamilia from "../dados/preregistro/f3-familia.json";

const SAIDA = new URL("../dados/publico/", import.meta.url);
const LOCAL = new URL("../dados/local/", import.meta.url);
const MATERIAL = "https://dadosabertos.compras.gov.br/modulo-material";
const CATMAT = `${MATERIAL}/4_consultarItemMaterial`;
const PRECOS = "https://dadosabertos.compras.gov.br/modulo-pesquisa-preco/1_consultarMaterial";
const BOLTS = "https://raw.githubusercontent.com/boltsparts/BOLTS_archive/master/data/bearings.blt";
const LICENCA_FEDERAL =
  "Decreto 8.777/2016, art. 4: dados do Poder Executivo federal são de livre utilização pela sociedade";
const LICENCA_FAMILIA = {
  licenca:
    "Decreto 8.777/2016, art. 4, na redação do Decreto 9.903/2019: os dados disponibilizados pelo Poder Executivo federal são de livre utilização pelos Poderes Públicos e pela sociedade; o § 1º autoriza a utilização gratuita das bases cujo detentor de direitos é a União",
  licenca_conferida_em: "2026-11-03",
  licenca_fontes: [
    "https://www2.camara.leg.br/legin/fed/decret/2019/decreto-9903-8-julho-2019-788792-publicacaooriginal-158693-pe.html",
    "https://www.gov.br/compras/pt-br/cidadao/portal-de-dados-abertos",
  ],
};

// Sem timeout, um pedido que pende (a rota IPv6 da API às vezes não responde) para o download inteiro.
async function json(url: string): Promise<any> {
  for (let tentativa = 1; ; tentativa++) {
    let falha: string;
    let espera = 2000 * tentativa;
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(60_000) });
      if (r.ok) return r.json();
      falha = String(r.status);
      if (r.status === 429) espera = Math.max(Number(r.headers.get("retry-after")) * 1000 || 0, 30_000 * tentativa);
    } catch (e) {
      falha = (e as Error).message;
    }
    if (tentativa >= 8) throw new Error(`${falha} em ${url}`);
    await new Promise((ok) => setTimeout(ok, espera));
  }
}

async function paginas(url: string): Promise<any[]> {
  const todas: any[] = [];
  for (let pagina = 1; ; pagina++) {
    const d = await json(`${url}&pagina=${pagina}`);
    todas.push(...d.resultado);
    if (pagina >= d.totalPaginas) return todas;
  }
}

async function sha256(texto: string): Promise<string> {
  const h = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(texto));
  return [...new Uint8Array(h)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function gravar(nome: string, conteudo: unknown) {
  await writeFile(new URL(nome, SAIDA), JSON.stringify(conteudo, null, 1) + "\n");
  console.log("gravado", nome);
}

async function catmat() {
  const itens: any[] = [];
  for (let pagina = 1; ; pagina++) {
    const d = await json(`${CATMAT}?pagina=${pagina}&codigoPdm=11797`);
    itens.push(...d.resultado);
    if (pagina >= d.totalPaginas) break;
  }
  itens.sort((a, b) => a.codigoItem - b.codigoItem);
  const campos = ["codigoItem", "codigoGrupo", "nomeGrupo", "codigoClasse", "nomeClasse", "codigoPdm", "nomePdm", "descricaoItem", "statusItem", "dataHoraAtualizacao"];
  const limpos = itens.map((i) => Object.fromEntries(campos.map((c) => [c, i[c]])));
  await gravar("catmat-pdm-11797.json", {
    fonte: {
      nome: "CATMAT, padrão descritivo 11797 ROLAMENTO DE ESFERA",
      url: `${CATMAT}?codigoPdm=11797`,
      consultado_em: new Date().toISOString(),
      licenca: LICENCA_FEDERAL,
      sha256_itens: await sha256(JSON.stringify(limpos)),
    },
    itens: limpos,
  });
}

async function precos() {
  // Linhas de compras públicas que usaram itens do PDM 11797. Ficam só campos do item e do órgão:
  // fornecedor, CNPJ e preço não são gravados (não são necessários para a resolução).
  const linhas: any[] = [];
  const base = `${PRECOS}?tipo=codigoPdm&codigo=11797&dataCompraInicio=2025-01-01&dataCompraFim=2026-09-01&tamanhoPagina=500`;
  for (let pagina = 1; ; pagina++) {
    const d = await json(`${base}&pagina=${pagina}`);
    linhas.push(...d.resultado);
    if (pagina >= d.totalPaginas) break;
  }
  const campos = ["idCompraItem", "dataCompra", "codigoItemCatalogo", "descricaoDetalhadaItem", "marca", "nomeUasg", "nomeOrgao", "municipio", "estado"];
  const limpos = linhas
    .map((i) => Object.fromEntries(campos.map((c) => [c, i[c]])))
    .sort((a, b) => String(a.idCompraItem).localeCompare(String(b.idCompraItem)));
  await gravar("compras-pdm-11797.json", {
    fonte: {
      nome: "Compras.gov.br, pesquisa de preço de material, PDM 11797, compras de 01/01/2025 a 01/09/2026",
      url: base,
      consultado_em: new Date().toISOString(),
      licenca: LICENCA_FEDERAL,
      campos_omitidos: "niFornecedor, nomeFornecedor, precoUnitario e demais campos de fornecedor e preço",
      sha256_linhas: await sha256(JSON.stringify(limpos)),
    },
    linhas: limpos,
  });
}

async function bolts() {
  const r = await fetch(BOLTS);
  if (!r.ok) throw new Error(`${r.status} em ${BOLTS}`);
  const texto = await r.text();
  // Tabela da classe singlerowradialbearing (DIN 625-1): "chave": [d1, d2, B, r_fillet]
  const inicio = texto.indexOf("id: singlerowradialbearing\n");
  const fim = texto.indexOf("id: singlerowradialbearingimperial");
  const bloco = texto.slice(inicio, fim);
  const linhas: Record<string, { d: number; D: number; B: number }> = {};
  for (const m of bloco.matchAll(/"(\d+)"\s*:\s*\[\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)/g)) {
    linhas[m[1]] = { d: Number(m[2]), D: Number(m[3]), B: Number(m[4]) };
  }
  await gravar("bolts-din625-1.json", {
    fonte: {
      nome: "BOLTS, bearings.blt, classe singlerowradialbearing (DIN 625-1)",
      url: BOLTS,
      consultado_em: new Date().toISOString(),
      licenca: "LGPL 2.1 ou posterior; Copyright (C) 2013 Johannes Reinhardt e Javier Martínez García",
      fonte_declarada_pela_bolts: "http://www.kgm-kugeln.de/show.php?ID=4589 e http://reprap.org/wiki/Ball_bearing",
      sha256_arquivo: await sha256(texto),
    },
    dimensoes_mm: linhas,
  });
}

/**
 * Grava um snapshot do benchmark de F3, que fica congelado depois da primeira gravação.
 * Uma nova consulta com o mesmo sha256 só registra a conferência. Com outro sha256, o arquivo congelado
 * continua igual, a conferência que falhou fica registrada e a consulta nova vai para dados/local/.
 */
async function gravarCongelado(nome: string, fonte: Record<string, unknown>, corpo: Record<string, unknown>) {
  const sha = await sha256(JSON.stringify(corpo));
  const agora = new Date().toISOString();
  const caminho = new URL(nome, SAIDA);
  if (!existsSync(caminho)) {
    await gravar(nome, { fonte: { ...fonte, consultado_em: agora, ...LICENCA_FAMILIA, sha256: sha, conferencias: [] }, ...corpo });
    return;
  }
  const congelado = JSON.parse(readFileSync(caminho, "utf8"));
  const bate = congelado.fonte.sha256 === sha;
  congelado.fonte.conferencias.push({ em: agora, sha256: sha, bate });
  await gravar(nome, congelado);
  if (!bate) {
    await mkdir(LOCAL, { recursive: true });
    await writeFile(new URL(nome, LOCAL), JSON.stringify({ fonte: { ...fonte, consultado_em: agora, sha256: sha }, ...corpo }, null, 1) + "\n");
    console.log(`${nome}: a consulta de hoje deu outro sha256 (${sha}); o benchmark congelado não muda e a medição fica INCONCLUSIVE. Consulta nova em dados/local/${nome}`);
  }
}

type PdmDaApi = { codigoGrupo: number; nomeGrupo: string; codigoClasse: number; nomeClasse: string; codigoPdm: number; nomePdm: string };

/** Árvore do CATMAT nos grupos do pré-registro de F3: grupo, classe e PDM ativo. */
async function arvoreFamilia(): Promise<PdmDaApi[]> {
  const pdms: PdmDaApi[] = [];
  for (const g of preregistroFamilia.selecao.grupos) {
    pdms.push(...(await paginas(`${MATERIAL}/3_consultarPdmMaterial?codigoGrupo=${g}&statusPdm=true&tamanhoPagina=500`)));
  }
  // A paginação da API pode repetir um registro entre páginas.
  const unicos = [...new Map(pdms.map((p) => [p.codigoPdm, p])).values()].sort((a, b) => a.codigoPdm - b.codigoPdm);
  const grupos = new Map<number, { codigo: number; nome: string; classes: Map<number, { codigo: number; nome: string; pdms: { codigo: number; nome: string }[] }> }>();
  for (const p of unicos) {
    const g = grupos.get(p.codigoGrupo) ?? { codigo: p.codigoGrupo, nome: p.nomeGrupo, classes: new Map() };
    grupos.set(p.codigoGrupo, g);
    const c = g.classes.get(p.codigoClasse) ?? { codigo: p.codigoClasse, nome: p.nomeClasse, pdms: [] };
    g.classes.set(p.codigoClasse, c);
    c.pdms.push({ codigo: p.codigoPdm, nome: p.nomePdm });
  }
  const ordem = <T extends { codigo: number }>(xs: Iterable<T>) => [...xs].sort((a, b) => a.codigo - b.codigo);
  await gravarCongelado(
    "catmat-arvore-manutencao.json",
    {
      nome: `CATMAT, PDMs ativos dos grupos ${preregistroFamilia.selecao.grupos.join(", ")}, para o benchmark de família de F3`,
      url: preregistroFamilia.fonte.arvore,
      preregistro: "dados/preregistro/f3-familia.json",
    },
    { grupos: ordem(grupos.values()).map((g) => ({ codigo: g.codigo, nome: g.nome, classes: ordem(g.classes.values()) })) },
  );
  return unicos;
}

/**
 * Textos do campo marca das compras de cada PDM da árvore, na janela do pré-registro.
 * Cada trio (PDM consultado, PDM da linha, marca) vira uma entrada com o número de linhas e a linha de menor idCompraItem.
 */
async function comprasFamilia(pdms: PdmDaApi[]) {
  const { inicio, fim } = preregistroFamilia.selecao.janela_de_compras;
  const textos = new Map<string, { pdm_consultado: number; codigoPdm: string; marca: string; linhas: number; idCompraItem: string; codigoItemCatalogo: number }>();
  let linhas = 0;
  let feitos = 0;
  const fila = [...pdms];
  // Dois pedidos de cada vez: com quatro, a API devolveu 429.
  await Promise.all(
    Array.from({ length: 2 }, async () => {
      for (let p = fila.shift(); p; p = fila.shift()) {
        const resultado = [...new Map((await paginas(`${PRECOS}?tipo=codigoPdm&codigo=${p.codigoPdm}&dataCompraInicio=${inicio}&dataCompraFim=${fim}&tamanhoPagina=500`)).map((l) => [String(l.idCompraItem), l])).values()];
        linhas += resultado.length;
        if (++feitos % 100 === 0) console.log(`compras: ${feitos} de ${pdms.length} PDMs`);
        for (const l of resultado) {
          const marca = String(l.marca ?? "");
          const chave = JSON.stringify([p.codigoPdm, l.codigoPdm, marca]);
          const atual = textos.get(chave);
          const id = String(l.idCompraItem);
          if (!atual) textos.set(chave, { pdm_consultado: p.codigoPdm, codigoPdm: l.codigoPdm, marca, linhas: 1, idCompraItem: id, codigoItemCatalogo: l.codigoItemCatalogo });
          else {
            atual.linhas++;
            if (id < atual.idCompraItem) Object.assign(atual, { idCompraItem: id, codigoItemCatalogo: l.codigoItemCatalogo });
          }
        }
      }
    }),
  );
  // Comparação por código de caractere, não por locale, para o sha256 ser o mesmo em qualquer máquina.
  const cmp = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);
  const ordenados = [...textos.values()].sort(
    (a, b) => a.pdm_consultado - b.pdm_consultado || cmp(a.idCompraItem, b.idCompraItem) || Number(a.codigoPdm) - Number(b.codigoPdm) || cmp(a.marca, b.marca),
  );
  await gravarCongelado(
    "compras-familia.json",
    {
      nome: `Compras.gov.br, pesquisa de preço de material, PDMs da árvore de F3, compras de ${inicio} a ${fim}`,
      url: preregistroFamilia.fonte.compras,
      preregistro: "dados/preregistro/f3-familia.json",
      campos_omitidos: "niFornecedor, nomeFornecedor, precoUnitario e demais campos de fornecedor, órgão e preço",
    },
    { linhas_lidas: linhas, textos: ordenados },
  );
}

const pedidos = new Set(process.argv.slice(2));
await mkdir(SAIDA, { recursive: true });
if (!pedidos.size || pedidos.has("v1")) {
  await catmat();
  await precos();
  await bolts();
}
if (!pedidos.size || pedidos.has("familia")) await comprasFamilia(await arvoreFamilia());
