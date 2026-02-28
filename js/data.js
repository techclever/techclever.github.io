/**
 * data.js - Data loader and cache for TechClever
 */
const Data = (() => {
  let _games = null;
  let _ai = null;
  let _dev = null;
  let _productivity = null;
  let _hardware = null;
  let _platforms = null;
  let _os = null;
  let _osHistory = null;
  let _quiz = null;

  async function _load(url) {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Failed to load ${url}: ${resp.status}`);
    return resp.json();
  }

  async function _loadSafe(url) {
    try { return await _load(url); } catch(e) { console.warn('Optional data not loaded:', url); return null; }
  }

  async function init() {
    if (!_games) {
      const [games, ai, dev, productivity, hardware, platforms, osData, quizData] = await Promise.all([
        _load('data/games.json'),
        _loadSafe('data/ai.json'),
        _loadSafe('data/dev.json'),
        _loadSafe('data/productivity.json'),
        _loadSafe('data/hardware.json'),
        _loadSafe('data/platforms.json'),
        _loadSafe('data/os.json'),
        _loadSafe('data/quiz.json')
      ]);
      _games = games;
      _ai = ai;
      _dev = dev;
      _productivity = productivity;
      _hardware = hardware;
      _platforms = platforms;
      if (osData) { _os = osData.os || []; _osHistory = osData.history || []; }
      _quiz = quizData;
    }
  }

  /* Games */
  function getGames() { return (_games || []).slice().sort((a, b) => b.year - a.year); }
  function getGamesByGenre(genre) { return getGames().filter(g => g.genre === genre); }
  function getGameGenres() {
    return [
      { id: 'rpg', icon: '\u2694\ufe0f', color: '#DC2626', name_key: 'genre.rpg' },
      { id: 'strategy', icon: '\u265f\ufe0f', color: '#2563EB', name_key: 'genre.strategy' },
      { id: 'fps', icon: '\ud83c\udfaf', color: '#EA580C', name_key: 'genre.fps' },
      { id: 'indie', icon: '\ud83c\udfa8', color: '#7C3AED', name_key: 'genre.indie' },
      { id: 'puzzle', icon: '\ud83e\udde9', color: '#0891B2', name_key: 'genre.puzzle' },
      { id: 'action', icon: '\ud83d\udde1\ufe0f', color: '#059669', name_key: 'genre.action' }
    ];
  }

  /* AI Tools */
  function getAI() { return _ai || []; }
  function getAIByCategory(cat) { return getAI().filter(a => a.category === cat); }
  function getAICategories() {
    return [
      { id: 'text', icon: '\ud83d\udcac', name_key: 'ai_cat.text' },
      { id: 'image', icon: '\ud83c\udfa8', name_key: 'ai_cat.image' },
      { id: 'code', icon: '\ud83d\udcbb', name_key: 'ai_cat.code' },
      { id: 'audio', icon: '\ud83c\udfb5', name_key: 'ai_cat.audio' },
      { id: 'video', icon: '\ud83c\udfac', name_key: 'ai_cat.video' },
      { id: 'productivity-ai', icon: '\u26a1', name_key: 'ai_cat.productivity-ai' }
    ];
  }

  /* Dev Resources */
  function getDev() { return _dev || []; }
  function getDevByCategory(cat) { return getDev().filter(d => d.category === cat); }
  function getDevCategories() {
    return [
      { id: 'languages', icon: '\ud83d\udcdd', name_key: 'dev_cat.languages' },
      { id: 'frameworks', icon: '\ud83c\udfd7\ufe0f', name_key: 'dev_cat.frameworks' },
      { id: 'ides', icon: '\ud83d\udda5\ufe0f', name_key: 'dev_cat.ides' },
      { id: 'devops', icon: '\u2601\ufe0f', name_key: 'dev_cat.devops' },
      { id: 'databases', icon: '\ud83d\uddc4\ufe0f', name_key: 'dev_cat.databases' },
      { id: 'learning', icon: '\ud83d\udcda', name_key: 'dev_cat.learning' }
    ];
  }

  /* Productivity */
  function getProductivity() { return _productivity || []; }
  function getProductivityByCategory(cat) { return getProductivity().filter(p => p.category === cat); }
  function getProductivityCategories() {
    return [
      { id: 'notes', icon: '\ud83d\udcd2', name_key: 'prod_cat.notes' },
      { id: 'project', icon: '\ud83d\udccb', name_key: 'prod_cat.project' },
      { id: 'communication', icon: '\ud83d\udcac', name_key: 'prod_cat.communication' },
      { id: 'design', icon: '\ud83c\udfa8', name_key: 'prod_cat.design' },
      { id: 'automation', icon: '\u2699\ufe0f', name_key: 'prod_cat.automation' },
      { id: 'cloud', icon: '\u2601\ufe0f', name_key: 'prod_cat.cloud' }
    ];
  }

  /* Hardware */
  function getHardware() { return _hardware || []; }
  function getHardwareByCategory(cat) { return getHardware().filter(h => h.category === cat); }
  function getHardwareCategories() {
    return [
      { id: 'laptops', icon: '\ud83d\udcbb', name_key: 'hw_cat.laptops' },
      { id: 'desktops', icon: '\ud83d\udda5\ufe0f', name_key: 'hw_cat.desktops' },
      { id: 'components', icon: '\ud83d\udd27', name_key: 'hw_cat.components' },
      { id: 'monitors', icon: '\ud83d\uddb5', name_key: 'hw_cat.monitors' },
      { id: 'peripherals', icon: '\u2328\ufe0f', name_key: 'hw_cat.peripherals' },
      { id: 'networking', icon: '\ud83d\udce1', name_key: 'hw_cat.networking' }
    ];
  }

  /* Platforms */
  function getPlatforms() { return (_platforms || []).slice().sort((a, b) => a.year - b.year); }
  function getPlatformsByType(type) { return getPlatforms().filter(p => p.type === type); }

  /* Operating Systems */
  function getOS() { return (_os || []).slice(); }
  function getOSByCategory(cat) { return getOS().filter(o => o.category === cat); }
  function getOSCategories() {
    return [
      { id: 'desktop', icon: '\uD83D\uDCBB', color: '#2563EB', name_key: 'os_cat.desktop' },
      { id: 'mobile', icon: '\uD83D\uDCF1', color: '#059669', name_key: 'os_cat.mobile' },
      { id: 'server', icon: '\uD83D\uDDA5\uFE0F', color: '#DC2626', name_key: 'os_cat.server' }
    ];
  }
  function getOSHistory() { return (_osHistory || []).slice().sort((a, b) => a.year - b.year); }

  /* Quiz */
  function getQuiz() { return (_quiz || []).slice(); }
  function getQuizByCategory(cat) { return getQuiz().filter(q => q.category === cat); }
  function getQuizCategories() {
    return [
      { id: 'games', icon: '\uD83C\uDFAE', name_key: 'nav.games' },
      { id: 'ai', icon: '\uD83E\uDD16', name_key: 'nav.ai' },
      { id: 'dev', icon: '\uD83D\uDCBB', name_key: 'nav.dev' },
      { id: 'hardware', icon: '\uD83D\uDD27', name_key: 'nav.hardware' },
      { id: 'os', icon: '\uD83D\uDDA5\uFE0F', name_key: 'nav.os' },
      { id: 'general', icon: '\uD83C\uDF10', name_key: 'quiz.cat_general' }
    ];
  }

  return {
    init,
    getGames, getGamesByGenre, getGameGenres,
    getAI, getAIByCategory, getAICategories,
    getDev, getDevByCategory, getDevCategories,
    getProductivity, getProductivityByCategory, getProductivityCategories,
    getHardware, getHardwareByCategory, getHardwareCategories,
    getPlatforms, getPlatformsByType,
    getOS, getOSByCategory, getOSCategories, getOSHistory,
    getQuiz, getQuizByCategory, getQuizCategories
  };
})();
