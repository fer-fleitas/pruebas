/* =========================================================
   LANDING.JS — interactividad de index.html
   ========================================================= */

(function () {
  const state = getState();

  // Si ya hizo onboarding, "Empezar a aprender" va directo al dashboard.
  if (state.onboardingDone) {
    document.querySelectorAll('#cta-empezar, .lp-final-card a.btn-primary').forEach(a => {
      a.href = 'dashboard.html';
      a.textContent = 'Seguir aprendiendo';
    });
  }

  // Tema (toggle en header de landing)
  const themeBtn = document.getElementById('lp-theme-toggle');
  if (themeBtn) {
    const paint = () => { themeBtn.innerHTML = effectiveThemeIsDark() ? icon('sun') : icon('moon'); };
    paint();
    themeBtn.addEventListener('click', () => {
      const s = getState();
      s.theme = effectiveThemeIsDark() ? 'light' : 'dark';
      saveState(s);
      applyTheme(s.theme);
      paint();
    });
  }

  // Audio de la frase hero
  const heroAudioBtn = document.getElementById('hero-audio-btn');
  if (heroAudioBtn) {
    heroAudioBtn.innerHTML = icon('volume');
    heroAudioBtn.addEventListener('click', () => {
      heroAudioBtn.classList.add('is-playing');
      speak("Mba'éichapa reime", { onEnd: () => heroAudioBtn.classList.remove('is-playing') });
    });
  }

  // Iconos de features
  const fiMap = { 'fi-chat': 'chat', 'fi-mic': 'mic', 'fi-target': 'target', 'fi-flag': 'flag' };
  Object.entries(fiMap).forEach(([elId, iconName]) => {
    const el = document.getElementById(elId);
    if (el) el.innerHTML = icon(iconName);
  });

  // Flashcard demo (usa "Y" = Agua, ícono simple y confiable)
  const flashRoot = document.getElementById('lp-flash-demo');
  if (flashRoot) {
    const word = VOCAB_BY_ID['y'];
    flashRoot.innerHTML = `
      <span class="badge badge-secondary">Vocabulario</span>
      <div class="flash-word">${word.gn}</div>
      <div class="flash-es">💧 ${word.es}</div>
      <button class="audio-btn" id="lp-flash-audio">${icon('volume')}<span>Escuchar</span></button>
      <div class="flash-actions">
        <button class="btn btn-ghost btn-sm">Necesito practicar</button>
        <button class="btn btn-soft btn-sm">Ya la sé</button>
      </div>`;
    document.getElementById('lp-flash-audio').addEventListener('click', (e) => {
      speak(word.gn);
    });
  }

  // Niveles (preview, todo desbloqueado visualmente salvo candado decorativo)
  const levelsGrid = document.getElementById('lp-levels-grid');
  if (levelsGrid) {
    levelsGrid.innerHTML = LEVELS.map((lvl, i) => `
      <div class="card card-hover level-card">
        <div class="feature-icon fi-${lvl.color === 'success' ? 'success' : lvl.color}">${icon(lvl.icon)}</div>
        <div>
          <div class="level-num">Nivel ${lvl.id}</div>
          <h3>${lvl.title}</h3>
          <p class="text-soft" style="font-size:.85rem">${lvl.subtitle}</p>
        </div>
        <span class="badge ${i === 0 ? 'badge-primary' : 'badge-neutral'}">${i === 0 ? `${lvl.lessons.length} lecciones` : icon('lock') + ' Se desbloquea'}</span>
      </div>`).join('');
  }

  // Cultura teaser
  const cultureRoot = document.getElementById('lp-culture-cards');
  if (cultureRoot) {
    cultureRoot.innerHTML = CULTURE_CARDS.slice(0, 3).map(c => `
      <div class="culture-mini-card">
        <div class="feature-icon fi-secondary">${icon(c.icon)}</div>
        <div><h4>${c.title}</h4><p>${c.text}</p></div>
      </div>`).join('');
  }
})();
