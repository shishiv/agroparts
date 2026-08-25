# Roadmap de prova

O trabalho segue a ordem de evidência do [ADR 0020](decisoes/adr-0020-prova-antes-do-pitch.md).
Cada fase só avança quando o artefato exigido pelo portão anterior estiver registrado.
O pitch é consequência da prova, não o marco organizador.

## P0: autorização e identidade

### Amostra real

Obter a menor exportação útil de cadastro real, com autorização de uso, dicionário de campos e regras acordadas de retenção e eliminação.
O portão de prova é o arquivo recebido no canal aprovado junto do esquema, da finalidade e da autorização registradas.

### Nome provisório

Escolher nome distinto, verificar domínio e executar busca oficial no INPI por nome, radical e classes relevantes antes de qualquer identidade pública.
O portão de prova é o registro das buscas e da decisão de nome, sem tratar busca web como parecer de marca.

## P1: modelo e medição pré-registrada

### Relações tipadas

Adotar o modelo que separa identidade, referência cruzada, intercâmbio condicionado, compatibilidade e similaridade.
O portão de prova é a documentação coerente com o [ADR 0013](decisoes/adr-0013-modelo-de-entidades-e-relacoes-tipadas.md).

### Benchmarks

Congelar os conjuntos de identidade, referência cruzada e intercâmbio, incluindo famílias, positivos, negativos, denominadores, elegibilidade, limiares e métricas.
O portão de prova é o pré-registro completo antes de observar resultados, com formato de cobertura que proíba acurácia geral única.

### Família e catálogo

Escolher um subtipo estreito de rolamento e um catálogo licenciado de um único fabricante.
Um segundo fabricante só entra quando licença e fonte estiverem claras.
Comparar por família CATMAT, ECLASS e o esquema do fabricante antes de escolher a ontologia principal.
O portão de prova é a licença verificada, a fonte reproduzível e a recomendação documentada para a família.

## P2: fatia vertical e utilidade

### Fatia vertical mínima

Fazer de dez a cinquenta itens reais atravessarem importação, extração, candidatos, regras, decisão ternária, revisão e exportação.
O portão de prova é um mapa auditável que preserve os originais e mostre tipo de relação, diferenças, condições e evidências.

### Medição

Medir cobertura e precisão estratificadas conforme o pré-registro.
Medir também tempo mediano de localização e revisão antes e depois, concordância entre revisores, candidatos por item, recusas corretas, decisões revertidas e itens bloqueados por atributo ausente.
O portão de prova é o relatório com números absolutos e percentuais por família e tipo de relação, sem inventar resultados ausentes.

## P3: pitch depois da prova

Preparar interface, narrativa e material somente sobre a fatia vertical medida.
A demonstração precisa mostrar uma duplicidade exata entre códigos locais, uma falsa semelhança corretamente recusada, uma referência cruzada com condições e fonte, tradução em lote com cobertura e precisão estratificadas e revisão humana que preserve o original e registre a decisão.
O portão de prova é o roteiro executado sobre entradas reais e congeladas, sem vídeo como substituto de falha, dado fabricado ou compra automática.

## Comitê de incubação

Qualquer checkpoint anterior ao pitch recebe somente fatos e números já produzidos pelos portões concluídos.
Datas e conteúdo exigido pelo comitê continuam dependentes de confirmação externa.

## Riscos e respostas

Sem amostra autorizada, não começa a fatia vertical nem se afirma valor para cliente.
Sem catálogo licenciado, a família não avança para prova técnica.
Se a precisão não fechar, a cobertura diminui e o limiar não é afrouxado.
Sem benchmark pré-registrado, nenhum resultado serve como portão de prova.
