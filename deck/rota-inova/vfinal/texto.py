#!/usr/bin/env python3
"""Lê data/agroparts-vfinal/texto-<X>.md e, a partir dele só:
- preenche a linha **Tempo:** de cada slide e a tabela de tempo no fim (125 palavras por minuto);
- escreve fala-<X>.txt (as falas de cada pessoa, em ordem, para ler no celular);
- escreve <deck>/notas.ts (o export `notes` do deck, palavra por palavra);
- confere as palavras proibidas na tela e na fala.
Uso: texto.py <A|B|C> <pasta-do-deck>
Sai 1 se passar de 6:00 ou se achar palavra proibida.
"""
import re
import sys

PPM = 125
LIMITE = 360
PROIBIDAS = ["folga", "proteção", "ISO", "gabarito", "OCR", "SKU", "par", "pares", "OEM", "ERP", "100%", "GitHub",
             "não são dados reais"]

letra, deck = sys.argv[1], sys.argv[2]
D = "/home/shiv/Projects/firstmate-portfolio/data/agroparts-vfinal"
caminho = f"{D}/texto-{letra}.md"
texto = open(caminho, encoding="utf-8").read()
texto = texto.split("\n## Tempo\n")[0].rstrip() + "\n"

partes = re.split(r"(?m)^## ", texto)
cabeca, slides = partes[0], partes[1:]

t = 0.0
por_pessoa: dict[str, int] = {}
saida = [cabeca]
notas = []
falas_txt = []
problemas = []
for s in slides:
    titulo = s.split("\n", 1)[0]
    tela = re.search(r"\*\*Na tela:\*\* (.*)", s).group(1)
    falas = re.findall(r"(?m)^- (Gabi|Myke|Alberto): (.*)$", s)
    palavras = sum(len(f.split()) for _, f in falas)
    seg = palavras * 60 / PPM
    ini, fim = t, t + seg
    mm = lambda x: f"{int(x) // 60}:{int(x) % 60:02d}"
    s = re.sub(r"\*\*Tempo:\*\* .*", f"**Tempo:** {mm(ini)} a {mm(fim)} ({round(seg)} s, {palavras} palavras)", s)
    saida.append(s)
    for quem, f in falas:
        por_pessoa[quem] = por_pessoa.get(quem, 0) + len(f.split())
    corpo = "\n".join(f"{q}: {f}" for q, f in falas)
    notas.append(f"{mm(ini)} · {corpo}")
    falas_txt.append((titulo, mm(ini), falas))
    for w in PROIBIDAS:
        alvo = tela + " " + " ".join(f for _, f in falas)
        if re.search(rf"(?<![\wÀ-ú]){re.escape(w)}(?![\wÀ-ú])", alvo, flags=re.I if w not in ("ISO",) else 0):
            problemas.append(f"slide {titulo}: '{w}'")
    t = fim

total = sum(por_pessoa.values())
tabela = ["## Tempo", "", "| Quem | Palavras | Tempo |", "| --- | ---: | ---: |"]
for q in ("Gabi", "Myke", "Alberto"):
    n = por_pessoa.get(q, 0)
    tabela.append(f"| {q} | {n} | {int(n * 60 / PPM) // 60}:{int(n * 60 / PPM) % 60:02d} |")
tabela.append(f"| **Total** | **{total}** | **{int(t) // 60}:{int(t) % 60:02d}** |")
tabela += ["", f"O limite é 6:00; sobram {int(LIMITE - t) // 60}:{int(LIMITE - t) % 60:02d} para pausas, troca de slide e perguntas."]
final = "## ".join(saida).rstrip() + "\n\n" + "\n".join(tabela) + "\n"
open(caminho, "w", encoding="utf-8").write(final)

# Fala para o celular: cada bloco diz o slide e quem fala, na ordem.
linhas = [f"AgroParts · variação {letra} · {int(t) // 60}:{int(t) % 60:02d} de fala", ""]
for titulo, ini, falas in falas_txt:
    linhas.append(f"[{titulo} · {ini}]")
    for q, f in falas:
        linhas.append(f"{q.upper()}: {f}")
    linhas.append("")
open(f"{D}/fala-{letra}.txt", "w", encoding="utf-8").write("\n".join(linhas))

js = "// Gerado por data/agroparts-vfinal/bin/texto.py a partir de texto-" + letra + ".md. Não edite à mão.\n"
js += "export const notes: (string | undefined)[] = [\n"
for n in notas:
    js += "  " + "`" + n.replace("`", "'") + "`,\n"
js += "];\n"
open(f"{deck}/notas.ts", "w", encoding="utf-8").write(js)

print(f"{letra}: {len(slides)} slides, {total} palavras, {int(t) // 60}:{int(t) % 60:02d}; " + ", ".join(f"{q} {n}" for q, n in por_pessoa.items()))
for p in problemas:
    print("PROIBIDA:", p)
sys.exit(1 if problemas or t > LIMITE else 0)
