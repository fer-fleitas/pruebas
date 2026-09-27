/* =========================================================
   LESSON.JS — motor de lección interactiva
   Tipos de ejercicio (rotan para que no sea monótono):
   - choose-translation: elegir la traducción correcta
   - listen-choose: escuchar audio y elegir el significado
   - order-phrase: ordenar las palabras de una frase corta
   ========================================================= */

(function () {
  const params = new URLSearchParams(window.location.search);
  const lessonId = params.get('id') || 'l1-1';
  const found = findLessonById(lessonId) || findLessonById('l1-1');
  const { level, lesson } = found;

  const startedAt = Date.now();
  let stepIndex = 0;
  let correctCount = 0;
  let combo = 0;
  let answered = false;
  const learnedThisLesson = new Set();

  const cardRoot = document.getElementById('lesson-card-root');
  const progressFill = document.getElementById('lesson-progress-fill');
  const livesEl = document.getElementById('lesson-lives');
  const feedbackBar = document.getElementById('lesson-feedback-bar');
  const feedbackTitle = document.getElementById('lesson-feedback-title');
  const feedbackDetail = document.getElementById('lesson-feedback-detail');
  const continueBtn = document.getElementById('lesson-continue-btn');
  const exitBtn = document.getElementById('lesson-exit');
  exitBtn.innerHTML = icon('x');
  exitBtn.addEventListener('click', () => {
    if (window.history.length > 1) window.history.back(); else window.location.href = 'cursos.html';
  });

  function pickDistractors(correct, field, count) {
    const pool = VOCAB.filter(v => v.id !== correct.id && v[field] !== correct[field]);
    const sameCat = pool.filter(v => v.category === correct.category);
    const rest = pool.filter(v => v.category !== correct.category);
    const shuffled = [...shuffle(sameCat), ...shuffle(rest)];
    const out = [];
    const seen = new Set([correct[field]]);
    for (const v of shuffled) {
      if (out.length >= count) break;
      if (seen.has(v[field])) continue;
      seen.add(v[field]);
      out.push(v);
    }
    return out;
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const KINDS = ['choose-translation-gn', 'listen-choose', 'order-phrase', 'choose-translation-es'];
  function buildSteps() {
    return lesson.vocabIds.map((vocabId, i) => {
      const vocab = VOCAB_BY_ID[vocabId];
      const hasMultipleWords = vocab.gn.trim().split(/\s+/).length >= 2 && vocab.gn.trim().split(/\s+/).length <= 5;
      let kind = KINDS[i % KINDS.length];
      if (kind === 'order-phrase' && !hasMultipleWords) kind = 'choose-translation-gn';
      return { vocab, kind };
    });
  }

  const steps = buildSteps();

  function updateProgress() {
    progressFill.style.width = `${Math.round((stepIndex / steps.length) * 100)}%`;
    livesEl.innerHTML = `${icon('flame')}<span>${combo}</span>`;
  }

  function renderStep() {
    answered = false;
    feedbackBar.classList.remove('show', 'correct', 'incorrect');
    const step = steps[stepIndex];
    const { vocab, kind } = step;
    updateProgress();

    if (kind === 'choose-translation-gn') {
      const distractors = pickDistractors(vocab, 'gn', 2);
      const options = shuffle([{ text: vocab.gn, correct: true }, ...distractors.map(d => ({ text: d.gn, correct: false }))]);
      cardRoot.innerHTML = `
        <div class="lesson-eyebrow"><span class="badge badge-primary">Nivel ${level.id}</span><span class="text-faint">${stepIndex + 1} / ${steps.length}</span></div>
        <h2 class="lesson-prompt">¿Cómo se dice "${vocab.es}"?</h2>
        <div class="ob-choices" id="lesson-options"></div>`;
      renderOptions(options, vocab.gn, () => `${vocab.gn} = ${vocab.es}`);
    } else if (kind === 'choose-translation-es') {
      const distractors = pickDistractors(vocab, 'es', 2);
      const options = shuffle([{ text: vocab.es, correct: true }, ...distractors.map(d => ({ text: d.es, correct: false }))]);
      cardRoot.innerHTML = `
        <div class="lesson-eyebrow"><span class="badge badge-primary">Nivel ${level.id}</span><span class="text-faint">${stepIndex + 1} / ${steps.length}</span></div>
        <h2 class="lesson-prompt">¿Qué significa "${vocab.gn}"?</h2>
        <div class="lesson-audio-row"><button class="audio-btn-icon" id="lesson-word-audio">${icon('volume')}</button></div>
        <div class="ob-choices" id="lesson-options"></div>`;
      document.getElementById('lesson-word-audio').addEventListener('click', (e) => speak(vocab.gn));
      renderOptions(options, vocab.es, () => `${vocab.gn} = ${vocab.es}`);
    } else if (kind === 'listen-choose') {
      const distractors = pickDistractors(vocab, 'es', 2);
      const options = shuffle([{ text: vocab.es, correct: true }, ...distractors.map(d => ({ text: d.es, correct: false }))]);
      cardRoot.innerHTML = `
        <div class="lesson-eyebrow"><span class="badge badge-secondary">Nivel ${level.id}</span><span class="text-faint">${stepIndex + 1} / ${steps.length}</span></div>
        <h2 class="lesson-prompt">Escuchá y elegí la traducción</h2>
        <div class="lesson-audio-row"><button class="audio-btn-icon" id="lesson-word-audio">${icon('volume')}</button></div>
        <div class="ob-choices" id="lesson-options"></div>`;
      const audioBtn = document.getElementById('lesson-word-audio');
      audioBtn.addEventListener('click', () => speak(vocab.gn));
      setTimeout(() => speak(vocab.gn), 350);
      renderOptions(options, vocab.es, () => `${vocab.gn} = ${vocab.es}`);
    } else if (kind === 'order-phrase') {
      const tokens = shuffle(vocab.gn.trim().split(/\s+/));
      cardRoot.innerHTML = `
        <div class="lesson-eyebrow"><span class="badge badge-accent">Nivel ${level.id}</span><span class="text-faint">${stepIndex + 1} / ${steps.length}</span></div>
        <h2 class="lesson-prompt">Ordená la frase</h2>
        <p class="text-soft" style="text-align:center;margin-bottom:1rem">"${vocab.es}"</p>
        <div class="order-tokens-target" id="order-target" aria-label="Tu respuesta"></div>
        <div class="order-tokens-bank" id="order-bank"></div>
        <div style="display:flex;justify-content:center;margin-top:1.5rem">
          <button class="btn btn-primary" id="order-check" disabled>Comprobar</button>
        </div>`;
      const target = document.getElementById('order-target');
      const bank = document.getElementById('order-bank');
      const checkBtn = document.getElementById('order-check');
      const placed = [];
      function renderBank() {
        bank.innerHTML = tokens.map((t, i) => `<button type="button" class="token-chip" data-i="${i}">${t}</button>`).join('');
        bank.querySelectorAll('.token-chip').forEach(btn => {
          btn.addEventListener('click', () => {
            const i = Number(btn.dataset.i);
            placed.push(tokens[i]);
            btn.classList.add('placed');
            renderTarget();
          });
        });
      }
      function renderTarget() {
        target.innerHTML = placed.map(t => `<span class="token-chip">${t}</span>`).join('') || '<span class="text-faint" style="font-size:.85rem">Tocá las palabras en orden</span>';
        checkBtn.disabled = placed.length !== tokens.length;
      }
      renderBank();
      renderTarget();
      checkBtn.addEventListener('click', () => {
        const isCorrect = placed.join(' ') === vocab.gn.trim();
        handleAnswerResult(isCorrect, () => `${vocab.gn} = ${vocab.es}`);
      });
    }
  }

  function renderOptions(options, correctText, detailFn) {
    const optWrap = document.getElementById('lesson-options');
    optWrap.innerHTML = options.map(o => `<button type="button" class="choice" data-text="${encodeURIComponent(o.text)}">${o.text}</button>`).join('');
    optWrap.querySelectorAll('.choice').forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered) return;
        const text = decodeURIComponent(btn.dataset.text);
        const isCorrect = text === correctText;
        optWrap.querySelectorAll('.choice').forEach(b => {
          const bText = decodeURIComponent(b.dataset.text);
          if (bText === correctText) b.classList.add('correct');
          else if (b === btn) b.classList.add('incorrect');
          b.disabled = true;
        });
        handleAnswerResult(isCorrect, detailFn);
      });
    });
  }

  function handleAnswerResult(isCorrect, detailFn) {
    if (answered) return;
    answered = true;
    const vocab = steps[stepIndex].vocab;
    if (isCorrect) {
      correctCount++;
      combo++;
      learnedThisLesson.add(vocab.id);
      feedbackBar.classList.add('show', 'correct');
      feedbackTitle.innerHTML = `${icon('check')} ¡Correcto!`;
      feedbackDetail.textContent = detailFn();
      playCorrectSfx();
    } else {
      combo = 0;
      feedbackBar.classList.add('show', 'incorrect');
      feedbackTitle.innerHTML = `${icon('x')} Probá nuevamente`;
      feedbackDetail.textContent = detailFn();
      playWrongSfx();
    }
    updateProgress();
    continueBtn.focus();
  }

  continueBtn.addEventListener('click', () => {
    stepIndex++;
    if (stepIndex >= steps.length) {
      finishLesson();
    } else {
      renderStep();
    }
  });

  function finishLesson() {
    progressFill.style.width = '100%';
    feedbackBar.classList.remove('show');
    const total = steps.length;
    const xpEarned = correctCount * 10 + (correctCount === total ? 20 : 0);
    const elapsedSeconds = Math.round((Date.now() - startedAt) / 1000);

    const state = getState();
    markLessonComplete(state, lesson.id);
    addXp(state, xpEarned);
    addStudySeconds(state, elapsedSeconds);
    learnedThisLesson.forEach(id => recordWordStatus(state, id, true));
    const newAchievements = checkNewAchievements(state);
    saveState(state);

    cardRoot.innerHTML = `
      <div class="card card-pad-lg lesson-complete">
        <div class="big-check">${icon('check')}</div>
        <span class="eyebrow">Lección completada</span>
        <h1 style="margin-top:.4rem">${lesson.title}</h1>
        <div class="lesson-complete-stats">
          <div class="lesson-complete-stat"><div class="v">${correctCount}/${total}</div><div class="l">Correctas</div></div>
          <div class="lesson-complete-stat"><div class="v">+${xpEarned}</div><div class="l">XP</div></div>
        </div>
        ${newAchievements.length ? `<p class="badge badge-accent" style="margin-bottom:1rem">${icon('trophy')} Nuevo logro: ${newAchievements[0].title}</p>` : ''}
        <div style="display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap">
          <a href="cursos.html" class="btn btn-ghost">Volver a Aprender</a>
          <a href="dashboard.html" class="btn btn-primary">Ir al inicio</a>
        </div>
      </div>`;
  }

  renderStep();
})();
