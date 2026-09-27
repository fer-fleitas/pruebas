/* =========================================================
   CHROME — header superior + bottom nav compartidos.
   Se inyectan en <div id="topnav-root"> y <div id="bottomnav-root">
   presentes en cada página, para no duplicar markup a mano.
   ========================================================= */

const NAV_ITEMS = [
  { key: 'inicio', label: 'Inicio', href: 'dashboard.html', icon: 'home', bottom: true },
  { key: 'aprender', label: 'Aprender', href: 'cursos.html', icon: 'book', bottom: true },
  { key: 'practicar', label: 'Practicar', href: 'pronunciacion.html', icon: 'mic', bottom: true },
  { key: 'vocabulario', label: 'Vocabulario', href: 'vocabulario.html', icon: 'star', bottom: false },
  { key: 'conversar', label: 'Conversar', href: 'conversar.html', icon: 'chat', bottom: true },
  { key: 'cultura', label: 'Cultura', href: 'cultura.html', icon: 'flag', bottom: false },
  { key: 'perfil', label: 'Perfil', href: 'perfil.html', icon: 'user', bottom: true },
];

function renderChrome(activeKey) {
  const topRoot = document.getElementById('topnav-root');
  const bottomRoot = document.getElementById('bottomnav-root');
  const state = getState();

  if (topRoot) {
    const links = NAV_ITEMS.filter(i => i.key !== 'inicio' && i.key !== 'perfil')
      .map(i => `<a href="${i.href}" class="${i.key === activeKey ? 'active' : ''}">${i.label}</a>`).join('');
    topRoot.innerHTML = `
      <header class="topnav">
        <div class="topnav-inner">
          <a href="dashboard.html" class="brand">
            <span class="brand-mark">Ñ</span>
            <span>Guaraní · Alfon</span>
          </a>
          <nav class="topnav-links" aria-label="Navegación principal">${links}</nav>
          <div class="topnav-actions">
            <a href="diccionario.html" class="icon-btn" aria-label="Diccionario" title="Diccionario">${icon('search')}</a>
            <span class="streak-pill" id="chrome-streak" title="Racha de días aprendiendo">${icon('flame')}<span></span></span>
            <button class="icon-btn" id="chrome-theme-toggle" aria-label="Cambiar tema" title="Cambiar tema"></button>
            <a href="perfil.html" class="avatar" aria-label="Tu perfil" title="Perfil"><span id="chrome-avatar-initial">A</span></a>
          </div>
        </div>
      </header>`;
  }

  if (bottomRoot) {
    const items = NAV_ITEMS.filter(i => i.bottom).map(i => `
      <a href="${i.href}" class="${i.key === activeKey ? 'active' : ''}">
        ${icon(i.icon)}<span>${i.label}</span>
      </a>`).join('');
    bottomRoot.innerHTML = `<nav class="bottomnav" aria-label="Navegación móvil">${items}</nav>`;
  }

  updateChromeStats(state);
  wireThemeToggle();
}

function updateChromeStats(state) {
  const streakEl = document.querySelector('#chrome-streak span');
  if (streakEl) streakEl.textContent = state.streak;
  const initialEl = document.getElementById('chrome-avatar-initial');
  if (initialEl) initialEl.textContent = (state.name || 'A').trim().charAt(0).toUpperCase() || 'A';
}

function wireThemeToggle() {
  const btn = document.getElementById('chrome-theme-toggle');
  if (!btn) return;
  const paint = () => { btn.innerHTML = effectiveThemeIsDark() ? icon('sun') : icon('moon'); };
  paint();
  btn.addEventListener('click', () => {
    const state = getState();
    state.theme = effectiveThemeIsDark() ? 'light' : 'dark';
    saveState(state);
    applyTheme(state.theme);
    paint();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  if (page) renderChrome(page);
});
