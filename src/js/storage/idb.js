(() => {
  function openDB(dbName, dbVersion) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, dbVersion);
      request.onupgradeneeded = event => {
        const database = request.result;
        if(!database.objectStoreNames.contains('printers')) database.createObjectStore('printers', { keyPath:'id' });
        if(!database.objectStoreNames.contains('products')) database.createObjectStore('products', { keyPath:'id' });
        if(!database.objectStoreNames.contains('inventory')) database.createObjectStore('inventory', { keyPath:'productId' });
        if(event.oldVersion > 0 && event.oldVersion < 2) {
          const store = request.transaction.objectStore('printers');
          store.openCursor().onsuccess = cursorEvent => {
            const cursor = cursorEvent.target.result;
            if(!cursor) return;
            const printer = cursor.value;
            delete printer.preco_fil_kg;
            cursor.update(printer);
            cursor.continue();
          };
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function storeAction(db, store, mode, action) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, mode);
      const request = action(tx.objectStore(store));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  const api = {
    openDB,
    storeAction,
    dbAll: (db, store) => storeAction(db, store, 'readonly', s => s.getAll()),
    dbGet: (db, store, id) => storeAction(db, store, 'readonly', s => s.get(id)),
    dbPut: (db, store, value) => storeAction(db, store, 'readwrite', s => s.put(value)),
    dbDelete: (db, store, id) => storeAction(db, store, 'readwrite', s => s.delete(id)),
    dbClear: (db, store) => storeAction(db, store, 'readwrite', s => s.clear()),
  };

  if(typeof window !== 'undefined') Object.assign(window, api);
  if(typeof module !== 'undefined' && module.exports) module.exports = api;
})();
