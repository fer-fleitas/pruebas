/* =========================================================
   PRONUNCIACION.JS
   La evaluación es una simulación (sin reconocimiento de voz
   real): se arma la interfaz y el flujo completos para poder
   enchufar más adelante un motor real (MediaRecorder + STT)
   sin tocar el resto de la página — ver evaluatePronunciation().
   ========================================================= */

(function () {
  const PRACTICE_CATEGORIES = ['saludos', 'cortesia', 'despedidas', 'compras', 'clima', 'presentaciones', 'basicos'];
  const LIST = VOCAB.filter(v => PRACTICE_CATEGORIES.includes(v.category));

  const REGISTER_LABEL = { [REGISTER.STD]: 'Guaraní estándar', [REGISTER.COL]: 'Coloquial', [REGISTER.JOP]: 'Jopará' };

  let index = 0;

  const gnEl = document.getElementById('pron-gn');
  const esEl = document.getElementById('pron-es');
  const regEl = document.getElementById('pron-register');
  const counterEl = document.getElementById('pron-counter');
  const listenBtn = document.getElementById('pron-listen');
  const micBtn = document.getElementById('pron-mic');
  const resultEl = document.getElementById('pron-result');
  const prevBtn = document.getElementById('pron-prev');
  const nextBtn = document.getElementById('pron-next');

  micBtn.innerHTML = icon('mic');
  listenBtn.prepend(document.createRange().createContextualFragment(icon('volume')));

  function render() {
    const item = LIST[index];
    gnEl.textContent = item.gn;
    esEl.textContent = item.es;
    regEl.textContent = REGISTER_LABEL[item.register] || item.register;
    counterEl.textContent = `${index + 1} / ${LIST.length}`;
    resultEl.innerHTML = '';
    prevBtn.disabled = index === 0;
  }

  function evaluatePronunciation() {
    // Simulación: 80% de probabilidad de "muy bien". Arquitectura lista
    // para reemplazar por un puntaje real de un motor de voz.
    return new Promise(resolve => setTimeout(() => resolve(Math.random() < 0.8 ? 'good' : 'retry'), 700));
  }

  listenBtn.addEventListener('click', () => {
    listenBtn.classList.add('is-playing');
    speak(LIST[index].gn, { onEnd: () => listenBtn.classList.remove('is-playing') });
  });

  let recording = false;
  async function recordOnce() {
    if (recording) return;
    recording = true;
    micBtn.classList.add('recording');
    resultEl.innerHTML = `<span class="text-soft">Escuchando...</span>`;
    await new Promise(r => setTimeout(r, 1100));
    micBtn.classList.remove('recording');
    resultEl.innerHTML = `<span class="text-soft">Analizando...</span>`;
    const result = await evaluatePronunciation();
    if (result === 'good') {
      resultEl.innerHTML = `<span class="pron-result-badge good">${icon('check')} ¡Muy bien!</span>`;
      playCorrectSfx();
      const state = getState();
      recordWordStatus(state, LIST[index].id, true);
      state.phrasesPracticed = [...new Set([...state.phrasesPracticed, LIST[index].id])];
      addXp(state, 5);
      checkNewAchievements(state);
      saveState(state);
    } else {
      resultEl.innerHTML = `<span class="pron-result-badge retry">${icon('refresh')} Probá nuevamente</span>`;
    }
    recording = false;
  }
  micBtn.addEventListener('click', recordOnce);

  prevBtn.addEventListener('click', () => { if (index > 0) { index--; render(); } });
  nextBtn.addEventListener('click', () => { index = (index + 1) % LIST.length; render(); });

  render();
})();
