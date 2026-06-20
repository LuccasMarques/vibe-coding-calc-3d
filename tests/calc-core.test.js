const assert = require('assert');
const core = require('../src/js/calc-core');

function near(actual, expected, epsilon = 1e-9) {
  assert.ok(Math.abs(actual - expected) <= epsilon, `${actual} !== ${expected}`);
}

assert.strictEqual(core.normalizeMaterial('100'), '100');
assert.strictEqual(core.normalizeMaterial('80'), '80');
assert.strictEqual(core.normalizeMaterial('custom'), '100');

const shopee = core.platformCharge(50, {
  taxaPlat: 'shopee_cpf_2026',
  shopeeCpfExtraOn: 1,
  shopeeCpfExtra: 3,
  shopeeCampanha: 0,
  shopeeDevolucao: 0,
  shopeeCupom: 0,
  shopeeAds: 0,
  shopeeFrete: 0,
});
assert.strictEqual(shopee.fixed, 7);
near(shopee.variable, 10);
near(shopee.total, 17);

const custom = core.platformCharge(100, { taxaPlat: 'custom_plat', customPlatVal: 12.5 });
near(custom.total, 12.5);

const priced = core.priceForMargin(100, 0.4, 0.06, { taxaPlat: '0' });
assert.ok(priced > 100);

const result = core.calculateProjectCosts({
  printer: {
    valor_maq: 3000,
    vida_util: 5,
    horas_dia: 8,
    consumo_w: 120,
    tarifa_kwh: 0.85,
    custo_fixo: 0,
    projetos_mes: 20,
    manut_ano: 300,
    insumos_mes: 30,
    valor_hora: 25,
  },
  project: {
    material: '100',
    tempo_h: 4,
    tempo_m: 30,
    filamento_g: 100,
    pos_proc: 0.5,
    taxa_perda: 15,
    qtd_pecas: 1,
    embalagem: 1.5,
    emb_protecao: 0,
    emb_etiqueta: 0,
    emb_brinde: 0,
    frete: 0,
    outros: 0,
  },
  pricing: {
    impostos: 0,
    taxaPlat: '0',
  },
});

assert.ok(result.project.total > 0);
assert.ok(result.project.porPeca > 0);
assert.ok(result.machine.depH > 0);

console.log('calc-core: ok');
