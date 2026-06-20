# CALC3D

Calculadora PWA de custos e precificação para impressão 3D.

## O que o app faz

- Cadastro de múltiplas impressoras com custos independentes
- Fluxo rápido de precificação usando o perfil da impressora
- Catálogo local de produtos com edição e duplicação
- Precificação Shopee CPF 2026 por faixa, tarifa fixa e adicionais configuráveis
- Composição detalhada dos custos de embalagem
- Backup e restauração em JSON
- Funcionamento offline por service worker

## Dados atuais do projeto

- PLA: R$ 100/kg
- PETG: R$ 80/kg
- Perda padrão: 15%
- Embalagem base: R$ 1,50

## Como rodar

Sirva esta pasta por HTTP para habilitar a instalação da PWA e o modo offline:

```powershell
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Contexto do projeto

O contexto vivo fica em [CONTEXT.md](./CONTEXT.md).
