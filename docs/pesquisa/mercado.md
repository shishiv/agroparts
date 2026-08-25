# Pesquisa de mercado

A reconferência das páginas públicas foi feita em 25/08/2026.
Números desta seção são alegações publicadas pelas próprias empresas e não validação independente do PartsGraph.

## Comandos de verificação

Os comandos abaixo preservam a rota de reprodução das alegações numéricas e dos recursos descritos.

```bash
curl -fsSL 'https://r.jina.ai/https://verusen.com/use_case/use-case-fortune-500-industrial-equipment-manufacturer/' -o /tmp/verusen-caso.md
curl -fsSL 'https://verusen.com/faq/' -o /tmp/verusen-faq.html
curl -fsSL 'https://r.jina.ai/https://versableai.com/' -o /tmp/versable.md
curl -fsSL 'https://r.jina.ai/https://www.meritdata-tech.com/case-studies/auto-parts-ai-llm' -o /tmp/merit.md
curl -fsSL 'https://r.jina.ai/https://tractian.com/en/solutions/integrations' -o /tmp/tractian-integracoes.md
grep -nEi '29 plants|20\.9M|10\.5M|3,000' /tmp/verusen-caso.md
grep -nEi '10,000|duplicates' /tmp/verusen-faq.html
grep -nEi 'ACES|PIES|PCdb|guardrails|hallucinations' /tmp/versable.md
grep -nEi '100%|85%|80%|60%|40%|text|image' /tmp/merit.md
grep -nEi 'SAP|Maximo|Oracle NetSuite|Power BI|inventory|CMMS' /tmp/tractian-integracoes.md
```

## Verusen

A Verusen, de Atlanta, é o análogo de negócio mais próximo porque sobrepõe sistemas existentes, recebe dados sem exigir limpeza prévia, conecta múltiplos ERPs e harmoniza materiais entre plantas.
Seu caso publicado de fabricante industrial Fortune 500 informa 29 plantas, US$ 20,9 milhões em oportunidade identificada, US$ 10,5 milhões verificados e mais de 3 mil materiais potencialmente duplicados.
A página de perguntas frequentes afirma que clientes eliminaram mais de 10 mil duplicidades em meses.
PartsGraph deve copiar a entrada não destrutiva, a visão entre origens e a venda de resultado medido, sem copiar texto, método proprietário ou alegações.

## Versable AI

A Versable AI é o análogo técnico em autopeças porque ancora o trabalho nos padrões ACES, PIES e PCdb.
Sua proposta pública contrasta especialização vertical com modelos genéricos e descreve guardrails programáticos para evitar alucinação.
PartsGraph deve copiar o princípio de combinar taxonomia setorial, regras e validação, sem copiar implementação proprietária.

## Merit Data

A Merit Data descreve identificação e classificação de autopeças por conjunto de modelos sobre catálogos em texto e imagem.
O caso publicado declara 100% de acurácia em 85% dos registros, redução de 80% no tempo de processamento, onboarding de fabricante mais de 60% rápido e economia operacional superior a 40%.
A leitura prudente é um teto público de mercado, não uma promessa transferível ao PartsGraph.
Se 85% receberam automação com acurácia total, 15% ficaram fora dessa faixa e sustentam a necessidade de revisão humana.

## Tractian

A Tractian oferece saúde de ativos por sensor e CMMS com inventário de peças.
Sua página de integrações lista SAP, IBM Maximo, Oracle NetSuite e Power BI, além de integração com processos de finanças, estoque, compras e manutenção.
Ela não é concorrente direta no escopo atual e não deve ser copiada em hardware.
PartsGraph deve copiar os princípios de captura sem fricção, resultado numérico, integração em vez de substituição, verticalização setorial e confiança tratada como elemento do produto.

## Entorno

Verdantis, Prospecta, Enventure e ALLSERV compõem o entorno de mercado de governança, enriquecimento e normalização de dados de materiais.
Essas referências mostram que dado mestre de materiais é um mercado existente, mas não substituem validação direta de posicionamento com clientes do AGR08.

## Risco competitivo

Tractian ou Verusen se tornam concorrentes diretos se passarem a oferecer um catálogo canônico que atravesse empresas e ERPs.
A defesa inicial do PartsGraph é foco no contrato de resolução, na taxonomia pública brasileira, na prova de calibração e na integração não destrutiva.

## Fontes

- [Caso Verusen em 29 plantas](https://verusen.com/use_case/use-case-fortune-500-industrial-equipment-manufacturer/)
- [Perguntas frequentes da Verusen](https://verusen.com/faq/)
- [Detecção de duplicidades sem reescrita pela Verusen](https://verusen.com/blog/ai-mro-duplicate-detection/)
- [Versable AI](https://versableai.com/)
- [Conceitos da Versable AI](https://app.versable.ai/help/1-core-concepts/)
- [Caso Merit Data](https://www.meritdata-tech.com/case-studies/auto-parts-ai-llm)
- [Integrações da Tractian](https://tractian.com/en/solutions/integrations)
- [Inventário no CMMS da Tractian](https://tractian.com/en/solutions/cmms/inventory-management-software)
- [Verdantis](https://www.verdantis.com/)
- [Prospecta](https://www.prospecta.com/)
- [Enventure](https://www.enventure.com/)
- [ALLSERV](https://www.allserv.com/)
