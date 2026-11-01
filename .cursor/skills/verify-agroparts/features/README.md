# Mapa de verificação do AgroParts

Este mapa é a fonte mantida para verificar o que a pessoa usa no protótipo. Leia este índice antes de dirigir, depois use o arquivo da funcionalidade como receita.

## Condições de partida

- O protótipo está de pé com `scripts/agroparts.sh start`, e `scripts/agroparts.sh doctor` termina com `0 falha(s)`.
- `B="$(scripts/agroparts.sh url)"` é a base de todas as URLs abaixo.
- A sessão do `agent-browser` é sua e tem `set media light reduced-motion`.
- O `localStorage` do navegador começa vazio. Uma sessão nova do `agent-browser` já começa assim.
- Os dados são os snapshots públicos de `dados/publico/`. Não há cadastro de cliente nem conta.

## Convenções

- Comece cada receita em `$B/` ou na rota que ela indica.
- Depois de tocar num link do rodapé ou num link de volta, espere o título da tela nova antes do próximo passo. A troca de tela acontece no evento `hashchange`, um instante depois do clique.
- Use os nomes acessíveis e os textos literais do mapa, sem traduzir nem encurtar.
- As respostas esperadas dos sete exemplos da apresentação estão em `web/casos.ts`, no campo `resposta` de cada caso. Compare com esse arquivo, não com números copiados para cá.

## Prova e o que ficou de fora

- Capture a ação e a tela que ela produz, não só a tela final.
- Uma decisão registrada só está provada depois de recarregar a página e ver a decisão em `Decisões`.
- Registre a funcionalidade, a entrada usada e a tela (desktop ou 390 px) junto de cada evidência.
- Se um caminho não puder ser dirigido, registre o comando tentado e a condição que faltou. Não declare um caminho provado por outro.

## Contrato de cada arquivo

Cada arquivo começa com um título H1 e um parágrafo sobre o que a pessoa vê. Depois vêm quatro seções H2, nesta ordem: `Sub-features`, `How to get to it (user POV)`, `Driving it with agent-browser` (começa por `Preconditions:`) e `Gotchas`.

## Funcionalidades

- [Identificar uma peça](./identificar.md): código, descrição e foto da etiqueta, com a resposta agrupada por relação.
- [Exemplos da apresentação](./exemplos.md): os sete casos, rodar cada um no protótipo e voltar ao caso.
- [Cadastro inteiro](./cadastro-inteiro.md): os 396 cadastros do CATMAT, filtro, busca e a planilha de-para em CSV.
- [Decisões das pessoas](./decisoes.md): registrar a decisão ao lado do original, ver, baixar e apagar o registro.
- [Explicação passo a passo](./passo-a-passo.md): o menu `Como funciona` e os oito tours.

Ainda sem mapa: `Quanto acerta` (`#medicao`), `Fontes` (`#fontes`), a página `/contato` e a API para integração (`/api/openapi.json`, incluindo `POST /api/lote`).
