(() => {
  const STOCK_MOVEMENTS = Object.freeze({
    entry: 1,
    sale: -1,
    reserve: 0,
    release: 0,
    adjustment: null,
  });

  function normalizeQuantity(value) {
    const number = Number(value);
    if(!Number.isFinite(number)) return 0;
    return Math.max(0, Math.round(number));
  }

  function normalizeStockRecord(record = {}) {
    const quantity = normalizeQuantity(record.quantityOnHand ?? record.quantity ?? 0);
    const reserved = normalizeQuantity(record.reservedQuantity ?? record.reserved ?? 0);
    const minimum = normalizeQuantity(record.minimumStock ?? record.minimum ?? 0);
    return {
      productId: String(record.productId || ''),
      quantityOnHand: quantity,
      reservedQuantity: Math.min(reserved, quantity),
      minimumStock: minimum,
      location: String(record.location || '').trim(),
      notes: String(record.notes || '').trim(),
      updatedAt: record.updatedAt || '',
    };
  }

  function summarizeStock(record = {}) {
    const stock = normalizeStockRecord(record);
    const available = Math.max(stock.quantityOnHand - stock.reservedQuantity, 0);
    return {
      ...stock,
      availableQuantity: available,
      isInStock: stock.quantityOnHand > 0,
      isReadyForDelivery: available > 0,
      isLowStock: stock.minimumStock > 0 && available <= stock.minimumStock,
      hasReservationOverflow: stock.reservedQuantity > stock.quantityOnHand,
    };
  }

  function applyStockMovement(record = {}, movement = {}) {
    const current = normalizeStockRecord(record);
    const type = String(movement.type || '');
    const amount = normalizeQuantity(movement.amount ?? 0);
    const next = { ...current };

    if(type === 'entry') next.quantityOnHand += amount;
    if(type === 'sale') next.quantityOnHand = Math.max(0, next.quantityOnHand - amount);
    if(type === 'reserve') next.reservedQuantity = Math.min(next.quantityOnHand, next.reservedQuantity + amount);
    if(type === 'release') next.reservedQuantity = Math.max(0, next.reservedQuantity - amount);
    if(type === 'adjustment') {
      const target = normalizeQuantity(movement.quantity ?? next.quantityOnHand);
      next.quantityOnHand = target;
      next.reservedQuantity = Math.min(next.reservedQuantity, next.quantityOnHand);
    }

    next.updatedAt = movement.updatedAt || new Date().toISOString();
    return summarizeStock(next);
  }

  function stockBadgeLabel(record = {}) {
    const stock = summarizeStock(record);
    if(stock.quantityOnHand <= 0) return 'Sem estoque';
    if(stock.isLowStock) return 'Estoque baixo';
    if(stock.isReadyForDelivery) return 'Pronta entrega';
    return 'Sem disponibilidade';
  }

  const api = Object.freeze({
    STOCK_MOVEMENTS,
    normalizeQuantity,
    normalizeStockRecord,
    summarizeStock,
    applyStockMovement,
    stockBadgeLabel,
  });

  if(typeof window !== 'undefined') window.CALC3D_INVENTORY = api;
  if(typeof module !== 'undefined' && module.exports) module.exports = api;
})();
