// Casca do apresentador: cada slide da composição toca a entrada e para no quadro final.
// → espaço, PageDown, Enter ou clique avançam; ← PageUp ou Backspace voltam;
// F põe e tira a tela cheia; N abre as notas numa segunda janela.
// #3 na URL abre o slide 3 já parado no quadro final.

const player = document.getElementById("player");
const canal = new BroadcastChannel("agroparts-deck-produto");
const QUADRO = 1 / 30;

const html = await (await fetch("composition/index.html")).text();
const slides = [...new DOMParser().parseFromString(html, "text/html").querySelectorAll("section.slide")].map((s) => ({
  id: s.id,
  inicio: Number(s.dataset.start),
  pausa: Number(s.dataset.pausa),
  notas: s.dataset.notas ?? "",
}));

let atual = -1;
let alvo = null;

await new Promise((pronto) => {
  if (player.duration > 0) pronto();
  else player.addEventListener("ready", pronto, { once: true });
});

function avisar() {
  canal.postMessage({
    atual,
    total: slides.length,
    notas: slides[atual]?.notas ?? "",
    proximo: slides[atual + 1]?.notas ?? "",
  });
  history.replaceState(null, "", atual >= 0 ? `#${atual + 1}` : location.pathname);
}

function parar(i) {
  alvo = null;
  player.pause();
  player.seek(i >= 0 ? slides[i].pausa : 0);
  atual = i;
  avisar();
}

function tocar(i) {
  atual = i;
  alvo = slides[i].pausa;
  player.seek(slides[i].inicio + QUADRO);
  player.play();
  avisar();
  requestAnimationFrame(vigiar);
}

function vigiar() {
  if (alvo === null) return;
  if (player.currentTime >= alvo - QUADRO) return parar(atual);
  requestAnimationFrame(vigiar);
}

function avancar() {
  if (document.fullscreenElement === null && document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {});
  }
  if (alvo !== null) return parar(atual);
  if (atual < slides.length - 1) tocar(atual + 1);
}

function voltar() {
  parar(Math.max(atual - 1, -1));
}

const comandos = { avancar, voltar };

addEventListener(
  "keydown",
  (e) => {
    const tecla = {
      ArrowRight: avancar,
      " ": avancar,
      PageDown: avancar,
      Enter: avancar,
      ArrowLeft: voltar,
      PageUp: voltar,
      Backspace: voltar,
      Home: () => parar(-1),
      f: () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()),
      n: () => open("notas.html", "agroparts-notas", "width=900,height=600"),
    }[e.key];
    if (!tecla) return;
    e.preventDefault();
    e.stopPropagation();
    tecla();
  },
  true,
);

addEventListener(
  "pointerdown",
  (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    avancar();
  },
  true,
);

canal.onmessage = ({ data }) => {
  if (data === "estado") avisar();
  else comandos[data]?.();
};

let ocioso;
addEventListener("pointermove", () => {
  document.body.classList.remove("parado");
  clearTimeout(ocioso);
  ocioso = setTimeout(() => document.body.classList.add("parado"), 1500);
});

const pedido = Number(location.hash.slice(1));
parar(pedido >= 1 && pedido <= slides.length ? pedido - 1 : -1);
