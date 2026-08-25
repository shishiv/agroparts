# Ferramentas de código aberto

## Método

A consulta foi executada em 25/08/2026 pela API do GitHub com `gh-axi`, o wrapper autenticado de `gh` disponível no ambiente de trabalho.
Fora desse ambiente, o mesmo comando pode ser executado com `gh api` após autenticação.
Estrelas e datas de último envio são instantâneos mutáveis e devem ser reconferidos antes de qualquer decisão futura.

```bash
for repo in dedupeio/dedupe moj-analytical-services/splink zinggAI/zingg OpenRefine/OpenRefine gsuresh083-alt/material-master-data-tool; do gh-axi api "repos/$repo" --jq '[.full_name,(.license.spdx_id // "SEM-LICENCA"),.stargazers_count,.pushed_at,.created_at,.language] | @tsv'; done
```

## Resultado reproduzido

`dedupeio/dedupe` declarou MIT, tinha 4.506 estrelas e último envio em 29/07/2025.
`moj-analytical-services/splink` declarou MIT, tinha 2.361 estrelas e último envio em 25/08/2026.
`zinggAI/zingg` declarou AGPL-3.0, tinha 1.236 estrelas e último envio em 25/08/2026.
`OpenRefine/OpenRefine` declarou BSD-3-Clause, tinha 11.953 estrelas e último envio em 21/08/2026.
`gsuresh083-alt/material-master-data-tool` era TypeScript, tinha zero estrelas, foi criado em 12/07/2026, recebeu último envio em 12/07/2026 e não declarou licença.
O README consultado em 25/08/2026 descreve a fase inicial como frontend, persistência padrão em `localStorage` e suporte opcional a Firebase.

```bash
gh-axi api repos/gsuresh083-alt/material-master-data-tool/readme --jq .download_url
curl -fsSL 'https://raw.githubusercontent.com/gsuresh083-alt/material-master-data-tool/main/README.md' | grep -nE 'frontend|localStorage|Firebase|backend'
```

## Regra de licença

Como política conservadora para o produto pretendido, a equipe considera a AGPL-3.0 incompatível e mantém Zingg fora enquanto distribuição, arquitetura e parecer de licença não justificarem outra decisão.
Um repositório sem licença permanece sob todos os direitos reservados, portanto a regra é não copiar código, texto ou planilhas de `gsuresh083-alt/material-master-data-tool`.
Nada entra no produto sem licença compatível verificada.
O modelo de domínio demonstrado pelo repositório, com substantivo e modificador, modelos de atributo, descrição por regra e duplicidade com peso e faixa, pode orientar uma implementação independente porque ideias não são protegidas como expressão.
Essa forma também converge com os padrões descritivos observados no CATMAT, que são a fonte de domínio adotada pelo projeto.

## Fontes

- [dedupe](https://github.com/dedupeio/dedupe)
- [Splink](https://github.com/moj-analytical-services/splink)
- [Zingg](https://github.com/zinggAI/zingg)
- [OpenRefine](https://github.com/OpenRefine/OpenRefine)
- [material-master-data-tool](https://github.com/gsuresh083-alt/material-master-data-tool)
- [GitHub sobre ausência de licença](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository)
