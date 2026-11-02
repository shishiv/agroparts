# F5: foto da etiqueta com Box, OCR e conferência do Jev

## Próximo agente

Você retoma F5.
O spec e o [esboço](esboco.md) estão prontos, e nada foi implementado.
F5 vem depois do piloto, pela ordem do plano, mas a [fatia 1](slices/01-fotos-e-linha-de-base.md) não precisa de chave nem de usina.
Ela espera só as fotos com licença (ticket [`montar-fotos-de-etiqueta-com-licenca`](../../docs/wayfinder/partsgraph/tickets/montar-fotos-de-etiqueta-com-licenca.md)).
A fatia 2 espera uma chave da TypeSafe que funcione (ticket [`conferir-termos-e-chave-da-typesafe`](../../docs/wayfinder/partsgraph/tickets/conferir-termos-e-chave-da-typesafe.md)).

- [ ] [Fatia 1](slices/01-fotos-e-linha-de-base.md): fotos pré-registradas e a linha de base do Tesseract na foto inteira.
- [ ] [Fatia 2](slices/02-box-e-conferencia.md): Box, recorte e conferência do Jev, na mesma medida.

Antes de terminar a sua passada, atualize esta seção com o que mudou e com o próximo ponto de partida.

## Pergunta

Num conjunto pré-registrado de fotos de peça com designação conhecida, a cadeia em que o Box do Jev acha a região do código, o Tesseract lê o recorte e o Jev confere o valor lido acerta mais vezes que o Tesseract na foto inteira?

## Hipótese

Achar a região antes de ler e conferir o que foi lido sobe a taxa de leitura certa pela margem pré-registrada.
A imagem continua sem decidir nada: a pessoa confere o texto antes de resolver.

## Linha de base

O site lê a foto inteira com tesseract.js 7 e o modelo `eng`.
Em duas fotos, ele leu a etiqueta impressa sem erro e devolveu lixo com confiança de 31% no anel gravado ([fontes do protótipo](../../docs/pesquisa/fontes-do-prototipo.md)).
Com n = 2, isso não sustenta taxa.

## Fatia mínima

```
1 fotos pré-registradas e Tesseract na foto inteira -> 2 Box, recorte e conferência do Jev
```

## Critérios

A leitura conta como certa quando `especificar` sobre o texto lido resolve a chave esperada da foto.
A margem e o número de fotos entram no pré-registro da fatia 1.

- **VERIFIED.** A taxa de leitura certa sobe pela margem pré-registrada, com números absolutos, e nenhuma foto vira resolve no produto sem o texto conferido por uma pessoa.
- **NOT VERIFIED.** A taxa não sobe.
- **INCONCLUSIVE.** Faltam fotos, a chave não funciona, ou a TypeSafe muda o formato das imagens no meio da medição.

## Dependências

- **Dado de usina.** Nenhum. Foto de usina é dado de cliente e fica fora (escolha D4).
- **Chave da TypeSafe.** Só para a fatia 2, com o cabeçalho que a TypeSafe exige para imagem enquanto as imagens não forem de produção.
- **Licença.** Cada foto é da equipe ou tem licença Creative Commons com atribuição conferida, registrada ao lado da foto. As imagens têm de 280 a 1568 pixels de lado e ficam em pé nos pixels.

## ADRs e escopo

- [ADR 0008](../../docs/decisoes/adr-0008-camera-para-leitura-de-codigo.md): a câmera lê código e etiqueta, e a imagem não decide a classificação. F5 mede leitura.
- [ADR 0010](../../docs/decisoes/adr-0010-licencas-de-terceiros.md): cada foto entra só com a licença registrada.
- [ADR 0021](../../docs/decisoes/adr-0021-pilha-do-prototipo-publico.md) e [ADR 0022](../../docs/decisoes/adr-0022-diagnostico-no-navegador.md): o OCR do site roda no navegador, e a API só lê corpus público. Levar o Box ao site mandaria a foto do usuário à TypeSafe por uma rota que guarda chave. Isso pediria um ADR que substitua o 0021 nesse ponto, e a pergunta está no ticket [`definir-jev-com-dado-de-cliente`](../../docs/wayfinder/partsgraph/tickets/definir-jev-com-dado-de-cliente.md).

## Fora

- O Box no site.
- Foto de usina ou de mecânico.
- Classificar a peça pela aparência.
- Trocar o Tesseract por outro OCR.

## Contratos que ficam

- A foto não resolve. O texto lido passa por `especificar`, como qualquer descrição.
- `julgarTexto`, em `scripts/leitura.ts`, é o único julgamento de texto lido, e F6 o usa para a fala.
- O código do Jev fica em `scripts/`, e nada dele entra em `web/`, `functions/` ou `dist/`.
