// Confere o layout das páginas que o export de PDF do open-slide monta em #os-print-root.
// Regras (as mesmas de docs/rota-inova/entrega-unica.html?checar=1):
// todo texto fica dentro da área útil da página, dentro da caixa branca que o contém,
// fora das fotos de canto a canto (menos o crédito, que fica dentro da foto), e toda imagem carrega.
// Devolve "ok" ou uma linha por problema.
(() => {
  const frames = [...document.querySelectorAll('#os-print-root .os-print-frame')];
  if (!frames.length) return 'nenhuma página no #os-print-root';
  const problemas = [];
  const dentro = (r, c, folga = 1) =>
    r.left >= c.left - folga && r.right <= c.right + folga && r.top >= c.top - folga && r.bottom <= c.bottom + folga;
  const cruza = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
  frames.forEach((frame, i) => {
    const pagina = i + 1;
    const s = frame.getBoundingClientRect();
    const util = { left: s.left + 40, right: s.right - 40, top: s.top + 30, bottom: s.bottom - 20 };
    // Fotos de canto a canto. As capturas recortadas (data-captura) ficam de fora: a imagem é maior que o recorte visível.
    const fotos = [...frame.querySelectorAll('img')].filter((img) => {
      if (img.closest('[data-captura]')) return false;
      const r = img.getBoundingClientRect();
      return r.height >= 1000;
    });
    const caixasFoto = fotos.map((f) => f.getBoundingClientRect());
    const ilustracoes = [...frame.querySelectorAll('[data-ilus]')].map((el) => el.getBoundingClientRect());
    const walker = document.createTreeWalker(frame, NodeFilter.SHOW_TEXT);
    for (let no = walker.nextNode(); no; no = walker.nextNode()) {
      const texto = no.textContent.trim();
      if (!texto) continue;
      const range = document.createRange();
      range.selectNodeContents(no);
      const pai = no.parentElement;
      const caixa = pai.closest('[data-caixa]');
      const c = caixa && caixa.getBoundingClientRect();
      const trecho = texto.slice(0, 40);
      const credito = pai.closest('[data-credito]');
      for (const r of range.getClientRects()) {
        if (!credito && !dentro(r, util)) problemas.push(`página ${pagina}: texto fora da área útil: "${trecho}"`);
        if (c && !dentro(r, c)) problemas.push(`página ${pagina}: texto vaza da caixa: "${trecho}"`);
        if (ilustracoes.some((b) => cruza(r, b))) problemas.push(`página ${pagina}: texto sobre uma ilustração: "${trecho}"`);
        if (credito) {
          if (!caixasFoto.some((b) => dentro(r, b))) problemas.push(`página ${pagina}: crédito fora da foto: "${trecho}"`);
        } else if (caixasFoto.some((b) => cruza(r, b))) {
          problemas.push(`página ${pagina}: texto sobre a foto: "${trecho}"`);
        }
      }
    }
    frame.querySelectorAll('[data-caixa]').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (!dentro(r, { ...util, bottom: s.bottom - 80 })) problemas.push(`página ${pagina}: caixa fora da área útil: "${el.textContent.trim().slice(0, 40)}"`);
      if (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) problemas.push(`página ${pagina}: conteúdo maior que a caixa: "${el.textContent.trim().slice(0, 40)}"`);
    });
    frame.querySelectorAll('img').forEach((img) => {
      if (!img.complete || img.naturalWidth === 0) problemas.push(`página ${pagina}: imagem não carregou: ${img.getAttribute('src')}`);
    });
    frame.querySelectorAll('[data-ilus-ausente]').forEach(() => problemas.push(`página ${pagina}: ilustração do Canva ausente (rode preparar.sh)`));
  });
  return [...new Set(problemas)].join('\n') || 'ok';
})();
