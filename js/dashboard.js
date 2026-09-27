/* =========================================================
   DASHBOARD.JS — Inicio
   ========================================================= */

(function () {
  if (!getState().onboardingDone) {
    window.location.href = 'onboarding.html';
    return;
  }
  const state = getState();

  const greetName = state.name ? state.name : 'che irũ';
  document.getElementById('dash-greeting').textContent = `¡Mba'éichapa, ${greetName}!`;

  const goalSeconds = state.dailyGoalMinutes * 60;
  const remaining = Math.max(0, Math.ceil((goalSeconds - state.secondsToday) / 60));
  const subEl = document.getElementById('dash-subgreeting');
  if (state.secondsToday >= goalSeconds) {
    subEl.textContent = '¡Ya cumpliste tu objetivo de hoy! Iporãite.';
  } else if (state.secondsToday > 0) {
    subEl.textContent = `Hoy te faltan ${remaining} minutos para completar tu objetivo.`;
  } else {
    subEl.textContent = `Tu objetivo de hoy: ${state.dailyGoalMinutes} minutos. ¡Arrancamos?`;
  }

  const levelInfo = getLevelInfo(state.xp);
  document.getElementById('dash-ring').style.setProperty('--pct', levelInfo.pct);
  document.getElementById('dash-ring-label').textContent = levelInfo.label;

  document.getElementById('stat-streak').textContent = state.streak;
  document.getElementById('stat-words').textContent = state.wordsLearned.length;
  document.getElementById('stat-lessons').textContent = state.lessonsCompleted.length;
  document.getElementById('stat-minutes').textContent = state.minutesToday;

  // Próxima lección recomendada
  const nextRoot = document.getElementById('dash-next-lesson');
  const next = getNextLesson(state);
  if (next) {
    nextRoot.innerHTML = `
      <div class="next-lesson-icon">${icon('book')}</div>
      <div class="next-lesson-meta">
        <span class="badge badge-primary">Nivel ${next.level.id} · ${next.level.title}</span>
        <h3 style="margin-top:.4rem">${next.lesson.title}</h3>
        <p>Seguí donde quedaste</p>
      </div>
      <a href="leccion.html?id=${next.lesson.id}" class="btn btn-primary">Continuar</a>`;
  } else {
    nextRoot.innerHTML = `
      <div class="next-lesson-icon">${icon('trophy')}</div>
      <div class="next-lesson-meta"><h3>¡Completaste todas las lecciones!</h3><p>Segui practicando en Ñañe'ẽ o Vocabulario</p></div>`;
  }

  // Objetivo diario
  const goalPct = Math.min(100, Math.round((state.secondsToday / goalSeconds) * 100));
  document.getElementById('dash-goal-fill').style.width = `${goalPct}%`;
  document.getElementById('dash-goal-text').textContent = `${state.minutesToday} / ${state.dailyGoalMinutes} min`;
  const weekRow = document.getElementById('dash-week-row');
  weekRow.innerHTML = getWeeklyActivity(state).map(d => `<span class="weekday-pill ${d.active ? 'active' : ''}">${d.label}</span>`).join('');

  // Frase del día
  const phrase = getPhraseOfDay();
  document.getElementById('dash-phrase-gn').textContent = phrase.gn;
  document.getElementById('dash-phrase-es').textContent = phrase.es;
  const phraseAudioBtn = document.getElementById('dash-phrase-audio');
  phraseAudioBtn.prepend(document.createRange().createContextualFragment(icon('volume')));
  phraseAudioBtn.addEventListener('click', () => {
    phraseAudioBtn.classList.add('is-playing');
    speak(phrase.gn, { onEnd: () => phraseAudioBtn.classList.remove('is-playing') });
  });
  document.getElementById('dash-phrase-learn').addEventListener('click', () => {
    const s = getState();
    recordWordStatus(s, phrase.id, true);
    checkNewAchievements(s);
    saveState(s);
    showToast(`"${phrase.gn}" agregada a tus palabras aprendidas.`, 'success');
  });
})();
