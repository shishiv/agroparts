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

## Status

Aceita.
