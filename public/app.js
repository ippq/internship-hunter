/* ═══════════════════════════════════════════════════════════════
   Internship Hunter — Production Frontend
   ═══════════════════════════════════════════════════════════════ */

const DATA_URL = '/data.json';
let allData = [], fullData = [], page = 1, tab = 'discover';
let currentUser = null;

/* ─── User Management ───────────────────────────────────────── */
const UserStore = {
  // Get user registry
  getUsers() { try { return JSON.parse(localStorage.ih_users||'{}'); } catch { return {}; } },
  saveUsers(u) { localStorage.ih_users = JSON.stringify(u); },

  // Check if any users exist
  hasUsers() { return Object.keys(this.getUsers()).length > 0; },

  // Register new user
  register(username, pin) {
    if (username.length < 2) return { ok: false, msg: 'Username must be at least 2 characters.' };
    if (pin.length < 4) return { ok: false, msg: 'PIN must be at least 4 characters.' };
    const users = this.getUsers();
    if (users[username]) return { ok: false, msg: 'Username already taken.' };
    users[username] = { pin, created: new Date().toISOString() };
    this.saveUsers(users);
    return { ok: true };
  },

  // Login
  login(username, pin) {
    const users = this.getUsers();
    if (!users[username]) return { ok: false, msg: 'User not found.' };
    if (users[username].pin !== pin) return { ok: false, msg: 'Wrong PIN.' };
    localStorage.ih_current_user = username;
    currentUser = username;
    return { ok: true };
  },

  // Logout
  logout() {
    currentUser = null;
    delete localStorage.ih_current_user;
  },

  // Get current user
  getCurrent() {
    if (currentUser) return currentUser;
    currentUser = localStorage.ih_current_user || null;
    return currentUser;
  },

  // Get user-scoped storage key
  scope(key) {
    const u = this.getCurrent();
    return u ? `ih_${u}_${key}` : null;
  }
};

/* ─── Storage (user-scoped) ──────────────────────────────────── */
const Store = {
  scope(key) { return UserStore.scope(key); },
  favs() { const k = this.scope('favs'); if (!k) return new Set(); try { return new Set(JSON.parse(localStorage[k]||'[]')); } catch { return new Set(); } },
  toggleFav(id) { const k = this.scope('favs'); if (!k) return false; const s = this.favs(); s.has(id)?s.delete(id):s.add(id); localStorage[k]=JSON.stringify([...s]); return s.has(id); },
  isFav(id) { return this.favs().has(id); },
  apps() { const k = this.scope('apps'); if (!k) return []; try { return JSON.parse(localStorage[k]||'[]'); } catch { return []; } },
  addApp(e) { const k = this.scope('apps'); if (!k) return; const a=this.apps(); e.id=Date.now().toString(36); e.date=new Date().toISOString().split('T')[0]; a.unshift(e); localStorage[k]=JSON.stringify(a); },
  updApp(id,u) { const k = this.scope('apps'); if (!k) return; const a=this.apps(); const i=a.findIndex(x=>x.id===id); if(i>=0) a[i]={...a[i],...u}; localStorage[k]=JSON.stringify(a); },
  profile() { const k = this.scope('profile'); if (!k) return {}; try { return JSON.parse(localStorage[k]||'{}'); } catch { return {}; } },
  saveProfile(p) { const k = this.scope('profile'); if (k) localStorage[k] = JSON.stringify(p); },
};

/* ─── Region→Country Cascade ────────────────────────────────── */
const REGION_COUNTRIES = {
  'North America': ['United States','Canada'],
  'Europe': ['United Kingdom','Germany','France','Netherlands','Switzerland','Sweden','Ireland','Denmark','Spain','Finland','Norway','Belgium','Austria','Italy','Portugal','Poland','Luxembourg','Estonia'],
  'APAC': ['Japan','South Korea','Australia','Singapore','China','Hong Kong','Taiwan','India'],
  'Remote': ['Remote (Global)'],
};

function updateCountryDropdown(region) {
  const sel = document.getElementById('filterCountry');
  const cur = sel.value;
  if (!region) { sel.innerHTML = '<option value="">🏳️ All Countries</option>'; return; }
  const cs = REGION_COUNTRIES[region] || [];
  sel.innerHTML = '<option value="">🏳️ All in ' + region + '</option>' + cs.map(c => '<option value="'+c+'">'+c+'</option>').join('');
  if (cs.includes(cur)) sel.value = cur;
}

/* ─── URL State ─────────────────────────────────────────────── */
function readURLParams() {
  const p = new URLSearchParams(location.search);
  const map = {filterTier:'tier', filterRegion:'region', filterCountry:'country', filterIndustry:'industry', filterYear:'year', filterFunc:'function', filterSort:'sort', filterSearch:'search'};
  for (const [id, key] of Object.entries(map)) {
    const v = p.get(key); if (v) { const el = document.getElementById(id); if (el) el.value = v; }
  }
  if (p.get('favs')==='1') document.getElementById('filterFavorites').classList.add('active');
  if (p.get('urgent')==='1') document.getElementById('btnUrgent').classList.add('active');
  if (p.get('visa')==='1') document.getElementById('filterVisa').classList.add('active');
  if (p.get('region')) updateCountryDropdown(p.get('region'));
}

function pushURL() {
  const f = getFilters();
  const p = new URLSearchParams();
  if (f.tier) p.set('tier', f.tier);
  if (f.region) p.set('region', f.region);
  if (f.country) p.set('country', f.country);
  if (f.industry) p.set('industry', f.industry);
  if (f.year) p.set('year', f.year);
  if (f.function) p.set('function', f.function);
  if (f.sort && f.sort !== 'deadline') p.set('sort', f.sort);
  if (f.search) p.set('search', f.search);
  if (f.favs) p.set('favs', '1');
  if (f.urgent) p.set('urgent', '1');
  if (f.visa) p.set('visa', '1');
  const qs = p.toString();
  const url = location.pathname + (qs ? '?' + qs : '');
  history.replaceState(null, '', url);
}

/* ─── Startup ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-btn').forEach(b => b.addEventListener('click', function() {
    document.querySelectorAll('.nav-btn').forEach(x=>x.classList.remove('active'));
    this.classList.add('active'); tab = this.dataset.tab;
    document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
    const view = document.getElementById('view-'+tab);
    if (view) view.classList.add('active');
    if (tab === 'discover') render();
    if (tab === 'applied') renderApplied();
    if (tab === 'ended') renderEnded();
  }));
  setupFilters();
  readURLParams();
  document.getElementById('filterFavorites').addEventListener('click', function(){this.classList.toggle('active');page=1;load();});
  document.getElementById('btnUrgent').addEventListener('click', function(){this.classList.toggle('active');page=1;load();});
  document.getElementById('filterVisa').addEventListener('click', function(){this.classList.toggle('active');page=1;load();});

  // Auth check
  const user = UserStore.getCurrent();
  if (!user) { showAuthModal(); }
  else { currentUser = user; updateUserUI(); load(); loadProfileForm(); }
  checkNotion();
});

/* ─── Auth UI ───────────────────────────────────────────────── */
function showAuthModal() {
  const isFirst = !UserStore.hasUsers();
  document.getElementById('authLoginUsername').value = '';
  document.getElementById('authLoginPin').value = '';
  document.getElementById('authRegUser').value = '';
  document.getElementById('authRegPin').value = '';
  document.getElementById('authRegPin2').value = '';
  document.getElementById('authError').textContent = '';
  document.getElementById('authLogin').style.display = isFirst ? 'none' : 'block';
  document.getElementById('authRegister').style.display = isFirst ? 'block' : 'none';
  document.getElementById('authModal').hidden = false;
}

function doLogin() {
  const u = document.getElementById('authLoginUsername').value.trim();
  const p = document.getElementById('authLoginPin').value.trim();
  const r = UserStore.login(u, p);
  if (!r.ok) { document.getElementById('authError').textContent = r.msg; return; }
  document.getElementById('authModal').hidden = true;
  currentUser = u;
  updateUserUI();
  load();
  loadProfileForm();
}

function doRegister() {
  const u = document.getElementById('authRegUser').value.trim();
  const p = document.getElementById('authRegPin').value.trim();
  const p2 = document.getElementById('authRegPin2').value.trim();
  if (p !== p2) { document.getElementById('authError').textContent = 'PINs do not match.'; return; }
  const r = UserStore.register(u, p);
  if (!r.ok) { document.getElementById('authError').textContent = r.msg; return; }
  UserStore.login(u, p);
  document.getElementById('authModal').hidden = true;
  currentUser = u;
  updateUserUI();
  load();
  loadProfileForm();
}

function doLogout() {
  UserStore.logout();
  document.getElementById('userDisplay').textContent = '';
  document.getElementById('userSection').style.display = 'none';
  allData = []; fullData = [];
  document.getElementById('cardGrid').innerHTML = '';
  document.getElementById('appliedContent').innerHTML = '';
  document.getElementById('endedContent').innerHTML = '';
  showAuthModal();
}

function switchAuthMode() {
  const loginEl = document.getElementById('authLogin');
  const regEl = document.getElementById('authRegister');
  const isLogin = loginEl.style.display !== 'none';
  loginEl.style.display = isLogin ? 'none' : 'block';
  regEl.style.display = isLogin ? 'block' : 'none';
  document.getElementById('authError').textContent = '';
}

function updateUserUI() {
  document.getElementById('userDisplay').textContent = '👤 ' + currentUser;
  document.getElementById('userSection').style.display = 'flex';
}

/* ─── Filters ───────────────────────────────────────────────── */
function setupFilters() {
  ['filterTier','filterRegion','filterIndustry','filterYear','filterFunc','filterSort'].forEach(id => {
    document.getElementById(id).addEventListener('change', () => { page = 1; load(); pushURL(); });
  });
  document.getElementById('filterRegion').addEventListener('change', function() {
    updateCountryDropdown(this.value || null); page = 1; load();
  });
  document.getElementById('filterCountry').addEventListener('change', () => { page = 1; load(); });
  document.getElementById('filterSearch').addEventListener('input', debounce(() => { page = 1; load(); }, 300));
}

function getFilters() {
  const favs = document.getElementById('filterFavorites').classList.contains('active');
  const urgent = document.getElementById('btnUrgent').classList.contains('active');
  const visa = document.getElementById('filterVisa').classList.contains('active');
  return {
    tier: document.getElementById('filterTier').value || null,
    region: document.getElementById('filterRegion').value || null,
    country: document.getElementById('filterCountry').value || null,
    industry: document.getElementById('filterIndustry').value || null,
    year: document.getElementById('filterYear').value || null,
    function: document.getElementById('filterFunc').value || null,
    sort: document.getElementById('filterSort').value || 'deadline',
    search: document.getElementById('filterSearch').value || null,
    page, favs, urgent, visa,
  };
}

/* ─── Load ──────────────────────────────────────────────────── */
async function load() {
  const f = getFilters();
  const grid = document.getElementById('cardGrid');
  // Skeleton loading
  grid.innerHTML = Array.from({length:6}, (_,i) => `
    <div class="skeleton-card">
      <div class="sk-line sk-region"></div>
      <div class="sk-line sk-company"></div>
      <div class="sk-line sk-role"></div>
      <div class="sk-line sk-tags"></div>
    </div>
  `).join('');

  // Load data from static JSON (first time only)
  if (!fullData.length) {
    try {
      const resp = await fetch(DATA_URL);
      if (!resp.ok) throw new Error('HTTP '+resp.status);
      fullData = await resp.json();
    } catch (e) {
      grid.innerHTML = `<div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <h2>Couldn't load data</h2>
        <p>${e.message}. The data file may be unavailable.</p>
        <button class="btn-act primary" onclick="load()" style="margin-top:12px">🔄 Retry</button>
      </div>`;
      return;
    }
  }

  // Apply filters client-side from fullData
  allData = [...fullData];
  if (f.region) allData = allData.filter(e => e.region === f.region);
  if (f.industry) allData = allData.filter(e => e.industry.includes(f.industry));
  if (f.year) allData = allData.filter(e => e.year === f.year);
  if (f.search) { const q = f.search.toLowerCase(); allData = allData.filter(e => e.company.toLowerCase().includes(q) || e.role.toLowerCase().includes(q) || e.city.toLowerCase().includes(q) || e.country.toLowerCase().includes(q)); }

  // Client-side filters
  if (f.favs) { const favs = Store.favs(); allData = allData.filter(e => favs.has(e.id)); }
  if (f.urgent) { allData = allData.filter(e => e.deadline && e.jobStatus === 'Open' && daysLeft(e.deadline) <= 14); }
  if (f.country) { allData = allData.filter(e => e.country === f.country); }
  if (f.visa) { allData = allData.filter(e => e.visaSponsorship); }
  if (f.tier) { allData = allData.filter(e => e.companyTier === f.tier); }
  if (f.function) { allData = allData.filter(e => (e.function||e.specialization||[]).includes(f.function)); }

  // Sort
  if (f.sort === 'deadline') {
    allData.sort((a,b) => { if(!a.deadline&&!b.deadline) return 0; if(!a.deadline) return 1; if(!b.deadline) return -1; return a.deadline.localeCompare(b.deadline); });
  } else if (f.sort === 'newest') {
    allData.sort((a,b) => b.createdTime.localeCompare(a.createdTime));
  } else {
    allData.sort((a,b) => a.company.localeCompare(b.company));
  }

  // Paginate
  const ps = 50;
  const start = (f.page - 1) * ps;
  const paged = allData.slice(start, start + ps);

  renderCardsFrom(paged);
  renderPagination(allData.length, f.page, ps);
  updateCounts(allData.length);
  loadStats();
}

function renderCardsFrom(data) {
  const grid = document.getElementById('cardGrid');
  if (!data.length) { grid.innerHTML = '<div class="empty-state"><div class="empty-icon">🔍</div><h2>No internships found</h2><p>Try adjusting filters.</p></div>'; return; }
  grid.innerHTML = data.map(card).join('');
}

function loadStats() {
  document.getElementById('statTotal').textContent = fullData.length||'--';
  document.getElementById('statOpen').textContent = fullData.filter(e=>e.jobStatus==='Open').length;
  document.getElementById('statUrgent').textContent = fullData.filter(e=>e.deadline&&e.jobStatus==='Open'&&daysLeft(e.deadline)<=14).length;
}

function updateCounts(apiTotal) {
  document.getElementById('totalBadge').textContent = (apiTotal||allData.length) + ' internships';
  document.getElementById('favoriteCount').textContent = Store.favs().size;
  const apps = Store.apps();
  document.getElementById('appliedCount').textContent = apps.filter(a=>a.status==='applied'||a.status==='interview').length;
  document.getElementById('endedCount').textContent = apps.filter(a=>a.status==='offer'||a.status==='rejected'||a.status==='accepted').length;
}

/* ─── Render Cards ──────────────────────────────────────────── */
function render() {
  const grid = document.getElementById('cardGrid');
  if (!allData.length) {
    grid.innerHTML = '<div class="empty-state"><div class="empty-icon">🔍</div><h2>No internships found</h2><p>Try adjusting your filters.</p></div>';
    return;
  }
  grid.innerHTML = allData.map(card).join('');
}

function card(e) {
  const indClass = (e.industry[0]||'technology-internet').toLowerCase().replace(/[\s&]+/g,'-').replace(/[^a-z0-9-]/g,'');
  const isFav = Store.isFav(e.id);
  const apps = Store.apps(); const tracked = apps.find(a=>a.notionId===e.id);
  const dl = e.deadline; const d = dl ? daysLeft(dl) : null;
  let dlHtml = '', dlCls = '';
  if (dl) {
    if (d < 0) { dlHtml = `<span class="dl-badge dl-closed">CLOSED</span> ${dl}`; dlCls = 'urgent'; }
    else if (d <= 7) { dlHtml = `<span class="dl-badge dl-urgent">⚠ ${d}d LEFT</span> ${dl}`; dlCls = 'urgent'; }
    else if (d <= 30) { dlHtml = `<span class="dl-badge dl-warn">⚡ ${d}d</span> ${dl}`; dlCls = 'warn'; }
    else { dlHtml = `<span class="dl-badge dl-ok">${d}d</span> ${dl}`; }
  } else {
    dlHtml = (e.notes||'').toLowerCase().includes('rolling') ? '<span class="dl-badge dl-rolling">ROLLING</span>' : '';
  }

  return `
  <div class="card${d !== null && d <= 7 && d >= 0 ? ' card-urgent' : ''}" data-industry="${indClass}" data-id="${e.id}">
    <div class="card-top">
      <span class="card-region-info">${e.regionFlag||'🌍'} ${e.region||''} · ${e.country} · ${e.city}</span>
      <div style="display:flex;align-items:center;gap:6px">
        ${tracked ? `<span class="card-tracked">📌 ${tracked.status}</span>` : ''}
        <button class="card-fav${isFav?' active':''}" onclick="toggleFav(this,'${e.id}')">${isFav?'⭐':'☆'}</button>
      </div>
    </div>
    <div class="card-company">${esc(e.company)}</div>
    <div class="card-role">${esc(e.role)}</div>
    <div class="card-tags">
      ${e.companyTier ? `<span class="tag tag-tier">${esc(e.companyTier)}</span>` : ''}
      ${e.visaSponsorship ? '<span class="tag tag-visa">🛂 Sponsors Visa</span>' : ''}
      <span class="tag tag-ind">${esc(e.industry.join(', ')||'?')}</span>
      ${((e.function||e.specialization||[])[0]) ? `<span class="tag tag-func">${esc((e.function||e.specialization)[0])}</span>` : ''}
      <span class="tag tag-loc">${esc(e.country)}</span>
      ${salaryTag(e.notes)}
      ${e.year ? `<span class="tag tag-year">📅 ${e.year} · ${e.season||'Summer'}</span>` : ''}
    </div>
    <div class="card-deadline ${dlCls}">${dlHtml}</div>
    <div class="card-actions">
      ${e.applyUrl ? `<a href="${e.applyUrl}" target="_blank" rel="noopener" class="btn-act apply">🔗 Apply</a>` : ''}
      <button class="btn-act primary" onclick="openWizard('${escAttr(e.company)}','${escAttr(e.role)}','${escAttr(e.applyUrl)}','${e.id}')">🚀 Smart Apply</button>
      <button class="btn-act" onclick="openTrack('${e.id}','${escAttr(e.company)}','${escAttr(e.role)}')">📌 Track</button>
      <button class="btn-act" onclick="togglePreview(this,'${e.id}')">📄 Preview</button>
    </div>
    <div class="card-preview" id="preview-${e.id}" style="display:none">
      <div class="preview-content">${esc(e.jdSummary || e.notes || 'No description available.')}</div>
    </div>
  </div>`;
}

function toggleFav(btn, id) { const a = Store.toggleFav(id); btn.classList.toggle('active',a); btn.textContent=a?'⭐':'☆'; updateCounts(); }

/* ─── Pagination ────────────────────────────────────────────── */
function renderPagination(total, p, ps) {
  const c = document.getElementById('pagination');
  const tp = Math.ceil(total/Math.max(ps,1));
  if (tp <= 1) { c.innerHTML=''; return; }
  let h = ''; if(p>1) h+=`<button class="pg-btn" onclick="goPage(${p-1})">←</button>`;
  for(let i=1;i<=tp;i++) {
    if(i===1||i===tp||Math.abs(i-p)<=2) h+=`<button class="pg-btn${i===p?' active':''}" onclick="goPage(${i})">${i}</button>`;
    else if(Math.abs(i-p)===3) h+=`<button class="pg-btn" disabled>…</button>`;
  }
  if(p<tp) h+=`<button class="pg-btn" onclick="goPage(${p+1})">→</button>`;
  c.innerHTML = h;
}
function goPage(p) { page = p; window.scrollTo({top:0,behavior:'smooth'}); load(); }

/* ─── Smart Apply Wizard ────────────────────────────────────── */
function openWizard(co, role, url, id) {
  document.getElementById('wizCompany').textContent = co;
  document.getElementById('wizRole').textContent = role;
  document.getElementById('wizUrl').href = url||'#'; document.getElementById('wizUrl').textContent = url||'(no link)';
  // Check profile from user storage
  const p = Store.profile();
  const checks = [];
  checks.push(p.identity?.full_name ? {ok:true,msg:'Name & email found'} : {ok:false,msg:'Missing: fill name/email in Settings'});
  checks.push(p.education?.university ? {ok:true,msg:'Education info found'} : {ok:false,msg:'Missing: fill education in Settings'});
  document.getElementById('materialChecks').innerHTML = checks.map(c=>`<div class="check-item ${c.ok?'ok':'fail'}">${c.ok?'✅':'❌'} ${c.msg}</div>`).join('');
  document.getElementById('wizReady').style.display = checks.every(c=>c.ok) ? 'block' : 'none';
  // Generate apply prompt client-side
  const prompt = `Apply to ${co} - ${role} at ${url}. Use my stored candidate profile to fill the application form via Playwright. PREVIEW everything before clicking submit.`;
  document.getElementById('applyCommand').textContent = prompt;
  document.getElementById('applySteps').innerHTML = [
    `Open ${url} with Playwright browser_navigate`,
    'Read my stored profile from localStorage (ih_profile)',
    'Upload my-materials/resume.pdf if file input exists',
    'Fill the form — never guess, ask me if unclear',
    'Take a screenshot and show me ALL fields before submitting',
    'Wait for my YES before clicking Submit'
  ].map(s => `<li>${s}</li>`).join('');
  document.getElementById('applyWizard').hidden = false;
  gotoWizStep(1);
}
function gotoWizStep(n) {
  document.querySelectorAll('.wiz-step').forEach(s=>s.classList.remove('active'));
  const s = document.getElementById('wizStep'+n); if(s) s.classList.add('active');
  document.querySelectorAll('.wiz-dot').forEach((d,i)=>d.classList.toggle('active',i<n));
}
function closeApplyWizard() { document.getElementById('applyWizard').hidden = true; }
function copyApplyCommand() {
  navigator.clipboard.writeText(document.getElementById('applyCommand').textContent)
    .then(()=>toast('Copied! Paste into Claude Code.','success'))
    .catch(()=>toast('Failed to copy. Select and copy manually.','error'));
}

/* ─── Track Modal ───────────────────────────────────────────── */
function openTrack(id, co, role) {
  document.getElementById('trackNotionId').value = id;
  document.getElementById('trackCompany').value = co;
  document.getElementById('trackRole').value = role;
  document.getElementById('trackStatus').value = 'applied';
  document.getElementById('trackDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('trackNotes').value = '';
  document.getElementById('trackModal').hidden = false;
}
function closeTrackModal() { document.getElementById('trackModal').hidden = true; }
function saveTrackEntry() {
  Store.addApp({
    notionId: document.getElementById('trackNotionId').value,
    company: document.getElementById('trackCompany').value,
    role: document.getElementById('trackRole').value,
    status: document.getElementById('trackStatus').value,
    date: document.getElementById('trackDate').value,
    notes: document.getElementById('trackNotes').value,
  });
  closeTrackModal(); updateCounts(); render();
  toast('Application tracked!', 'success');
}

/* ─── Applied / Ended Views ─────────────────────────────────── */
function renderApplied() {
  const c = document.getElementById('appliedContent');
  const apps = Store.apps().filter(a=>a.status==='applied'||a.status==='interview');
  if (!apps.length) { c.innerHTML = '<div class="empty-state"><div class="empty-icon">📋</div><h2>No applications yet</h2><p>Click <strong>📌 Track</strong> on any card to start.</p></div>'; return; }
  c.innerHTML = '<div class="track-list">'+apps.map(a=>`
    <div class="track-card">
      <div class="track-icon">${a.status==='interview'?'🎙️':'📨'}</div>
      <div class="track-info"><strong>${esc(a.company)}</strong><div class="track-role">${esc(a.role)}</div><div class="track-meta">📅 ${a.date} · ${a.notes||'No notes'}</div></div>
      <span class="track-status ts-${a.status}">${a.status.toUpperCase()}</span>
      <div class="track-actions">
        <button class="btn-act" onclick="updAppStatus('${a.id}','interview')">🎙️</button>
        <button class="btn-act" onclick="updAppStatus('${a.id}','offer')">🎉</button>
        <button class="btn-act" onclick="updAppStatus('${a.id}','rejected')">❌</button>
      </div>
    </div>`).join('')+'</div>';
}
function renderEnded() {
  const c = document.getElementById('endedContent');
  const apps = Store.apps().filter(a=>['offer','rejected','accepted'].includes(a.status));
  if (!apps.length) { c.innerHTML = '<div class="empty-state"><div class="empty-icon">✅</div><h2>No outcomes yet</h2><p>Offers and rejections will appear here.</p></div>'; return; }
  c.innerHTML = '<div class="track-list">'+apps.map(a=>`
    <div class="track-card ended">
      <div class="track-icon">${a.status==='accepted'?'🎉':a.status==='offer'?'📨':'👋'}</div>
      <div class="track-info"><strong>${esc(a.company)}</strong><div class="track-role">${esc(a.role)}</div><div class="track-meta">📅 ${a.date} · ${a.notes||''}</div></div>
      <span class="track-status ts-${a.status}">${a.status.toUpperCase()}</span>
    </div>`).join('')+'</div>';
}
function updAppStatus(id, status) { Store.updApp(id, {status}); if(tab==='applied') renderApplied(); if(tab==='ended') renderEnded(); updateCounts(); toast('Status updated!','success'); }

/* ─── Profile ───────────────────────────────────────────────── */
// Profile stored in user-scoped localStorage
async function loadProfileForm() {
  const p = Store.profile();
  if (!p || !p.identity) { document.getElementById('profileStatus').textContent = 'Not configured'; return; }
  try {
    const i=p.identity||{}; document.getElementById('pfName').value=i.full_name||''; document.getElementById('pfEmail').value=i.email||''; document.getElementById('pfPhone').value=i.phone||''; document.getElementById('pfLinkedin').value=i.linkedin||''; document.getElementById('pfGithub').value=i.github||'';
    const e=p.education||{}; document.getElementById('pfUni').value=e.university||''; document.getElementById('pfDegree').value=e.degree||''; document.getElementById('pfMajor').value=e.major||''; document.getElementById('pfGrad').value=(e.graduation_month&&e.graduation_year)?e.graduation_month+' '+e.graduation_year:'';
    const t=p.target||{}; document.getElementById('pfRoles').value=(t.roles||[]).join(', '); document.getElementById('pfCities').value=(t.preferred_cities||[]).join(', '); document.getElementById('pfRemote').checked=t.open_to_remote!==false;
    document.getElementById('profileStatus').textContent='Configured'; document.getElementById('profileStatus').style.color='var(--green)';
  } catch(e) { document.getElementById('profileStatus').textContent='Not configured'; }
}
async function saveProfile() {
  const data = {
    identity: { full_name: document.getElementById('pfName').value, email: document.getElementById('pfEmail').value, phone: document.getElementById('pfPhone').value, linkedin: document.getElementById('pfLinkedin').value, github: document.getElementById('pfGithub').value, website: '' },
    education: { university: document.getElementById('pfUni').value, degree: document.getElementById('pfDegree').value, major: document.getElementById('pfMajor').value, graduation_month: '', graduation_year: '' },
    work_authorization: {},
    target: { roles: document.getElementById('pfRoles').value.split(',').map(s=>s.trim()).filter(Boolean), industries: [], preferred_regions: [], preferred_cities: document.getElementById('pfCities').value.split(',').map(s=>s.trim()).filter(Boolean), open_to_remote: document.getElementById('pfRemote').checked, min_salary_usd: '', visa_sponsorship_required: false },
    preferences: { company_sizes: [], max_applications_per_day: 5 },
  };
  const g = document.getElementById('pfGrad').value.trim().split(' ');
  if(g.length>=2) { data.education.graduation_month=g[0]; data.education.graduation_year=g[1]; }
  Store.saveProfile(data);
  document.getElementById('profileStatus').textContent='Configured'; document.getElementById('profileStatus').style.color='var(--green)';
  toast('Profile saved!','success');
}

/* ─── Settings ──────────────────────────────────────────────── */
function checkNotion() {
  // For static site, just check if data.json loads
  fetch('/data.json').then(r => {
    if (r.ok) { document.getElementById('notionStatus').textContent = 'Connected'; document.getElementById('notionStatus').style.color = 'var(--green)'; }
    else { document.getElementById('notionStatus').textContent = 'Not connected'; }
  }).catch(() => { document.getElementById('notionStatus').textContent = 'Not connected'; });
}

/* ─── Salary Extraction ─────────────────────────────────────── */
function salaryTag(notes) {
  const n = notes || '';
  // Match salary patterns: $XX/hr, $XXk, $XXX,XXX, etc.
  const m = n.match(/\$[\d,]+(\/hr|\/mo|\/month|K|k|,?\d{3}\/yr|\/year| annually| annualized)/);
  if (m) return `<span class="tag tag-salary">💰 ${m[0]}</span>`;
  const m2 = n.match(/\$[\d,]+/);
  if (m2) return `<span class="tag tag-salary">💰 ${m2[0]}</span>`;
  return '';
}

function togglePreview(btn, id) {
  const panel = document.getElementById('preview-'+id);
  if (!panel) return;
  const shown = panel.style.display === 'block';
  panel.style.display = shown ? 'none' : 'block';
  btn.textContent = shown ? '📄 Preview' : '📄 Hide';
}

/* ─── CSV Export ────────────────────────────────────────────── */
function exportCSV() {
  const data = allData.length > 0 ? allData : fullData;
  if (!data.length) return toast('No data to export','error');
  const headers = ['Company','Role','Industry','Function','Tier','Country','City','Region','Year','Season','Deadline','Status','Visa','Apply URL'];
  const rows = data.map(e => [
    e.company, e.role, (e.industry||[]).join('; '), (e.function||e.specialization||[])[0]||'',
    e.companyTier||'', e.country, e.city, e.region, e.year, e.season,
    e.deadline||'Rolling', e.jobStatus, e.visaSponsorship?'Yes':'No', e.applyUrl
  ].map(v => '"'+String(v).replace(/"/g,'""')+'"').join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['﻿'+csv], {type:'text/csv;charset=utf-8'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = 'internships-'+new Date().toISOString().split('T')[0]+'.csv';
  a.click(); toast('CSV exported!','success');
}

/* ─── Theme Toggle ──────────────────────────────────────────── */
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('ih_theme', next);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = next === 'dark' ? '🌙' : '☀️';
}
// Apply saved theme on load
(function() {
  const saved = localStorage.getItem('ih_theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
})();

/* ─── Utilities ─────────────────────────────────────────────── */
function daysLeft(d) { return Math.ceil((new Date(d)-new Date())/86400000); }
function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function escAttr(s) { return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function debounce(fn,ms) { let t; return (...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms);}; }
function toast(msg,type) {
  const ct = document.querySelector('.toast-container') || (()=>{const d=document.createElement('div');d.className='toast-container';document.body.appendChild(d);return d;})();
  const el = document.createElement('div'); el.className='toast toast-'+type; el.textContent=msg; ct.appendChild(el); setTimeout(()=>el.remove(),3000);
}

// Modal close on overlay click
document.addEventListener('click', e => {
  if (e.target.id==='applyWizard') closeApplyWizard();
  if (e.target.id==='trackModal') closeTrackModal();
});
document.addEventListener('keydown', e => {
  if (e.key==='Escape') { closeApplyWizard(); closeTrackModal(); }
  if (e.key==='r' && e.ctrlKey) { e.preventDefault(); load(); }
});
