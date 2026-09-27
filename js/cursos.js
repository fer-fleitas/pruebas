/* =========================================================
   CURSOS.JS — listado de niveles y lecciones
   ========================================================= */

(function () {
  const state = getState();
  const root = document.getElementById('courses-root');

  root.innerHTML = LEVELS.map((level, li) => {
    const unlocked = isLevelUnlocked(li, state);
    const doneCount = level.lessons.filter(l => state.lessonsCompleted.includes(l.id)).length;
    return `
      <section class="course-level">
        <div class="course-level-head">
          <div class="course-level-icon fi-${level.color}" data-icon="${level.icon}"></div>
          <div style="flex:1">
            <div style="display:flex;align-items:center;gap:.5rem;flex-wrap:wrap">
              <h2 style="font-size:1.15rem">Nivel ${level.id} · ${level.title}</h2>
              ${unlocked ? '' : `<span class="badge badge-locked">${icon('lock')} Bloqueado</span>`}
            </div>
            <p class="text-soft" style="font-size:.88rem">${level.subtitle}</p>
          </div>
          <span class="badge badge-neutral">${doneCount}/${level.lessons.length}</span>
        </div>
        <div class="lesson-list">
          ${level.lessons.map((lesson, i) => {
            const done = state.lessonsCompleted.includes(lesson.id);
            const lessonUnlocked = isLessonUnlocked(li, i, state);
            const isCurrent = !done && lessonUnlocked;
            const cls = done ? 'done' : (lessonUnlocked ? 'current' : 'locked');
            const bulletIcon = done ? icon('check') : (lessonUnlocked ? icon('play') : icon('lock'));
            const inner = `
              <div class="lesson-row-bullet">${bulletIcon}</div>
              <div class="lesson-row-meta">
                <h4>${lesson.title}</h4>
                <p>${lesson.vocabIds.length} frases · ${done ? 'Completada' : (lessonUnlocked ? 'Disponible' : 'Se desbloquea al completar la anterior')}</p>
              </div>
              ${lessonUnlocked ? `<span class="text-faint">${icon('chevronRight')}</span>` : ''}`;
            return lessonUnlocked
              ? `<a href="leccion.html?id=${lesson.id}" class="card lesson-row ${cls}">${inner}</a>`
              : `<div class="card lesson-row ${cls}">${inner}</div>`;
          }).join('')}
        </div>
      </section>`;
  }).join('');
  paintIcons(root);
})();
