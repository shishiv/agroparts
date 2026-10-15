#!/usr/bin/env python3
"""Extrai as ilustrações vetoriais do modelo do Canva para ilustracoes/*.svg.

Requisito: pdftocairo (poppler). Uso: python3 extrair-ilustracoes.py
As caixas estão em pontos da página do modelo (1440 x 810 pt).
"""
import os
import subprocess
import sys
import tempfile

from svgcrop import Page

AQUI = os.path.dirname(os.path.abspath(__file__))
MODELO = os.path.join(AQUI, "modelo-canva.pdf")
SAIDA = os.path.join(AQUI, "ilustracoes")

# nome: (página do modelo, caixa x0, y0, x1, y1)
ILUSTRACOES = {
    # Página de recursos do modelo (página 10)
    "notebook": (10, (596, 95, 762, 268)),
    "busca": (10, (886, 121, 1067, 284)),
    "livro": (10, (1146, 140, 1339, 262)),
    "celular": (10, (594, 355, 776, 470)),
    "chaves": (10, (927, 351, 1025, 475)),
    "aviao": (10, (1153, 357, 1335, 474)),
    "janelas": (10, (910, 545, 1048, 707)),
    "tomada": (10, (1171, 545, 1335, 678)),
    "lampada": (10, (629, 558, 728, 707)),
    # Ilustrações grandes e enfeites de canto, nas posições do modelo
    "pessoa-no-computador": (5, (767, 144, 1350, 697)),
    "janelas-grandes": (8, (858, -12, 1490, 733)),
    "notebook-grande": (7, (857, 41, 1440, 751)),
    "chave-roxa-canto": (7, (25, 526, 141, 810)),
    "chave-branca-canto": (1, (37, 530, 153, 810)),
    "chave-branca-topo": (5, (5, 0, 121, 289)),
    "chave-verde-topo": (6, (1315, 0, 1431, 261)),
}


def page_svg(numero, pasta):
    destino = os.path.join(pasta, f"p{numero}.svg")
    # pdftocairo às vezes aborta ao fechar, depois de gravar o SVG inteiro.
    subprocess.run(["pdftocairo", "-svg", "-f", str(numero), "-l", str(numero), MODELO, destino],
                   stderr=subprocess.DEVNULL, check=False)
    return Page(destino)


def main():
    os.makedirs(SAIDA, exist_ok=True)
    with tempfile.TemporaryDirectory() as pasta:
        paginas = {}
        for nome, (numero, caixa) in ILUSTRACOES.items():
            if numero not in paginas:
                paginas[numero] = page_svg(numero, pasta)
            # Cada recorte leva só os elementos que cabem inteiros na caixa.
            dentro = lambda b, c=caixa: b[0] >= c[0] - 1 and b[1] >= c[1] - 1 and b[2] <= c[2] + 1 and b[3] <= c[3] + 1
            total = paginas[numero].crop(caixa, os.path.join(SAIDA, f"{nome}.svg"), keep=dentro)
            if total == 0:
                sys.exit(f"nenhum elemento em {nome}")
            print(f"{nome}.svg: {total} elementos")


if __name__ == "__main__":
    main()
