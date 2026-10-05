// GET /api/fontes -> fontes, datas de consulta e licenças dos corpora públicos.
import { FONTE_BOLTS, FONTE_CATMAT, FONTE_COMPRAS } from "../../src/motor/corpus";
import { FONTES_REGRA } from "../../src/motor/designacao";
import { VERSAO_REGRAS } from "../../src/motor/especificacao";
import { json } from "../../src/api/http";

export const onRequestGet: PagesFunction = async () =>
  json({ versao_regras: VERSAO_REGRAS, corpora: [FONTE_CATMAT, FONTE_COMPRAS, FONTE_BOLTS], regras: Object.values(FONTES_REGRA) });
