---
name: verify-agroparts
description: 'Sobe o protótipo AgroParts (site e API /api/* no Cloudflare Pages local, via wrangler) e o usa num navegador como uma pessoa usa, para provar que uma mudança funciona. Use depois de mudar web/, src/, functions/, public/ ou dados/, ou quando precisar mostrar uma resposta do protótipo com evidência: identificar uma peça, exemplos da apresentação, cadastro inteiro, decisões das pessoas e explicação passo a passo.'
---

# Verificar o protótipo AgroParts

O protótipo é um site estático (`web/`, gerado em `dist/`) com uma API sem estado em `functions/api/`. O motor lê só os snapshots públicos de `dados/`. As decisões das pessoas ficam no `localStorage` do navegador, então nenhuma ação na interface grava no servidor.

Leia [`features/README.md`](features/README.md) e o arquivo da funcionalidade que a mudança toca antes de dirigir. Esta skill prova só o que você dirigiu.

## Subir

Escolha uma pasta absoluta só desta verificação, fora do repositório. Num trabalho do firstmate, use uma subpasta da pasta de artefatos da tarefa. A pasta guarda o pid, o log, o build e a evidência, e continua depois da limpeza.

```sh
export AGROPARTS_VERIFY_DIR=/caminho/absoluto/da/verificacao
export AGROPARTS_PORT=8790   # opcional; 8788 fica livre para o `bun run demo` de quem estiver usando
S=.cursor/skills/verify-agroparts/scripts/agroparts.sh
bun install                  # só se node_modules/ faltar ou o bun.lock mudou
"$S" start
```

`start` roda `bun run build`, sobe `wrangler pages dev dist` em `127.0.0.1:$AGROPARTS_PORT`, com o inspetor em `$AGROPARTS_PORT + 1000` e o estado do wrangler dentro da pasta da verificação. O comando volta quando a instância está usável: `GET /` devolve o título `AgroParts · Qual é esta peça?` e `POST /api/resolver` com o código `311960` devolve `SAME_AS` para `CATMAT 311963`. Ele leva uns 10 s e recusa uma porta que já tem dono.

Duas instâncias rodam lado a lado com pastas e portas diferentes. Nunca dirija uma instância que esta verificação não subiu, nem o `bun run demo` de outra pessoa.

## Doctor

```sh
"$S" doctor
```

Rode antes de dirigir e sempre que algo parecer errado. Ele só lê: confere que o processo está vivo, que a porta é dele, que o build corresponde ao código atual de `web/`, `src/`, `functions/`, `public/` e `dados/`, que a página e `/api/fontes` respondem e que o motor resolve `311960`. Se ele disser que o código mudou depois do build, rode `stop` e `start` de novo: o site servido é o `dist/` do último `start`.

## Dirigir

Use o `agent-browser` numa sessão só sua. Antes do primeiro comando:

```sh
export AGENT_BROWSER_SESSION="$(agent-browser session id --scope worktree --prefix verify-agroparts)"
agent-browser set media light reduced-motion
agent-browser open "$("$S" url)/"
```

O movimento reduzido é a linha de base. Com animação, a resposta rola suave até o resultado, e um clique durante a rolagem cai fora do alvo sem erro. Para provar a própria animação, desligue o movimento reduzido e espere a tela parar antes de cada clique.

Prefira os nomes acessíveis (`agent-browser find role button click --name "Identificar"`, `find label "Código do cadastro ou da peça" fill ...`). Use os ids e atributos de dados que o mapa cita quando não houver nome. Tire um `snapshot -i` novo depois de cada troca de tela.

Para o celular, rode `agent-browser set viewport 390 844 2` antes de abrir a página. A prova de layout no celular inclui conferir que a página não rola na horizontal.

A API é a mesma que a interface usa. Para quem integra sistemas, dirija com `curl` contra `$("$S" url)/api/...`, conforme `public/api/openapi.json`.

## Evidência

Guarde tudo em `$AGROPARTS_VERIFY_DIR`. Escreva `evidencia.md` com, para cada passo: a funcionalidade e a entrada do mapa, a tela (desktop ou 390 px), a ação, o resultado observado, o arquivo de evidência e o nível da prova.

- Prove pelo caminho da pessoa: digitar, tocar, escolher. Não chame funções da página nem preencha o `localStorage` à mão para chegar a um estado.
- Capture a ação e o estado que ela produz: o texto lido com `get text`, e uma captura de tela da resposta. Confira cada captura antes de citar.
- Confira o efeito além da tela. Uma decisão registrada aparece em `localStorage["agroparts.revisoes.v1"]` e continua depois de recarregar. A planilha CSV sai de `/api/lote?formato=csv` com `content-disposition` de anexo.
- Confira os erros do navegador com `agent-browser errors` e `agent-browser console` no fim da jornada.
- O teste do repositório (`bun run test`) roda o motor, a API e os passos a passo num Chromium contra um adaptador Node das rotas, não contra o wrangler. Ele é o portão de regressão do repositório, e não substitui a jornada dirigida aqui.

Níveis da prova:

- **local**: jornada dirigida nesta instância do wrangler, que roda as mesmas Pages Functions do Cloudflare.
- **prévia**: a mesma jornada na URL de prévia do check "Cloudflare Pages" do commit. Não há pid nem doctor; confira o título e `/api/fontes` com `curl` antes.
- **produção, só leitura**: a mesma jornada em https://agroparts.pages.dev. Não apague o registro de decisões de um navegador que não é seu.

## Limpar

```sh
agent-browser close
"$S" stop
ls "$AGROPARTS_VERIFY_DIR"
```

`stop` mata só o processo que o `start` gravou em `server.pid` e os filhos dele (o `workerd`), confere que a porta ficou livre e não apaga nada da pasta. Nunca mate por nome de processo. O `dist/` fica no repositório, ignorado pelo git. Depois do `stop`, confira que a evidência continua na pasta.

## Manutenção

Quando o app ganhar ou mudar uma tela, atualize o mapa em `features/`. Rode `/maintain-verification-skill` para conferir o mapa contra o código.
