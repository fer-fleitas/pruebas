/* =========================================================
   CULTURA.JS
   ========================================================= */

(function () {
  const grid = document.getElementById('culture-grid');
  grid.innerHTML = CULTURE_CARDS.map(c => `
    <div class="card card-hover culture-card">
      <div class="feature-icon fi-secondary" data-icon="${c.icon}"></div>
      <h3>${c.title}</h3>
      <p>${c.text}</p>
    </div>`).join('');
  paintIcons(grid);
})();
