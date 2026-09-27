/* =========================================================
   STATE — progreso del usuario en localStorage, XP/racha,
   logros, tema, audio (TTS de pronunciación) y toasts.
   Todo vive en un único objeto serializado, sin backend.
   ========================================================= */

const STORAGE_KEY = 'guarani_alfon_state_v1';

const XP_PER_LEVEL_LABEL = [
  { min: 0, label: 'A1', name: 'Principiante' },
  { min: 300, label: 'A1', name: 'Principiante avanzado' },
  { min: 700, label: 'A2', name: 'Elemental' },
  { min: 1400, label: 'B1', name: 'Intermedio' },
  { min: 2400, label: 'B2', name: 'Intermedio avanzado' },
];

function defaultState() {
  return {
    onboardingDone: false,
    name: '',
    motivations: [],
    priorKnowledge: '',
    dailyGoalMinutes: 10,
    xp: 0,
    streak: 0,
    lastActiveDate: null,
    minutesToday: 0,
    secondsToday: 0,
    secondsStudiedTotal: 0,
    wordsLearned: [],
    wordsToPractice: [],
    phrasesPracticed: [],
    lessonsCompleted: [],
    scenariosCompleted: [],
    achievementsUnlocked: [],
    theme: 'system',
    soundOn: true,
    notificationsOn: true,
    lastGameoverMessage: '',
  };
}

function getState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed };
  } catch (e) {
    return defaultState();
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) { /* almacenamiento no disponible: se sigue sin persistir */ }
  return state;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

/* Marca actividad de hoy y actualiza la racha. Se llama una
   vez por sesión de práctica real (no solo por navegar). */
function touchActivity(state) {
  const today = todayStr();
  if (state.lastActiveDate === today) return state;
  const yest = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (state.lastActiveDate === yest) {
    state.streak += 1;
  } else {
    state.streak = 1;
  }
  state.lastActiveDate = today;
  state.minutesToday = 0;
  state.secondsToday = 0;
  return state;
}

function addStudySeconds(state, seconds) {
  touchActivity(state);
  state.secondsToday += seconds;
  state.secondsStudiedTotal += seconds;
  state.minutesToday = Math.floor(state.secondsToday / 60);
  return state;
}

function addXp(state, amount) {
  touchActivity(state);
  state.xp = Math.max(0, state.xp + amount);
  return state;
}

function getLevelInfo(xp) {
  let current = XP_PER_LEVEL_LABEL[0];
  let next = XP_PER_LEVEL_LABEL[1] || null;
  for (let i = 0; i < XP_PER_LEVEL_LABEL.length; i++) {
    if (xp >= XP_PER_LEVEL_LABEL[i].min) {
      current = XP_PER_LEVEL_LABEL[i];
      next = XP_PER_LEVEL_LABEL[i + 1] || null;
    }
  }
  const pct = next ? Math.min(100, Math.round(((xp - current.min) / (next.min - current.min)) * 100)) : 100;
  return { ...current, next, pct, xp };
}

function recordWordStatus(state, vocabId, known) {
  state.wordsLearned = state.wordsLearned.filter(id => id !== vocabId);
  state.wordsToPractice = state.wordsToPractice.filter(id => id !== vocabId);
  (known ? state.wordsLearned : state.wordsToPractice).push(vocabId);
  return state;
}

function markLessonComplete(state, lessonId) {
  if (!state.lessonsCompleted.includes(lessonId)) state.lessonsCompleted.push(lessonId);
  return state;
}

function markScenarioComplete(state, scenarioId) {
  if (!state.scenariosCompleted.includes(scenarioId)) state.scenariosCompleted.push(scenarioId);
  return state;
}

function checkNewAchievements(state) {
  const unlocked = [];
  ACHIEVEMENTS.forEach(a => {
    if (!state.achievementsUnlocked.includes(a.id) && a.check(state)) {
      state.achievementsUnlocked.push(a.id);
      unlocked.push(a);
    }
  });
  return unlocked;
}

/* ---------------- Tema (dark mode) ---------------- */
function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'dark' || theme === 'light') root.setAttribute('data-theme', theme);
  else root.removeAttribute('data-theme');
}

function initTheme() {
  const state = getState();
  applyTheme(state.theme);
}
initTheme();

function effectiveThemeIsDark() {
  const state = getState();
  if (state.theme === 'dark') return true;
  if (state.theme === 'light') return false;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/* ---------------- Audio de pronunciación ----------------
   No existen grabaciones nativas de guaraní en este prototipo.
   Se usa Web Speech API (síntesis del navegador) como
   aproximación de pronunciación, dejando la arquitectura lista
   para enchufar audios reales grabados por hablantes nativos
   más adelante (ver `AUDIO_SOURCE`). */
const AUDIO_SOURCE = 'tts-placeholder'; // 'tts-placeholder' | 'recorded' (futuro)

function pickVoice() {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  return voices.find(v => v.lang && v.lang.toLowerCase().startsWith('es-py'))
    || voices.find(v => v.lang && v.lang.toLowerCase().startsWith('es'))
    || voices[0] || null;
}

function speak(text, { onStart, onEnd } = {}) {
  if (!('speechSynthesis' in window)) {
    showToast('Tu navegador no soporta audio de pronunciación todavía.', 'error');
    onEnd && onEnd();
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voice = pickVoice();
    if (voice) utter.voice = voice;
    utter.lang = (voice && voice.lang) || 'es-ES';
    utter.rate = 0.86;
    utter.pitch = 1.02;
    utter.onstart = () => onStart && onStart();
    utter.onend = () => onEnd && onEnd();
    utter.onerror = () => onEnd && onEnd();
    window.speechSynthesis.speak(utter);
  } catch (e) {
    onEnd && onEnd();
  }
}

/* ---------------- SFX cortos (Web Audio API, sin archivos) ---------------- */
let _sfxCtx = null;
function getSfxContext() {
  if (!getState().soundOn) return null;
  if (!_sfxCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    _sfxCtx = new Ctx();
  }
  if (_sfxCtx.state === 'suspended') _sfxCtx.resume();
  return _sfxCtx;
}
function playTone(freq, duration, delay = 0, type = 'sine', gainPeak = 0.16) {
  const ctx = getSfxContext();
  if (!ctx) return;
  const t0 = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(gainPeak, t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}
function playCorrectSfx() { playTone(660, 0.12, 0); playTone(880, 0.16, 0.09); }
function playWrongSfx() { playTone(220, 0.22, 0, 'sawtooth', 0.1); }

/* ---------------- Toasts ---------------- */
function ensureToastStack() {
  let stack = document.querySelector('.toast-stack');
  if (!stack) {
    stack = document.createElement('div');
    stack.className = 'toast-stack';
    stack.setAttribute('aria-live', 'polite');
    document.body.appendChild(stack);
  }
  return stack;
}

function showToast(message, type = '') {
  const stack = ensureToastStack();
  const el = document.createElement('div');
  el.className = `toast ${type}`.trim();
  el.textContent = message;
  stack.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(6px)';
    el.style.transition = 'all .25s ease';
    setTimeout(() => el.remove(), 260);
  }, 2600);
}

function formatMinutes(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h} h ${m % 60} min`;
  return `${m} min`;
}
