// Baixa os corpora públicos usados pelo protótipo e grava snapshots versionados em dados/publico/.
// Uso: bun run dados
// Fontes e licenças: docs/pesquisa/fontes-do-prototipo.md.
import { mkdir, writeFile } from "node:fs/promises";

const SAIDA = new URL("../dados/publico/", import.meta.url);
const CATMAT = "https://dadosabertos.compras.gov.br/modulo-material/4_consultarItemMaterial";
const PRECOS = "https://dadosabertos.compras.gov.br/modulo-pesquisa-preco/1_consultarMaterial";
const BOLTS = "https://raw.githubusercontent.com/boltsparts/BOLTS_archive/master/data/bearings.blt";
const LICENCA_FEDERAL =
  "Decreto 8.777/2016, art. 4: dados do Poder Executivo federal são de livre utilização pela sociedade";

async function json(url: string): Promise<any> {
  for (let tentativa = 1; ; tentativa++) {
    const r = await fetch(url);
    if (r.ok) return r.json();
    if (tentativa >= 3) throw new Error(`${r.status} em ${url}`);
    await new Promise((ok) => setTimeout(ok, 2000 * tentativa));
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

await mkdir(SAIDA, { recursive: true });
await catmat();
await precos();
await bolts();
