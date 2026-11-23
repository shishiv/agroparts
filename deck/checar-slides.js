// Para a linha do tempo do deck no quadro de repouso de cada slide, deixa só esse slide visível
// e confere que o texto cabe (texto-cabe.js) e que o slide mostra até 40 palavras.
// O deck/checar.sh chama esta função com a de texto-cabe.js. Devolve "ok" ou uma linha por problema.
async (textoCabe) => {
  const LIMITE = 40; // regra do Myke para o texto de um slide
  await document.fonts.ready;
  const tl = Object.values(window.__timelines || {})[0];
  if (!tl) return "deck sem linha do tempo em window.__timelines";
  const slides = [...document.querySelectorAll("section.slide[data-start], [data-slide]")].filter((s, i, a) => a.indexOf(s) === i);
  if (!slides.length) return "deck sem section.slide com data-start";
  // Repouso: data-rest (relativo ao slide), data-pausa (absoluto), o fim da última data-paradas, ou meio segundo antes do fim.
  const repouso = (s) => {
    const d = s.dataset;
    if (d.rest !== undefined) return Number(d.start) + Number(d.rest);
    if (d.pausa !== undefined) return Number(d.pausa);
    if (d.paradas) return Number(d.start) + Number(d.paradas.split(",").at(-1).split("-")[1]);
    return Number(d.start) + Number(d.duration) - 0.5;
  };
  const visivel = (el) => el.checkVisibility({ opacityProperty: true, visibilityProperty: true });
  // Um dígito do odômetro escondido pela máscara (overflow cortado) ou fora da tela não aparece, então não conta.
  const aparece = (no) => {
    const r = document.createRange();
    r.selectNodeContents(no);
    return [...r.getClientRects()].some((c) => {
      let l = c.left, rr = c.right, t = c.top, b = c.bottom;
      for (let e = no.parentElement; e && e !== document.body; e = e.parentElement) {
        if (getComputedStyle(e).overflow === "visible") continue;
        const q = e.getBoundingClientRect();
        l = Math.max(l, q.left); rr = Math.min(rr, q.right); t = Math.max(t, q.top); b = Math.min(b, q.bottom);
      }
      return rr - l > 1 && b - t > 1 && rr > 0 && l < innerWidth && b > 0 && t < innerHeight;
    });
  };
  const problemas = [];
  for (const [i, s] of slides.entries()) {
    tl.pause();
    tl.seek(repouso(s), false);
    for (const outro of slides) outro.style.visibility = outro === s ? "visible" : "hidden";
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const nome = `slide ${i + 1} (${s.id})`;
    const cabe = textoCabe("#" + s.id);
    if (cabe !== "ok") for (const linha of cabe.split("\n")) problemas.push(`${nome}: ${linha}`);
    // A cópia de uma tela do site, marcada com data-tela-do-site, vale como foto da tela e não conta.
    const andar = document.createTreeWalker(s, NodeFilter.SHOW_TEXT);
    let texto = "";
    for (let no = andar.nextNode(); no; no = andar.nextNode())
      if (!no.parentElement.closest("[data-tela-do-site]") && visivel(no.parentElement) && aparece(no)) texto += " " + no.textContent;
    const palavras = texto.split(/\s+/).filter((x) => /[\p{L}]{2,}|\d/u.test(x)).length;
    if (palavras > LIMITE) problemas.push(`${nome}: ${palavras} palavras na tela; o limite do Myke é ${LIMITE} por slide`);
  }
  return problemas.join("\n") || "ok";
}
