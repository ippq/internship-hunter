/* ═══════════════════════════════════════════════════════════════
   Internship Hunter — Production Frontend
   ═══════════════════════════════════════════════════════════════ */

const API = '/api/internships', STATS = '/api/stats', PROFILE = '/api/profile', APPLY = '/api/apply';
let allData = [], page = 1, tab = 'discover';

/* ─── Storage ───────────────────────────────────────────────── */
const Store = {
  favs() { try { return new Set(JSON.parse(localStorage.ih_favs||'[]')); } catch { return new Set(); } },
  toggleFav(id) { const s=this.favs(); s.has(id)?s.delete(id):s.add(id); localStorage.ih_favs=JSON.stringify([...s]); return s.has(id); },
  isFav(id) { return this.favs().has(id); },
  apps() { try { return JSON.parse(localStorage.ih_apps||'[]'); } catch { return []; } },
  addApp(e) { const a=this.apps(); e.id=Date.now().toString(36); e.date=new Date().toISOString().split('T')[0]; a.unshift(e); localStorage.ih_apps=JSON.stringify(a); },
  updApp(id,u) { const a=this.apps(); const i=a.findIndex(x=>x.id===id); if(i>=0) a[i]={...a[i],...u}; localStorage.ih_apps=JSON.stringify(a); },
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
  readURLParams(); // Restore filters from URL
  document.getElementById('filterFavorites').addEventListener('click', function(){this.classList.toggle('active');page=1;load();});
  document.getElementById('btnUrgent').addEventListener('click', function(){this.classList.toggle('active');page=1;load();});
  document.getElementById('filterVisa').addEventListener('click', function(){this.classList.toggle('active');page=1;load();});
  load();
  checkNotion();
  loadProfileForm();
});

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
  grid.innerHTML = '<div class="loading"><span class="spinner"></span>Loading...</div>';

  const params = new URLSearchParams();
  if (f.region) params.set('region', f.region);
  if (f.industry) params.set('industry', f.industry);
  if (f.year) params.set('year', f.year);
  if (f.sort) params.set('sort', f.sort);
  if (f.search) params.set('search', f.search);
  params.set('page', f.page);
  params.set('pageSize', '100');

  let data;
  try {
    const resp = await fetch(API+'?'+params);
    data = await resp.json();
    allData = data.results || [];
  } catch (e) { grid.innerHTML = '<div class="loading">Error loading data.</div>'; return; }

  // Client-side filters
  if (f.favs) { const favs = Store.favs(); allData = allData.filter(e => favs.has(e.id)); }
  if (f.urgent) { allData = allData.filter(e => e.deadline && e.jobStatus === 'Open' && daysLeft(e.deadline) <= 14); }
  if (f.country) { allData = allData.filter(e => e.country === f.country); }
  if (f.visa) { allData = allData.filter(e => e.visaSponsorship); }
  if (f.tier) { allData = allData.filter(e => e.companyTier === f.tier); }
  if (f.function) { allData = allData.filter(e => (e.function||e.specialization||[]).includes(f.function)); }

  render();
  renderPagination(data.total, f.page, data.pageSize || 50);
  updateCounts(data.total || allData.length);
  loadStats();
}

async function loadStats() {
  try {
    const s = await fetch(STATS).then(r=>r.json());
    document.getElementById('statTotal').textContent = s.total||'--';
    document.getElementById('statOpen').textContent = s.byStatus?.Open||0;
    document.getElementById('statUrgent').textContent = allData.filter(e => e.deadline && e.jobStatus==='Open' && daysLeft(e.deadline)<=14).length;
  } catch(e){}
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
  fetch(PROFILE).then(r=>r.json()).then(p=>{
    const checks = [];
    checks.push(p.identity?.full_name ? {ok:true,msg:'Name & email found'} : {ok:false,msg:'Missing: fill name/email in Settings'});
    checks.push(p.education?.university ? {ok:true,msg:'Education info found'} : {ok:false,msg:'Missing: fill education in Settings'});
    document.getElementById('materialChecks').innerHTML = checks.map(c=>`<div class="check-item ${c.ok?'ok':'fail'}">${c.ok?'✅':'❌'} ${c.msg}</div>`).join('');
    document.getElementById('wizReady').style.display = checks.every(c=>c.ok) ? 'block' : 'none';
  });
  fetch(APPLY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({company:co,role,applyUrl:url,id})})
    .then(r=>r.json()).then(d=>{
      document.getElementById('applyCommand').textContent = d.prompt;
      document.getElementById('applySteps').innerHTML = d.steps.map((s,i)=>`<li>${s}</li>`).join('');
    });
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
async function loadProfileForm() {
  try {
    const r = await fetch(PROFILE); if(!r.ok) return; const p = await r.json();
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
  try {
    await fetch(PROFILE,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    document.getElementById('profileStatus').textContent='Configured'; document.getElementById('profileStatus').style.color='var(--green)';
    toast('Profile saved!','success');
  } catch(e) { toast('Error saving','error'); }
}

/* ─── Settings ──────────────────────────────────────────────── */
async function checkNotion() {
  try { const r = await fetch(STATS); if(r.ok) { document.getElementById('notionStatus').textContent='Connected'; document.getElementById('notionStatus').style.color='var(--green)'; } }
  catch(e) { document.getElementById('notionStatus').textContent='Not connected'; }
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
