# Wayfinder: PartsGraph

## Destination

O motor de resolução com calibração provada e tradução em lote roda ao vivo no dia do pitch, com número medido em vez de promessa.

## Notes

O domínio é resolução e normalização não destrutiva de peças para operações industriais e agroindustriais.
A capacidade é de dois estudantes, Alberto Gabriel e Myke Matos, sem verba declarada.
Nenhum número, cliente, caso ou resultado pode ser inventado.
Cada ticket resolve uma pergunta agora precisa, registra evidência e opções, define como a hipótese falha e declara o artefato de fechamento.
As skills relevantes são `research`, `grounded-citations`, `github-decision-maps`, `issue-graph-planning`, `api-and-interface-design`, `security-and-hardening` e `e2e-real-contract-testing`.
Este tracker é Markdown local e não cria issues no GitHub.
Os tickets abertos ficam em [`tickets/`](tickets/) com frontmatter em YAML e dependências por slug conforme o contrato deste brief.

## Decisions so far

- [ADR 0001](../../decisoes/adr-0001-camada-de-traducao-nao-destrutiva.md): a tradução preserva o ERP e liga códigos legados ao item canônico.
- [ADR 0002](../../decisoes/adr-0002-catmat-como-espinha-taxonomica.md): o CATMAT é a espinha taxonômica pública, não substituto do fabricante.
- [ADR 0003](../../decisoes/adr-0003-forma-canonica-do-item.md): o item usa substantivo, modificador, atributos tipados e descrição por regra.
- [ADR 0004](../../decisoes/adr-0004-entrega-por-api-integrada.md): a entrega é por API integrada aos sistemas existentes.
- [ADR 0005](../../decisoes/adr-0005-isolamento-de-dados-por-inquilino.md): dados comerciais permanecem isolados e só o mapa anônimo pode ser comum.
- [ADR 0006](../../decisoes/adr-0006-guardrails-programaticos-e-revisao-humana.md): regras programáticas e revisão humana protegem a faixa automática.
- [ADR 0007](../../decisoes/adr-0007-normalizacao-como-receita-e-comissao-latente.md): normalização é a receita inicial e comissão permanece latente.
- [ADR 0008](../../decisoes/adr-0008-camera-para-leitura-de-codigo.md): câmera lê código e contexto, mas não decide classificação visual.
- [ADR 0009](../../decisoes/adr-0009-etiqueta-em-ativo-e-endereco.md): etiqueta fica no ativo e no endereço, aplicada pelo cliente.
- [ADR 0010](../../decisoes/adr-0010-licencas-de-terceiros.md): terceiro só entra após licença compatível verificada.
- [ADR 0011](../../decisoes/adr-0011-escopo-do-dia-do-pitch.md): o pitch prova resolução calibrada e tradução em lote ao vivo.
- [ADR 0012](../../decisoes/adr-0012-erp-alvo-em-aberto.md): exportação e API mantêm o primeiro corte agnóstico de ERP.

## Not yet specified

Ainda não está definido qual fabricante terá catálogo extraído.
Ainda não está definido como extrair catálogo publicado somente em PDF.
Ainda não está definido qual empresa entregará o cadastro real.
Ainda não está definido como versionar o item canônico quando atributos ou classificação mudarem.
Ainda não está definido como representar peça descontinuada e sua sucessora.
Ainda não está definida a interface mínima da demonstração.
Ainda não está definido como medir cobertura por família sem esconder classes difíceis.
Ainda não está definida a forma jurídica do uso de catálogo de terceiro.

## Out of scope

Hardware e sensor estão fora do escopo.
ERP próprio está fora do escopo.
Marketplace transacional ativo está fora do escopo.
Equipe de campo está fora do escopo.
Integração nativa com ERP antes do piloto está fora do escopo.
