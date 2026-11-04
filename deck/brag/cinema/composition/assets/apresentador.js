// Modo apresentador: só liga com ?apresentar na URL. Sem ele, a página é a composição pura que o render e o check leem.
(function () {
  if (!/[?&]apresentar\b/.test(location.search)) return;

  var tl = window.__timelines.deck;
  var root = document.getElementById("root");
  var slides = Array.prototype.map.call(root.querySelectorAll(":scope > .slide"), function (el) {
    var start = Number(el.dataset.start);
    return { el: el, start: start, end: start + Number(el.dataset.duration), rest: start + Number(el.dataset.rest) };
  });
  var atual = 0;
  var entrada = null;

  document.documentElement.style.cssText = "width:100vw;height:100vh;background:#000;cursor:none";
  document.body.style.cssText = "width:100vw;height:100vh;background:#000;overflow:hidden";
  root.style.position = "absolute";
  root.style.transformOrigin = "0 0";

  function encaixar() {
    var s = Math.min(innerWidth / 1920, innerHeight / 1080);
    root.style.transform = "translate(" + (innerWidth - 1920 * s) / 2 + "px," + (innerHeight - 1080 * s) / 2 + "px) scale(" + s + ")";
  }

  function mostrar() {
    var t = tl.time();
    slides.forEach(function (s) {
      var ativo = t >= s.start && t < s.end;
      s.el.style.visibility = ativo ? "visible" : "hidden";
    });
  }

  function ir(i, tocar) {
    atual = Math.max(0, Math.min(slides.length - 1, i));
    if (entrada) entrada.kill();
    entrada = null;
    var s = slides[atual];
    if (tocar) {
      tl.seek(s.start);
      mostrar();
      entrada = tl.tweenFromTo(s.start, s.rest, { ease: "none", onUpdate: mostrar });
    } else {
      tl.seek(s.rest);
      mostrar();
    }
    history.replaceState(null, "", "#" + (atual + 1));
    atualizarNotas();
  }

  // Notas do apresentador (tecla N): uma janela à parte com a fala do slide atual e o começo do próximo.
  var notas = null;
  var comeco = null;
  function falaDe(i) {
    return (window.FALAS && window.FALAS[i]) || "";
  }
  function atualizarNotas() {
    if (!notas || notas.closed) return;
    var d = notas.document;
    var min = comeco ? Math.floor((performance.now() - comeco) / 60000) : 0;
    d.getElementById("n-onde").textContent = "Slide " + (atual + 1) + " de " + slides.length + " · " + min + " min";
    d.getElementById("n-fala").textContent = falaDe(atual);
    d.getElementById("n-proxima").textContent = atual + 1 < slides.length ? "Depois: " + falaDe(atual + 1).split("\n")[0] : "Último slide.";
  }
  function abrirNotas() {
    notas = window.open("", "agroparts-notas", "width=960,height=720");
    if (!notas) return;
    comeco = comeco || performance.now();
    notas.document.open();
    notas.document.write(
      '<!doctype html><meta charset="utf-8"><title>Notas · AgroParts</title>' +
        "<style>body{margin:0;padding:40px 48px;background:#15191a;color:#f3f4f2;font:400 30px/1.45 Barlow,Arial,sans-serif}" +
        "#n-onde{color:#8f989b;font-weight:600;margin-bottom:24px}#n-fala{white-space:pre-line;font-size:34px}" +
        "#n-proxima{color:#8f989b;margin-top:36px;font-size:24px}</style>" +
        '<div id="n-onde"></div><div id="n-fala"></div><div id="n-proxima"></div>',
    );
    notas.document.close();
    notas.addEventListener("keydown", teclar);
    atualizarNotas();
  }

  function telaCheia() {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(function () {});
    }
  }

  function teclar(e) {
    if (["ArrowRight", " ", "PageDown", "Enter"].indexOf(e.key) >= 0) {
      e.preventDefault();
      if (atual < slides.length - 1) ir(atual + 1, true);
    } else if (["ArrowLeft", "PageUp", "Backspace"].indexOf(e.key) >= 0) {
      e.preventDefault();
      ir(atual - 1, false);
    } else if (e.key === "Home") {
      ir(0, true);
    } else if (e.key === "f" || e.key === "F") {
      telaCheia();
    } else if (e.key === "n" || e.key === "N") {
      abrirNotas();
    }
  }
  addEventListener("keydown", teclar);
  addEventListener("click", function () {
    telaCheia();
    if (atual < slides.length - 1) ir(atual + 1, true);
  });
  addEventListener("resize", encaixar);

  encaixar();
  var inicio = Math.max(0, (parseInt(location.hash.slice(1), 10) || 1) - 1);
  tl.seek(slides[inicio].start);
  mostrar();
  document.fonts.ready.then(function () {
    ir(inicio, true);
  });
})();
