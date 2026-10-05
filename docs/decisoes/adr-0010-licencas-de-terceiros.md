# ADR 0010: Licenças de terceiros

## Contexto

Ferramentas de resolução de entidades e projetos de dados de materiais possuem licenças com obrigações diferentes.
Zingg usa AGPL-3.0, e o repositório `gsuresh083-alt/material-master-data-tool` não declara licença.
Ausência de licença mantém todos os direitos reservados e não autoriza copiar código ou planilhas.
A evidência consultada está registrada em [ferramentas OSS](../pesquisa/ferramentas-oss.md).

## Decisão

Nada entrará no produto sem licença compatível verificada e registrada.
Como política conservadora do produto pretendido, Zingg fica fora enquanto distribuição, arquitetura e parecer de licença não demonstrarem compatibilidade com a AGPL-3.0.
Nenhum código, texto ou planilha do repositório sem licença será copiado.
Ideias de domínio podem ser estudadas e reimplementadas de forma independente, com fonte e convergência com o CATMAT registradas.

## Alternativas descartadas

Copiar e regularizar depois foi descartado porque cria risco jurídico e contaminação difícil de remover.
Tratar repositório público como domínio público foi descartado porque publicação não concede licença.

## Consequências

Cada dependência ou corpus futuro exige uma verificação de licença antes de uso.
A pesquisa de ferramentas registra licença e data de consulta como evidência.

## Termos de fabricantes verificados em 05/10/2026

Os termos de uso da SKF permitem que um indivíduo reproduza, guarde e baixe as informações do site sem autorização prévia.
Os mesmos termos proíbem uso comercial sem aprovação escrita e proíbem, em qualquer caso, fornecer essas informações a terceiros.
Os termos de uso da Timken proíbem copiar, distribuir, exibir ou usar qualquer informação do site sem permissão escrita.
Um site público redistribui o que contém, e um proxy da equipe para a API da SKF também redistribui.
Por isso, o protótipo público do [ADR 0021](adr-0021-pilha-do-prototipo-publico.md) não contém dado da SKF nem da Timken.
A SKF aparece só como link para o sistema de designação, usado como regra.
Uma etapa local para o pitch pode baixar um snapshot da SKF para uso individual, fora do repositório e do site publicado.
Essa etapa fica para depois do site público e só acontece se houver prazo antes de 09/10/2026.
Evidência, URLs e corpora abertos usados no lugar estão em [fontes do protótipo](../pesquisa/fontes-do-prototipo.md).

## Bibliotecas da interface verificadas em 05/10/2026

O passo a passo do site ("Como funciona") usa driver.js 1.9.0, de Kamran Ahmed, sob licença MIT.
A licença MIT permite usar, copiar e redistribuir o código, inclusive em uso comercial, desde que o aviso de copyright acompanhe o código.
O pacote vai junto com o JavaScript do site, e o aviso está no arquivo `LICENSE` do pacote npm `driver.js`.
O teste do passo a passo usa playwright-core 1.63.0, sob Apache 2.0, só no desenvolvimento. Ele não vai para o site publicado.

## Status

Aceita.
