# agroparts e PartsGraph

`agroparts` é o repositório da iniciativa Rota Inova AGR08, e PartsGraph é o nome do produto desenvolvido por Alberto Gabriel e Myke Matos.
O desafio AGR08 busca eficiência na gestão de peças por identificação automática, integração com catálogos de fabricantes, geração automática de requisições e correlação e classificação de materiais para evitar solicitações indevidas.
O problema inicial é que a mesma peça aparece com textos e códigos diferentes entre plantas, ERPs, fornecedores e históricos, enquanto registros aparentemente duplicados podem precisar permanecer por vínculos operacionais e fiscais.
PartsGraph resolve texto sujo ou código em um item canônico com atributos, equivalentes e grau de confiança, sem alterar o cadastro de origem.
Busca, tradução em lote e futuros guardrails de requisição são vistas da mesma função de resolução de item.
A entrega se integra por API ao ERP e ao CMMS, onde continuam alerta, aprovação, requisição e compra.

## Navegação

[Produto](docs/produto.md) define problema, cliente, dores, pilares e limites.
[Arquitetura](docs/arquitetura.md) registra o contrato técnico e de confiança.
[Glossário](docs/glossario.md) fixa a linguagem ubíqua.
[Roadmap](docs/roadmap.md) organiza as doze semanas e seus portões de prova.
[Decisões](docs/decisoes/) preservam as decisões fechadas como ADRs.
[Pesquisa](docs/pesquisa/) preserva comandos, fontes e resultados reconferidos.
[Wayfinder](docs/wayfinder/partsgraph/map.md) mantém decisões, névoa e tickets locais.
