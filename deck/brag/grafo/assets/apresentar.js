// A casca do apresentador. O render do Hyperframes busca a linha do tempo quadro a quadro e não usa isto.
// Liga sozinha numa janela de navegador comum; ?apresentar=1 força, ?apresentar=0 desliga.
(() => {
  const q = new URLSearchParams(location.search);
  const pedido = q.get("apresentar");
  const ligada = pedido ? pedido === "1" : window.top === window && !navigator.webdriver;
  if (!ligada) return;

  const tl = window.__timelines.main;
  const slides = [...document.querySelectorAll("[data-slide]")].map((el) => {
    const inicio = Number(el.dataset.start);
    return { id: el.id, inicio, pausa: inicio + Number(el.dataset.rest), notas: el.dataset.notes || "" };
  });
  const clips = [...document.querySelectorAll(".clip")].map((el) => ({
    el,
    de: Number(el.dataset.start),
    ate: Number(el.dataset.start) + Number(el.dataset.duration),
  }));
  const canal = "BroadcastChannel" in window ? new BroadcastChannel("agroparts-grafo") : null;

  const mostrarClips = () => {
    const t = tl.time();
    for (const c of clips) c.el.style.visibility = t >= c.de && t < c.ate ? "visible" : "hidden";
  };
  tl.eventCallback("onUpdate", mostrarClips);

  const ajustar = () => {
    const s = Math.min(innerWidth / 1920, innerHeight / 1080);
    const b = document.body.style;
    b.transformOrigin = "0 0";
    b.transform = `translate(${(innerWidth - 1920 * s) / 2}px, ${(innerHeight - 1080 * s) / 2}px) scale(${s})`;
  };
  document.documentElement.style.background = "#15191a";
  document.documentElement.style.overflow = "hidden";
  addEventListener("resize", ajustar);
  ajustar();

  let atual = -1;
  let entrada = null;
  const avisar = () => {
    history.replaceState(null, "", `#${atual + 1}`);
    canal?.postMessage({ atual, total: slides.length, notas: slides[atual]?.notas || "" });
  };
  const parar = (i) => {
    entrada?.kill();
    entrada = null;
    atual = i;
    tl.pause();
    tl.seek(slides[i].pausa, false);
    mostrarClips();
    avisar();
  };
  const tocar = (i) => {
    entrada?.kill();
    atual = i;
    tl.pause();
    tl.seek(slides[i].inicio, false);
    mostrarClips();
    entrada = tl.tweenFromTo(slides[i].inicio, slides[i].pausa, { ease: "none" });
    avisar();
  };
  const avancar = () => {
    if (atual < slides.length - 1) tocar(atual + 1);
  };
  const voltar = () => {
    if (atual > 0) parar(atual - 1);
    else if (atual === 0) {
      entrada?.kill();
      tl.seek(0, false);
      mostrarClips();
      atual = -1;
    }
  };
  const telaCheia = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  };

  addEventListener("keydown", (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const k = e.key;
    if (["ArrowRight", "ArrowDown", " ", "PageDown", "Enter"].includes(k)) avancar();
    else if (["ArrowLeft", "ArrowUp", "PageUp", "Backspace"].includes(k)) voltar();
    else if (k === "Home") tocar(0);
    else if (k === "End") parar(slides.length - 1);
    else if (k === "f" || k === "F") telaCheia();
    else if (k === "n" || k === "N") window.open("notas.html", "agroparts-notas", "width=900,height=700");
    else return;
    e.preventDefault();
  });
  addEventListener("click", (e) => {
    if (e.button === 0) avancar();
  });
  addEventListener("contextmenu", (e) => {
    e.preventDefault();
    voltar();
  });
  canal?.addEventListener("message", (e) => {
    if (e.data === "avancar") avancar();
    else if (e.data === "voltar") voltar();
    else if (e.data === "estado") avisar();
  });

  let sumir = 0;
  addEventListener("mousemove", () => {
    document.body.style.cursor = "";
    clearTimeout(sumir);
    sumir = setTimeout(() => (document.body.style.cursor = "none"), 1500);
  });

  const n = Number(location.hash.slice(1));
  document.fonts.ready.then(() => {
    tl.seek(0, false);
    mostrarClips();
    if (n >= 1 && n <= slides.length) parar(n - 1);
  });
})();
