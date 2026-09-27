/* =========================================================
   CONTENT-HELPERS — utilidades sobre LEVELS/lecciones que
   comparten dashboard, cursos y progreso.
   ========================================================= */

function flatLessons() {
  const out = [];
  LEVELS.forEach(level => level.lessons.forEach(lesson => out.push({ level, lesson })));
  return out;
}

function isLevelUnlocked(levelIndex, state) {
  if (levelIndex === 0) return true;
  const prev = LEVELS[levelIndex - 1];
  return prev.lessons.every(l => state.lessonsCompleted.includes(l.id));
}

function isLessonUnlocked(levelIndex, lessonIndex, state) {
  if (!isLevelUnlocked(levelIndex, state)) return false;
  if (lessonIndex === 0) return true;
  const prevLesson = LEVELS[levelIndex].lessons[lessonIndex - 1];
  return state.lessonsCompleted.includes(prevLesson.id);
}

function getNextLesson(state) {
  for (let li = 0; li < LEVELS.length; li++) {
    const level = LEVELS[li];
    for (let i = 0; i < level.lessons.length; i++) {
      const lesson = level.lessons[i];
      if (!state.lessonsCompleted.includes(lesson.id) && isLessonUnlocked(li, i, state)) {
        return { level, lesson, levelIndex: li, lessonIndex: i };
      }
    }
  }
  return null;
}

function findLessonById(lessonId) {
  for (const level of LEVELS) {
    const lesson = level.lessons.find(l => l.id === lessonId);
    if (lesson) return { level, lesson };
  }
  return null;
}

function getOverallLessonProgress(state) {
  const total = flatLessons().length;
  const done = state.lessonsCompleted.length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

function getWeeklyActivity(state) {
  // Aproximación simple: los últimos 7 días, marcando "hoy" activo si ya
  // hubo actividad, y días previos según si la racha los cubre.
  const days = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  const today = new Date();
  const out = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    const isToday = i === 0;
    const active = i < state.streak || (isToday && state.secondsToday > 0);
    out.push({ label: days[d.getDay()], active, isToday });
  }
  return out;
}
