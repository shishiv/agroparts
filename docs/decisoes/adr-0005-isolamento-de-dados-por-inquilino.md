# ADR 0005: Isolamento de dados por inquilino

## Contexto

Cadastros de materiais contêm informação comercial e operacional que não pode atravessar clientes.
O produto pode aprender relações comuns sem compartilhar preço, fornecedor ou uso.

## Decisão

Todo dado de cliente será isolado por inquilino em leitura, processamento, revisão e exportação.
Somente o mapeamento anônimo de código para item canônico poderá subir para a base comum.
Preço, fornecedor, condição comercial, volume e consumo nunca subirão para a base comum.
Consultas sem escopo de inquilino falharão fechadas.
Testes automatizados provarão que dois inquilinos não acessam registros um do outro e rejeitarão campos proibidos em esquema, evento ou exportação comum.

## Alternativas descartadas

Uma base compartilhada com filtros opcionais foi descartada porque uma consulta esquecida causaria vazamento.
Anonimizar todos os campos comerciais foi descartado porque reidentificação e inferência ainda seriam possíveis e o compartilhamento não é necessário.

## Consequências

O identificador de inquilino é obrigatório em toda fronteira privada.
Logs e auditoria precisam evitar copiar campos comerciais proibidos.

## Status

Aceita.
