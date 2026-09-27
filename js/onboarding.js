/* =========================================================
   ONBOARDING.JS — wizard de bienvenida
   ========================================================= */

(function () {
  const answers = { motivations: [], priorKnowledge: '', dailyGoalMinutes: null, name: '' };

  const STEPS = [
    {
      key: 'motivations', type: 'multi', eyebrow: 'Paso 1 de 4',
      title: "¿Por qué querés aprender guaraní?",
      options: [
        { value: 'cultura', emoji: '🇵🇾', label: 'Quiero conocer más mi cultura' },
        { value: 'familia', emoji: '🗣️', label: 'Quiero hablar con familiares' },
        { value: 'trabajo', emoji: '💼', label: 'Quiero usarlo en el trabajo' },
        { value: 'alguien', emoji: '❤️', label: 'Quiero aprender por alguien especial' },
        { value: 'idioma', emoji: '🎓', label: 'Quiero aprender un nuevo idioma' },
        { value: 'curiosidad', emoji: '🌎', label: 'Simplemente me interesa' },
      ],
    },
    {
      key: 'priorKnowledge', type: 'single', eyebrow: 'Paso 2 de 4',
      title: '¿Cuánto guaraní sabés?',
      options: [
        { value: 'nada', label: 'Nada' },
        { value: 'algunas', label: 'Algunas palabras' },
        { value: 'basico', label: 'Básico' },
        { value: 'conversar', label: 'Puedo mantener conversaciones' },
      ],
    },
    {
      key: 'dailyGoalMinutes', type: 'single', eyebrow: 'Paso 3 de 4',
      title: '¿Cuánto tiempo querés aprender por día?',
      options: [
        { value: 5, label: '5 minutos' },
        { value: 10, label: '10 minutos' },
        { value: 15, label: '15 minutos' },
        { value: 30, label: '30 minutos' },
      ],
    },
    {
      key: 'name', type: 'name', eyebrow: 'Paso 4 de 4',
      title: '¿Cómo te llamás?',
    },
    { key: 'summary', type: 'summary' },
  ];

  let stepIndex = 0;

  const root = document.getElementById('ob-step-root');
  const continueBtn = document.getElementById('ob-continue');
  const progressFill = document.getElementById('ob-progress-fill');
  const backBtn = document.getElementById('ob-back');
  const skipLink = document.getElementById('ob-skip');
  backBtn.innerHTML = icon('chevronLeft');

  function render() {
    const step = STEPS[stepIndex];
    progressFill.style.width = `${Math.round(((stepIndex) / (STEPS.length - 1)) * 100)}%`;
    backBtn.style.visibility = stepIndex === 0 ? 'hidden' : 'visible';
    skipLink.style.visibility = step.type === 'summary' ? 'hidden' : 'visible';

    if (step.type === 'multi' || step.type === 'single') {
      root.innerHTML = `
        <span class="eyebrow ob-step-eyebrow">${step.eyebrow}</span>
        <h1>${step.title}</h1>
        <div class="ob-choices" role="${step.type === 'multi' ? 'group' : 'radiogroup'}" aria-label="${step.title}">
          ${step.options.map(opt => `
            <button type="button" class="choice" data-value="${opt.value}">
              ${opt.emoji ? `<span class="choice-emoji">${opt.emoji}</span>` : ''}
              <span>${opt.label}</span>
            </button>`).join('')}
        </div>`;
      const current = answers[step.key];
      root.querySelectorAll('.choice').forEach(btn => {
        const raw = btn.dataset.value;
        const val = step.key === 'dailyGoalMinutes' ? Number(raw) : raw;
        const isSelected = step.type === 'multi' ? current.includes(val) : current === val;
        btn.classList.toggle('selected', isSelected);
        btn.setAttribute('aria-pressed', String(isSelected));
        btn.addEventListener('click', () => {
          if (step.type === 'multi') {
            const i = answers[step.key].indexOf(val);
            if (i >= 0) answers[step.key].splice(i, 1); else answers[step.key].push(val);
          } else {
            answers[step.key] = val;
          }
          render();
        });
      });
      updateContinueEnabled(step);
    } else if (step.type === 'name') {
      root.innerHTML = `
        <span class="eyebrow ob-step-eyebrow">${step.eyebrow}</span>
        <h1>${step.title}</h1>
        <div class="field ob-name-input">
          <input class="input" id="ob-name-field" type="text" placeholder="Tu nombre" maxlength="30" autocomplete="given-name" value="${answers.name}">
        </div>`;
      const input = document.getElementById('ob-name-field');
      input.addEventListener('input', () => { answers.name = input.value.trim(); updateContinueEnabled(step); });
      input.focus();
      updateContinueEnabled(step);
    } else if (step.type === 'summary') {
      root.innerHTML = `
        <div class="card card-pad-lg ob-summary-card">
          <div class="ob-summary-icon">${icon('spark')}</div>
          <span class="eyebrow">¡Listo, ${escapeHtmlOb(answers.name || 'che irũ')}!</span>
          <h1 style="margin-top:.5rem">Armamos tu plan para empezar</h1>
          <p class="text-soft">Objetivo diario: ${answers.dailyGoalMinutes} minutos. Empezamos por el Nivel 1 — Primeros pasos.</p>
        </div>`;
      continueBtn.textContent = 'Empezar a aprender';
      continueBtn.disabled = false;
    }
  }

  function updateContinueEnabled(step) {
    continueBtn.textContent = 'Continuar';
    if (step.type === 'multi') continueBtn.disabled = answers[step.key].length === 0;
    else if (step.type === 'single') continueBtn.disabled = answers[step.key] === '' || answers[step.key] === null;
    else if (step.type === 'name') continueBtn.disabled = answers.name.trim().length === 0;
  }

  function escapeHtmlOb(s) {
    return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  backBtn.addEventListener('click', () => { if (stepIndex > 0) { stepIndex--; render(); } });

  continueBtn.addEventListener('click', () => {
    const step = STEPS[stepIndex];
    if (step.type === 'summary') {
      const state = getState();
      state.motivations = answers.motivations;
      state.priorKnowledge = answers.priorKnowledge;
      state.dailyGoalMinutes = answers.dailyGoalMinutes;
      state.name = answers.name;
      state.onboardingDone = true;
      saveState(state);
      window.location.href = 'dashboard.html';
      return;
    }
    stepIndex++;
    render();
  });

  render();
})();
