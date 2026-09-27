/* =========================================================
   CONVERSAR.JS — Ñañe'ẽ
   ========================================================= */

(function () {
  const root = document.getElementById('conversar-root');

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function renderList() {
    const state = getState();
    root.innerHTML = `<div class="scenario-grid">${SCENARIOS.map(sc => {
      const done = state.scenariosCompleted.includes(sc.id);
      return `
      <button type="button" class="card card-hover scenario-card ${done ? 'done' : ''}" data-id="${sc.id}">
        <div class="feature-icon fi-secondary" data-icon="${sc.icon}"></div>
        <h3>${sc.title}</h3>
        <p>${sc.setting}</p>
        ${done ? `<span class="badge badge-success">${icon('check')} Completado</span>` : `<span class="badge badge-neutral">${sc.lines.length} intercambios</span>`}
      </button>`;
    }).join('')}</div>`;
    paintIcons(root);
    root.querySelectorAll('.scenario-card').forEach(card => {
      card.addEventListener('click', () => renderConversation(SCENARIOS.find(s => s.id === card.dataset.id)));
    });
  }

  function renderConversation(scenario) {
    let lineIndex = 0;
    const log = [];

    function renderShell() {
      root.innerHTML = `
        <div class="convo-shell">
          <button class="btn btn-ghost btn-sm" id="convo-back" style="margin-bottom:1rem">${icon('chevronLeft')} Escenarios</button>
          <div class="convo-setting">${scenario.setting}</div>
          <div class="convo-log" id="convo-log"></div>
          <div id="convo-current"></div>
        </div>`;
      document.getElementById('convo-back').addEventListener('click', renderList);
      renderLog();
      renderCurrentLine();
    }

    function renderLog() {
      const logEl = document.getElementById('convo-log');
      logEl.innerHTML = log.map(b => `
        <div class="convo-bubble ${b.who}">
          <div class="convo-bubble-gn">${b.gn}</div>
          <div class="convo-bubble-es">${b.es}</div>
        </div>`).join('');
    }

    function renderCurrentLine() {
      const wrap = document.getElementById('convo-current');
      if (lineIndex >= scenario.lines.length) { finish(); return; }
      const line = scenario.lines[lineIndex];
      const ordered = shuffle(line.options);
      wrap.innerHTML = `
        <div class="convo-bubble npc" style="margin-bottom:1rem">
          <div class="convo-bubble-gn">${line.npc}</div>
          <div class="convo-bubble-es">${line.npcEs}</div>
        </div>
        <div class="ob-choices">${ordered.map((o, i) => `<button type="button" class="choice" data-i="${i}">${o.text}</button>`).join('')}</div>`;

      wrap.querySelectorAll('.choice').forEach((btn, i) => {
        btn.addEventListener('click', () => {
          const opt = ordered[i];
          wrap.querySelectorAll('.choice').forEach((b2, i2) => {
            if (ordered[i2].correct) b2.classList.add('correct');
            else if (i2 === i) b2.classList.add('incorrect');
            b2.disabled = true;
          });
          opt.correct ? playCorrectSfx() : playWrongSfx();
          setTimeout(() => {
            log.push({ who: 'npc', gn: line.npc, es: line.npcEs });
            log.push({ who: 'user', gn: opt.text, es: VOCAB_BY_ID[opt.vocabId] ? VOCAB_BY_ID[opt.vocabId].es : '' });
            lineIndex++;
            renderLog();
            renderCurrentLine();
          }, 850);
        });
      });
    }

    function finish() {
      const s = getState();
      markScenarioComplete(s, scenario.id);
      addXp(s, 25);
      const newAch = checkNewAchievements(s);
      saveState(s);
      document.getElementById('convo-current').innerHTML = `
        <div class="card card-pad-lg convo-complete">
          <div style="width:72px;height:72px;border-radius:50%;background:var(--success-soft);color:var(--success);display:grid;place-items:center;margin:0 auto 1rem">${icon('check')}</div>
          <span class="eyebrow">Conversación completa</span>
          <h2 style="margin-top:.4rem">${scenario.title}</h2>
          <p class="text-soft" style="margin:.75rem 0 1.25rem">+25 XP</p>
          ${newAch.length ? `<p class="badge badge-accent" style="margin-bottom:1rem">${icon('trophy')} Nuevo logro: ${newAch[0].title}</p>` : ''}
          <button class="btn btn-primary" id="convo-finish-back">Ver más escenarios</button>
        </div>`;
      document.getElementById('convo-finish-back').addEventListener('click', renderList);
    }

    renderShell();
  }

  renderList();
})();
