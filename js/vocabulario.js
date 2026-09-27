/* =========================================================
   VOCABULARIO.JS — tarjetas de repaso
   ========================================================= */

(function () {
  const CATEGORY_LABELS = {
    saludos: 'Saludos', cortesia: 'Cortesía', basicos: 'Básicos', presentaciones: 'Presentaciones',
    despedidas: 'Despedidas', compras: 'Compras', clima: 'Clima', vocabulario: 'Vocabulario',
    cultura: 'Cultura', familia: 'Familia', numeros: 'Números', colores: 'Colores',
  };

  let activeCat = 'all';
  let deck = [];
  let idx = 0;
  let flipped = false;

  const tabsEl = document.getElementById('vocab-tabs');
  const counterEl = document.getElementById('vocab-counter');
  const cardEl = document.getElementById('vocab-flashcard');
  const frontCat = document.getElementById('vocab-front-cat');
  const frontWord = document.getElementById('vocab-front-word');
  const frontAudio = document.getElementById('vocab-front-audio');
  const backTag = document.getElementById('vocab-back-tag');
  const backWord = document.getElementById('vocab-back-word');
  const backExample = document.getElementById('vocab-back-example');
  const practiceBtn = document.getElementById('vocab-practice');
  const knownBtn = document.getElementById('vocab-known');

  frontAudio.innerHTML = icon('volume');

  function buildTabs() {
    const cats = ['all', ...CATEGORIES];
    tabsEl.innerHTML = cats.map(c => `<button type="button" class="tab ${c === activeCat ? 'active' : ''}" data-c="${c}">${c === 'all' ? 'Todas' : (CATEGORY_LABELS[c] || c)}</button>`).join('');
    tabsEl.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => {
      activeCat = btn.dataset.c;
      buildTabs();
      buildDeck();
    }));
  }

  function buildDeck() {
    deck = activeCat === 'all' ? [...VOCAB] : VOCAB.filter(v => v.category === activeCat);
    idx = 0;
    render();
  }

  function render() {
    flipped = false;
    cardEl.classList.remove('flipped');
    const item = deck[idx];
    counterEl.textContent = `${idx + 1} / ${deck.length}`;
    frontCat.textContent = CATEGORY_LABELS[item.category] || item.category;
    frontWord.textContent = item.gn;
    backTag.textContent = item.es;
    backWord.textContent = item.es;
    backExample.textContent = item.example ? `"${item.example.gn}" — ${item.example.es}` : (item.note || '');
  }

  cardEl.addEventListener('click', (e) => {
    if (e.target.closest('#vocab-front-audio')) return;
    flipped = !flipped;
    cardEl.classList.toggle('flipped', flipped);
  });
  cardEl.setAttribute('tabindex', '0');
  cardEl.setAttribute('role', 'button');
  cardEl.setAttribute('aria-label', 'Tocar para ver traducción');
  cardEl.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cardEl.click(); } });

  frontAudio.addEventListener('click', (e) => {
    e.stopPropagation();
    speak(deck[idx].gn);
  });

  function next() {
    idx = (idx + 1) % deck.length;
    render();
  }

  practiceBtn.addEventListener('click', () => {
    const s = getState();
    recordWordStatus(s, deck[idx].id, false);
    saveState(s);
    next();
  });
  knownBtn.addEventListener('click', () => {
    const s = getState();
    recordWordStatus(s, deck[idx].id, true);
    checkNewAchievements(s);
    saveState(s);
    showToast('¡Iporã! Palabra marcada como aprendida.', 'success');
    next();
  });

  buildTabs();
  buildDeck();
})();
