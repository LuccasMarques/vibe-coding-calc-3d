# CALC3D

Calculadora PWA de custos e precificação para impressão 3D.

## Recursos

- Cadastro de múltiplas impressoras com custos independentes
- Cálculo de material, energia, depreciação, manutenção e mão de obra
- Catálogo local de produtos com edição e duplicação
- Precificação Shopee CPF 2026 por faixa, tarifa fixa e adicionais configuráveis
- Composição detalhada dos custos de embalagem
- Backup e restauração em JSON
- Funcionamento offline por service worker

Os dados são armazenados no IndexedDB do navegador. Exporte um backup regularmente,
especialmente antes de limpar os dados do navegador ou trocar de dispositivo.

## Executar

Sirva esta pasta por HTTP para habilitar a instalação da PWA e o modo offline:

```powershell
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.
