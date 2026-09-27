/* =========================================================
   PERFIL.JS
   ========================================================= */

(function () {
  const state = getState();

  document.getElementById('profile-name').textContent = state.name || 'Che irũ';
  document.getElementById('profile-avatar').textContent = (state.name || 'A').charAt(0).toUpperCase();
  const lvl = getLevelInfo(state.xp);
  document.getElementById('profile-level-label').textContent = `Nivel ${lvl.label} · ${lvl.name}`;

  document.getElementById('p-streak').textContent = state.streak;
  document.getElementById('p-words').textContent = state.wordsLearned.length;
  document.getElementById('p-phrases').textContent = state.phrasesPracticed.length;
  document.getElementById('p-time').textContent = formatMinutes(state.secondsStudiedTotal);

  const achvGrid = document.getElementById('achv-grid');
  achvGrid.innerHTML = ACHIEVEMENTS.map(a => {
    const unlocked = state.achievementsUnlocked.includes(a.id);
    return `
      <div class="card achv-card ${unlocked ? '' : 'locked'}">
        <div class="achv-icon" data-icon="${unlocked ? a.icon : 'lock'}"></div>
        <h4>${a.title}</h4>
        <p>${a.desc}</p>
      </div>`;
  }).join('');
  paintIcons(achvGrid);

  const goalSelect = document.getElementById('p-goal-select');
  goalSelect.value = String(state.dailyGoalMinutes);
  goalSelect.addEventListener('change', () => {
    const s = getState();
    s.dailyGoalMinutes = Number(goalSelect.value);
    saveState(s);
    showToast('Objetivo diario actualizado.', 'success');
  });

  const themeSelect = document.getElementById('p-theme-select');
  themeSelect.value = state.theme;
  themeSelect.addEventListener('change', () => {
    const s = getState();
    s.theme = themeSelect.value;
    saveState(s);
    applyTheme(s.theme);
  });

  const soundToggle = document.getElementById('p-sound-toggle');
  soundToggle.checked = state.soundOn;
  soundToggle.addEventListener('change', () => {
    const s = getState();
    s.soundOn = soundToggle.checked;
    saveState(s);
  });

  const notifToggle = document.getElementById('p-notif-toggle');
  notifToggle.checked = state.notificationsOn;
  notifToggle.addEventListener('change', () => {
    const s = getState();
    s.notificationsOn = notifToggle.checked;
    saveState(s);
    showToast(notifToggle.checked ? 'Notificaciones activadas.' : 'Notificaciones desactivadas.', '');
  });

  document.getElementById('p-reset').addEventListener('click', () => {
    if (confirm('¿Seguro que querés reiniciar todo tu progreso? Esta acción no se puede deshacer.')) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.href = 'onboarding.html';
    }
  });
})();
