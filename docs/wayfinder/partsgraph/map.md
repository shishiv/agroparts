# Wayfinder: PartsGraph

## Destination

Uma fatia vertical de dez a cinquenta itens de cadastro real autorizado atravessa o fluxo completo e produz precisão e cobertura estratificadas por tipo de relação.
O pitch é consequência dessa prova, não o destino.

## Notes

`PartsGraph` é codinome interno até a escolha de outro nome antes de qualquer identidade pública.
O produto é uma camada B2B de resolução e normalização não destrutiva, não uma loja nem um marketplace.
Toda resposta declara se resolveu `SAME_AS`, `CROSS_REFERENCE`, `INTERCHANGEABLE_FOR`, `COMPATIBLE_WITH` ou somente recuperou `SIMILAR_TO`.
A capacidade é de dois estudantes, Alberto Gabriel e Myke Matos, sem verba declarada.
Nenhum número, cliente, caso ou resultado pode ser inventado.
Cada ticket resolve uma pergunta agora precisa, registra evidência e opções, define como a hipótese falha e declara o artefato de fechamento.
As skills relevantes são `research`, `grounded-citations`, `github-decision-maps`, `issue-graph-planning`, `api-and-interface-design`, `security-and-hardening` e `e2e-real-contract-testing`.
Este tracker é Markdown local e não cria issues no GitHub.
Os tickets ficam em [`tickets/`](tickets/) com frontmatter em YAML e dependências por slug.
A reconciliação atual se apoia no [recon profundo](../../pesquisa/recon-profundo-2026-08-25.md).

## Decisions so far

1. [ADR 0001](../../decisoes/adr-0001-camada-de-traducao-nao-destrutiva.md): a camada preserva os registros do ERP e mantém o vínculo reversível.
2. [ADR 0002](../../decisoes/adr-0002-catmat-como-espinha-taxonomica.md): superado pelo [ADR 0017](../../decisoes/adr-0017-catmat-como-corpus.md); CATMAT não é mais a espinha taxonômica.
3. [ADR 0003](../../decisoes/adr-0003-forma-canonica-do-item.md): superado pelo [ADR 0013](../../decisoes/adr-0013-modelo-de-entidades-e-relacoes-tipadas.md); a entidade única dá lugar a entidades e relações tipadas.
4. [ADR 0004](../../decisoes/adr-0004-entrega-por-api-integrada.md): a entrega é por API, com ERP e CMMS como sistemas de registro.
5. [ADR 0005](../../decisoes/adr-0005-isolamento-de-dados-por-inquilino.md): superado pelo [ADR 0018](../../decisoes/adr-0018-isolamento-estrito-no-piloto.md); o piloto adota zero aprendizagem entre clientes.
6. [ADR 0006](../../decisoes/adr-0006-guardrails-programaticos-e-revisao-humana.md): regras programáticas produzem resolve, revisa ou recusa.
7. [ADR 0007](../../decisoes/adr-0007-normalizacao-como-receita-e-comissao-latente.md): superado pelo [ADR 0019](../../decisoes/adr-0019-comissao-fora-do-caminho-critico.md); comissão sai do pitch e do caminho crítico.
8. [ADR 0008](../../decisoes/adr-0008-camera-para-leitura-de-codigo.md): câmera serve somente para OCR e contexto.
9. [ADR 0009](../../decisoes/adr-0009-etiqueta-em-ativo-e-endereco.md): etiqueta fica no ativo e no endereço, aplicada pelo cliente.
10. [ADR 0010](../../decisoes/adr-0010-licencas-de-terceiros.md): terceiro só entra após licença compatível verificada.
11. [ADR 0011](../../decisoes/adr-0011-escopo-do-dia-do-pitch.md): superado pelo [ADR 0020](../../decisoes/adr-0020-prova-antes-do-pitch.md); a prova passa a preceder o pitch.
12. [ADR 0012](../../decisoes/adr-0012-erp-alvo-em-aberto.md): o piloto define a primeira integração nativa de ERP.
13. [ADR 0013](../../decisoes/adr-0013-modelo-de-entidades-e-relacoes-tipadas.md): entidades e relações tipadas separam identidade, aplicação, procedência e condição.
14. [ADR 0014](../../decisoes/adr-0014-benchmarks-separados-e-pre-registrados.md): identidade, referência cruzada e intercâmbio têm benchmarks pré-registrados próprios.
15. [ADR 0015](../../decisoes/adr-0015-partsgraph-como-codinome-interno.md): PartsGraph é codinome interno e exige novo nome antes de identidade pública.
16. [ADR 0016](../../decisoes/adr-0016-fronteira-de-posicionamento.md): o posicionamento se limita à resolução agroindustrial verificável e conservadora.
17. [ADR 0017](../../decisoes/adr-0017-catmat-como-corpus.md): CATMAT é corpus, e a ontologia principal depende de comparação por família.
18. [ADR 0018](../../decisoes/adr-0018-isolamento-estrito-no-piloto.md): dados e decisões privadas permanecem no inquilino durante o piloto.
19. [ADR 0019](../../decisoes/adr-0019-comissao-fora-do-caminho-critico.md): comissão só pode ser reaberta com canal, atribuição e demanda comprovadas.
20. [ADR 0020](../../decisoes/adr-0020-prova-antes-do-pitch.md): amostra, benchmark, fatia vertical e medição vêm antes do pitch.
21. [ADR 0021](../../decisoes/adr-0021-pilha-do-prototipo-publico.md): o protótipo público é site estático com API serverless no Cloudflare Pages, só com dados abertos.

## Not yet specified

Ainda não está definido como extrair catálogo publicado somente em PDF.
Ainda não está definido como representar condições de `INTERCHANGEABLE_FOR`.
Ainda não está definido como versionar evidência e proveniência.
Ainda não está definido como representar peça descontinuada e sua sucessora.
Ainda não está definido como acordar retenção e eliminação com o cliente.

## Out of scope

Hardware e sensor estão fora do escopo.
ERP próprio está fora do escopo.
E-commerce e marketplace estão fora do escopo.
Equipe de campo está fora do escopo.
Mercado endereçável calculado por frota está fora do escopo.
Catálogo universal está fora do escopo.
Integração nativa com ERP antes do piloto está fora do escopo.
Guardrail de requisição antes do vínculo real entre peça e ativo está fora do escopo.
Implementação ampla antes de amostra autorizada e benchmark pré-registrado está fora do escopo.
