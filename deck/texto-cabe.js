// Confere, na tela parada, que todo texto visível dentro de `raiz` cabe na caixa dele e não sai do quadro.
// Devolve "ok" ou uma linha por problema. Roda no deck/checar.sh (um slide por vez) e no tests/tour.test.ts (raiz "body").
// [data-layout-allow-overflow] tira o elemento da conferência: só para o que esconde texto de propósito (máscara, odômetro).
(raiz) => {
  const FOLGA = 6; // px: letra com acento ou descendente passa a caixa por poucos pixels sem cortar nada
  const problemas = [];
  const quadro = document.querySelector(raiz);
  const q = quadro.getBoundingClientRect();
  const visivel = (el) => el.checkVisibility({ opacityProperty: true, visibilityProperty: true });
  // A parte do retângulo que nenhum ancestral com overflow cortado esconde.
  const recorte = (no, c) => {
    let r = { l: c.left, r: c.right, t: c.top, b: c.bottom };
    for (let e = no.parentElement; e && e !== document.body; e = e.parentElement) {
      if (getComputedStyle(e).overflow === "visible") continue;
      const b = e.getBoundingClientRect();
      r = { l: Math.max(r.l, b.left), r: Math.min(r.r, b.right), t: Math.max(r.t, b.top), b: Math.min(r.b, b.bottom) };
    }
    return r.r - r.l > 1 && r.b - r.t > 1 ? r : null;
  };
  const andar = document.createTreeWalker(quadro, NodeFilter.SHOW_TEXT);
  const pais = new Set();
  for (let no = andar.nextNode(); no; no = andar.nextNode()) {
    const texto = no.textContent.trim();
    if (!texto || !visivel(no.parentElement) || no.parentElement.closest("[data-layout-allow-overflow]")) continue;
    const range = document.createRange();
    range.selectNodeContents(no);
    for (const c of range.getClientRects()) {
      const v = c.width > 0 && recorte(no, c);
      if (!v) continue;
      pais.add(no.parentElement);
      // Texto todo fora do quadro foi tirado dali de propósito (link "pular para o conteúdo"); o erro é o que passa da borda.
      const cruza = v.r > q.left && v.l < q.right && v.b > q.top && v.t < q.bottom;
      if (cruza && (v.l < q.left - FOLGA || v.r > q.right + FOLGA || v.t < q.top - FOLGA || v.b > q.bottom + FOLGA))
        problemas.push(`texto sai do quadro: "${texto.slice(0, 50)}"`);
    }
  }
  for (const el of pais) {
    for (let e = el; e && e !== quadro; e = e.parentElement) {
      if (e.closest("[data-layout-allow-overflow]")) break;
      const s = getComputedStyle(e);
      if (/auto|scroll/.test(s.overflowX + s.overflowY)) break; // a caixa rola, e o resto aparece ao rolar
      const corta = s.overflow !== "visible" || s.textOverflow === "ellipsis" || s.webkitLineClamp !== "none";
      if (corta || s.position === "absolute") {
        const dw = e.scrollWidth - e.clientWidth, dh = e.scrollHeight - e.clientHeight;
        // Caixa sem corte só erra na largura: a sobra na altura de um número grande com line-height 1 não esconde nada.
        if (dw > FOLGA || (corta && dh > FOLGA))
          problemas.push(`texto maior que a caixa (${dw}x${dh}px) <${e.tagName.toLowerCase()} ${e.id ? "#" + e.id : "." + [...e.classList].join(".")}>: "${e.textContent.trim().replace(/\s+/g, " ").slice(0, 50)}"`);
        break;
      }
    }
  }
  return [...new Set(problemas)].join("\n") || "ok";
}
