# CALC3D

Calculadora PWA de custos e precificação para impressão 3D.

## O que o app faz

- Cadastro de múltiplas impressoras com custos independentes
- Fluxo rápido de precificação usando o perfil da impressora
- Catálogo local de produtos com edição e duplicação
- Controle de estoque local por produto, com pronta entrega, reservas e mínimo
- Precificação Shopee CPF 2026 e CNPJ 2026 por faixa, tarifa fixa e adicionais configuráveis
- Composição detalhada dos custos de embalagem
- Backup e restauração em JSON
- Funcionamento offline por service worker
- Versão pública rápida com cálculo simples e laterais reservadas para anúncios
- Modo avançado com catálogo, estoque e precificação detalhada

## Dados atuais do projeto

- PLA: R$ 100/kg
- PETG: R$ 80/kg
- Perda padrão: 15%
- Embalagem base: R$ 1,50
- Shopee CNPJ 2026: 20% + R$ 4 até R$ 79,99; 14% + R$ 16 de R$ 80 a R$ 99,99; 14% + R$ 20 de R$ 100 a R$ 199,99; 14% + R$ 26 acima de R$ 200

## Como rodar

Sirva esta pasta por HTTP para habilitar a instalação da PWA e o modo offline:

```powershell
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Contexto do projeto

O contexto vivo fica em [CONTEXT.md](./CONTEXT.md).

## Login protegido

Veja [docs/auth-architecture.md](./docs/auth-architecture.md) para a arquitetura do login próprio e sessão no servidor.

Para habilitar:

- preencha `authApiBaseUrl` em `src/js/app-state.js`;
- configure o backend em `auth-server/.env` com `FRONTEND_ORIGIN`, `AUTH_USERNAME`, `AUTH_PASSWORD_HASH` e `SESSION_SECRET`;
- publique o frontend no GitHub Pages e o backend em uma origem HTTPS separada.
