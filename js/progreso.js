/* =========================================================
   PROGRESO.JS
   ========================================================= */

(function () {
  const state = getState();
  const lvl = getLevelInfo(state.xp);

  document.getElementById('prog-ring').style.setProperty('--pct', lvl.pct);
  document.getElementById('prog-ring-label').textContent = lvl.label;
  document.getElementById('prog-xp-label').textContent = lvl.next
    ? `${lvl.xp} XP · ${lvl.next.min - lvl.xp} XP para el próximo nivel`
    : `${lvl.xp} XP · ¡Nivel máximo alcanzado!`;

  const overall = getOverallLessonProgress(state);
  document.getElementById('prog-lessons-text').textContent = `${overall.done} / ${overall.total}`;
  document.getElementById('prog-lessons-fill').style.width = `${overall.pct}%`;

  const breakdown = document.getElementById('prog-level-breakdown');
  breakdown.innerHTML = LEVELS.map(level => {
    const done = level.lessons.filter(l => state.lessonsCompleted.includes(l.id)).length;
    const pct = Math.round((done / level.lessons.length) * 100);
    return `
      <div style="margin-bottom:.6rem">
        <div style="display:flex;justify-content:space-between;font-size:.78rem;font-weight:700;margin-bottom:.25rem">
          <span class="text-soft">Nivel ${level.id} · ${level.title}</span><span class="text-faint">${done}/${level.lessons.length}</span>
        </div>
        <div class="progress progress-sm"><div class="progress-fill" style="width:${pct}%"></div></div>
      </div>`;
  }).join('');

  document.getElementById('prog-week-row').innerHTML = getWeeklyActivity(state)
    .map(d => `<span class="weekday-pill ${d.active ? 'active' : ''}">${d.label}</span>`).join('');

  document.getElementById('prog-known').textContent = state.wordsLearned.length;
  document.getElementById('prog-practice').textContent = state.wordsToPractice.length;
  document.getElementById('prog-scenarios').textContent = state.scenariosCompleted.length;
  document.getElementById('prog-achv').textContent = `${state.achievementsUnlocked.length}/${ACHIEVEMENTS.length}`;
})();
