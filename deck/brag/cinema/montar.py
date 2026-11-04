#!/usr/bin/env python3
"""Monta composition/index.html a partir de molde.html e, se receber o texto aprovado, refaz assets/falas.js.

Uso: python3 deck/brag/cinema/montar.py [caminho do report.md aprovado]
O texto de cada slide fica escrito no molde; mude-o lá e rode de novo.
"""
import json, pathlib, re, sys

aqui = pathlib.Path(__file__).resolve().parent
comp = aqui / "composition"
html = (aqui / "molde.html").read_text()

def rolo(m):
    d = m.group(1)
    fita = "".join(f"<i>{i % 10}</i>" for i in range(20))
    return f'<span class="dig"><span class="fita" data-final="{d}">{fita}</span></span>'

html = re.sub(r"ROLO\((\d)\)", rolo, html)
brasil = re.search(r'd="([^"]+)"', (comp / "assets/brasil.svg").read_text()).group(1)
html = html.replace('d="BRASIL"', f'd="{brasil}"')
qr = (comp / "assets/qr-diagnostico.svg").read_text()
qr = qr[qr.index("<svg"):].replace('width="3.07cm" height="3.07cm"', 'aria-hidden="true"')
html = html.replace("QRCODE", qr)
(comp / "index.html").write_text(html)
print("composition/index.html montado")

if len(sys.argv) > 1:
    texto = pathlib.Path(sys.argv[1]).read_text()
    falas = []
    for bloco in re.split(r"\n## \d+ · ", texto)[1:]:
        fala = re.search(r"Fala:\n(.*?)\nTempo: (.*?)\n", bloco, re.S)
        falas.append({"fala": "\n".join(l.removeprefix("- ") for l in fala.group(1).strip().splitlines()), "tempo": fala.group(2)})
    (comp / "assets/falas.js").write_text("window.FALAS = " + json.dumps(falas, ensure_ascii=False, indent=1) + ";\n")
    print(f"{len(falas)} falas em composition/assets/falas.js")
