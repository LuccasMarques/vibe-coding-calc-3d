(() => {
  function uid() {
    return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
  }
  function toast(message) {
    const el = document.getElementById('toast');
    el.textContent = message; el.classList.add('show');
    clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 2400);
  }
  function valuesFrom(ids) { return Object.fromEntries(ids.map(id => [id, document.getElementById(id).value])); }
  function applyValues(values, ids) { ids.forEach(id => { if(values[id] !== undefined) document.getElementById(id).value = values[id]; }); }
  function moneyFrom(id) {
    const text = document.getElementById(id).textContent.replace('R$','').trim().replace(/\./g,'').replace(',','.');
    return parseFloat(text) || 0;
  }

  const api = Object.freeze({ uid, toast, valuesFrom, applyValues, moneyFrom });
  if(typeof window !== 'undefined') Object.assign(window, api);
  if(typeof module !== 'undefined' && module.exports) module.exports = api;
})();
