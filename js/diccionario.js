/* =========================================================
   DICCIONARIO.JS — buscador
   ========================================================= */

(function () {
  const input = document.getElementById('dict-search');
  const resultsEl = document.getElementById('dict-results');

  function normalize(s) {
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/['’]/g, '');
  }

  function search(query) {
    const q = normalize(query);
    if (!q) return [];
    return VOCAB.filter(v => normalize(v.gn).includes(q) || normalize(v.es).includes(q)).slice(0, 12);
  }

  function relatedWords(item) {
    return VOCAB.filter(v => v.category === item.category && v.id !== item.id).slice(0, 6);
  }

  function renderDetail(item) {
    const related = relatedWords(item);
    return `
      <div class="card card-pad-lg">
        <div class="dict-result">
          <div style="flex:1">
            <div class="dict-word">${item.gn}</div>
            <div class="dict-tags">
              <span class="badge badge-neutral">${item.category}</span>
              <span class="badge badge-secondary">${item.register}</span>
            </div>
            <p style="font-size:1.05rem;font-weight:700">💧 ${item.es}</p>
            <p class="text-faint" style="font-size:.85rem;margin-top:.25rem">Pronunciación aproximada: ${item.pron}</p>
          </div>
          <button class="audio-btn-icon" data-audio="${item.id}" aria-label="Escuchar">${icon('volume')}</button>
        </div>
        ${item.example ? `
        <div class="dict-example">
          <p style="font-weight:700">"${item.example.gn}"</p>
          <p class="text-soft" style="font-size:.88rem">${item.example.es}</p>
        </div>` : ''}
        ${item.note ? `<p class="text-soft" style="font-size:.85rem;margin-top:.75rem">${item.note}</p>` : ''}
        ${related.length ? `
        <div class="dict-related">
          ${related.map(r => `<button type="button" class="dict-chip" data-goto="${r.id}">${r.gn}</button>`).join('')}
        </div>` : ''}
      </div>`;
  }

  function renderResultsList(items) {
    return `<div class="lesson-list">${items.map(v => `
      <button type="button" class="card lesson-row" data-goto="${v.id}" style="text-align:left;width:100%">
        <div class="lesson-row-bullet" style="background:var(--primary-soft);color:var(--primary-dark)">${icon('star')}</div>
        <div class="lesson-row-meta"><h4>${v.gn}</h4><p>${v.es}</p></div>
        <span class="text-faint">${icon('chevronRight')}</span>
      </button>`).join('')}</div>`;
  }

  function bindActions() {
    resultsEl.querySelectorAll('[data-goto]').forEach(el => el.addEventListener('click', () => showDetail(el.dataset.goto)));
    resultsEl.querySelectorAll('[data-audio]').forEach(el => el.addEventListener('click', () => speak(VOCAB_BY_ID[el.dataset.audio].gn)));
  }

  function showDetail(id) {
    resultsEl.innerHTML = `
      <button class="btn btn-ghost btn-sm" id="dict-back" style="margin-bottom:1rem">${icon('chevronLeft')} Volver</button>
      ${renderDetail(VOCAB_BY_ID[id])}`;
    document.getElementById('dict-back').addEventListener('click', () => { input.value = ''; renderEmpty(); input.focus(); });
    bindActions();
  }

  function renderEmpty() {
    const suggestions = ['y', 'aguyje', 'terere', 'mbaeichapa'].map(id => VOCAB_BY_ID[id]);
    resultsEl.innerHTML = `
      <p class="eyebrow" style="margin-bottom:.75rem">Probá buscando</p>
      ${renderResultsList(suggestions)}`;
    bindActions();
  }

  input.addEventListener('input', () => {
    const q = input.value.trim();
    if (!q) { renderEmpty(); return; }
    const results = search(q);
    if (!results.length) {
      resultsEl.innerHTML = `<div class="state-block"><div class="state-icon">${icon('search')}</div><p>No encontramos "${q}" todavía.</p></div>`;
      return;
    }
    resultsEl.innerHTML = renderResultsList(results);
    bindActions();
  });

  renderEmpty();
})();
