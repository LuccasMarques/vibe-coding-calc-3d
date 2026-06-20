# Contexto do projeto — CALC3D

CALC3D é uma PWA de precificação e controle de custos para impressão 3D.

Objetivo do produto:

- permitir cadastrar mais de uma impressora com custos independentes;
- calcular custo por projeto com foco em agilidade;
- salvar produtos/projetos localmente para reaproveitar e editar depois;
- manter o fluxo direto: idealmente o usuário informa só os dados essenciais de cada peça;
- funcionar offline e persistir dados no navegador.

Estrutura mental do app:

- Impressoras: perfis com custo da máquina, manutenção, energia, tributos e padrões rápidos.
- Produtos: projetos salvos com materiais, tempos, gramatura, pós-processo, embalagem e preços.
- Estoque: quantidade em mãos, reservados, disponível, mínimo e situação de pronta entrega por produto.
- Precificação: cálculo do custo e do preço de venda com taxas de plataforma e margem.
- Plataforma: regras de venda, hoje focadas em Shopee CPF 2026 e Shopee CNPJ 2026.

Regras e decisões atuais do projeto:

- usar duas impressoras diferentes como cenário principal;
- salvar os dados dos produtos feitos pelo usuário;
- manter um controle de estoque simples por produto, com pronta entrega e reservas;
- default de perda: 15%;
- custo de envelope/embalagem base: R$ 1,50;
- remover monitoramento de impressão do cálculo;
- desconsiderar monitoramento como parte do custo, porque ele entra junto do pós-processamento/acabamento;
- tabela de filamento em uso:
  - PLA: R$ 100/kg;
  - PETG: R$ 80/kg;
- por enquanto, não usar outras tabelas de material.
- perfil Shopee CNPJ 2026 usa a tabela:
  - até R$ 79,99: 20% + R$ 4;
  - R$ 80,00 a R$ 99,99: 14% + R$ 16;
  - R$ 100,00 a R$ 199,99: 14% + R$ 20;
  - R$ 200,00 a R$ 499,99: 14% + R$ 26;
  - acima de R$ 500,00: 14% + R$ 26.

Direção de usabilidade:

- a tela deve ficar mais direta;
- o ideal é reduzir entradas manuais repetidas;
- a versão pública deve priorizar uma calculadora simples e rápida, com áreas laterais para anúncios;
- o fluxo desejado é: escolher um perfil pronto e preencher apenas gramas e tempo de impressão, quando possível.
- o acesso protegido virou opcional e não deve ser o caminho padrão da experiência pública.

Padrão de trabalho deste repositório:

- antes de mudanças estruturais, analisar o formato do código e a arquitetura com a skill `improve-codebase-architecture`;
- antes de implementar comportamento novo, seguir `tdd`;
- quando houver dúvida grande de arquitetura, UX ou regras de negócio, fazer um “grill” da proposta com `grill-me` antes de consolidar a mudança;
- manter este arquivo atualizado quando o vocabulário, as regras ou o fluxo do app mudarem.

Notas de implementação:

- os dados ficam no navegador;
- a aplicação é uma PWA;
- o catálogo de produtos deve continuar local e editável;
- mudanças de preço ou regra devem priorizar consistência do cálculo e clareza da interface.
