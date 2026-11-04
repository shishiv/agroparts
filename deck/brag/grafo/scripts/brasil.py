# Gera assets/brasil.js: o contorno do Brasil e uma grade de pontos dentro dele, para o slide 11.
# Fonte: Natural Earth 1:110m, domínio público. Uso: python3 deck/brag/grafo/scripts/brasil.py
import json
import pathlib
import urllib.request

URL = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson"
dados = json.load(urllib.request.urlopen(URL))
anel = next(f for f in dados["features"] if f["properties"]["ADMIN"] == "Brazil")["geometry"]["coordinates"][0]

LARGURA = 700
lon0, lon1 = min(p[0] for p in anel), max(p[0] for p in anel)
lat0, lat1 = min(p[1] for p in anel), max(p[1] for p in anel)
escala = LARGURA / (lon1 - lon0)
xy = [((lon - lon0) * escala, (lat1 - lat) * escala) for lon, lat in anel]


def dentro(x, y):
    d = False
    for (x1, y1), (x2, y2) in zip(xy, xy[1:] + xy[:1]):
        if (y1 > y) != (y2 > y) and x < x1 + (y - y1) * (x2 - x1) / (y2 - y1):
            d = not d
    return d


passo = 26
pontos = [
    [round(x), round(y)]
    for j in range(0, int((lat1 - lat0) * escala) + 1, passo)
    for i in range(0, LARGURA + 1, passo)
    for x, y in [(i + (passo / 2 if (j // passo) % 2 else 0), j)]
    if dentro(x, y)
]
caminho = "M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in xy) + " Z"
saida = pathlib.Path(__file__).parent.parent / "assets" / "brasil.js"
saida.write_text(
    "// Gerado por scripts/brasil.py a partir do Natural Earth 1:110m (domínio público). Não edite à mão.\n"
    f"window.BRASIL = {json.dumps({'largura': LARGURA, 'altura': round((lat1 - lat0) * escala), 'contorno': caminho, 'pontos': pontos})};\n"
)
print(len(pontos), "pontos")
