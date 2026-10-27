---
name: AgroParts
description: Protótipo de identificação de peças, desenhado como sinalização de segurança industrial
colors:
  chapa: "#f3f4f2"
  papel: "#ffffff"
  tinta: "#15191a"
  tinta-2: "#3b4447"
  suave: "#4f585b"
  linha: "#c7cccd"
  verde: "#237f52"
  verde-escuro: "#1a6141"
  verde-claro: "#e3efe8"
  amarelo: "#f9a800"
  amarelo-escuro: "#7a5200"
  amarelo-claro: "#fdf0cc"
  vermelho: "#a52019"
  vermelho-escuro: "#8a1a14"
  vermelho-claro: "#f6e1df"
  azul: "#154889"
  azul-escuro: "#0f3566"
  azul-claro: "#e2eaf4"
  desligado: "#8f989b"
  exemplo: "#6a7477"
typography:
  display:
    fontFamily: "Barlow Semi Condensed, Barlow, Liberation Sans Narrow, Arial, sans-serif"
    fontSize: "clamp(2.4rem, 5vw, 4.4rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.015em"
  placa:
    fontFamily: "Barlow Semi Condensed, Barlow, Liberation Sans Narrow, Arial, sans-serif"
    fontSize: "clamp(2.2rem, 5vw, 4.6rem)"
    fontWeight: 700
    lineHeight: 1
  titulo:
    fontFamily: "Barlow Semi Condensed, Barlow, Liberation Sans Narrow, Arial, sans-serif"
    fontSize: "1.55rem"
    fontWeight: 700
    lineHeight: 1.08
  body:
    fontFamily: "Barlow, Liberation Sans, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  numero:
    fontFamily: "Barlow Semi Condensed, Barlow, Liberation Sans Narrow, Arial, sans-serif"
    fontSize: "clamp(2.4rem, 4.4vw, 3.6rem)"
    fontWeight: 700
    lineHeight: 1
  peca:
    fontFamily: "Barlow Semi Condensed, Barlow, Liberation Sans Narrow, Arial, sans-serif"
    fontSize: "clamp(1.45rem, 2.6vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.15
  grupo:
    fontFamily: "Barlow Semi Condensed, Barlow, Liberation Sans Narrow, Arial, sans-serif"
    fontSize: "clamp(1.4rem, 2.3vw, 1.95rem)"
    fontWeight: 700
    lineHeight: 1.08
  subtitulo:
    fontFamily: "Barlow Semi Condensed, Barlow, Liberation Sans Narrow, Arial, sans-serif"
    fontSize: "1.3rem"
    fontWeight: 600
    lineHeight: 1.08
  lead:
    fontFamily: "Barlow, Liberation Sans, Arial, sans-serif"
    fontSize: "clamp(1.1rem, 1.5vw, 1.3rem)"
    fontWeight: 400
    lineHeight: 1.5
  campo:
    fontFamily: "Barlow, Liberation Sans, Arial, sans-serif"
    fontSize: "clamp(1.25rem, 1.8vw, 1.55rem)"
    fontWeight: 400
    lineHeight: 1.35
  ui:
    fontFamily: "Barlow, Liberation Sans, Arial, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 600
    lineHeight: 1.4
  rotulo:
    fontFamily: "Barlow, Liberation Sans, Arial, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 600
    lineHeight: 1.4
  meta:
    fontFamily: "Barlow, Liberation Sans, Arial, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 600
    lineHeight: 1.3
rounded:
  canto: "4px"
  pictograma: "2px"
spacing:
  apertado: "0.5rem"
  grupo: "1rem"
  bloco: "1.5rem"
  respiro: "clamp(1.75rem, 4.5vh, 3rem)"
  coluna: "62rem"
components:
  botao-primario:
    backgroundColor: "{colors.azul}"
    textColor: "{colors.papel}"
    typography: "{typography.titulo}"
    rounded: "{rounded.canto}"
    padding: "0.6rem 1.75rem"
    height: "4rem"
  botao-primario-hover:
    backgroundColor: "{colors.azul-escuro}"
  link:
    textColor: "{colors.azul}"
    typography: "{typography.ui}"
    height: "44px"
  botao:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.azul}"
    rounded: "{rounded.canto}"
    padding: "0.5rem 1rem"
    height: "48px"
  placa-resolve:
    backgroundColor: "{colors.verde}"
    textColor: "{colors.papel}"
    typography: "{typography.placa}"
  placa-revisa:
    backgroundColor: "{colors.amarelo}"
    textColor: "{colors.tinta}"
    typography: "{typography.placa}"
  placa-recusa:
    backgroundColor: "{colors.vermelho}"
    textColor: "{colors.papel}"
    typography: "{typography.placa}"
  campo:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    typography: "{typography.campo}"
    rounded: "{rounded.canto}"
    padding: "0.8rem 1rem"
    height: "4rem"
---

# Design System: AgroParts

## Overview

O site fala como a sinalização de segurança de um almoxarifado ou de uma planta industrial. A resposta a "qual é esta peça?" é uma placa: verde quando é a mesma peça, amarelo quando precisa de uma pessoa, vermelho quando parece mas não é. Quem trabalha com manutenção conhece essas cores pela NR-26 e pela ISO 7010 e lê a resposta antes de ler o texto.

A superfície é clara, séria e plana: chapa de alumínio, tinta quase preta e muito espaço. Cada tela mostra uma coisa: a pergunta e o campo, a resposta ou um caso da apresentação. O que é processo (como o sistema leu, as fontes, o cadastro inteiro, a medição) fica a um toque, nunca no caminho de quem só quer a resposta. Os exemplos da apresentação têm a profundidade do PDF do Rota Inova: a situação, a foto, a entrada, a resposta e o porquê, passo a passo (decisão do capitão, 14/10/2026). Não há gradiente, vidro, sombra decorativa nem número de confiança. A cor de segurança só aparece quando diz uma decisão. O azul só aparece no que se pode apertar.

**The Uma Coisa Por Tela Rule.** Uma ação primária por tela. O resto é link de texto ou fica atrás de "Ver detalhes". Espaço separa; moldura só onde a pessoa digita ou escolhe.

**The Placa Rule.** Toda decisão do sistema aparece como placa ou selo de cor cheia com pictograma. Nunca como filete, borda lateral ou número.

**The Nada Técnico Rule.** A superfície usa a língua de quem cuida de almoxarifado, manutenção e compras. Código de relação, nome de norma, pontuação interna e registro do sistema ficam atrás de "Ver detalhes".

## Colors

Estratégia comprometida por região: a placa de resultado pinta uma faixa inteira com a cor da decisão; o resto da tela fica em chapa, papel e tinta.

### Primary

- **Azul de ação** (azul): botões primários, links, foco e o que se pode apertar. Vem do sinal azul de ação obrigatória. Nunca indica estado.
- **Azul escuro** (azul-escuro): hover e pressionado do botão primário.

### Secondary

As três cores de segurança carregam a decisão e nada mais.

- **Verde de condição segura** (verde, RAL 6032): "Peça identificada", "É a mesma peça", selo "Confirmado". Texto branco por cima.
- **Amarelo de atenção** (amarelo, RAL 1003): "Precisa de uma pessoa". Texto e pictograma em tinta, nunca branco.
- **Vermelho de proibição** (vermelho, RAL 3001): "Parece, mas não é", "O cadastro se contradiz", selo "Recusado". Texto branco por cima.
- Os tons claros (verde-claro, amarelo-claro, vermelho-claro) só aparecem como fundo de uma escolha marcada, junto do pictograma na cor cheia.

### Neutral

- **Chapa** (chapa): fundo da página, cinza frio de alumínio. Não é creme.
- **Papel** (papel): formulários, tabelas e corpo da placa.
- **Tinta** (tinta): texto, borda de 2px do campo e da descrição padronizada, quadrados de número e pictogramas.
- **Tinta 2 e suave** (tinta-2, suave): texto de apoio e rótulos. Os dois passam de 4.5:1 sobre chapa e papel.
- **Linha** (linha): divisórias de 1px entre grupos, linhas de tabela, itens e o topo e o rodapé.
- **Desligado e exemplo** (desligado, exemplo): botão em espera e texto de exemplo dentro do campo.

**The Uma Cor, Um Sentido Rule.** Verde, amarelo e vermelho só dizem decisão. Azul só diz ação. Uma cor nunca muda de sentido entre telas.

## Typography

Barlow e Barlow Semi Condensed, letras de placa de estrada (SIL Open Font License 1.1), servidas pelo próprio site. Números sempre tabulares.

### Hierarchy

- **Display** (display): o título de cada tela, como "Qual é esta peça?".
- **Placa** (placa): a frase da decisão dentro da faixa colorida. Precisa ser legível do fundo de uma sala com projetor.
- **Título** (titulo): seções e grupos de resultado ("É a mesma peça", "Parece, mas não é"), em Semi Condensed 600 a 700.
- **Corpo** (body): Barlow 400 em 17px, 18px a partir de 1440px e 19px a partir de 1800px, para a projeção a 1920x1080. No celular, 16px.
- **Número** (numero): os totais grandes do cadastro inteiro e dos casos. A contagem de cada grupo da resposta vem em palavras ("7 cadastros"), em Barlow 600 na cor suave, logo depois do título do grupo.
- **Peça e grupo** (peca, grupo, subtitulo): a peça em uma linha e o título de cada grupo de resultado.
- **Lead e interface** (lead, ui): introdução de cada tela, frases da placa e códigos de cada grupo; botões, listas e células. O campo de entrada usa o tamanho campo, de 1,25rem a 1,55rem.
- **Rótulo e meta** (rotulo, meta): Barlow 600 em caixa normal, cor suave. Não há sobretítulo em caixa alta espaçada.
- A raiz muda de tamanho: 17px no desktop, 18px a partir de 1440px, 19px a partir de 1800px e 16px no celular. Todo o resto escala em rem.

**The Frase Inteira Rule.** Toda resposta é uma frase completa em pt-BR, com sujeito e verbo. Instrução tem até 20 palavras.

## Layout

Coluna única de 62rem, com margem lateral de 1rem a 3rem. O topo e o rodapé alinham com a coluna.

- **Identificar:** o título grande, uma frase de instrução e o campo com o botão "Identificar" ao lado, em até 52rem. Embaixo do campo, o aviso de recorte em letra pequena e o link grande "Exemplos da apresentação", com as duas fotos de "parecido não é igual". Nada mais.
- **A resposta:** depois de identificar, a página rola até a resposta, e a resposta ocupa no mínimo a altura da tela. A ordem é fixa: a placa da decisão; a peça em uma linha, com o desenho dos dois lados dela; os motivos, quando a decisão é amarela ou vermelha; um grupo por pergunta ("É a mesma peça", "Parece, mas não é"…), com o título, a contagem e uma frase; dentro de cada grupo, cada cadastro à vista; e duas linhas discretas, "Ver detalhes da resposta" e "Registrar a decisão de uma pessoa".
- **Cada cadastro** de um grupo mostra, sem abrir nada, o desenho dos dois lados, o código e a ficha: o que muda e o que bate com a peça procurada. "Ver o texto do cadastro e a fonte" abre o texto original, a fonte e o registro. **Ver detalhes da resposta** abre o original ao lado da descrição padronizada, a nota sobre aplicação em máquina, a leitura, as fontes e o registro.
- **Exemplos da apresentação** (`#casos`): a lista dos sete casos e uma tela por caso (`#casos/<caso>`). Um toque na tela inicial abre a lista; outro abre o caso. Quando a pessoa roda o caso, a resposta começa com "Voltar ao caso".
- **Telas de conferência:** Cadastro inteiro, Quanto acerta, Decisões e Fontes ficam fora do caminho principal, numa linha do rodapé ("Por dentro do protótipo"). Cada uma abre com o link "Identificar uma peça" para voltar.

- Até 860px: a descrição padronizada vai para baixo do original, os itens e as escolhas viram uma coluna, a planilha de-para empilha cada linha e, num caso, a foto vai para baixo do texto e a resposta para cima do porquê.
- Até 560px: o botão Identificar e o botão "Rodar no protótipo" vão para baixo do campo, na largura toda; a faixa da placa empilha o pictograma acima da frase; o desenho da peça vai para cima da peça; as duas fotos de um caso ficam uma embaixo da outra.

Tabelas largas rolam dentro da própria área, com largura mínima de 44rem; a página nunca rola na horizontal.

## Elevation & Depth

A interface é plana. A profundidade vem da cor cheia da placa e do espaço, não de sombra nem de moldura. A única sombra é transitória: quando uma placa nova chega, ela sobe 10px com uma sombra suave que some em 0,45s.

## Shapes

- **Canto de placa** (canto, 4px): placas, botões e campos.
- **Canto de pictograma** (pictograma, 2px): quadrados de pictograma, selos e números dos casos e dos passos.
- A faixa da placa tem um filete interno de 2px a 6px da borda, como a margem branca de uma placa de sinalização.
- Marcadores de lista são quadrados de tinta; condições são traços curtos de tinta. Nenhum marcador parece caixa de marcar.

## Components

### Buttons

- **Primário:** azul cheio, texto branco em Semi Condensed 700, seta à direita; na tela de identificar, da altura do campo. Um por tela: "Identificar", "Ler o cadastro inteiro", "Registrar decisão", "Rodar no protótipo" (em cada caso). Desabilitado fica cinza durante a espera.
- **Link de ação:** texto azul sublinhado, sem caixa, com 44px de altura de toque. É a ação secundária padrão: "Baixar planilha de-para (CSV)", "Baixar registro (JSON)", exemplos de foto, "Identificar uma peça", "Voltar ao caso", caso anterior e próximo.
- **Link grande:** "Exemplos da apresentação", na tela inicial, em Semi Condensed 700 no tamanho de título, com seta e duas fotos pequenas. Os títulos da lista de casos seguem o mesmo desenho.
- **Abrir e fechar:** "Ver detalhes da resposta", "Registrar a decisão de uma pessoa" e "Ver o texto do cadastro e a fonte" são textos azuis com uma seta que gira.
- **Secundário com borda:** papel com borda azul de 2px, só para "Tirar ou escolher foto" e "Mostrar mais".
- **Perigo:** link vermelho, só para "Apagar registro deste navegador", sempre com confirmação.
- **Código clicável:** texto azul sublinhado, leva o código do lote para a tela de identificar.

### Chips

- **Selo de decisão:** retângulo de cor cheia com pictograma e nome curto: "Confirmado", "Precisa de uma pessoa", "Recusado". Quando a pessoa discorda do sistema, o selo do sistema aparece riscado, nunca apagado.
- **Nota do cadastro:** texto pequeno em cor suave, sem caixa, para "Cadastro duplicado" ou a semelhança de texto em palavras ("Textos quase iguais"). Não parece botão.

### Containers

- **Placa de resultado:** só a faixa tem cor e moldura. Faixa da decisão com pictograma de até 136px num quadrado branco (no amarelo, quadrado vazado em tinta). O resto da resposta fica direto na chapa, separado por espaço e por divisórias de 1px.
- **Grupo:** divisória de 1px no topo, pictograma de 52px, título com a contagem em palavras e uma frase. Os cadastros vêm logo abaixo, à vista, em linhas com divisória de 1px, não cartões.
- **Ficha do cadastro:** uma linha por dado que decide se é a mesma peça (tamanho, proteção, folga e material). O que muda vem com o pictograma de proibição em vermelho, o valor do outro cadastro e o valor da peça procurada. O que bate vem numa linha só, com o visto em verde. Notas sobre o texto vêm com o pictograma de informação; um problema do cadastro, com o pictograma de pessoa em amarelo escuro. Os pictogramas aparecem sem quadrado, para não parecerem caixa de marcar.
- **Desenho da peça:** os dois lados do rolamento, lado a lado, desenhados pela equipe: esferas à mostra (aberto), disco cinza-claro (blindagem de metal) ou disco preto (vedação de borracha). "Em um lado" e "nos dois lados" aparecem diferentes. Embaixo do desenho de cada cadastro, "Igual por fora" ou "Muda por fora": folga e material não aparecem por fora, e é isso que "parece, mas não é" quer dizer. Outra marca, cujo final de código ninguém conferiu, aparece em contorno tracejado com "?" e "Proteção não conferida". A resposta explica o desenho uma vez, embaixo da peça. O desenho usa só chapa, papel, linha e tinta; a cor de segurança fica com a decisão.
- Nada de cartão, nem cartão dentro de cartão. Nada de fileira de cartões.

### Inputs / Fields

Campo com borda de tinta de 2px, letra de 1,25rem a 1,55rem e a altura do botão primário. No modo Código, o campo tem uma linha e Enter identifica. O modo de entrada (Código, Descrição, Foto da etiqueta) é uma fileira de abas em texto: a ativa fica em tinta com um traço de 3px embaixo, as outras em cor suave. O nome do campo fica para leitor de tela; a aba ativa e o exemplo dentro do campo dizem o que digitar.

### Navigation

Topo claro, na chapa, com divisória de 1px: o pictograma de rolamento, o nome AgroParts, a linha "Protótipo · Rota Inova UEMG 2026" (some até 860px) e, à direita, "Como funciona". Não há abas. As telas de conferência ficam no rodapé, e a tela atual aparece em tinta, sem sublinhado.

### Placa de resultado (signature component)

Ao chegar, a faixa sobe 10px e o pictograma bate como um carimbo, de 1,18 para 1, em curva exponencial de saída. Com movimento reduzido, nada se move. Fora do passo a passo, é o único momento animado do site.

### Exemplos da apresentação

A lista mostra os sete casos na ordem do PDF: as cinco provas do pitch, o texto de fornecedor e a foto da etiqueta. Cada linha tem uma foto quadrada (no texto de fornecedor, o desenho da peça), o quadrado de número em tinta, o título do caso e uma frase. O título do caso é o nome dele em todo o site: lista, menu "Como funciona" e explicação passo a passo. Embaixo da lista ficam as três respostas, em placas pequenas, e os quatro passos do código à resposta.

Cada caso é uma tela, com os números dos casos no topo (o atual em tinta) e cinco passos numerados:

1. A situação no campo, com a foto do cenário quando o PDF tem uma.
2. A imagem que mostra o que é "a mesma peça" ou "parece, mas não é": as fotos do PDF, os textos reais dos cadastros com os trechos que importam em negrito ou os números do cadastro inteiro.
3. O que a pessoa informa, como texto (não é campo), com o botão "Rodar no protótipo". O botão roda o caso pelos mesmos caminhos da pessoa: preenche e identifica, lê o cadastro inteiro ou lê a etiqueta e identifica.
4. O que a AgroParts responde: uma frase e a placa pequena com os grupos.
5. Por quê, em frases curtas.

No desktop, os passos 4 e 5 ficam lado a lado. No fim, o caso anterior e o próximo. O teste `tests/casos.test.ts` confere no motor cada resposta escrita num caso.

As fotos vêm do PDF, com o crédito embaixo de cada uma, e aparecem só nos exemplos e no link da tela inicial. A paleta do Canva fica no PDF; os exemplos usam os tokens deste arquivo.

### Passo a passo (Como funciona)

O botão "Como funciona" fica no topo, em texto azul com o pictograma de informação. Ele abre o link para os exemplos da apresentação e a lista de explicações: a visão geral e uma por caso. Nenhuma explicação abre sozinha: quem chega cai direto no campo. Quando um passo aponta para algo atrás de "Ver detalhes", o passo abre esse detalhe antes de destacar.

- O balão é papel com borda de tinta de 2px e canto de 4px, sem sombra. Título em Semi Condensed 700, texto em Barlow 400 na cor tinta 2, uma ou duas frases curtas.
- "Avançar" é o botão primário, "Voltar" é o secundário e "Pular explicação" é um link discreto em cor suave.
- O fundo escurece em tinta e deixa o elemento explicado recortado. O balão nunca cobre esse elemento, nem no celular.
- Teclado: setas avançam e voltam, Esc sai, e o foco entra no balão. Com movimento reduzido, nada desliza nem esmaece.

## Do's and Don'ts

### Do:

- **Do** escrever a decisão como frase: "É a mesma peça", "Equivale na medida, com condições", "Parece, mas não é", "Precisa de uma pessoa".
- **Do** mostrar o texto original sem alteração ao lado da descrição padronizada.
- **Do** dar a semelhança e a qualidade da leitura em palavras ("Textos quase iguais", "Leitura ruim").
- **Do** mostrar em cada cadastro, sem abrir nada, se é a mesma peça e o que muda.
- **Do** acompanhar toda porcentagem da medição com a conta que a gerou ("7 de 7").

### Don't:

- **Don't** mostrar SAME_AS, CROSS_REFERENCE, INTERCHANGEABLE_FOR, SIMILAR_TO, COMPATIBLE_WITH, nome de ADR ou pontuação interna fora de "Ver detalhes".
- **Don't** usar verde, amarelo ou vermelho como decoração, nem azul para indicar estado.
- **Don't** usar borda lateral colorida, gradiente, vidro, sombra decorativa ou anel de progresso.
- **Don't** pôr tela de processo, fileira de cartões ou segunda ação primária no caminho entre a pergunta e a resposta.
- **Don't** inventar cliente, economia ou número que a medição não traz.
