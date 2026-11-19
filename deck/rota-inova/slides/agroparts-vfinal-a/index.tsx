// Pitch final da AgroParts no Rota Inova Day (29/10/2026), variação A, enxuta.
// O texto de cada página e a fala vêm de data/agroparts-vfinal/texto-A.md; as páginas ficam em ../../vfinal/pecas.tsx.
import type { Page, SlideMeta } from '@open-slide/core';

import { Abertura, DiaDeSafra, QuantoCusta, CadaSetorCadastra, UmEmDoze, Solucao, CadaSetorGanha, CincoPassos, OTeste, LaFora, Pedido } from '../../vfinal/pecas';
import { notes as notas } from './notas';

export { design } from '../../vfinal/pecas';

export const notes = notas;

export const meta: SlideMeta = {
  title: 'AgroParts · Rota Inova Day · variação A, enxuta',
  createdAt: '2026-10-29T07:00:00.000Z',
};

export default [
  Abertura,
  DiaDeSafra,
  QuantoCusta,
  CadaSetorCadastra,
  UmEmDoze,
  Solucao,
  CadaSetorGanha,
  CincoPassos,
  OTeste,
  LaFora,
  Pedido,
] satisfies Page[];
