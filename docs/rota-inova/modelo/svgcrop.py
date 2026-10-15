"""Recorta ilustrações vetoriais de uma página SVG gerada por pdftocairo.

Usado por extrair-ilustracoes.py. Só usa a biblioteca padrão do Python.
"""
import re
import xml.etree.ElementTree as ET

SVG = "http://www.w3.org/2000/svg"
XLINK = "http://www.w3.org/1999/xlink"
ET.register_namespace("", SVG)
ET.register_namespace("xlink", XLINK)
NUM = re.compile(r"-?\d*\.?\d+(?:e-?\d+)?")


def tag(el):
    return el.tag.split("}")[-1]


def matrix(el):
    t = el.get("transform")
    if not t:
        return (1, 0, 0, 1, 0, 0)
    m = re.match(r"matrix\(([^)]*)\)", t)
    if not m:
        raise ValueError(f"transform não suportado: {t}")
    return tuple(float(v) for v in NUM.findall(m.group(1)))


def mul(m, n):  # m depois de n
    a, b, c, d, e, f = m
    a2, b2, c2, d2, e2, f2 = n
    return (a * a2 + c * b2, b * a2 + d * b2, a * c2 + c * d2, b * c2 + d * d2,
            a * e2 + c * f2 + e, b * e2 + d * f2 + f)


def apply(m, pts):
    a, b, c, d, e, f = m
    return [(a * x + c * y + e, b * x + d * y + f) for x, y in pts]


def union(boxes):
    boxes = [b for b in boxes if b]
    if not boxes:
        return None
    return (min(b[0] for b in boxes), min(b[1] for b in boxes),
            max(b[2] for b in boxes), max(b[3] for b in boxes))


def box_of_points(pts):
    if not pts:
        return None
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    return (min(xs), min(ys), max(xs), max(ys))


class Page:
    def __init__(self, path):
        self.tree = ET.parse(path)
        self.root = self.tree.getroot()
        self.ids = {el.get("id"): el for el in self.root.iter() if el.get("id")}

    def bbox(self, el, m=(1, 0, 0, 1, 0, 0)):
        """Caixa do elemento em coordenadas da página (superconjunto)."""
        m = mul(m, matrix(el))
        t = tag(el)
        if t == "path":
            nums = [float(v) for v in NUM.findall(el.get("d", ""))]
            pts = list(zip(nums[0::2], nums[1::2]))
            box = box_of_points(apply(m, pts))
            sw = float(el.get("stroke-width", 0)) if el.get("stroke") else 0
            if box and sw:
                s = sw * max(abs(m[0]) + abs(m[2]), abs(m[1]) + abs(m[3])) / 2
                box = (box[0] - s, box[1] - s, box[2] + s, box[3] + s)
            return box
        if t == "rect":
            x, y = float(el.get("x", 0)), float(el.get("y", 0))
            w, h = float(el.get("width")), float(el.get("height"))
            return box_of_points(apply(m, [(x, y), (x + w, y), (x, y + h), (x + w, y + h)]))
        if t == "use":
            ref = self.ids.get(el.get(f"{{{XLINK}}}href", "")[1:])
            x, y = float(el.get("x", 0)), float(el.get("y", 0))
            return self.bbox(ref, mul(m, (1, 0, 0, 1, x, y))) if ref is not None else None
        if t == "image":
            x, y = float(el.get("x", 0)), float(el.get("y", 0))
            w, h = float(el.get("width")), float(el.get("height"))
            return box_of_points(apply(m, [(x, y), (x + w, y), (x, y + h), (x + w, y + h)]))
        if t in ("g", "svg", "clipPath", "mask", "symbol"):
            box = union(self.bbox(k, m) for k in el)
            clip = el.get("clip-path")
            if box and clip:
                cl = self.ids.get(clip[5:-1])
                cb = self.bbox(cl, m) if cl is not None else None
                if cb:
                    box = (max(box[0], cb[0]), max(box[1], cb[1]), min(box[2], cb[2]), min(box[3], cb[3]))
                    if box[0] >= box[2] or box[1] >= box[3]:
                        return None
            return box
        return None

    def is_text(self, el, seen=None):
        """Texto do Canva: elemento que, resolvidas as referências, só desenha glifos."""
        seen = seen if seen is not None else set()
        drew_glyph = False
        for d in el.iter():
            if tag(d) in ("path", "rect", "image"):
                return False
            if tag(d) == "use":
                href = d.get(f"{{{XLINK}}}href", "")[1:]
                if href.startswith("glyph"):
                    drew_glyph = True
                elif href in self.ids and href not in seen:
                    seen.add(href)
                    if not self.is_text(self.ids[href], seen):
                        return False
                    drew_glyph = True
        return drew_glyph

    def is_background(self, el):
        return tag(el) == "rect" and float(el.get("width", 0)) >= 1440 and float(el.get("height", 0)) >= 800

    def artwork(self):
        """Elementos de topo que desenham ilustração, com a caixa de cada um."""
        out = []
        for el in self.root:
            if tag(el) == "defs" or self.is_background(el) or self.is_text(el):
                continue
            box = self.bbox(el)
            if box:
                out.append((el, box))
        return out

    def crop(self, area, out_path, keep=None):
        """Grava um SVG com os elementos que tocam `area` (x0, y0, x1, y1 em pt)."""
        x0, y0, x1, y1 = area
        kept = [el for el, b in self.artwork()
                if b[2] > x0 and b[0] < x1 and b[3] > y0 and b[1] < y1 and (keep is None or keep(b))]
        needed, stack = set(), list(kept)
        while stack:
            el = stack.pop()
            for d in el.iter():
                for k, v in d.attrib.items():
                    for ref in re.findall(r"url\(#([^)]+)\)", v) + ([v[1:]] if k.endswith("href") and v.startswith("#") else []):
                        if ref not in needed and ref in self.ids:
                            needed.add(ref)
                            stack.append(self.ids[ref])
        svg = ET.Element(f"{{{SVG}}}svg", {
            "viewBox": f"{x0:.2f} {y0:.2f} {x1 - x0:.2f} {y1 - y0:.2f}",
            "width": f"{x1 - x0:.2f}pt", "height": f"{y1 - y0:.2f}pt"})
        defs = ET.SubElement(svg, f"{{{SVG}}}defs")
        for d in self.root.iter():
            if d.get("id") in needed and tag(d) != "defs":
                defs.append(d)
        for el in kept:
            svg.append(el)
        ET.ElementTree(svg).write(out_path, xml_declaration=True, encoding="utf-8")
        return len(kept)
