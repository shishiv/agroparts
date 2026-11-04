#!/usr/bin/env python3
"""Liga o deck ao texto aprovado.

1. Põe a "Fala" de cada slide nas notas do apresentador (#falas em index.html), com ▶ onde a seta avança.
2. Confere que a tela de cada slide tem exatamente as palavras do "Na tela", nem uma a mais.

Uso: scripts/texto.py <report.md>   (sai 1 se alguma tela não bater)
"""
import html
import json
import re
import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path

PASTA = Path(__file__).resolve().parent.parent
INDEX = PASTA / "index.html"

# Onde a seta avança dentro da fala: o primeiro trecho de cada slide entra com a troca de slide,
# os outros entram quando quem fala chega nestas palavras.
DEIXAS = {
    "s1": ["E nós somos a AgroParts", "Queremos"],
    "s2": ["Mas, na prateleira"],
    "s3": ["Milhões"],
    "s4": ["o almoxarifado de um jeito", "O sistema vê três peças"],
    "s5": [],
    "s6": ["é a mesma peça", "ou precisa de uma pessoa"],
    "s7": [],
    "s8": ["Um:", "Dois:", "Três:", "Quatro:", "Cinco:"],
    "s9": ["Na primeira rodada", "Depois de um ajuste"],
    "s10": ["O arquivo não sai", "Num arquivo público", "ela achou 55 grupos"],
    "s11": ["A Verusen", "No Brasil"],
    "s12": ["em dinheiro", "e em conhecimento", "e acesso a uma usina", "O QR abre"],
}


def ler_texto(caminho):
    texto = Path(caminho).read_text(encoding="utf-8")
    slides = []
    for bloco in re.split(r"^## \d+ · ", texto, flags=re.M)[1:]:
        titulo = bloco.splitlines()[0].strip()
        if not re.search(r"^Na tela:", bloco, re.M):
            continue
        tela = re.search(r"^Na tela: (.+)$", bloco, re.M).group(1)
        fala = re.search(r"^Fala:\n((?:- .+\n)+)", bloco, re.M).group(1)
        falas = [re.match(r"- (\w+): (.+)", l).groups() for l in fala.strip().splitlines()]
        slides.append({"titulo": titulo, "tela": tela, "falas": falas})
    return slides


def palavras(s):
    s = s.replace("{", " ").replace("}", " ").replace("·", " ")
    return Counter(w for w in re.findall(r"[\wÀ-ÿ$ª=?/.,:-]+", s.lower()) if w.strip(".,:"))


class TextoVisivel(HTMLParser):
    """Junta o texto de cada section.slide, fora de .nao-texto e aria-hidden."""

    def __init__(self):
        super().__init__()
        self.slide, self.pulo, self.pilha, self.textos = None, 0, [], {}

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ("br", "img", "use", "i", "path", "circle"):
            if tag == "img" and self.slide and not self.pulo and "QR" in (a.get("alt") or ""):
                self.textos[self.slide].append(" QR ")
            return
        pula = "nao-texto" in (a.get("class") or "") or a.get("aria-hidden") == "true" or tag in ("script", "style", "symbol")
        if tag == "section" and "slide" in (a.get("class") or ""):
            self.slide = a["id"]
            self.textos[self.slide] = []
        self.pilha.append(pula)
        self.pulo += pula

    def handle_endtag(self, tag):
        if tag in ("br", "img", "use", "i", "path", "circle"):
            return
        if self.pilha:
            self.pulo -= self.pilha.pop()
        if tag == "section":
            self.slide = None

    def handle_data(self, data):
        if self.slide and not self.pulo:
            self.textos[self.slide].append(data)


def com_deixas(id_slide, falas):
    linhas = []
    deixas = list(DEIXAS[id_slide])
    for quem, frase in falas:
        for d in list(deixas):
            if d in frase:
                frase = frase.replace(d, "▶ " + d, 1)
                deixas.remove(d)
        linhas.append(f"{quem}: {frase}")
    if deixas:
        sys.exit(f"{id_slide}: deixa não achada na fala: {deixas}")
    return "▶ " + "\n".join(linhas)


def main():
    slides = ler_texto(sys.argv[1])
    fonte = INDEX.read_text(encoding="utf-8")
    ids = re.findall(r'<section id="(s\d+)" class="slide', fonte)
    if len(ids) != len(slides):
        sys.exit(f"o texto tem {len(slides)} slides e o deck tem {len(ids)}")

    falas = {i: com_deixas(i, s["falas"]) for i, s in zip(ids, slides)}
    corpo = json.dumps(falas, ensure_ascii=False, indent=2).replace("</", "<\\/")
    fonte = re.sub(r'(<script type="application/json" id="falas">).*?(</script>)', lambda m: m.group(1) + "\n" + corpo + "\n    " + m.group(2), fonte, flags=re.S)
    INDEX.write_text(fonte, encoding="utf-8")

    leitor = TextoVisivel()
    leitor.feed(fonte)
    ruim = 0
    for i, s in zip(ids, slides):
        tela = html.unescape(" ".join(leitor.textos[i]))
        esperado, visto = palavras(s["tela"]), palavras(tela)
        if esperado != visto:
            ruim += 1
            print(f"{i} · {s['titulo']}: a mais {dict(visto - esperado)}, faltando {dict(esperado - visto)}")
        else:
            print(f"{i} · {s['titulo']}: tela confere ({sum(visto.values())} palavras)")
    sys.exit(1 if ruim else 0)


if __name__ == "__main__":
    main()
