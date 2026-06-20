(() => {
  const MATERIAL_PRICES = Object.freeze({
    '100': 100,
    '80': 80,
  });

  const SHOPEE_TIERS = Object.freeze([
    { min: 0,   max: 8,        pct: 0.50, fixed: 0,  label: 'R$ 0–7,99 · 50%' },
    { min: 8,   max: 80,       pct: 0.20, fixed: 4,  label: 'R$ 8–79,99 · 20%' },
    { min: 80,  max: 100,      pct: 0.14, fixed: 16, label: 'R$ 80–99,99 · 14%' },
    { min: 100, max: 200,      pct: 0.14, fixed: 20, label: 'R$ 100–199,99 · 14%' },
    { min: 200, max: Infinity, pct: 0.14, fixed: 26, label: 'R$ 200+ · 14%' },
  ]);

  function normalizeMaterial(value) {
    const text = String(value ?? '');
    return Object.prototype.hasOwnProperty.call(MATERIAL_PRICES, text) ? text : '100';
  }

  function shopeeTier(price) {
    return SHOPEE_TIERS.find(tier => price >= tier.min && price < tier.max) || SHOPEE_TIERS[0];
  }

  function platformCharge(price, config = {}) {
    const selected = config.taxaPlat ?? 0;
    if(selected === 'shopee_cpf_2026') {
      const tier = shopeeTier(price);
      const extraPct = ((Number(config.shopeeCampanha) || 0) + (Number(config.shopeeDevolucao) || 0)) / 100;
      const cpfExtra = config.shopeeCpfExtraOn ? (Number(config.shopeeCpfExtra) || 0) : 0;
      const fixed = tier.fixed + cpfExtra + (Number(config.shopeeCupom) || 0) + (Number(config.shopeeAds) || 0) + (Number(config.shopeeFrete) || 0);
      const variable = price * (tier.pct + extraPct);
      return { total: variable + fixed, variable, fixed, pct: tier.pct + extraPct, tier };
    }
    const pct = selected === 'custom_plat'
      ? (Number(config.customPlatVal) || 0) / 100
      : (parseFloat(selected) / 100 || 0);
    return { total: price * pct, variable: price * pct, fixed: 0, pct, tier: null };
  }

  function priceForMargin(cost, margin, taxPct, config = {}) {
    if((config.taxaPlat ?? 0) !== 'shopee_cpf_2026') {
      const divisor = 1 - margin - taxPct - platformCharge(1, config).pct;
      return divisor > 0 ? cost / divisor : cost * (1 + margin);
    }
    const candidates = [];
    SHOPEE_TIERS.forEach(tier => {
      const extraPct = ((Number(config.shopeeCampanha) || 0) + (Number(config.shopeeDevolucao) || 0)) / 100;
      const cpfExtra = config.shopeeCpfExtraOn ? (Number(config.shopeeCpfExtra) || 0) : 0;
      const fixed = tier.fixed + cpfExtra + (Number(config.shopeeCupom) || 0) + (Number(config.shopeeAds) || 0) + (Number(config.shopeeFrete) || 0);
      const divisor = 1 - margin - taxPct - tier.pct - extraPct;
      if(divisor <= 0) return;
      const candidate = Math.max((cost + fixed) / divisor, tier.min);
      if(candidate < tier.max) {
        const fee = platformCharge(candidate, config).total;
        const achieved = candidate > 0 ? (candidate - cost - candidate * taxPct - fee) / candidate : -1;
        if(achieved + 0.000001 >= margin) candidates.push(candidate);
      }
    });
    return candidates.length ? Math.min(...candidates) : cost * 2;
  }

  function calculateProjectCosts(input) {
    const printer = input.printer || {};
    const project = input.project || {};
    const pricing = input.pricing || {};
    const materialPricePerKg = MATERIAL_PRICES[normalizeMaterial(project.material)] ?? MATERIAL_PRICES['100'];

    const valorMaq = Number(printer.valor_maq) || 0;
    const vidaUtil = Math.max(Number(printer.vida_util) || 0, 0.1);
    const horasDia = Math.max(Number(printer.horas_dia) || 0, 0.1);
    const consumoW = Number(printer.consumo_w) || 0;
    const tarifaKwh = Number(printer.tarifa_kwh) || 0;
    const custoFixo = Number(printer.custo_fixo) || 0;
    const projetosMes = Math.max(Number(printer.projetos_mes) || 0, 1);
    const manutAno = Number(printer.manut_ano) || 0;
    const insumosMes = Number(printer.insumos_mes) || 0;
    const valorHora = Number(printer.valor_hora) || 0;

    const tempoH = (Number(project.tempo_h) || 0) + (Number(project.tempo_m) || 0) / 60;
    const filamentoG = Number(project.filamento_g) || 0;
    const posProc = Number(project.pos_proc) || 0;
    const perdaPct = (Number(project.taxa_perda) || 0) / 100;
    const qtdPecas = Math.max(Number(project.qtd_pecas) || 0, 1);
    const embalagem = Number(project.embalagem) || 0;
    const embProtecao = Number(project.emb_protecao) || 0;
    const embEtiqueta = Number(project.emb_etiqueta) || 0;
    const embBrinde = Number(project.emb_brinde) || 0;
    const frete = Number(project.frete) || 0;
    const outros = Number(project.outros) || 0;

    const horasTotais = vidaUtil * 365 * horasDia;
    const depH = horasTotais > 0 ? valorMaq / horasTotais : 0;
    const enerH = (consumoW / 1000) * tarifaKwh;
    const manutH = horasDia > 0 ? (manutAno + insumosMes * 12) / (365 * horasDia) : 0;
    const custoTotalH = depH + enerH + manutH;
    const fixoPorProj = custoFixo / projetosMes;

    const cFil = filamentoG * (materialPricePerKg / 1000);
    const cEner = tempoH * enerH;
    const cDep = tempoH * depH;
    const cManut = tempoH * manutH;
    const cMdo = posProc * valorHora;
    const cFixo = fixoPorProj;
    const cEmb = embalagem + embProtecao + embEtiqueta + embBrinde;
    const cExtra = cEmb + frete + outros;
    const subtotal = cFil + cEner + cDep + cManut + cMdo + cFixo + cExtra;
    const cPerda = subtotal * perdaPct;
    const total = subtotal + cPerda;
    const porPeca = total / qtdPecas;

    const impPct = (Number(pricing.impostos) || 0) / 100;
    const platform = platformCharge(pricing.salePrice ?? porPeca, {
      taxaPlat: pricing.taxaPlat,
      customPlatVal: pricing.customPlatVal,
      shopeeCpfExtraOn: pricing.shopeeCpfExtraOn,
      shopeeCpfExtra: pricing.shopeeCpfExtra,
      shopeeCampanha: pricing.shopeeCampanha,
      shopeeDevolucao: pricing.shopeeDevolucao,
      shopeeCupom: pricing.shopeeCupom,
      shopeeAds: pricing.shopeeAds,
      shopeeFrete: pricing.shopeeFrete,
    });

    return {
      machine: { depH, enerH, manutH, custoTotalH, fixoPorProj },
      project: { tempoH, filamentoG, posProc, perdaPct, qtdPecas, cFil, cEner, cDep, cManut, cMdo, cFixo, cEmb, cExtra, subtotal, cPerda, total, porPeca },
      pricing: { impPct, platform, materialPricePerKg },
    };
  }

  const api = Object.freeze({
    MATERIAL_PRICES,
    SHOPEE_TIERS,
    normalizeMaterial,
    shopeeTier,
    platformCharge,
    priceForMargin,
    calculateProjectCosts,
  });

  if(typeof module !== 'undefined' && module.exports) module.exports = api;
  if(typeof window !== 'undefined') window.CALC3D_CORE = api;
})();
