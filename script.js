// ===== GLOBAL STATE =====
const state = {
  currentSection: 'home',
  refCat: 'all',
  tut: { catId: null, lessonIdx: 0, done: new Set() },
  mission: { id: null, completed: new Set(), objDone: {} },
  missionCat: 'all',
};

let bash = null;

// ===== PROGRESS =====
const storage = {
  get: (k) => { try { return JSON.parse(localStorage.getItem('lp:' + k)); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem('lp:' + k, JSON.stringify(v)); } catch {} },
};

function loadProgress() {
  state.tut.done = new Set(storage.get('tut-done') || []);
  state.mission.completed = new Set(storage.get('missions-done') || []);
  updateProgress();
}
function saveProgress() {
  storage.set('tut-done', [...state.tut.done]);
  storage.set('missions-done', [...state.mission.completed]);
}
function updateProgress() {
  const total = EXERCISES.missions.length + TUTORIALS.reduce((s, c) => s + c.lessons.length, 0);
  const done = state.tut.done.size + state.mission.completed.size;
  document.getElementById('progress-text').textContent = `進度 ${done}/${total}`;
  document.getElementById('progress-fill').style.width = total ? (done / total * 100) + '%' : '0%';
}

// ===== SECTION NAVIGATION =====
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('section-' + id).classList.add('active');
  document.getElementById('nav-' + id).classList.add('active');
  state.currentSection = id;
  if (id === 'home') renderHome();
  if (id === 'reference') renderReference();
  if (id === 'tutorial') renderTutorialHome();
  if (id === 'terminal') initTerminal();
}

// ===== HOME =====
function renderHome() {
  // Hero terminal animation
  const termEl = document.getElementById('hero-term');
  if (termEl && !termEl.dataset.animated) {
    termEl.dataset.animated = '1';
    animateHeroTerm(termEl);
  }
  // Category grid
  const grid = document.getElementById('cat-grid');
  if (!grid.children.length) {
    grid.innerHTML = EXERCISES.categories.map(cat => {
      const missions = EXERCISES.missions.filter(m => m.cat === cat.id);
      const done = missions.filter(m => state.mission.completed.has(m.id)).length;
      return `<div class="cat-card" onclick="showSection('terminal'); setTimeout(()=>openMissionCat('${cat.id}'), 300)">
        <div class="cat-card-icon">${cat.icon}</div>
        <div class="cat-card-name">${cat.name}</div>
        <div class="cat-card-count">${done}/${missions.length} 完成</div>
      </div>`;
    }).join('');
  }
}

function animateHeroTerm(el) {
  const lines = [
    { type: 'prompt', text: 'ls design/logs/' },
    { type: 'out dim', text: 'sim.log  synth.log' },
    { type: 'prompt', text: 'grep "Error" design/logs/synth.log' },
    { type: 'out t-red', text: 'Error: Multiple drivers found on net \'bus_out[3]\'. (ELAB-399)' },
    { type: 'prompt', text: 'grep -c "Warning" design/logs/synth.log' },
    { type: 'out t-yellow', text: '5' },
    { type: 'prompt', text: 'awk \'/Total area/{print $NF}\' design/reports/area.rpt' },
    { type: 'out t-green', text: '858.010000' },
  ];
  let i = 0, html = '';
  const next = () => {
    if (i >= lines.length) return;
    const line = lines[i++];
    if (line.type.includes('prompt')) {
      html += `<div class="t-line"><span class="t-prompt">$ </span>${escHtml(line.text)}</div>`;
    } else {
      html += `<div class="t-line ${line.type}">${escHtml(line.text)}</div>`;
    }
    el.innerHTML = html + '<div class="t-line"><span class="t-cursor"></span></div>';
    setTimeout(next, 800);
  };
  next();
}

// ===== REFERENCE =====
function renderReference() {
  const catContainer = document.getElementById('ref-cats');
  if (!catContainer.children.length) {
    catContainer.innerHTML = `<button class="ref-cat-btn active" onclick="filterRefCat('all')">全部</button>` +
      REF_CATS.map(c => `<button class="ref-cat-btn" onclick="filterRefCat('${c}')">${c}</button>`).join('');
  }
  renderRefGrid();
}

function renderRefGrid(search = '', cat = state.refCat) {
  let cmds = COMMANDS_REF;
  if (cat !== 'all') cmds = cmds.filter(c => c.cat === cat);
  if (search) {
    const q = search.toLowerCase();
    cmds = cmds.filter(c => c.cmd.includes(q) || c.desc.includes(q) || c.cat.includes(q));
  }
  document.getElementById('ref-grid').innerHTML = cmds.map(c => `
    <div class="ref-card" onclick="showRefDetail('${c.cmd}')">
      <div class="ref-card-head">
        <span class="ref-cmd">${c.cmd}</span>
        <span class="ref-cat-tag">${c.cat}</span>
      </div>
      <div class="ref-card-desc">${c.desc}</div>
    </div>`).join('');
  document.getElementById('ref-grid').style.display = 'grid';
  document.getElementById('ref-detail').style.display = 'none';
}

function filterRef(q) { renderRefGrid(q, state.refCat); }
function filterRefCat(cat) {
  state.refCat = cat;
  document.querySelectorAll('.ref-cat-btn').forEach(b => b.classList.toggle('active', b.textContent === (cat === 'all' ? '全部' : cat)));
  renderRefGrid(document.getElementById('ref-search').value, cat);
}

function showRefDetail(cmd) {
  const c = COMMANDS_REF.find(r => r.cmd === cmd);
  if (!c) return;
  document.getElementById('ref-grid').style.display = 'none';
  document.getElementById('ref-detail').style.display = 'block';
  document.getElementById('ref-detail-content').innerHTML = `
    <div class="ref-detail-content">
      <h2>${c.cmd}</h2>
      <div class="detail-cat">${c.cat}</div>
      <p>${c.desc}</p>
      <h4>語法</h4>
      <div class="code-block">${escHtml(c.syntax)}</div>
      ${c.opts.length ? `<h4>選項</h4>
      <table class="opts-table"><thead><tr><th>選項</th><th>說明</th></tr></thead><tbody>
      ${c.opts.map(o => `<tr><td>${escHtml(o.f)}</td><td>${escHtml(o.d)}</td></tr>`).join('')}
      </tbody></table>` : ''}
      <h4>範例（點擊在終端機試試）</h4>
      ${c.examples.map(e => `<p style="margin-bottom:4px;font-size:12px;color:var(--text2)">${escHtml(e.desc)}</p>
        <button class="try-btn" onclick="tryCmdInTerminal('${escAttr(e.cmd)}')">${escHtml(e.cmd)}</button>`).join('')}
    </div>`;
}

function closeRefDetail() {
  document.getElementById('ref-grid').style.display = 'grid';
  document.getElementById('ref-detail').style.display = 'none';
}

// ===== TUTORIAL =====
function renderTutorialHome() {
  const home = document.getElementById('tut-home');
  const play = document.getElementById('tut-play');
  home.style.display = 'block';
  play.style.display = 'none';
  const grid = document.getElementById('tut-cat-grid');
  grid.innerHTML = TUTORIALS.map(cat => {
    const done = cat.lessons.filter(l => state.tut.done.has(cat.id + ':' + l.id)).length;
    return `<div class="tut-cat-card" onclick="openTutCat('${cat.id}')">
      <div class="tut-cat-icon">${cat.icon}</div>
      <div class="tut-cat-info">
        <h3>${cat.name}</h3>
        <p>${cat.desc}</p>
        <div class="tut-count">${done}/${cat.lessons.length} 完成</div>
      </div>
    </div>`;
  }).join('');
}

function openTutCat(catId) {
  state.tut.catId = catId;
  state.tut.lessonIdx = 0;
  document.getElementById('tut-home').style.display = 'none';
  document.getElementById('tut-play').style.display = 'grid';
  buildTutSidebar();
  renderTutLesson();
}

function buildTutSidebar() {
  const cat = TUTORIALS.find(c => c.id === state.tut.catId);
  if (!cat) return;
  let html = `<button class="tut-sidebar-back" onclick="renderTutorialHome()">← 所有主題</button>
    <div class="tut-sidebar-cat">${cat.icon} ${cat.name}</div>`;
  cat.lessons.forEach((l, i) => {
    const done = state.tut.done.has(cat.id + ':' + l.id);
    const active = i === state.tut.lessonIdx;
    html += `<div class="tut-sidebar-item${active ? ' active' : ''}${done ? ' done' : ''}" onclick="jumpTutLesson(${i})">
      <div class="tut-num">${done ? '✓' : i + 1}</div>
      <div>${l.title}</div>
    </div>`;
  });
  document.getElementById('tut-sidebar').innerHTML = html;
}

function renderTutLesson() {
  const cat = TUTORIALS.find(c => c.id === state.tut.catId);
  if (!cat) return;
  const lesson = cat.lessons[state.tut.lessonIdx];
  if (!lesson) return;
  document.getElementById('tut-breadcrumb').innerHTML = `${cat.icon} ${cat.name} › <span>${lesson.title}</span>`;
  document.getElementById('tut-article').className = 'tut-article';
  document.getElementById('tut-article').innerHTML = lesson.content;
  document.getElementById('tut-prev').disabled = state.tut.lessonIdx === 0;
  document.getElementById('tut-next').textContent = state.tut.lessonIdx === cat.lessons.length - 1 ? '完成本章 ✓' : '下一節 →';
  // Mark as done
  state.tut.done.add(cat.id + ':' + lesson.id);
  saveProgress(); updateProgress();
  buildTutSidebar();
}

function jumpTutLesson(idx) {
  state.tut.lessonIdx = idx;
  renderTutLesson();
}

function tutNav(dir) {
  const cat = TUTORIALS.find(c => c.id === state.tut.catId);
  if (!cat) return;
  const next = state.tut.lessonIdx + dir;
  if (next < 0) return;
  if (next >= cat.lessons.length) { renderTutorialHome(); return; }
  state.tut.lessonIdx = next;
  renderTutLesson();
}

// ===== TERMINAL =====
let termOutput, termInput, termPromptEl;
let histIdx = -1;

function initTerminal() {
  if (bash) return;
  bash = new BashInterpreter();
  termOutput = document.getElementById('term-output');
  termInput  = document.getElementById('term-input');
  termPromptEl = document.getElementById('term-prompt');
  renderMissions();
  printWelcome();
  termInput.focus();
}

function printWelcome() {
  appendOutput(`<span class="t-success t-bold">Linux Shell 練習器 — 數位 IC 設計工程師版</span>
<span class="t-dim">虛擬環境已就緒。預載專案：/home/user/design/</span>
<span class="t-dim">輸入 <span class="t-cyan">help</span> 查看提示，輸入 <span class="t-cyan">ls</span> 開始探索。</span>`, '');
  updatePrompt();
}

function appendOutput(html, type = '') {
  const div = document.createElement('div');
  div.className = 'term-output-block';
  div.innerHTML = html.split('\n').map(line => `<span class="t-line${type ? ' ' + type : ''}">${line}</span>`).join('');
  termOutput.appendChild(div);
  termOutput.scrollTop = termOutput.scrollHeight;
}

function appendLine(html, cls = '') {
  const span = document.createElement('span');
  span.className = 't-line ' + cls;
  span.innerHTML = html;
  termOutput.appendChild(span);
  termOutput.scrollTop = termOutput.scrollHeight;
}

function updatePrompt() {
  if (bash) termPromptEl.innerHTML = bash.prompt();
}

function termKeyDown(e) {
  if (e.key === 'Enter') {
    const cmd = termInput.value.trim();
    termInput.value = '';
    histIdx = -1;
    if (!cmd) { appendLine(bash.prompt() + ' '); updatePrompt(); return; }
    bash.history.unshift(cmd);
    appendLine(bash.prompt() + escHtml(cmd), 't-cmd-line');
    if (cmd === 'help') { printHelp(); updatePrompt(); return; }
    if (cmd === 'reset') { termReset(); return; }
    const result = bash.execute(cmd);
    if (result.stdout && result.stdout !== '\x1bc') {
      appendOutput(result.stdout.replace(/</g, '&lt;').replace(/&lt;span/g, '<span').replace(/&lt;\/span>/g, '</span>'));
    }
    if (result.stdout === '\x1bc') termClear();
    if (result.stderr) appendLine('<span class="t-err">' + escHtml(result.stderr) + '</span>');
    updatePrompt();
    checkMissionObjectives(cmd, result.stdout);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (bash.history.length) {
      histIdx = Math.min(histIdx + 1, bash.history.length - 1);
      termInput.value = bash.history[histIdx];
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    histIdx = Math.max(histIdx - 1, -1);
    termInput.value = histIdx >= 0 ? bash.history[histIdx] : '';
  } else if (e.key === 'Tab') {
    e.preventDefault();
    tabComplete();
  } else if (e.key === 'c' && e.ctrlKey) {
    appendLine('^C', 't-dim');
    termInput.value = '';
    updatePrompt();
  } else if (e.key === 'l' && e.ctrlKey) {
    e.preventDefault(); termClear();
  }
}

function tabComplete() {
  const val = termInput.value;
  const parts = val.split(' ');
  const last = parts[parts.length - 1];
  if (!last) return;
  const base = bash.vfs.normPath(last.includes('/') ? last.slice(0, last.lastIndexOf('/') + 1) : '.');
  const prefix = last.includes('/') ? last.slice(0, last.lastIndexOf('/') + 1) : '';
  const partial = last.includes('/') ? last.slice(last.lastIndexOf('/') + 1) : last;
  const node = bash.vfs.node(base);
  if (!node || node.t !== 'd') return;
  const matches = Object.keys(node.c).filter(n => n.startsWith(partial));
  if (matches.length === 1) {
    const m = matches[0];
    const isDir = node.c[m].t === 'd';
    parts[parts.length - 1] = prefix + m + (isDir ? '/' : '');
    termInput.value = parts.join(' ');
  } else if (matches.length > 1) {
    appendLine(matches.join('  '), 't-dim');
  }
}

function termClear() {
  termOutput.innerHTML = '';
  updatePrompt();
}

function termReset() {
  bash = null;
  termOutput.innerHTML = '';
  initTerminal();
}

function tryCmdInTerminal(cmd) {
  showSection('terminal');
  setTimeout(() => {
    initTerminal();
    termInput.value = cmd;
    termInput.focus();
  }, 100);
}

function printHelp() {
  appendOutput(`<span class="t-cyan t-bold">Linux Shell 練習器 — 說明</span>
<span class="t-dim">────────────────────────────────</span>
<span class="t-yellow">基本指令：</span> ls, cd, pwd, mkdir, touch, rm, cp, mv
<span class="t-yellow">文字處理：</span> cat, grep, awk, sed, cut, sort, uniq, wc
<span class="t-yellow">其  他：</span> find, chmod, env, export, git, make, tar

<span class="t-dim">專案目錄：</span> <span class="t-cyan">design/</span>  (rtl, tb, scripts, reports, logs)
<span class="t-dim">試試：</span> ls design/reports/timing.rpt 或 cat design/logs/synth.log`);
}

// ===== MISSION PANEL =====
function toggleMissionPanel() {
  const panel = document.getElementById('mission-panel');
  const btn = document.getElementById('mission-toggle-btn');
  panel.classList.toggle('open');
  btn.textContent = panel.classList.contains('open') ? '任務 ◀' : '任務 ▶';
}

function openMissionCat(catId) {
  state.missionCat = catId;
  const panel = document.getElementById('mission-panel');
  if (!panel.classList.contains('open')) toggleMissionPanel();
  renderMissions();
}

function renderMissions() {
  const listEl = document.getElementById('mission-list');
  const cats = EXERCISES.categories;
  const mcat = state.missionCat;
  let missions = EXERCISES.missions;
  if (mcat !== 'all') missions = missions.filter(m => m.cat === mcat);

  let html = `<div class="mission-cats">
    <button class="mission-cat-btn${mcat === 'all' ? ' active' : ''}" onclick="filterMissionCat('all')">全部</button>
    ${cats.map(c => `<button class="mission-cat-btn${mcat === c.id ? ' active' : ''}" onclick="filterMissionCat('${c.id}')">${c.icon} ${c.name}</button>`).join('')}
  </div>`;
  html += missions.map(m => {
    const done = state.mission.completed.has(m.id);
    return `<div class="mission-item${done ? ' done' : ''}" onclick="openMission('${m.id}')">
      <div class="mission-item-head">
        <span class="mission-num">#${m.id.replace('m', '')}</span>
        <span class="mission-title">${m.title}</span>
        ${done ? '<span class="mission-check">✓</span>' : `<span class="mission-diff diff-${m.diff}">${m.diff === 'easy' ? '簡單' : m.diff === 'med' ? '中等' : '困難'}</span>`}
      </div>
      <div class="mission-desc">${m.desc}</div>
    </div>`;
  }).join('');
  listEl.innerHTML = html;
}

function filterMissionCat(cat) {
  state.missionCat = cat;
  renderMissions();
}

function openMission(id) {
  const m = EXERCISES.missions.find(x => x.id === id);
  if (!m) return;
  state.mission.id = id;
  if (!state.mission.objDone[id]) state.mission.objDone[id] = {};
  document.getElementById('mission-list').style.display = 'none';
  document.getElementById('mission-detail').style.display = 'block';
  renderMissionDetail(m);
}

function renderMissionDetail(m) {
  const objDone = state.mission.objDone[m.id] || {};
  const allDone = state.mission.completed.has(m.id);
  const cat = EXERCISES.categories.find(c => c.id === m.cat);
  document.getElementById('mission-detail-content').innerHTML = `
    <h3 style="margin-bottom:6px">${m.title}</h3>
    <div style="font-size:12px;color:var(--text2);margin-bottom:12px">${cat?.icon} ${cat?.name} · ${m.diff === 'easy' ? '簡單' : m.diff === 'med' ? '中等' : '困難'}</div>
    <p style="font-size:13px;margin-bottom:16px;line-height:1.5">${m.desc}</p>
    <div class="mission-obj">
      <h4>任務目標</h4>
      ${m.objectives.map(o => `<div class="obj-item${objDone[o.id] ? ' done' : ''}" id="obj-${m.id}-${o.id}">${escHtml(o.desc)}</div>`).join('')}
    </div>
    ${m.hints.map((h, i) => `
      <button class="mission-hint-btn" onclick="toggleHint('hint-${m.id}-${i}')">提示 ${i + 1} ${i === 0 ? '(概念)' : i === 1 ? '(方向)' : '(解答)'}...</button>
      <div class="mission-hint-content" id="hint-${m.id}-${i}"><code>${escHtml(h)}</code></div>
    `).join('')}
    <div class="mission-complete-banner${allDone ? ' visible' : ''}" id="mission-complete-${m.id}">
      任務完成！繼續下一個挑戰
    </div>`;
}

function closeMissionDetail() {
  document.getElementById('mission-list').style.display = 'block';
  document.getElementById('mission-detail').style.display = 'none';
  state.mission.id = null;
  renderMissions();
}

function toggleHint(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('visible');
}

function checkMissionObjectives(cmd, stdout) {
  if (!state.mission.id) return;
  const m = EXERCISES.missions.find(x => x.id === state.mission.id);
  if (!m) return;
  if (!state.mission.objDone[m.id]) state.mission.objDone[m.id] = {};
  let changed = false;
  for (const obj of m.objectives) {
    if (state.mission.objDone[m.id][obj.id]) continue;
    try {
      if (obj.check(cmd, { cwd: bash.vfs.cwd }, stdout || '')) {
        state.mission.objDone[m.id][obj.id] = true;
        changed = true;
        const el = document.getElementById(`obj-${m.id}-${obj.id}`);
        if (el) el.classList.add('done');
      }
    } catch {}
  }
  if (changed) {
    const allObjDone = m.objectives.every(o => state.mission.objDone[m.id][o.id]);
    if (allObjDone && !state.mission.completed.has(m.id)) {
      state.mission.completed.add(m.id);
      saveProgress(); updateProgress();
      const banner = document.getElementById('mission-complete-' + m.id);
      if (banner) banner.classList.add('visible');
      appendLine('<span class="t-success">任務完成！' + m.title + '</span>');
    }
  }
}

// ===== UTILITIES =====
function escHtml(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function escAttr(s) {
  if (!s) return '';
  return String(s).replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  loadProgress();
  renderHome();
  renderReference();
});
