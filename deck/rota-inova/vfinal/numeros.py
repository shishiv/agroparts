#!/usr/bin/env python3
"""Confere cada número da tela e da fala de texto-<A|B|C>.md contra a lista de números com fonte
(agroparts-doc-testes/agroparts-testes.md e docs/pesquisa/numeros-do-pitch.md). Sai 1 se achar número sem fonte."""
import re
import sys

FONTES = {
    "183,5": "São Martinho 3T26, p. 15 (publicado)", "183": "São Martinho (falado: 183 milhões e meio)",
    "9": "São Martinho: abril a dezembro de 2025, 9 meses", "nove": "idem",
    "6318": "código ilustrativo do slide 4", "6312": "código real do teste (CATMAT 283529, 472657, 311967)",
    "6312-2Z": "código real do teste", "6318-2Z": "código ilustrativo", "6318ZZC3": "código ilustrativo",
    "1": "1 em 12 / 1ª rodada", "12": "33 ÷ 396 = 8,3% (medido)", "doze": "idem", "8%": "33 ÷ 396 = 8,3% (medido)",
    "396": "396 cadastros ativos do padrão 11797 (medido)", "42": "42 cadastros do CATMAT no teste (medido)",
    "104": "104 comparações contáveis (medido)", "6": "6 erros na primeira execução (medido)",
    "0": "0 erros contra as respostas certas depois do conserto (medido)", "14": "14 de 14 iguais achadas (medido)",
    "90": "0 de 90 diferentes juntadas (medido)", "10,5": "Verusen, US$ 10,5 mi verificados (publicado pela empresa)",
    "10": "Verusen (falado: 10 milhões e meio)", "8": "8% = 33 ÷ 396 (medido)",
    "2": "número do passo", "3": "número do passo", "4": "número do passo", "5": "número do passo", "250": "UNICA, 22/06/2026 (publicado)",
}
letra = sys.argv[1]
texto = open(f"/home/shiv/Projects/firstmate-portfolio/data/agroparts-vfinal/texto-{letra}.md", encoding="utf-8").read()
alvo = "\n".join(re.findall(r"(?m)^\*\*Na tela:\*\* (.*)$", texto) + re.findall(r"(?m)^- (?:Gabi|Myke|Alberto): (.*)$", texto))
achados = re.findall(r"\b(?:\d[\d.,]*(?:-2Z|ZZC3|%)?|nove|doze)\b", alvo)
sem = []
for n in sorted(set(x.rstrip(".,") for x in achados)):
    fonte = FONTES.get(n)
    print(f"{letra} {n}: {fonte or 'SEM FONTE'}")
    if not fonte:
        sem.append(n)
sys.exit(1 if sem else 0)
