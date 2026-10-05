// GET /api/medicao -> números do gabarito v1, estratificados e com denominadores.
import { medir } from "../../src/motor/lote";
import { json } from "../../src/api/http";

export const onRequestGet: PagesFunction = async () => json(medir());
