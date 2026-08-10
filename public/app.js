/* ═══════════════════════════════════════════════════════════════
   Internship Hunter — Production Frontend
   ═══════════════════════════════════════════════════════════════ */

const DATA_URL = '/data.json';
let allData = [], fullData = [], page = 1, tab = 'discover';
let currentUser = null;

/* ─── i18n ────────────────────────────────────────────────────── */
let LANG = localStorage.getItem('ih_lang') || 'en';
const I18N = {
  // Nav
  discover: { en: '🔍 Discover', zh: '🔍 发现' },
  applied: { en: '📋 Applied', zh: '📋 已投递' },
  ended: { en: '✅ Ended', zh: '✅ 已结束' },
  analytics: { en: '📊 Analytics', zh: '📊 分析' },
  settings: { en: '⚙️ Settings', zh: '⚙️ 设置' },
  switch_account: { en: '↪ Switch', zh: '↪ 切换' },
  internships: { en: 'internships', zh: '个实习机会' },

  // Hero
  open_now: { en: 'Open Now', zh: '正在招聘' },
  closing_soon: { en: 'Closing Soon', zh: '即将截止' },
  saved: { en: 'Saved', zh: '已收藏' },
  total: { en: 'Total', zh: '总计' },

  // Filters
  filter_saved: { en: '⭐ Saved', zh: '⭐ 已收藏' },
  filter_urgent: { en: '⚠️ Urgent', zh: '⚠️ 紧急' },
  filter_visa: { en: '🛂 Visa', zh: '🛂 签证' },
  filter_tier_all: { en: '🏢 All Tiers', zh: '🏢 全部级别' },
  filter_region_all: { en: '🌍 All Regions', zh: '🌍 全部地区' },
  filter_country_all: { en: '🏳️ All Countries', zh: '🏳️ 全部国家' },
  filter_industry_all: { en: '💼 Industry', zh: '💼 行业' },
  filter_function_all: { en: '🔧 Function', zh: '🔧 职能' },
  filter_year_all: { en: '📅 Year', zh: '📅 年份' },
  search_placeholder: { en: 'Search...', zh: '搜索公司/职位/城市...' },
  filter_country_in: { en: 'All in', zh: '' },

  // Tiers
  tier_f500: { en: 'Fortune 500', zh: '世界500强' },
  tier_unicorn: { en: 'Unicorn', zh: '独角兽' },
  tier_startup: { en: 'Startup', zh: '初创' },
  tier_gov: { en: 'Gov/NPO', zh: '政府/非营利' },

  // Regions
  reg_na: { en: '🇺🇸 NA', zh: '🇺🇸 北美' },
  reg_eu: { en: '🇪🇺 EU', zh: '🇪🇺 欧洲' },
  reg_apac: { en: '🌏 APAC', zh: '🌏 亚太' },
  reg_remote: { en: '🌐 Remote', zh: '🌐 远程' },

  // Industries
  ind_tech: { en: 'Technology', zh: '科技与互联网' },
  ind_finance: { en: 'Finance & Fintech', zh: '金融与金融科技' },
  ind_crypto: { en: 'Crypto & Web3', zh: '加密与Web3' },
  ind_consulting: { en: 'Consulting', zh: '咨询' },
  ind_healthcare: { en: 'Healthcare', zh: '医疗与生命科学' },
  ind_energy: { en: 'Energy', zh: '能源与清洁技术' },
  ind_industrial: { en: 'Industrial', zh: '工业与制造' },
  ind_consumer: { en: 'Consumer', zh: '消费与零售' },
  ind_media: { en: 'Media', zh: '媒体与娱乐' },
  ind_gov: { en: 'Government', zh: '政府与公共部门' },

  // Functions
  func_eng: { en: 'Engineering', zh: '工程与开发' },
  func_ai: { en: 'AI / ML & Data', zh: 'AI/ML与数据' },
  func_quant: { en: 'Quant Finance', zh: '量化金融' },
  func_product: { en: 'Product & Design', zh: '产品与设计' },
  func_marketing: { en: 'Marketing', zh: '市场与增长' },
  func_sales: { en: 'Sales & BD', zh: '销售与商务' },
  func_ops: { en: 'Operations', zh: '运营与战略' },
  func_fa: { en: 'Finance & Acct', zh: '财务与会计' },
  func_consulting: { en: 'Consulting', zh: '咨询与研究' },
  func_people: { en: 'People & Culture', zh: '人力资源' },

  // Sort
  sort_deadline: { en: '⏰', zh: '⏰' },
  sort_newest: { en: '🆕', zh: '🆕' },
  sort_company: { en: '🔤', zh: '🔤' },

  // Cards
  apply_now: { en: '🔗 Apply Now', zh: '🔗 立即投递' },
  smart_apply: { en: '🚀 Smart Apply', zh: '🚀 智能投递' },
  track_btn: { en: '📌 Track', zh: '📌 追踪' },
  preview_btn: { en: '📄 Preview', zh: '📄 预览' },
  hide_preview: { en: '📄 Hide', zh: '📄 收起' },
  more_actions: { en: 'More actions', zh: '更多操作' },
  sponsors_visa: { en: '🛂 Sponsors Visa', zh: '🛂 提供签证' },
  new_badge: { en: 'NEW', zh: '新' },
  closed_badge: { en: 'CLOSED', zh: '已截止' },
  rolling_badge: { en: 'ROLLING', zh: '滚动招聘' },
  left_days: { en: 'd LEFT', zh: '天后截止' },
  days_short: { en: 'd', zh: '天' },

  // Empty states
  no_results: { en: 'No internships found', zh: '未找到实习机会' },
  no_results_hint: { en: 'Try adjusting filters.', zh: '请调整筛选条件' },
  no_applications: { en: 'No applications yet', zh: '暂无投递记录' },
  no_applications_hint: { en: 'Click Track on any card to start.', zh: '点击卡片上的追踪按钮开始' },
  no_outcomes: { en: 'No outcomes yet', zh: '暂无结果' },
  no_outcomes_hint: { en: 'Offers and rejections will appear here.', zh: '录取和拒绝将显示在这里' },
  no_data_yet: { en: 'No data yet', zh: '暂无数据' },
  no_data_hint: { en: 'Start tracking applications with Track to see your funnel.', zh: '点击追踪按钮开始记录投递，查看漏斗分析' },
  data_load_error: { en: "Couldn't load data", zh: '数据加载失败' },
  data_load_hint: { en: 'The data file may be unavailable.', zh: '数据文件可能不可用' },
  retry: { en: '🔄 Retry', zh: '🔄 重试' },

  // Loading
  loading: { en: 'Loading internships…', zh: '加载实习机会中…' },

  // Pagination
  prev_page: { en: '←', zh: '←' },
  next_page: { en: '→', zh: '→' },

  // Auth
  welcome_title: { en: '🔐 Welcome to Internship Hunter', zh: '🔐 欢迎来到实习猎手' },
  username_label: { en: 'Username', zh: '用户名' },
  pin_label: { en: 'PIN', zh: '密码(PIN)' },
  pin_placeholder: { en: '4+ digit PIN', zh: '至少4位数字' },
  login_btn: { en: '🔓 Login', zh: '🔓 登录' },
  no_account: { en: "No account? Register here", zh: '没有账号？点此注册' },
  choose_username: { en: 'Choose Username', zh: '选择用户名' },
  username_placeholder: { en: 'e.g. alice', zh: '例如: alice' },
  create_pin: { en: 'Create PIN', zh: '创建PIN码' },
  confirm_pin: { en: 'Confirm PIN', zh: '确认PIN码' },
  register_btn: { en: '✨ Create Account', zh: '✨ 创建账号' },
  have_account: { en: 'Already have an account? Login', zh: '已有账号？点此登录' },
  auth_footer: { en: 'Your data (favorites, applications, profile) is saved in your browser and scoped to your account.', zh: '你的数据（收藏、投递记录、个人资料）保存在浏览器中，仅限你的账号访问。' },
  username_short: { en: 'Username must be at least 2 characters.', zh: '用户名至少需要2个字符' },
  pin_short: { en: 'PIN must be at least 4 characters.', zh: 'PIN至少需要4位数字' },
  username_taken: { en: 'Username already taken.', zh: '用户名已被占用' },
  user_not_found: { en: 'User not found.', zh: '用户不存在' },
  wrong_pin: { en: 'Wrong PIN.', zh: 'PIN码错误' },
  pins_dont_match: { en: 'PINs do not match.', zh: '两次PIN不一致' },

  // Onboarding
  onboard_title: { en: '🚀 Welcome! Let us set up your feed', zh: '🚀 欢迎！让我们为你定制信息流' },
  onboard_step1: { en: 'Step 1: What are you interested in?', zh: '第一步：你对哪些行业感兴趣？' },
  onboard_step2: { en: 'Step 2: Where do you want to work?', zh: '第二步：你想在哪里工作？' },
  onboard_next: { en: 'Next →', zh: '下一步 →' },
  onboard_finish: { en: '✨ Show me internships', zh: '✨ 查看实习机会' },
  onboard_skip: { en: 'Skip, show everything', zh: '跳过，查看全部' },

  // Smart Apply Wizard
  wizard_title: { en: '🚀 Smart Apply', zh: '🚀 智能投递' },
  wizard_step1: { en: 'Step 1: Check Materials', zh: '第一步：检查材料' },
  wizard_step1_desc: { en: 'Applying to', zh: '正在投递' },
  wizard_open_listing: { en: 'Open listing', zh: '打开职位链接' },
  wizard_no_link: { en: '(no link)', zh: '(无链接)' },
  wizard_missing_name: { en: 'Missing: fill name/email in Settings', zh: '缺失：请在设置中填写姓名/邮箱' },
  wizard_missing_edu: { en: 'Missing: fill education in Settings', zh: '缺失：请在设置中填写教育信息' },
  wizard_name_found: { en: 'Name & email found', zh: '姓名和邮箱已填写' },
  wizard_edu_found: { en: 'Education info found', zh: '教育信息已填写' },
  wizard_ready: { en: '✅ All materials ready', zh: '✅ 所有材料就绪' },
  wizard_step2: { en: 'Step 2: Launch via Claude Code', zh: '第二步：通过Claude Code启动' },
  wizard_copy: { en: '📋 Copy & Launch', zh: '📋 复制并启动' },
  wizard_step3: { en: 'Step 3: What Claude Will Do', zh: '第三步：Claude将做什么' },
  wizard_warning: { en: '⚠️ Never submits without your confirmation.', zh: '⚠️ 未经你确认不会提交' },

  // Track Modal
  track_title: { en: '📌 Track Application', zh: '📌 追踪投递' },
  track_company: { en: 'Company', zh: '公司' },
  track_role: { en: 'Role', zh: '职位' },
  track_status: { en: 'Status', zh: '状态' },
  track_date: { en: 'Date', zh: '日期' },
  track_notes: { en: 'Notes', zh: '备注' },
  track_notes_placeholder: { en: 'Confirmation #, next steps...', zh: '确认号、下一步...' },
  track_save: { en: '💾 Save', zh: '💾 保存' },
  status_applied: { en: '📨 Applied', zh: '📨 已投递' },
  status_interview: { en: '🎙️ Interview', zh: '🎙️ 面试' },
  status_offer: { en: '🎉 Offer', zh: '🎉 录取' },
  status_rejected: { en: '❌ Rejected', zh: '❌ 被拒' },
  status_accepted: { en: '✅ Accepted', zh: '✅ 已接受' },
  tracked_label: { en: '📌', zh: '📌' },

  // Settings
  candidate_profile: { en: '👤 Candidate Profile', zh: '👤 候选人资料' },
  not_configured: { en: 'Not configured', zh: '未配置' },
  configured: { en: 'Configured', zh: '已配置' },
  connections: { en: '🔗 Connections', zh: '🔗 连接状态' },
  notion_api_label: { en: 'Notion API', zh: 'Notion API' },
  playwright_label: { en: 'Playwright MCP', zh: 'Playwright MCP' },
  playwright_hint: { en: 'Run claude mcp add playwright', zh: '运行 claude mcp add playwright' },
  checking: { en: 'Checking...', zh: '检查中...' },
  connected: { en: 'Connected', zh: '已连接' },
  not_connected: { en: 'Not connected', zh: '未连接' },
  save_profile: { en: '💾 Save Profile', zh: '💾 保存资料' },
  identity: { en: 'Identity', zh: '身份信息' },
  full_name: { en: 'Full Name', zh: '姓名' },
  email: { en: 'Email', zh: '邮箱' },
  phone: { en: 'Phone', zh: '电话' },
  linkedin: { en: 'LinkedIn', zh: 'LinkedIn' },
  github: { en: 'GitHub', zh: 'GitHub' },
  education: { en: 'Education', zh: '教育背景' },
  university: { en: 'University', zh: '大学' },
  degree: { en: 'Degree', zh: '学位' },
  major: { en: 'Major', zh: '专业' },
  graduation: { en: 'Graduation', zh: '毕业时间' },
  target: { en: 'Target', zh: '求职意向' },
  target_roles: { en: 'Target Roles', zh: '意向职位' },
  target_cities: { en: 'Cities', zh: '意向城市' },
  target_remote: { en: 'Open to remote', zh: '接受远程工作' },

  // Analytics
  total_applications: { en: 'Total Applications', zh: '总投递数' },
  interviews: { en: 'Interviews', zh: '面试' },
  rate: { en: 'rate', zh: '率' },
  offers: { en: 'Offers', zh: '录取' },
  accepted: { en: 'Accepted', zh: '已接受' },
  apps_by_industry: { en: 'Applications by Industry', zh: '按行业投递分布' },
  funnel_stages: { en: 'Funnel Stages', zh: '漏斗阶段' },

  // CSV
  export_btn: { en: '📥', zh: '📥' },

  // Toast
  profile_saved: { en: 'Profile saved!', zh: '资料已保存！' },
  app_tracked: { en: 'Application tracked!', zh: '投递已记录！' },
  status_updated: { en: 'Status updated!', zh: '状态已更新！' },
  csv_exported: { en: 'CSV exported!', zh: 'CSV已导出！' },
  no_data_export: { en: 'No data to export', zh: '没有可导出的数据' },
  copied: { en: 'Copied! Paste into Claude Code.', zh: '已复制！粘贴到Claude Code' },
  copy_failed: { en: 'Failed to copy.', zh: '复制失败，请手动复制' },

  // CSV headers
  csv_company: { en: 'Company', zh: '公司' },
  csv_role: { en: 'Role', zh: '职位' },
  csv_industry: { en: 'Industry', zh: '行业' },
  csv_function: { en: 'Function', zh: '职能' },
  csv_tier: { en: 'Tier', zh: '级别' },
  csv_country: { en: 'Country', zh: '国家' },
  csv_city: { en: 'City', zh: '城市' },
  csv_region: { en: 'Region', zh: '地区' },
  csv_year: { en: 'Year', zh: '年份' },
  csv_season: { en: 'Season', zh: '学期' },
  csv_deadline: { en: 'Deadline', zh: '截止日期' },
  csv_status: { en: 'Status', zh: '状态' },
  csv_visa: { en: 'Visa', zh: '签证' },
  csv_url: { en: 'Apply URL', zh: '投递链接' },

  // Status tags
  ts_applied: { en: 'APPLIED', zh: '已投递' },
  ts_interview: { en: 'INTERVIEW', zh: '面试中' },
  ts_offer: { en: 'OFFER', zh: '已录取' },
  ts_rejected: { en: 'REJECTED', zh: '已拒绝' },
  ts_accepted: { en: 'ACCEPTED', zh: '已接受' },
  ts_no_notes: { en: 'No notes', zh: '无备注' },
};

function t(key) {
  const entry = I18N[key];
  if (!entry) return key;
  return entry[LANG] || entry.en;
}

function toggleLang() {
  LANG = LANG === 'en' ? 'zh' : 'en';
  localStorage.setItem('ih_lang', LANG);
  document.getElementById('langToggle').textContent = LANG === 'zh' ? '🇨🇳' : '🌐';
  rebuildFilterOptions();
  applyStaticI18n();
  // Re-render current view
  if (tab === 'discover') { page = 1; load(); }
  else if (tab === 'applied') renderApplied();
  else if (tab === 'ended') renderEnded();
  else if (tab === 'analytics') renderFunnel();
  // Update badges
  updateCounts(allData.length || fullData.length);
  loadStats();
}

function applyStaticI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = t(key);
    if (text && text !== key) el.textContent = text;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const text = t(key);
    if (text && text !== key) el.placeholder = text;
  });
}

// Init lang toggle icon
(function() {
  const saved = localStorage.getItem('ih_lang');
  if (saved) LANG = saved;
})();

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
  // Set language toggle icon
  document.getElementById('langToggle').textContent = LANG === 'zh' ? '🇨🇳' : '🌐';
  // Apply static translations
  applyStaticI18n();
  initStaticText();

  document.querySelectorAll('.nav-btn').forEach(b => b.addEventListener('click', function() {
    document.querySelectorAll('.nav-btn').forEach(x=>x.classList.remove('active'));
    this.classList.add('active'); tab = this.dataset.tab;
    document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
    const view = document.getElementById('view-'+tab);
    if (view) view.classList.add('active');
    if (tab === 'discover') render();
    if (tab === 'applied') renderApplied();
    if (tab === 'ended') renderEnded();
    if (tab === 'analytics') renderFunnel();
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

function initStaticText() {
  // Nav buttons
  document.querySelectorAll('.nav-btn').forEach((b,i) => {
    const keys = ['discover','applied','ended','analytics','settings'];
    if (keys[i]) b.innerHTML = t(keys[i]) + (b.querySelector('.nav-badge')?.outerHTML||'');
  });
  // Hero labels
  document.querySelectorAll('.hero-stat .lbl').forEach((el,i) => {
    const keys = ['open_now','closing_soon','saved','total'];
    if (keys[i]) el.textContent = t(keys[i]);
  });
  // Filter chips
  document.getElementById('filterFavorites').childNodes[0] && (document.getElementById('filterFavorites').childNodes[0].textContent = t('filter_saved'));
  document.getElementById('btnUrgent').childNodes[0] && (document.getElementById('btnUrgent').childNodes[0].textContent = t('filter_urgent'));
  document.getElementById('filterVisa').childNodes[0] && (document.getElementById('filterVisa').childNodes[0].textContent = t('filter_visa'));
  // Search placeholder
  document.getElementById('filterSearch').placeholder = t('search_placeholder');
}

function rebuildFilterOptions() {
  // Tier
  const tier = document.getElementById('filterTier');
  tier.innerHTML = `<option value="">${t('filter_tier_all')}</option>
    <option value="Fortune 500 / Global Corp">${t('tier_f500')}</option>
    <option value="Unicorn / Growth Stage">${t('tier_unicorn')}</option>
    <option value="Startup / SME">${t('tier_startup')}</option>
    <option value="Government / Non-profit">${t('tier_gov')}</option>`;
  // Region
  const reg = document.getElementById('filterRegion');
  reg.innerHTML = `<option value="">${t('filter_region_all')}</option>
    <option value="North America">${t('reg_na')}</option>
    <option value="Europe">${t('reg_eu')}</option>
    <option value="APAC">${t('reg_apac')}</option>
    <option value="Remote">${t('reg_remote')}</option>`;
  // Country
  updateCountryDropdown(getFilters().region || null);
  // Industry
  const ind = document.getElementById('filterIndustry');
  ind.innerHTML = `<option value="">${t('filter_industry_all')}</option>
    <option value="Technology & Internet">${t('ind_tech')}</option>
    <option value="Finance & Fintech">${t('ind_finance')}</option>
    <option value="Crypto & Web3">${t('ind_crypto')}</option>
    <option value="Consulting & Advisory">${t('ind_consulting')}</option>
    <option value="Healthcare & Life Sciences">${t('ind_healthcare')}</option>
    <option value="Energy & CleanTech">${t('ind_energy')}</option>
    <option value="Industrial & Manufacturing">${t('ind_industrial')}</option>
    <option value="Consumer & Retail">${t('ind_consumer')}</option>
    <option value="Media & Entertainment">${t('ind_media')}</option>
    <option value="Government & Public Sector">${t('ind_gov')}</option>`;
  // Function
  const func = document.getElementById('filterFunc');
  func.innerHTML = `<option value="">${t('filter_function_all')}</option>
    <option value="Engineering & Development">${t('func_eng')}</option>
    <option value="AI / ML & Data">${t('func_ai')}</option>
    <option value="Quantitative Finance">${t('func_quant')}</option>
    <option value="Product & Design">${t('func_product')}</option>
    <option value="Marketing & Growth">${t('func_marketing')}</option>
    <option value="Sales & BD">${t('func_sales')}</option>
    <option value="Operations & Strategy">${t('func_ops')}</option>
    <option value="Finance & Accounting">${t('func_fa')}</option>
    <option value="Consulting & Research">${t('func_consulting')}</option>
    <option value="People & Culture">${t('func_people')}</option>`;
  // Year
  const year = document.getElementById('filterYear');
  year.innerHTML = `<option value="">${t('filter_year_all')}</option>
    <option value="2026">2026</option><option value="2027">2027</option>`;
}

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
  // Show onboarding if first time
  if (!Store.profile()?.onboarded) { showOnboarding(); }
  else { load(); loadProfileForm(); }
}

function doRegister() {
  const u = document.getElementById('authRegUser').value.trim();
  const p = document.getElementById('authRegPin').value.trim();
  const p2 = document.getElementById('authRegPin2').value.trim();
  if (p !== p2) { document.getElementById('authError').textContent = t('pins_dont_match'); return; }
  const r = UserStore.register(u, p);
  if (!r.ok) { document.getElementById('authError').textContent = r.msg; return; }
  UserStore.login(u, p);
  document.getElementById('authModal').hidden = true;
  currentUser = u;
  updateUserUI();
  load();
  loadProfileForm();
}

/* ─── Onboarding ────────────────────────────────────────────── */
function showOnboarding() {
  document.getElementById('onboardStep1').style.display = 'block';
  document.getElementById('onboardStep2').style.display = 'none';
  document.getElementById('onboardModal').hidden = false;
}
function onboardNext() {
  document.getElementById('onboardStep1').style.display = 'none';
  document.getElementById('onboardStep2').style.display = 'block';
}
function finishOnboarding() {
  // Apply selections as filters
  const inds = [...document.querySelectorAll('#onboardInds input:checked')].map(c=>c.value);
  const regs = [...document.querySelectorAll('#onboardRegs input:checked')].map(c=>c.value);
  if (inds.length) document.getElementById('filterIndustry').value = inds[0];
  if (regs.length) document.getElementById('filterRegion').value = regs[0];
  // Save preference
  const p = Store.profile(); p.onboarded = true;
  if (inds.length) p.target = {...p.target||{}, industries: inds};
  if (regs.length) p.target = {...p.target||{}, preferred_regions: regs};
  Store.saveProfile(p);
  document.getElementById('onboardModal').hidden = true;
  load();
  loadProfileForm();
}

/* ─── NEW Badge ──────────────────────────────────────────────── */
function isNew(createdTime) {
  if (!createdTime) return false;
  const diff = Date.now() - new Date(createdTime).getTime();
  return diff < 7 * 24 * 3600 * 1000; // 7 days
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
        <h2>${t("data_load_error")}</h2>
        <p>${e.message}. ${t("data_load_hint")}</p>
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

// Double-click card to open Apply URL
document.addEventListener('dblclick', function(e) {
  const card = e.target.closest('.card');
  if (!card) return;
  const applyBtn = card.querySelector('a[href]');
  if (applyBtn) window.open(applyBtn.href, '_blank');
});

function renderCardsFrom(data) {
  const grid = document.getElementById('cardGrid');
  if (!data.length) { grid.innerHTML = '<div class="empty-state"><div class="empty-icon">🔍</div><h2>${t("no_results")}</h2><p>${t("no_results_hint")}</p></div>'; return; }
  grid.innerHTML = data.map(card).join('');
}

function loadStats() {
  document.getElementById('statTotal').textContent = fullData.length||'--';
  document.getElementById('statOpen').textContent = fullData.filter(e=>e.jobStatus==='Open').length;
  document.getElementById('statUrgent').textContent = fullData.filter(e=>e.deadline&&e.jobStatus==='Open'&&daysLeft(e.deadline)<=14).length;
}

function updateCounts(apiTotal) {
  document.getElementById('totalBadge').innerHTML = (apiTotal||allData.length) + ' <span>' + t('internships') + '</span>';
  document.getElementById('favoriteCount').textContent = Store.favs().size;
  const apps = Store.apps();
  document.getElementById('appliedCount').textContent = apps.filter(a=>a.status==='applied'||a.status==='interview').length;
  document.getElementById('endedCount').textContent = apps.filter(a=>a.status==='offer'||a.status==='rejected'||a.status==='accepted').length;
}

/* ─── Render Cards ──────────────────────────────────────────── */
function render() {
  const grid = document.getElementById('cardGrid');
  if (!allData.length) {
    grid.innerHTML = '<div class="empty-state"><div class="empty-icon">🔍</div><h2>${t("no_results")}</h2><p>Try adjusting your filters.</p></div>';
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
    if (d < 0) { dlHtml = `<span class="dl-badge dl-closed">${t("closed_badge")}</span> ${dl}`; dlCls = 'urgent'; }
    else if (d <= 7) { dlHtml = `<span class="dl-badge dl-urgent">⚠ ${d}${t("days_short")} ${t("left_days")}</span> ${dl}`; dlCls = 'urgent'; }
    else if (d <= 30) { dlHtml = `<span class="dl-badge dl-warn">⚡ ${d}d</span> ${dl}`; dlCls = 'warn'; }
    else { dlHtml = `<span class="dl-badge dl-ok">${d}d</span> ${dl}`; }
  } else {
    dlHtml = (e.notes||'').toLowerCase().includes('rolling') ? '<span class="dl-badge dl-rolling">${t("rolling_badge")}</span>' : '';
  }

  return `
  <div class="card${d !== null && d <= 7 && d >= 0 ? ' card-urgent' : ''}" data-industry="${indClass}" data-id="${e.id}">
    <div class="card-top">
      <div style="display:flex;align-items:center;gap:6px">
        ${isNew(e.createdTime) ? '<span class="new-badge">${t("new_badge")}</span>' : ''}
        <span class="card-region-info">${e.regionFlag||'🌍'} ${e.region||''} · ${e.country} · ${e.city}</span>
      </div>
      <div style="display:flex;align-items:center;gap:6px">
        ${tracked ? `<span class="card-tracked">📌 ${tracked.status}</span>` : ''}
        <button class="card-fav${isFav?' active':''}" onclick="toggleFav(this,'${e.id}')">${isFav?'⭐':'☆'}</button>
      </div>
    </div>
    <div class="card-company">${esc(e.company)}</div>
    <div class="card-role">${esc(e.role)}</div>
    <div class="card-tags">
      ${e.companyTier ? `<span class="tag tag-tier">${esc(e.companyTier)}</span>` : ''}
      ${e.visaSponsorship ? '<span class="tag tag-visa">${t("sponsors_visa")}</span>' : ''}
      <span class="tag tag-ind">${esc(e.industry.join(', ')||'?')}</span>
      ${((e.function||e.specialization||[])[0]) ? `<span class="tag tag-func">${esc((e.function||e.specialization)[0])}</span>` : ''}
      <span class="tag tag-loc">${esc(e.country)}</span>
      ${salaryTag(e.notes)}
      ${e.year ? `<span class="tag tag-year">📅 ${e.year} · ${e.season||'Summer'}</span>` : ''}
    </div>
    <div class="card-deadline ${dlCls}">${dlHtml}</div>
    <div class="card-actions">
      ${e.applyUrl ? `<a href="${e.applyUrl}" target="_blank" rel="noopener" class="btn-act primary">${t("apply_now")}</a>` : ''}
      <button class="btn-act primary" onclick="openWizard('${escAttr(e.company)}','${escAttr(e.role)}','${escAttr(e.applyUrl)}','${e.id}')">${t("smart_apply")}</button>
      <div class="card-menu-wrap">
        <button class="btn-act card-menu-btn" onclick="toggleCardMenu(this)" title="${t("more_actions")}">···</button>
        <div class="card-menu" style="display:none">
          <button onclick="openTrack('${e.id}','${escAttr(e.company)}','${escAttr(e.role)}');this.closest('.card-menu').style.display='none'">${t("track_btn")}</button>
          <button onclick="togglePreview(this,'${e.id}');this.closest('.card-menu').style.display='none'">${t("preview_btn")}</button>
        </div>
      </div>
    </div>
    <div class="card-preview" id="preview-${e.id}" style="display:none">
      <div class="preview-content">${esc(e.jdSummary || e.notes || t('no_results_hint'))}</div>
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
    .then(()=>toast(t('copied'),'success'))
    .catch(()=>toast(t('copy_failed'),'error'));
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
  toast(t('app_tracked'), 'success');
}

/* ─── Applied / Ended Views ─────────────────────────────────── */
function renderApplied() {
  const c = document.getElementById('appliedContent');
  const apps = Store.apps().filter(a=>a.status==='applied'||a.status==='interview');
  if (!apps.length) { c.innerHTML = '<div class="empty-state"><div class="empty-icon">📋</div><h2>${t("no_applications")}</h2><p>${t("no_applications_hint")}</p></div>'; return; }
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
  if (!apps.length) { c.innerHTML = '<div class="empty-state"><div class="empty-icon">✅</div><h2>${t("no_outcomes")}</h2><p>${t("no_outcomes_hint")}</p></div>'; return; }
  c.innerHTML = '<div class="track-list">'+apps.map(a=>`
    <div class="track-card ended">
      <div class="track-icon">${a.status==='accepted'?'🎉':a.status==='offer'?'📨':'👋'}</div>
      <div class="track-info"><strong>${esc(a.company)}</strong><div class="track-role">${esc(a.role)}</div><div class="track-meta">📅 ${a.date} · ${a.notes||''}</div></div>
      <span class="track-status ts-${a.status}">${a.status.toUpperCase()}</span>
    </div>`).join('')+'</div>';
}
function updAppStatus(id, status) { Store.updApp(id, {status}); if(tab==='applied') renderApplied(); if(tab==='ended') renderEnded(); updateCounts(); toast(t('status_updated'),'success'); }

/* ─── Profile ───────────────────────────────────────────────── */
// Profile stored in user-scoped localStorage
async function loadProfileForm() {
  const p = Store.profile();
  if (!p || !p.identity) { document.getElementById('profileStatus').textContent = t('not_configured'); return; }
  try {
    const i=p.identity||{}; document.getElementById('pfName').value=i.full_name||''; document.getElementById('pfEmail').value=i.email||''; document.getElementById('pfPhone').value=i.phone||''; document.getElementById('pfLinkedin').value=i.linkedin||''; document.getElementById('pfGithub').value=i.github||'';
    const e=p.education||{}; document.getElementById('pfUni').value=e.university||''; document.getElementById('pfDegree').value=e.degree||''; document.getElementById('pfMajor').value=e.major||''; document.getElementById('pfGrad').value=(e.graduation_month&&e.graduation_year)?e.graduation_month+' '+e.graduation_year:'';
    const t=p.target||{}; document.getElementById('pfRoles').value=(t.roles||[]).join(', '); document.getElementById('pfCities').value=(t.preferred_cities||[]).join(', '); document.getElementById('pfRemote').checked=t.open_to_remote!==false;
    document.getElementById('profileStatus').textContent=t('configured'); document.getElementById('profileStatus').style.color='var(--green)';
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
  document.getElementById('profileStatus').textContent=t('configured'); document.getElementById('profileStatus').style.color='var(--green)';
  toast(t('profile_saved'),'success');
}

/* ─── Settings ──────────────────────────────────────────────── */
function checkNotion() {
  // For static site, just check if data.json loads
  fetch('/data.json').then(r => {
    if (r.ok) { document.getElementById('notionStatus').textContent = t('connected'); document.getElementById('notionStatus').style.color = 'var(--green)'; }
    else { document.getElementById('notionStatus').textContent = t('not_connected'); }
  }).catch(() => { document.getElementById('notionStatus').textContent = t('not_connected'); });
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

function toggleCardMenu(btn) {
  const menu = btn.nextElementSibling;
  const isOpen = menu.style.display === 'block';
  // Close all other menus
  document.querySelectorAll('.card-menu').forEach(m => m.style.display = 'none');
  menu.style.display = isOpen ? 'none' : 'block';
}
// Close card menu on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('.card-menu-wrap')) {
    document.querySelectorAll('.card-menu').forEach(m => m.style.display = 'none');
  }
});

function togglePreview(btn, id) {
  const panel = document.getElementById('preview-'+id);
  if (!panel) return;
  const shown = panel.style.display === 'block';
  panel.style.display = shown ? 'none' : 'block';
  btn.textContent = shown ? '📄 Preview' : '📄 Hide';
}

/* ─── Funnel Analytics ──────────────────────────────────────── */
function renderFunnel() {
  const apps = Store.apps();
  const ct = document.getElementById('funnel');
  if (!ct) return;

  if (!apps.length) {
    ct.innerHTML = '<div class="empty-state"><div class="empty-icon">📊</div><h2>${t("no_data_yet")}</h2><p>${t("no_data_hint")}</p></div>';
    return;
  }

  const stages = { applied: 0, interview: 0, offer: 0, rejected: 0, accepted: 0 };
  for (const a of apps) { if (stages[a.status] !== undefined) stages[a.status]++; }

  const total = apps.length;
  const interviewRate = stages.applied > 0 ? ((stages.interview / stages.applied) * 100).toFixed(0) : 0;
  const offerRate = (stages.interview + stages.offer + stages.accepted) > 0
    ? (((stages.offer + stages.accepted) / (stages.interview + stages.offer + stages.accepted + stages.rejected)) * 100).toFixed(0) : 0;

  // Industry breakdown
  const byInd = {};
  for (const a of apps) {
    const match = fullData.find(e => e.id === a.notionId);
    const ind = match ? (match.industry[0] || 'Unknown') : 'Unknown';
    byInd[ind] = (byInd[ind] || 0) + 1;
  }

  ct.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;margin-bottom:20px">
      <div class="funnel-card"><div class="funnel-num">${total}</div><div class="funnel-lbl">Total Applications</div></div>
      <div class="funnel-card"><div class="funnel-num">${stages.interview}</div><div class="funnel-lbl">Interviews · ${interviewRate}% rate</div></div>
      <div class="funnel-card"><div class="funnel-num">${stages.offer + stages.accepted}</div><div class="funnel-lbl">Offers · ${offerRate}% rate</div></div>
      <div class="funnel-card"><div class="funnel-num">${stages.accepted}</div><div class="funnel-lbl">Accepted</div></div>
    </div>
    <h3 style="margin-bottom:12px">Applications by Industry</h3>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px">
      ${Object.entries(byInd).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`
        <div class="funnel-bar"><span>${k}</span><span>${v}</span><div class="fbar"><div style="width:${(v/total*100)}%"></div></div></div>
      `).join('')}
    </div>
    <h3 style="margin:20px 0 12px">Funnel Stages</h3>
    <div class="funnel-viz">
      ${['applied','interview','offer','accepted'].map(s=>`
        <div class="fv-stage"><div class="fv-bar" style="height:${Math.max(stages[s]/total*200, 4)}px"></div><span>${s}</span><strong>${stages[s]||0}</strong></div>
      `).join('')}
    </div>`;
}

/* ─── CSV Export ────────────────────────────────────────────── */
function exportCSV() {
  const data = allData.length > 0 ? allData : fullData;
  if (!data.length) return toast(t('no_data_export'),'error');
  const headers = [t('csv_company'),t('csv_role'),t('csv_industry'),t('csv_function'),t('csv_tier'),t('csv_country'),t('csv_city'),t('csv_region'),t('csv_year'),t('csv_season'),t('csv_deadline'),t('csv_status'),t('csv_visa'),t('csv_url')];
  const rows = data.map(e => [
    e.company, e.role, (e.industry||[]).join('; '), (e.function||e.specialization||[])[0]||'',
    e.companyTier||'', e.country, e.city, e.region, e.year, e.season,
    e.deadline||'Rolling', e.jobStatus, e.visaSponsorship?'Yes':'No', e.applyUrl
  ].map(v => '"'+String(v).replace(/"/g,'""')+'"').join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['﻿'+csv], {type:'text/csv;charset=utf-8'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = 'internships-'+new Date().toISOString().split('T')[0]+'.csv';
  a.click(); toast(t('csv_exported'),'success');
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
