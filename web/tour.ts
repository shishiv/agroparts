// Explicação passo a passo do site, com driver.js (MIT). Cada tour roda o exemplo da sua
// prova pelos mesmos caminhos que a pessoa usaria e destaca, na ordem, o que prova o ponto.
// Os textos seguem a linguagem de almoxarifado do DESIGN.md: frases curtas, nada técnico.
import { driver, type Driver, type DriveStep, type Side } from "driver.js";
import "driver.js/dist/driver.css";

/** O que o tour pede para a página fazer. Cada promessa termina quando a tela já mostra o resultado. */
export type Acoes = {
  exemplo(valor: string): Promise<void>;
  aba(nome: string): void;
  lote(): Promise<void>;
  modo(tipo: "codigo" | "descricao" | "ocr"): void;
  foto(url: string): Promise<void>;
  identificar(): Promise<void>;
};

type Alvo = string | (() => Element | null);
type Passo = {
  alvo?: Alvo;
  titulo: string;
  texto: string;
  lado?: Side;
  /** Roda antes de mostrar este passo, quando a pessoa avança até ele. */
  antes?: (a: Acoes) => Promise<void> | void;
  /** Texto do botão de avançar do passo anterior, quando ele dispara `antes`. */
  rotuloAntes?: string;
};
export type Tour = { titulo: string; passos: Passo[] };

const grupo = (chave: string, parte = ".grupo-cabeca"): Alvo => () => document.getElementById(`g-${chave}`)?.closest(".grupo")?.querySelector(parte) ?? null;
const selos = `<span class="tour-selos">
  <span class="selo selo-resolve"><svg aria-hidden="true"><use href="#p-resolve" /></svg>Verde: é a peça</span>
  <span class="selo selo-revisa"><svg aria-hidden="true"><use href="#p-revisa" /></svg>Amarelo: falta conferir</span>
  <span class="selo selo-recusa"><svg aria-hidden="true"><use href="#p-recusa" /></svg>Vermelho: não é, ou o cadastro tem erro</span>
</span>`;
const prova = (n: number): Alvo => `.roteiro li:nth-child(${n}) [data-exemplo], .roteiro li:nth-child(${n}) [data-ir]`;

export const TOURS: Record<string, Tour> = {
  inicio: {
    titulo: "Visão geral do site",
    passos: [
      {
        titulo: "Bem-vindo ao AgroParts",
        texto: "No almoxarifado, a mesma peça costuma ter vários códigos. Cada pessoa cadastra de um jeito. O AgroParts diz se dois cadastros são a mesma peça.",
      },
      { alvo: "#t-resolver", titulo: "Uma pergunta só", texto: "O site responde a uma pergunta: qual é esta peça?" },
      { alvo: ".recorte", titulo: "O que o protótipo cobre", texto: "Por enquanto, só rolamentos de esferas. Os dados são públicos, do governo federal." },
      { alvo: "#form-resolver .modos", titulo: "Como informar a peça", texto: "Escolha uma forma: o código, a descrição do cadastro ou a foto da etiqueta." },
      { alvo: "#campo-texto", titulo: "Onde digitar", texto: "Digite o código ou cole a descrição do jeito que está no cadastro." },
      {
        alvo: "#form-resolver .primario",
        titulo: "Identificar",
        texto: "Aperte Identificar. A resposta aparece logo abaixo. Vamos ver um exemplo com o código 311960.",
      },
      {
        alvo: "#resultado .placa-faixa",
        titulo: "A placa de resposta",
        texto: `A cor da placa diz o resultado.${selos}`,
        antes: (a) => a.exemplo("codigo|311960"),
        rotuloAntes: "Ver o exemplo",
      },
      { alvo: "#resultado .peca", titulo: "A peça", texto: "A peça em poucas palavras: o tamanho, a proteção e a folga." },
      { alvo: "#resultado .resumo", titulo: "O que mais apareceu", texto: "Outros cadastros encontrados, separados em grupos. Toque num grupo para ir até ele." },
      { alvo: "#resultado .original", titulo: "O original fica intacto", texto: "Este é o texto do cadastro, sem nenhuma mudança. O AgroParts não apaga nem altera o cadastro." },
      { alvo: "#resultado .padronizada", titulo: "A descrição padronizada", texto: "A mesma peça escrita sempre do mesmo jeito. Assim fica fácil achar cadastro repetido." },
      { alvo: grupo("mesma"), titulo: "Os grupos", texto: "Cada grupo junta cadastros com a mesma resposta. Aqui está outro código da mesma peça." },
      {
        alvo: "#form-revisao .escolhas",
        titulo: "Quem decide é uma pessoa",
        texto: "Quem conhece a peça confirma ou corrige o sistema. O sistema nunca troca uma peça sozinho.",
      },
      {
        alvo: ".roteiro li:first-child",
        titulo: "As provas da apresentação",
        texto: "Cada placa numerada roda um exemplo da apresentação. Toque em Explicar, embaixo dela, para ver a prova passo a passo.",
      },
      { alvo: "#como-funciona", titulo: "Para ver de novo", texto: "Toque em Como funciona quando quiser rever esta explicação ou outra prova." },
    ],
  },
  duplicado: {
    titulo: "Prova 1: cadastro duplicado",
    passos: [
      { alvo: prova(1), titulo: "Prova 1: cadastro duplicado", texto: "O mesmo rolamento foi cadastrado duas vezes, com códigos diferentes. Vamos procurar o código 311960." },
      {
        alvo: "#resultado .placa-faixa",
        titulo: "Placa verde",
        texto: "O sistema achou a peça. Nada no cadastro contradiz o código.",
        antes: (a) => a.exemplo("codigo|311960"),
        rotuloAntes: "Procurar",
      },
      { alvo: "#resultado .peca", titulo: "A peça", texto: "Rolamento 6318, com blindagem nos dois lados e folga C3." },
      { alvo: grupo("mesma"), titulo: "É a mesma peça", texto: "O sistema achou outro código com a mesma especificação." },
      { alvo: grupo("mesma", ".item-alvo"), titulo: "O cadastro repetido", texto: "O código 311963 é a mesma peça. Os dois códigos continuam no cadastro." },
      { alvo: "#resultado .original", titulo: "O original fica intacto", texto: "O texto do cadastro aparece como está, sem nenhuma mudança." },
      { alvo: "#resultado .padronizada", titulo: "A descrição padronizada", texto: "Os dois códigos ganham a mesma descrição. É assim que o repetido aparece." },
      { alvo: "#form-revisao .escolhas", titulo: "A pessoa confirma", texto: "Quem conhece o estoque confirma se pode juntar os dois cadastros." },
    ],
  },
  parece: {
    titulo: "Prova 2: parece, mas não é",
    passos: [
      { alvo: prova(2), titulo: "Prova 2: parece, mas não é", texto: "Textos quase iguais podem ser peças diferentes. Vamos procurar o código 317388." },
      {
        alvo: "#resultado .placa-faixa",
        titulo: "Placa verde",
        texto: "O sistema achou a peça 317388: um rolamento 6211 com blindagem nos dois lados.",
        antes: (a) => a.exemplo("codigo|317388"),
        rotuloAntes: "Procurar",
      },
      { alvo: "#resultado .resumo", titulo: "Muitos parecidos", texto: "Apareceram 7 cadastros com texto parecido. Só 1 é a mesma peça." },
      { alvo: grupo("parece"), titulo: "Grupo vermelho", texto: "Estes cadastros parecem, mas não são a mesma peça." },
      { alvo: grupo("parece", ".item .motivos"), titulo: "O detalhe que muda tudo", texto: "Cada item diz o que muda. Aqui mudam a proteção e a folga. Com isso, a peça é outra." },
      { alvo: grupo("mesma"), titulo: "Só este é igual", texto: "Este outro código tem a mesma especificação. Ele é a mesma peça." },
      { titulo: "Parecido não é igual", texto: "O sistema nunca chama de igual o que só parece. Ele recusa e diz o motivo." },
    ],
  },
  marca: {
    titulo: "Prova 3: outra marca",
    passos: [
      { alvo: prova(3), titulo: "Prova 3: outra marca", texto: "Um cadastro cita duas marcas para o mesmo rolamento. Vamos procurar o código 624270." },
      {
        alvo: "#resultado .placa-faixa",
        titulo: "Placa amarela",
        texto: "Falta uma informação para confirmar a peça. Uma pessoa precisa conferir.",
        antes: (a) => a.exemplo("codigo|624270"),
        rotuloAntes: "Procurar",
      },
      { alvo: "#resultado .motivos.forte", titulo: "O que falta", texto: "O sistema diz o que não conseguiu confirmar, em palavras simples." },
      { alvo: grupo("outra-marca"), titulo: "A mesma medida em outra marca", texto: "As duas marcas têm a mesma medida. Isso ainda não prova que uma troca a outra." },
      { alvo: grupo("troca"), titulo: "Trocar de marca", texto: "Trocar uma marca pela outra nunca é automático. Uma pessoa decide." },
      { alvo: "#resultado .nota-final", titulo: "Em que máquina serve", texto: "O sistema não diz em que máquina a peça serve. Isso fica com quem conhece a máquina." },
      { alvo: "#form-revisao .escolhas", titulo: "A pessoa decide", texto: "Quem conhece a peça escolhe aqui e diz o motivo." },
    ],
  },
  lote: {
    titulo: "Prova 4: cadastro inteiro",
    passos: [
      { alvo: prova(4), titulo: "Prova 4: cadastro inteiro", texto: "O sistema lê o cadastro inteiro de uma vez, não só uma peça." },
      {
        alvo: "#rodar-lote",
        titulo: "Ler o cadastro inteiro",
        texto: "Este botão lê todos os rolamentos de esferas do catálogo público.",
        antes: (a) => a.aba("lote"),
      },
      {
        alvo: "#lote-resultado .resumo-lote > div:first-child",
        titulo: "Tudo de uma vez",
        texto: "Este é o total de cadastros lidos de uma vez, em poucos segundos.",
        antes: (a) => a.lote(),
        rotuloAntes: "Ler agora",
      },
      { alvo: "#lote-resultado .resumo-lote > div:nth-child(4)", titulo: "Cadastros repetidos", texto: "Cada grupo junta códigos diferentes que são a mesma peça." },
      { alvo: "#lote-resultado .rolagem.tabela", titulo: "Por série", texto: "O resultado de cada série de rolamento. Isto conta o que o sistema decidiu, não se acertou." },
      { alvo: "#lote-resultado .mapa tbody tr", titulo: "A planilha de-para", texto: "Cada linha traz o código, o texto original, o resultado e o código padronizado." },
      { alvo: "#baixar-csv", titulo: "Baixar a planilha", texto: "Baixe a planilha inteira para abrir no Excel." },
    ],
  },
  pessoa: {
    titulo: "Prova 5: decisão de uma pessoa",
    passos: [
      { alvo: prova(5), titulo: "Prova 5: decisão de uma pessoa", texto: "Às vezes o próprio cadastro tem um erro. Vamos procurar o código 472447." },
      {
        alvo: "#resultado .placa-faixa",
        titulo: "Placa vermelha",
        texto: "O cadastro se contradiz. O sistema não escolhe um lado.",
        antes: (a) => a.exemplo("codigo|472447"),
        rotuloAntes: "Procurar",
      },
      { alvo: "#resultado .motivos.forte", titulo: "O motivo", texto: "A descrição diz furo de 60 mm. O código 6013 tem furo de 65 mm." },
      { alvo: "#resultado .original", titulo: "O original fica intacto", texto: "O texto errado continua como está. Quem corrige é uma pessoa." },
      { alvo: "#form-revisao .escolhas", titulo: "A pessoa escolhe", texto: "É esta peça, ainda falta conferir, ou não é esta peça." },
      { alvo: "#form-revisao .linha", titulo: "Quem e por quê", texto: "A pessoa diz o nome ou a função e o motivo. Por exemplo: conferi na etiqueta." },
      { alvo: "#form-revisao .primario", titulo: "Registrar", texto: "A decisão fica guardada ao lado do cadastro original. O registro fica só neste navegador." },
      { alvo: 'nav a[data-aba="revisoes"]', titulo: "Ver as decisões", texto: "Todas as decisões ficam na tela Decisões, com o que o sistema tinha dito." },
    ],
  },
  fornecedor: {
    titulo: "Texto de fornecedor",
    passos: [
      { alvo: prova(6), titulo: "Texto de fornecedor", texto: "Fornecedor escreve curto e do seu jeito. Vamos procurar o texto BLK Modelo 6205-2rs." },
      {
        alvo: "#resultado .placa-faixa",
        titulo: "Placa verde",
        texto: "Mesmo com texto curto, o sistema achou a peça.",
        antes: (a) => a.exemplo("descricao|BLK Modelo 6205-2rs"),
        rotuloAntes: "Procurar",
      },
      { alvo: "#resultado .peca", titulo: "A peça", texto: "Rolamento 6205 com vedação de borracha nos dois lados." },
      { alvo: "#resultado .original", titulo: "O texto como veio", texto: "O texto do fornecedor fica guardado como veio." },
      { alvo: "#resultado .padronizada", titulo: "Do jeito do cadastro", texto: "A mesma peça na descrição padronizada, igual à do cadastro." },
      { alvo: grupo("mesma"), titulo: "Já está no cadastro", texto: "Esta peça já tem código no cadastro. Não precisa criar outro." },
    ],
  },
  foto: {
    titulo: "Foto da etiqueta",
    passos: [
      {
        alvo: '#form-resolver .modos label:has(input[value="ocr"])',
        titulo: "Foto da etiqueta",
        texto: "Também dá para fotografar a etiqueta da peça, sem digitar nada.",
      },
      {
        alvo: "#campo-foto .foto-acoes",
        titulo: "Tirar a foto",
        texto: "No celular, a câmera abre aqui. Vamos usar uma etiqueta de exemplo.",
        antes: (a) => a.modo("ocr"),
      },
      {
        alvo: "#previa",
        titulo: "A foto",
        texto: "Esta etiqueta de exemplo traz o texto do cadastro 311960.",
        antes: (a) => a.foto("/exemplos/etiqueta-impressa-catmat-311960.png"),
        rotuloAntes: "Ler a etiqueta",
      },
      { alvo: "#ocr-estado", titulo: "A leitura", texto: "Aqui o site diz se a leitura ficou boa ou ruim." },
      { alvo: "#texto-ocr", titulo: "Confira o texto", texto: "Este é o texto lido na foto. Corrija o que estiver errado. A câmera lê o texto, não a peça." },
      { alvo: "#form-resolver .primario", titulo: "Identificar", texto: "Agora o site procura a peça pelo texto lido." },
      {
        alvo: "#resultado .placa-faixa",
        titulo: "A resposta",
        texto: "A resposta vem igual à do código digitado.",
        antes: (a) => a.identificar(),
        rotuloAntes: "Identificar",
      },
      { alvo: "#resultado .original", titulo: "O texto lido fica guardado", texto: "O texto lido na foto aparece como veio, sem mudança." },
    ],
  },
};

const VISTO = "agroparts.tour.v1";
let atual: Driver | null = null;

function alvoDe(alvo: Alvo | undefined): DriveStep["element"] {
  if (alvo === undefined) return undefined;
  // Sem elemento na tela (por exemplo, a API falhou), o passo aparece no centro.
  return () => (typeof alvo === "string" ? document.querySelector(alvo) : alvo()) ?? document.body;
}

export function abrirTour(nome: string, acoes: Acoes) {
  const tour = TOURS[nome];
  if (!tour) return;
  atual?.destroy();
  const reduzir = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let ocupado = false;

  const passos: DriveStep[] = tour.passos.map((p, i) => {
    const seguinte = tour.passos[i + 1];
    const passo: DriveStep = {
      element: alvoDe(p.alvo),
      popover: { title: p.titulo, description: p.texto, side: p.lado },
    };
    if (seguinte?.antes) {
      passo.popover!.nextBtnText = seguinte.rotuloAntes ?? "Avançar";
      passo.popover!.onNextClick = async (_el, _passo, { driver: d }) => {
        if (ocupado) return;
        ocupado = true;
        const botao = d.getState("popover")?.nextButton as HTMLButtonElement | undefined;
        if (botao) {
          botao.disabled = true;
          botao.textContent = "Carregando…";
        }
        try {
          await seguinte.antes!(acoes);
        } finally {
          ocupado = false;
        }
        if (d.isActive()) d.moveNext();
      };
    }
    return passo;
  });

  const d = driver({
    steps: passos,
    animate: !reduzir,
    // Rolagem suave deixa o popover no lugar antigo até a rolagem acabar. A rolagem é direta.
    smoothScroll: false,
    showProgress: true,
    progressText: "{{current}} de {{total}}",
    nextBtnText: "Avançar",
    prevBtnText: "Voltar",
    doneBtnText: "Concluir",
    showButtons: ["next", "previous"],
    allowClose: true,
    overlayClickBehavior: "none",
    overlayColor: "#15191a",
    overlayOpacity: 0.55,
    stagePadding: 6,
    stageRadius: 4,
    popoverOffset: 12,
    disableActiveInteraction: true,
    popoverClass: "tour",
    onPopoverRender: (pop, { driver: dd }) => {
      if (!dd.isLastStep()) {
        const pular = Object.assign(document.createElement("button"), {
          type: "button",
          className: "tour-pular",
          textContent: "Pular explicação",
        });
        pular.addEventListener("click", () => dd.destroy());
        pop.footer.insertBefore(pular, pop.footer.firstChild);
      }
      // O driver.js põe o foco no primeiro botão; o botão de avançar é o caminho natural.
      requestAnimationFrame(() => pop.nextButton.focus({ preventScroll: true }));
    },
    onDestroyed: () => {
      if (atual === d) atual = null;
      document.getElementById("como-funciona")?.focus({ preventScroll: true });
    },
  });
  atual = d;
  // A visão geral abre sozinha uma vez só: depois de aberta, fica lembrada neste navegador.
  if (nome === "inicio") localStorage.setItem(VISTO, "sim");
  d.drive();
}

/** Liga os botões de explicação e abre a visão geral na primeira visita. */
export function iniciarTours(acoes: Acoes) {
  const menu = document.getElementById("menu-tours");
  document.querySelectorAll<HTMLButtonElement>("[data-tour]").forEach((b) =>
    b.addEventListener("click", () => {
      if (menu?.matches(":popover-open")) menu.hidePopover();
      abrirTour(b.dataset.tour!, acoes);
    }),
  );
  const naInicial = !location.hash || location.hash === "#resolver";
  if (naInicial && !localStorage.getItem(VISTO)) abrirTour("inicio", acoes);
}
