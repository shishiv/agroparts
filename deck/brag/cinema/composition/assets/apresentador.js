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
  }

  function telaCheia() {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(function () {});
    }
  }

  addEventListener("keydown", function (e) {
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
    }
  });
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
