# Decisões das pessoas

Depois de uma resposta, quem conhece a peça confirma ou corrige o sistema. A decisão fica registrada ao lado do cadastro original, que não muda, com o que o sistema tinha dito, quem decidiu, o motivo e a impressão digital (sha256) do original. O registro fica só neste navegador e pode ser baixado em JSON ou apagado.

## Sub-features

- `dec-registrar` registra a decisão de uma pessoa a partir da resposta.
- `dec-validar` pede quem decide e por quê antes de registrar.
- `dec-listar` mostra as decisões em `Decisões`, mais nova primeiro.
- `dec-baixar` baixa o registro em JSON.
- `dec-apagar` apaga o registro deste navegador, com confirmação.

## How to get to it (user POV)

- `Registrar a decisão de uma pessoa`, no fim de qualquer resposta de Identificar.
- O link `Decisões` no rodapé (`$B/#revisoes`).
- O link `Ver todas as decisões` que aparece depois de registrar.

## Driving it with agent-browser

Preconditions:

- O doctor passou, a sessão é nova (registro vazio) e uma resposta está na tela, por exemplo a do código `317388` de [Identificar](./identificar.md).

- **Abrir o formulário.** Rode `agent-browser click "summary#t-revisao"`. O formulário mostra três escolhas, com a decisão do sistema já marcada.
- **Validar.** Toque em `agent-browser find role button click --name "Registrar decisão"` com os campos vazios. `#revisao-estado` diz `Preencha quem decide e por quê.`, e nada entra no registro.
- **Registrar.** Rode `agent-browser find role radio click --name "Não é esta peça"`, `find label "Quem decide" fill "Verificação"`, `find label "Por quê" fill "Teste da skill de verificação"` e `find role button click --name "Registrar decisão"`, depois `agent-browser wait --text "Decisão registrada"`. `#revisao-estado` diz que o sistema disse `Confirmado` e a pessoa decidiu `Recusado`.
- **Efeito guardado.** Rode `agent-browser eval 'localStorage.getItem("agroparts.revisoes.v1")'`. O primeiro item tem `decisao_motor` `resolve`, `decisao_humana` `recusa` e o `original` intacto. `sha256_original` é o sha256 de `JSON.stringify(original)`.
- **Listar.** Rode `agent-browser find role link click --name "Decisões"`, `agent-browser reload` e `agent-browser wait ".decisao-item"`. A decisão continua lá depois de recarregar, com o nome, o motivo e o texto original.
- **Apagar.** Rode `agent-browser find role button click --name "Apagar registro deste navegador"`. O clique volta avisando que um `confirm` bloqueia a página; aceite com `agent-browser dialog accept`. A lista diz `Nenhuma decisão registrada neste navegador.`
- **Proof.** A captura de `#revisao-estado` depois de registrar, o JSON do `localStorage` e a lista depois de recarregar.

## Gotchas

- `POST /api/revisoes` não guarda nada no servidor. Uma decisão só existe no `localStorage` do navegador que a registrou, então outra sessão do `agent-browser` não a vê.
- Os campos do formulário ficam dentro de um `details` fechado. Abra `summary#t-revisao` antes de procurar `Quem decide`.
- O sha256 cobre o objeto `original` inteiro em JSON, não só o texto.
- Nunca apague o registro de um navegador que não é seu, inclusive em produção.
