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
  nav-texto: "#dfe4e5"
  nav-sub: "#c3cacc"
  nav-hover: "#5d686b"
  nav-linha: "#343c3e"
  desligado: "#8f989b"
  exemplo: "#6a7477"
typography:
  display:
    fontFamily: "Barlow Semi Condensed, Barlow, Liberation Sans Narrow, Arial, sans-serif"
    fontSize: "clamp(2.2rem, 4.6vw, 3.6rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  placa:
    fontFamily: "Barlow Semi Condensed, Barlow, Liberation Sans Narrow, Arial, sans-serif"
    fontSize: "clamp(2rem, 4.4vw, 3.5rem)"
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
    fontSize: "clamp(2.2rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1
  peca:
    fontFamily: "Barlow Semi Condensed, Barlow, Liberation Sans Narrow, Arial, sans-serif"
    fontSize: "clamp(1.35rem, 2.4vw, 1.85rem)"
    fontWeight: 600
    lineHeight: 1.15
  grupo:
    fontFamily: "Barlow Semi Condensed, Barlow, Liberation Sans Narrow, Arial, sans-serif"
    fontSize: "clamp(1.3rem, 2.2vw, 1.6rem)"
    fontWeight: 700
    lineHeight: 1.08
  subtitulo:
    fontFamily: "Barlow Semi Condensed, Barlow, Liberation Sans Narrow, Arial, sans-serif"
    fontSize: "1.3rem"
    fontWeight: 600
    lineHeight: 1.08
  lead:
    fontFamily: "Barlow, Liberation Sans, Arial, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 400
    lineHeight: 1.5
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
  secao: "2rem"
components:
  botao-primario:
    backgroundColor: "{colors.azul}"
    textColor: "{colors.papel}"
    typography: "{typography.titulo}"
    rounded: "{rounded.canto}"
    padding: "0.6rem 1.4rem"
    height: "52px"
  botao-primario-hover:
    backgroundColor: "{colors.azul-escuro}"
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
    rounded: "{rounded.canto}"
    padding: "0.7rem 0.85rem"
---

# Design System: AgroParts

## Overview

O site fala como a sinalização de segurança de um almoxarifado ou de uma planta industrial. A resposta a "qual é esta peça?" é uma placa: verde quando é a mesma peça, amarelo quando precisa de uma pessoa, vermelho quando parece mas não é. Quem trabalha com manutenção conhece essas cores pela NR-26 e pela ISO 7010 e lê a resposta antes de ler o texto.

A superfície é clara, séria e plana: chapa de alumínio, tinta quase preta, bordas de 2px. Não há gradiente, vidro, sombra decorativa nem número de confiança. A cor de segurança só aparece quando diz uma decisão. O azul só aparece no que se pode apertar.

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
- Os tons claros (verde-claro, amarelo-claro, vermelho-claro) só aparecem como fundo de uma escolha marcada ou de um atalho do resumo, junto do pictograma na cor cheia.

### Neutral

- **Chapa** (chapa): fundo da página, cinza frio de alumínio. Não é creme.
- **Papel** (papel): formulários, tabelas e corpo da placa.
- **Tinta** (tinta): texto, bordas de 2px, faixa da marca e quadrados de número.
- **Tinta 2 e suave** (tinta-2, suave): texto de apoio e rótulos. Os dois passam de 4.5:1 sobre chapa e papel.
- **Linha** (linha): divisórias de 1px entre linhas de tabela e itens.
- **Faixa da marca** (nav-texto, nav-sub, nav-hover, nav-linha): só dentro da faixa de tinta do topo.
- **Desligado e exemplo** (desligado, exemplo): botão em espera e texto de exemplo dentro do campo.

**The Uma Cor, Um Sentido Rule.** Verde, amarelo e vermelho só dizem decisão. Azul só diz ação. Uma cor nunca muda de sentido entre telas.

## Typography

Barlow e Barlow Semi Condensed, letras de placa de estrada (SIL Open Font License 1.1), servidas pelo próprio site. Números sempre tabulares.

### Hierarchy

- **Display** (display): o título de cada aba, como "Qual é esta peça?".
- **Placa** (placa): a frase da decisão dentro da faixa colorida. Precisa ser legível do fundo de uma sala com projetor.
- **Título** (titulo): seções e grupos de resultado ("É a mesma peça", "Parece, mas não é"), em Semi Condensed 600 a 700.
- **Corpo** (body): Barlow 400 em 17px, 18px a partir de 1440px e 19px a partir de 1800px, para a projeção a 1920x1080. No celular, 16px.
- **Número** (numero): os totais grandes do cadastro inteiro.
- **Peça e grupo** (peca, grupo, subtitulo): a peça em uma linha e o título de cada grupo de resultado.
- **Lead e interface** (lead, ui): introdução de cada aba, campos e frases da placa; botões, listas e células.
- **Rótulo e meta** (rotulo, meta): Barlow 600 em caixa normal, cor suave. Não há sobretítulo em caixa alta espaçada.
- A raiz muda de tamanho: 17px no desktop, 18px a partir de 1440px, 19px a partir de 1800px e 16px no celular. Todo o resto escala em rem.

**The Frase Inteira Rule.** Toda resposta é uma frase completa em pt-BR, com sujeito e verbo. Instrução tem até 20 palavras.

## Layout

Coluna única de até 1360px, com margem lateral de 1rem a 3rem. A primeira tela traz o título grande à esquerda, o aviso de recorte à direita, a régua do roteiro com seis placas numeradas e o formulário de entrada. O resultado entra abaixo, na largura toda.

A ordem da placa de resultado é fixa: faixa da decisão; a peça em uma linha; o resumo dos outros itens encontrados; os motivos; o original ao lado da descrição padronizada; os grupos; a nota sobre aplicação em máquina; "Ver detalhes da leitura"; a decisão de uma pessoa.

- Até 1100px: o roteiro passa a três colunas.
- Até 860px: tudo vira uma coluna, a faixa da marca deixa de grudar no topo e a navegação rola na horizontal. A planilha de-para empilha cada linha.
- Até 560px: o roteiro tem duas colunas, a faixa da placa empilha o pictograma acima da frase e os botões primários ocupam a largura toda.

Tabelas largas rolam dentro de uma moldura de 2px com largura mínima de 44rem; o texto nunca espreme coluna.

## Elevation & Depth

A interface é plana. A profundidade vem de borda de tinta de 2px e da cor cheia da placa, não de sombra. A única sombra é transitória: quando uma placa nova chega, ela sobe 10px com uma sombra suave que some em 0,45s.

## Shapes

- **Canto de placa** (canto, 4px): placas, botões, campos e molduras de tabela.
- **Canto de pictograma** (pictograma, 2px): quadrados de pictograma, selos e números do roteiro.
- A faixa da placa tem um filete interno de 2px a 6px da borda, como a margem branca de uma placa de sinalização.
- Marcadores de lista são quadrados de tinta; condições são quadrados vazados.

## Components

### Buttons

- **Primário:** azul cheio, texto branco em Semi Condensed 700, seta à direita. Um por tarefa: "Identificar", "Ler o cadastro inteiro", "Registrar decisão". Desabilitado fica cinza durante a espera.
- **Secundário:** papel com borda azul de 2px e texto azul. "Baixar planilha de-para", exemplos de foto, "Mostrar mais".
- **Perigo:** borda e texto vermelhos, só para "Apagar registro deste navegador", sempre com confirmação.
- **Código clicável:** texto azul sublinhado, leva o código do lote para a tela de identificar.

### Chips

- **Selo de decisão:** retângulo de cor cheia com pictograma e nome curto: "Confirmado", "Precisa de uma pessoa", "Recusado". Quando a pessoa discorda do sistema, o selo do sistema aparece riscado, nunca apagado.
- **Etiqueta neutra:** chapa com borda de linha, para "Cadastro duplicado" ou a semelhança de texto em palavras ("Textos quase iguais").

### Cards / Containers

- **Placa de resultado:** moldura de 2px em tinta. Faixa de cor da decisão com pictograma de 120px num quadrado branco (no amarelo, quadrado vazado em tinta). Corpo em papel.
- **Grupo:** filete de tinta de 2px no topo, pictograma de 44px, título e explicação. Os itens são linhas com divisória de 1px, não cartões.
- Nada de cartão dentro de cartão.

### Inputs / Fields

Campo com borda de tinta de 2px e texto de 1.15rem. Rótulo sempre visível acima. O modo de entrada (Código, Descrição, Foto da etiqueta) é um controle segmentado em tinta; o modo ativo fica em tinta cheia com texto branco.

### Navigation

Faixa de marca em tinta com o pictograma de rolamento, o nome AgroParts e as abas. A aba atual tem uma barra branca de 4px embaixo.

### Placa de resultado (signature component)

Ao chegar, a placa sobe 10px e o pictograma bate como um carimbo, de 1,18 para 1, em curva exponencial de saída. Com movimento reduzido, nada se move. Fora do passo a passo, é o único momento animado do site.

### Passo a passo (Como funciona)

O botão "Como funciona" fica na faixa da marca e, até 860px, preso no canto de baixo da tela, em azul cheio. Ele abre a lista de explicações: a visão geral e uma por prova do roteiro. Cada placa do roteiro tem um link "Explicar" embaixo. A visão geral abre sozinha na primeira visita e fica lembrada no navegador.

- O balão é papel com borda de tinta de 2px e canto de 4px, sem sombra. Título em Semi Condensed 700, texto em Barlow 400 na cor tinta 2, uma ou duas frases curtas.
- "Avançar" é o botão primário, "Voltar" é o secundário e "Pular explicação" é um link discreto em cor suave.
- O fundo escurece em tinta e deixa o elemento explicado recortado. O balão nunca cobre esse elemento, nem no celular.
- Teclado: setas avançam e voltam, Esc sai, e o foco entra no balão. Com movimento reduzido, nada desliza nem esmaece.

## Do's and Don'ts

### Do:

- **Do** escrever a decisão como frase: "É a mesma peça", "Equivale na medida, com condições", "Parece, mas não é", "Precisa de uma pessoa".
- **Do** mostrar o texto original sem alteração ao lado da descrição padronizada.
- **Do** dar a semelhança e a qualidade da leitura em palavras ("Textos quase iguais", "Leitura ruim").
- **Do** acompanhar toda porcentagem da medição com a conta que a gerou ("7 de 7").

### Don't:

- **Don't** mostrar SAME_AS, CROSS_REFERENCE, INTERCHANGEABLE_FOR, SIMILAR_TO, COMPATIBLE_WITH, nome de ADR ou pontuação interna fora de "Ver detalhes".
- **Don't** usar verde, amarelo ou vermelho como decoração, nem azul para indicar estado.
- **Don't** usar borda lateral colorida, gradiente, vidro, sombra decorativa ou anel de progresso.
- **Don't** inventar cliente, economia ou número que a medição não traz.
