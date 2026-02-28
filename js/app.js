/**
 * app.js - Main renderer for TechClever
 */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await Data.init();
    await I18n.init();
  } catch (e) { console.error('Init failed:', e); return; }

  const page = detectPage();
  renderPage(page);

  document.addEventListener('tc-lang-change', () => renderPage(detectPage()));
});

/* ========== PAGE DETECTION ========== */
function detectPage() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('games')) return 'games';
  if (path.includes('ai')) return 'ai';
  if (path.includes('productivity')) return 'productivity';
  if (path.includes('dev')) return 'dev';
  if (path.includes('hardware')) return 'hardware';
  if (path.includes('platform')) return 'platforms';
  return 'index';
}

function renderPage(page) {
  const renderers = {
    'index': renderIndex,
    'games': renderGames,
    'ai': renderAI,
    'dev': renderDev,
    'productivity': renderProductivity,
    'hardware': renderHardware,
    'platforms': renderPlatforms
  };
  if (renderers[page]) renderers[page]();
}

/* ========== HELPERS ========== */
function _t(key) { return I18n.t(key); }
function _loc(obj) { return I18n.getLocalizedText(obj); }

function _backLink() {
  return `<a href="index.html" class="back-link">\u2190 ${_t('detail.back')}</a>`;
}

function _genreColor(genreId) {
  const g = Data.getGameGenres().find(x => x.id === genreId);
  return g ? g.color : '#7C3AED';
}

function _genreIcon(genreId) {
  const g = Data.getGameGenres().find(x => x.id === genreId);
  return g ? g.icon : '';
}

/* ========== GAME CARD ========== */
function _gameCardHtml(game) {
  const color = _genreColor(game.genre);
  return `<div class="game-card" style="border-left-color:${color}">
    <div class="game-card-header">
      <span class="game-card-icon">${_genreIcon(game.genre)}</span>
      <div>
        <div class="game-card-title">${game.title}</div>
        <div class="game-card-meta">${game.year} \u00b7 ${game.developer}</div>
      </div>
    </div>
    <div class="game-card-platform"><strong>${_t('games.platform')}:</strong> ${game.platform}</div>
    <div class="game-card-desc">${_loc(game.description)}</div>
    <div class="game-card-why">
      <strong>${_t('games.why_play')}:</strong> ${_loc(game.why_play)}
    </div>
    <div class="game-card-tags">${(game.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</div>
  </div>`;
}

/* ========== AI CARD ========== */
function _aiCardHtml(tool) {
  return `<div class="ai-card">
    <div class="ai-card-header">
      <div class="ai-card-title">${tool.name}</div>
      <div class="ai-card-meta">${_t('ai.pricing')}: <span class="pricing-badge">${tool.pricing}</span></div>
    </div>
    <div class="ai-card-desc">${_loc(tool.description)}</div>
    <div class="ai-card-best"><strong>${_t('ai.best_for')}:</strong> ${_loc(tool.best_for)}</div>
    <div class="ai-card-tags">${(tool.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</div>
    ${tool.url ? `<div style="text-align:right;margin-top:0.75rem"><a href="${tool.url}" target="_blank" rel="noopener" class="btn btn-visit">${_t('ai.visit')} \u2192</a></div>` : ''}
  </div>`;
}

/* ========== DEV CARD ========== */
function _devCardHtml(res) {
  const diffClass = (res.difficulty || '').toLowerCase().replace(/\s+/g, '-');
  return `<div class="dev-card">
    <div class="dev-card-header">
      <div class="dev-card-title">${res.name}</div>
      <div class="dev-card-meta">
        ${res.difficulty ? `<span class="difficulty-badge difficulty-${diffClass}">${_t('dev.difficulty')}: ${res.difficulty}</span>` : ''}
      </div>
    </div>
    <div class="dev-card-desc">${_loc(res.description)}</div>
    <div class="dev-card-best"><strong>${_t('dev.best_for')}:</strong> ${_loc(res.best_for)}</div>
    <div class="dev-card-tags">${(res.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</div>
    ${res.url ? `<div style="text-align:right;margin-top:0.75rem"><a href="${res.url}" target="_blank" rel="noopener" class="btn btn-visit">${_t('dev.visit')} \u2192</a></div>` : ''}
  </div>`;
}

/* ========== PRODUCTIVITY CARD ========== */
function _prodCardHtml(tool) {
  return `<div class="prod-card">
    <div class="prod-card-header">
      <div class="prod-card-title">${tool.name}</div>
      <div class="prod-card-meta">
        <span class="pricing-badge">${tool.pricing}</span>
        ${tool.platforms ? ` \u00b7 ${tool.platforms}` : ''}
      </div>
    </div>
    <div class="prod-card-desc">${_loc(tool.description)}</div>
    <div class="prod-card-best"><strong>${_t('productivity.best_for')}:</strong> ${_loc(tool.best_for)}</div>
    <div class="prod-card-tags">${(tool.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</div>
    ${tool.url ? `<div style="text-align:right;margin-top:0.75rem"><a href="${tool.url}" target="_blank" rel="noopener" class="btn btn-visit">${_t('productivity.visit')} \u2192</a></div>` : ''}
  </div>`;
}

/* ========== HARDWARE CARD ========== */
function _hwCardHtml(item) {
  return `<div class="hw-card">
    <div class="hw-card-header">
      <div class="hw-card-title">${item.name}</div>
      <div class="hw-card-meta">${_t('hardware.price_range')}: <strong>${item.price_range}</strong></div>
    </div>
    <div class="hw-card-use-case"><strong>${_t('hardware.use_case')}:</strong> ${item.use_case}</div>
    <div class="hw-card-specs"><strong>${_t('hardware.key_specs')}:</strong> ${_loc(item.key_specs)}</div>
    <div class="hw-card-desc">${_loc(item.description)}</div>
    <div class="hw-card-why">
      <strong>${_t('hardware.why_buy')}:</strong> ${_loc(item.why_buy)}
    </div>
    <div class="hw-card-tags">${(item.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</div>
  </div>`;
}

/* ========== RENDER: INDEX ========== */
function renderIndex() {
  const heroStats = document.getElementById('hero-stats');
  if (heroStats) {
    heroStats.textContent = _t('hero.stats')
      .replace('{games}', Data.getGames().length)
      .replace('{ai}', Data.getAI().length)
      .replace('{dev}', Data.getDev().length);
  }

  /* Game of the Day */
  const gameSection = document.getElementById('game-of-day-box');
  if (gameSection) {
    const games = Data.getGames();
    if (games.length) {
      const dayIdx = Math.floor(Date.now() / 86400000) % games.length;
      const game = games[dayIdx];
      gameSection.innerHTML = `<div class="daily-game-box">
        <div class="home-section-header">
          <h2>${_t('index.game_of_day')}</h2>
          <a href="games.html">${_t('index.see_all_games')} \u2192</a>
        </div>
        ${_gameCardHtml(game)}
      </div>`;
    }
  }

  /* AI Tool Spotlight */
  const aiSection = document.getElementById('ai-spotlight-box');
  if (aiSection) {
    const tools = Data.getAI();
    if (tools.length) {
      const dayIdx = Math.floor(Date.now() / 86400000) % tools.length;
      const tool = tools[dayIdx];
      aiSection.innerHTML = `<div class="daily-ai-box">
        <div class="home-section-header">
          <h2>${_t('index.ai_spotlight')}</h2>
          <a href="ai.html">${_t('index.see_all_ai')} \u2192</a>
        </div>
        ${_aiCardHtml(tool)}
      </div>`;
    }
  }

  /* Dev Pick of the Day */
  const devSection = document.getElementById('dev-pick-box');
  if (devSection) {
    const resources = Data.getDev();
    if (resources.length) {
      const dayIdx = Math.floor(Date.now() / 86400000) % resources.length;
      const res = resources[dayIdx];
      devSection.innerHTML = `<div class="daily-dev-box">
        <div class="home-section-header">
          <h2>${_t('index.dev_pick')}</h2>
          <a href="dev.html">${_t('index.see_all_dev')} \u2192</a>
        </div>
        ${_devCardHtml(res)}
      </div>`;
    }
  }

  /* Productivity Pick */
  const prodSection = document.getElementById('prod-pick-box');
  if (prodSection) {
    const tools = Data.getProductivity();
    if (tools.length) {
      const dayIdx = Math.floor(Date.now() / 86400000) % tools.length;
      const tool = tools[dayIdx];
      prodSection.innerHTML = `<div class="daily-prod-box">
        <div class="home-section-header">
          <h2>${_t('index.prod_pick')}</h2>
          <a href="productivity.html">${_t('index.see_all_prod')} \u2192</a>
        </div>
        ${_prodCardHtml(tool)}
      </div>`;
    }
  }
}

/* ========== RENDER: GAMES ========== */
function renderGames() {
  const el = document.getElementById('games-content');
  if (!el) return;

  const genres = Data.getGameGenres();
  let activeFilter = 'all';

  function render() {
    const games = activeFilter === 'all' ? Data.getGames() : Data.getGamesByGenre(activeFilter);

    el.innerHTML = `
      ${_backLink()}
      <h1>${_t('games.title')}</h1>
      <p class="section-subtitle">${_t('games.subtitle')}</p>

      <div class="filter-bar">
        <button class="btn ${activeFilter === 'all' ? 'btn-primary' : ''}" data-filter="all">${_t('games.filter_all')}</button>
        ${genres.map(g => `<button class="btn ${activeFilter === g.id ? 'btn-primary' : ''}" data-filter="${g.id}" style="${activeFilter === g.id ? 'background:'+g.color+';border-color:'+g.color : ''}">${g.icon} ${_t(g.name_key)}</button>`).join('')}
      </div>

      <div class="game-grid">
        ${games.map(g => _gameCardHtml(g)).join('')}
      </div>

      ${games.length === 0 ? '<p style="text-align:center;color:var(--text-gray);margin:2rem 0">No games in this genre yet.</p>' : ''}
    `;

    el.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.filter;
        render();
      });
    });
  }

  render();
}

/* ========== RENDER: AI ========== */
function renderAI() {
  const el = document.getElementById('ai-content');
  if (!el) return;

  const categories = Data.getAICategories();
  let activeFilter = 'all';

  function render() {
    const tools = activeFilter === 'all' ? Data.getAI() : Data.getAIByCategory(activeFilter);

    el.innerHTML = `
      ${_backLink()}
      <h1>${_t('ai.title')}</h1>
      <p class="section-subtitle">${_t('ai.subtitle')}</p>

      <div class="filter-bar">
        <button class="btn ${activeFilter === 'all' ? 'btn-primary' : ''}" data-filter="all">${_t('ai.filter_all')}</button>
        ${categories.map(c => `<button class="btn ${activeFilter === c.id ? 'btn-primary' : ''}" data-filter="${c.id}">${c.icon} ${_t(c.name_key)}</button>`).join('')}
      </div>

      <div class="ai-grid">
        ${tools.map(t => _aiCardHtml(t)).join('')}
      </div>

      ${tools.length === 0 ? '<p style="text-align:center;color:var(--text-gray);margin:2rem 0">No tools in this category yet.</p>' : ''}
    `;

    el.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.filter;
        render();
      });
    });
  }

  render();
}

/* ========== RENDER: DEV ========== */
function renderDev() {
  const el = document.getElementById('dev-content');
  if (!el) return;

  const categories = Data.getDevCategories();
  let activeFilter = 'all';

  function render() {
    const resources = activeFilter === 'all' ? Data.getDev() : Data.getDevByCategory(activeFilter);

    el.innerHTML = `
      ${_backLink()}
      <h1>${_t('dev.title')}</h1>
      <p class="section-subtitle">${_t('dev.subtitle')}</p>

      <div class="filter-bar">
        <button class="btn ${activeFilter === 'all' ? 'btn-primary' : ''}" data-filter="all">${_t('dev.filter_all')}</button>
        ${categories.map(c => `<button class="btn ${activeFilter === c.id ? 'btn-primary' : ''}" data-filter="${c.id}">${c.icon} ${_t(c.name_key)}</button>`).join('')}
      </div>

      <div class="dev-grid">
        ${resources.map(r => _devCardHtml(r)).join('')}
      </div>

      ${resources.length === 0 ? '<p style="text-align:center;color:var(--text-gray);margin:2rem 0">No resources in this category yet.</p>' : ''}
    `;

    el.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.filter;
        render();
      });
    });
  }

  render();
}

/* ========== RENDER: PRODUCTIVITY ========== */
function renderProductivity() {
  const el = document.getElementById('productivity-content');
  if (!el) return;

  const categories = Data.getProductivityCategories();
  let activeFilter = 'all';

  function render() {
    const tools = activeFilter === 'all' ? Data.getProductivity() : Data.getProductivityByCategory(activeFilter);

    el.innerHTML = `
      ${_backLink()}
      <h1>${_t('productivity.title')}</h1>
      <p class="section-subtitle">${_t('productivity.subtitle')}</p>

      <div class="filter-bar">
        <button class="btn ${activeFilter === 'all' ? 'btn-primary' : ''}" data-filter="all">${_t('productivity.filter_all')}</button>
        ${categories.map(c => `<button class="btn ${activeFilter === c.id ? 'btn-primary' : ''}" data-filter="${c.id}">${c.icon} ${_t(c.name_key)}</button>`).join('')}
      </div>

      <div class="prod-grid">
        ${tools.map(t => _prodCardHtml(t)).join('')}
      </div>

      ${tools.length === 0 ? '<p style="text-align:center;color:var(--text-gray);margin:2rem 0">No tools in this category yet.</p>' : ''}
    `;

    el.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.filter;
        render();
      });
    });
  }

  render();
}

/* ========== RENDER: HARDWARE ========== */
function renderHardware() {
  const el = document.getElementById('hardware-content');
  if (!el) return;

  const categories = Data.getHardwareCategories();
  let activeFilter = 'all';

  function render() {
    const items = activeFilter === 'all' ? Data.getHardware() : Data.getHardwareByCategory(activeFilter);

    el.innerHTML = `
      ${_backLink()}
      <h1>${_t('hardware.title')}</h1>
      <p class="section-subtitle">${_t('hardware.subtitle')}</p>

      <div class="filter-bar">
        <button class="btn ${activeFilter === 'all' ? 'btn-primary' : ''}" data-filter="all">${_t('hardware.filter_all')}</button>
        ${categories.map(c => `<button class="btn ${activeFilter === c.id ? 'btn-primary' : ''}" data-filter="${c.id}">${c.icon} ${_t(c.name_key)}</button>`).join('')}
      </div>

      <div class="hw-grid">
        ${items.map(i => _hwCardHtml(i)).join('')}
      </div>

      ${items.length === 0 ? '<p style="text-align:center;color:var(--text-gray);margin:2rem 0">No items in this category yet.</p>' : ''}
    `;

    el.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.filter;
        render();
      });
    });
  }

  render();
}

/* ========== RENDER: PLATFORMS ========== */
function renderPlatforms() {
  const el = document.getElementById('platforms-content');
  if (!el) return;

  const platforms = Data.getPlatforms();
  const types = [...new Set(platforms.map(p => p.type))];
  let activeFilter = 'all';

  function render() {
    const items = activeFilter === 'all' ? platforms : Data.getPlatformsByType(activeFilter);

    el.innerHTML = `
      ${_backLink()}
      <h1>${_t('platforms.title')}</h1>
      <p class="section-subtitle">${_t('platforms.subtitle')}</p>

      <div class="filter-bar">
        <button class="btn ${activeFilter === 'all' ? 'btn-primary' : ''}" data-filter="all">${_t('platforms.filter_all')}</button>
        ${types.map(t => `<button class="btn ${activeFilter === t ? 'btn-primary' : ''}" data-filter="${t}">${t}</button>`).join('')}
      </div>

      <div class="timeline">
        ${items.map(p => `<div class="timeline-item">
          <div class="timeline-year">${p.year}</div>
          <div class="timeline-card">
            <div class="timeline-card-header">
              <div class="timeline-card-title">${p.name}</div>
              <div class="timeline-card-meta">${p.company} \u00b7 ${p.type}</div>
            </div>
            <div class="timeline-card-desc">${_loc(p.description)}</div>
            <div class="timeline-card-significance">
              <strong>${_t('platforms.significance')}:</strong> ${_loc(p.significance)}
            </div>
            <div class="timeline-card-tags">${(p.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</div>
          </div>
        </div>`).join('')}
      </div>
    `;

    el.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.filter;
        render();
      });
    });
  }

  render();
}
