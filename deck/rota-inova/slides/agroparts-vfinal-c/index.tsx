// Pitch final da AgroParts no Rota Inova Day (29/10/2026), variação C, curta.
// O texto de cada página e a fala vêm de data/agroparts-vfinal/texto-C.md; as páginas ficam em ../../vfinal/pecas.tsx.
import type { Page, SlideMeta } from '@open-slide/core';

import { Abertura, DiaDeSafra, QuantoCusta, CadaSetorCadastra, RespostaEGanho, CincoPassos, OTeste, Pedido } from '../../vfinal/pecas';
import { notes as notas } from './notas';

export { design } from '../../vfinal/pecas';

export const notes = notas;

export const meta: SlideMeta = {
  title: 'AgroParts · Rota Inova Day · variação C, curta',
  createdAt: '2026-10-29T07:00:00.000Z',
};

export default [
  Abertura,
  DiaDeSafra,
  QuantoCusta,
  CadaSetorCadastra,
  RespostaEGanho,
  CincoPassos,
  OTeste,
  Pedido,
] satisfies Page[];
