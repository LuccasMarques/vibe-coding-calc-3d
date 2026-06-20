const assert = require('assert');
const inventory = require('../src/js/inventory-core');

const normalized = inventory.normalizeStockRecord({
  productId: 'abc',
  quantity: '7',
  reserved: '3',
  minimum: '2',
});

assert.strictEqual(normalized.quantityOnHand, 7);
assert.strictEqual(normalized.reservedQuantity, 3);
assert.strictEqual(normalized.minimumStock, 2);

const summary = inventory.summarizeStock(normalized);
assert.strictEqual(summary.availableQuantity, 4);
assert.strictEqual(summary.isReadyForDelivery, true);
assert.strictEqual(summary.isLowStock, false);

const afterEntry = inventory.applyStockMovement(normalized, { type: 'entry', amount: 5 });
assert.strictEqual(afterEntry.quantityOnHand, 12);
assert.strictEqual(afterEntry.availableQuantity, 9);

const afterSale = inventory.applyStockMovement(afterEntry, { type: 'sale', amount: 2 });
assert.strictEqual(afterSale.quantityOnHand, 10);

const afterReserve = inventory.applyStockMovement(afterSale, { type: 'reserve', amount: 6 });
assert.strictEqual(afterReserve.reservedQuantity, 9);
assert.strictEqual(afterReserve.availableQuantity, 1);
assert.strictEqual(inventory.stockBadgeLabel(afterReserve), 'Estoque baixo');

console.log('inventory-core: ok');
