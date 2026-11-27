/* Shared site code: header/footer, toy cards, homepage widgets, toys page */
(function(){
  const MW = window.PP_MW || [], PAT = window.PP_PATREON || [];
  const LINKS = {
    mw:'https://makerworld.com/en/@spot5438', patreon:'https://www.patreon.com/Patopato_design',
    thangs:'https://thangs.com/designer/Patopato%20design', nexprint:'https://www.nexprint.com/en/search/creators?keyword=Patopato_design',
    yt:'https://www.youtube.com/@Patopato_design', ig:'https://www.instagram.com/patopato_design/',
    course:'https://makerworld.com/en/maker-kids/course/FCX8RW7V'
  };
  window.PP_LINKS = LINKS;
  const SERIES = {pop:'Pop-Eyed', air:'Air Pressure', hands:'Robot hands', spin:'Spin & fly', puzzle:'Puzzles', more:'More toys'};
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const k = n => n >= 1000 ? (n/1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/,'') + 'K' : String(n);
  const SHORT = window.PP_SHORT || {};
const mwUrl = id => SHORT[id] || 'https://makerworld.com/en/models/' + id;
const patUrl = u => SHORT[u] || u;

  // header + footer
  const here = (location.pathname.split('/').pop() || 'index.html');
  const top = document.getElementById('top');
  // right-side tabs in the same picture style (Louis 11/26)
  const SIDE = [['toys.html','all','All toys',''],['sellers.html','sellers','Sellers',''],['about.html','about','About',''],[LINKS.patreon,'patreon','Join on Patreon',' pat']];
  // top nav: category tabs with simplified product pictures (Louis 11/26: combine with the text tabs, Apple-style)
  const TABS = [['pop','Pop-Eyed'],['air','Air Pressure'],['tanks','Tanks'],['cars','Cars'],['apm','APM'],['spin','Spin Tops'],['hands','Grabbers'],['puzzle','Puzzles']];
  const curHash = (location.hash || '').slice(1);
  const sideHtml = () => '<span class="tabdiv" aria-hidden="true"></span>' + SIDE.map(s => '<a class="tab' + s[3] + (here === s[0] && !(s[0] === 'toys.html' && curHash) ? ' on' : '') + '" href="' + s[0] + '"' + (s[0].startsWith('http') ? ' target="_blank" rel="noopener"' : '') + '><img src="img/cat-' + s[1] + '.png" alt="" width="44" height="44"><span>' + s[2] + '</span></a>').join('') + '</nav></div>';
  if (top) top.innerHTML = '<div class="wrap topbar"><a class="logo" href="index.html"><img src="img/logo.png" alt="" width="40" height="40">Patopato</a>' +
    '<nav class="tabs" aria-label="Main">' + TABS.map(t => '<a class="tab' + (here === 'toys.html' && curHash === t[0] ? ' on' : '') + '" href="toys.html#' + t[0] + '"><img src="img/cat-' + t[0] + '.png" alt="" width="44" height="44"><span>' + t[1] + '</span></a>').join('') +
    sideHtml();

  window.addEventListener('hashchange', () => { const h = location.hash.slice(1); document.querySelectorAll('.tabs .tab').forEach(x => x.classList.toggle('on', x.getAttribute('href') === 'toys.html#' + h)); });
  const foot = document.getElementById('foot');
  if (foot) foot.innerHTML = '<div class="wrap"><a class="logo" href="index.html" style="color:#fff"><img src="img/logo.png" alt="" width="48" height="48">Patopato</a>' +
    '<p>Toys by Louis, a mechanical engineer and a dad of two boys. Even the springs are 3D printed.</p>' +
    '<div class="links"><a href="' + LINKS.mw + '" target="_blank" rel="noopener">MakerWorld</a><a href="' + LINKS.patreon + '" target="_blank" rel="noopener">Patreon</a>' +
    '<a href="' + LINKS.thangs + '" target="_blank" rel="noopener">Thangs</a><a href="' + LINKS.nexprint + '" target="_blank" rel="noopener">Nexprint</a>' +
    '<a href="' + LINKS.course + '" target="_blank" rel="noopener">MakerWorld course</a><a href="' + LINKS.yt + '" target="_blank" rel="noopener">YouTube</a>' +
    '<a href="' + LINKS.ig + '" target="_blank" rel="noopener">Instagram</a><a href="sellers.html">Sell Patopato toys</a><a href="about.html">About</a></div>' +
    '<p>Questions, wholesale or collaboration: <a href="mailto:hi@patopatodesign.com">hi@patopatodesign.com</a></p>' +
    '<small>© ' + new Date().getFullYear() + ' Patopato Design</small></div>';

  // cards
  // download pill with flames: 1K+ one, 5K+ two, 10K+ three (Louis 11/27)
  function dl(n){
    const t = n >= 10000 ? 3 : n >= 5000 ? 2 : n >= 1000 ? 1 : 0;
    return '<span class="pill heat' + t + '">' + (t ? '<span class="fire" aria-hidden="true">' + '\u{1F525}'.repeat(t) + '</span>' : '') + '<svg class="dlico" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2v8m0 0L4.5 6.5M8 10l3.5-3.5M3 13h10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' + k(n) + '<span class="word"> downloads</span></span>';
  }
  // compact cards (Louis 11/26): picture, title, one small line
  function mwCard(m){
    return '<a class="toy" href="' + mwUrl(m.id) + '" target="_blank" rel="noopener"><span class="pic"><img loading="lazy" src="img/' + m.id + '.jpg" alt="' + esc(m.t) + '"><i class="badge free">Free</i></span>' +
      '<div class="body"><b>' + esc(m.t) + '</b><span class="line">' + dl(m.d) + '<span class="go">Download ›</span></span></div></a>';
  }
  function patCard(p){
    return '<a class="toy" href="' + patUrl(p.u) + '" target="_blank" rel="noopener"><span class="pic"><img loading="lazy" src="img/' + p.img + '" alt="' + esc(p.t) + '">' + (p.pr === 0 ? '<i class="badge free">Free</i>' : '<i class="badge pat">Members</i>') + '</span>' +
      '<div class="body"><b>' + esc(p.t) + '</b><span class="line">' + (p.pr === 0 ? '<span class="pill free">Free</span>' : p.pr ? '<span class="pill price">$' + p.pr + '</span>' : '<span class="pill price">Members</span>') + '<span class="go">Patreon ›</span></span></div></a>';
  }
  window.PP_CARDS = {mwCard, patCard};

  // weighted shuffle: popular and new toys come up more often, but every load is different
  function shuffle(list){
    const now = Date.now();
    return list.map(m => {
      const ageDays = (now - Date.parse(m.p || '2024-01-01')) / 864e5;
      const w = Math.log10((m.d || 50) + 10) + (ageDays < 60 ? 1.5 : 0);
      return [m, Math.pow(Math.random(), 1 / w)];
    }).sort((a, b) => b[1] - a[1]).map(a => a[0]);
  }

  // ---------- homepage ----------
  const feed = document.getElementById('feed');
  if (feed){
    const pool = shuffle(MW); let n = 0;
    const more = document.getElementById('feed-more');
    function addMore(){ const html = pool.slice(n, n + 12).map(mwCard).join(''); n += 12; feed.insertAdjacentHTML('beforeend', html);
      if (n >= pool.length && more) more.hidden = true; }
    addMore();
    if (more){
      more.addEventListener('click', addMore);
      if ('IntersectionObserver' in window){ let auto = 0;
        new IntersectionObserver(es => { if (es[0].isIntersecting && auto < 3 && n < pool.length){ auto++; addMore(); } }, {rootMargin:'300px'}).observe(more); }
    }
  }
  // series tiles with live counts
  const tiles = document.getElementById('series');
  if (tiles){
    const S = [['pop','Pop-Eyed','Press them and the eyes pop out','2144875'],['air','Air Pressure','Punch it and it flies','726755'],['hands','Grabbers','Grab anything, even chips','850566'],['spin','Spin Tops','Spin tops and launchers','702556'],['puzzle','Puzzles','Pocket-size brain teasers','2938577']];
    tiles.innerHTML = S.map(s => { const n = MW.filter(m => m.s === s[0]).length + PAT.filter(p => p.s === s[0]).length;
      return '<a class="tile" href="toys.html#' + s[0] + '"><img loading="lazy" src="img/' + s[3] + '.jpg" alt=""><div><b>' + s[1] + '</b><span>' + s[2] + '</span><small>' + n + ' toys ›</small></div></a>'; }).join('');
  }
  const totalToys = document.getElementById('stat-toys');
  if (totalToys) totalToys.textContent = (MW.length + PAT.length) + '';
  const pc = document.getElementById('pat-count'); if (pc) pc.textContent = PAT.length;
  const patRow = document.getElementById('patreon-row');
  if (patRow) patRow.innerHTML = PAT.map(patCard).join('');
  const xmasRow = document.getElementById('xmas-row');
  if (xmasRow) xmasRow.innerHTML = MW.filter(m => m.z === 'xmas').map(mwCard).join('') + PAT.filter(p => p.z === 'xmas').map(patCard).join('');

  // carousel
  const track = document.getElementById('track');
  if (track){
    const slides = track.children.length, dots = document.getElementById('dots'); let s = 0, timer;
    for (let i = 0; i < slides; i++){ const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Slide ' + (i + 1));
      b.addEventListener('click', () => { go(i); restart(); }); dots.appendChild(b); }
    function go(i){ s = (i + slides) % slides; [...track.children].forEach((el, j) => el.classList.toggle('on', j === s));
      [...dots.children].forEach((d, j) => d.classList.toggle('on', j === s)); }
    function restart(){ clearInterval(timer); if (!matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => go(s + 1), 4500); }
    go(0); restart();
  }

  // capsule machine
  const crank = document.getElementById('crank');
  if (crank){
    const out = document.getElementById('prize'), globe = document.getElementById('globe'), shelf = document.getElementById('collected'), cnt = document.getElementById('count');
    const all = MW.map(m => ({img:'img/' + m.id + '.jpg', t:m.t, u:mwUrl(m.id), where:'Download on MakerWorld'}))
      .concat(PAT.map(p => ({img:'img/' + p.img, t:p.t, u:patUrl(p.u), where:'Get it on Patreon'})));
    const got = new Set();
    crank.addEventListener('click', () => {
      crank.classList.remove('turn'); globe.classList.remove('shake'); void crank.offsetWidth; crank.classList.add('turn'); globe.classList.add('shake');
      setTimeout(() => {
        const t = all[Math.floor(Math.random() * all.length)];
        out.innerHTML = '<a class="prize" href="' + t.u + '" target="_blank" rel="noopener"><img src="' + t.img + '" alt=""><b>You got: ' + esc(t.t) + '!</b><span class="go">' + t.where + ' ›</span></a>';
        if (!got.has(t.img)){ got.add(t.img); const i = document.createElement('img'); i.src = t.img; i.alt = t.t; shelf.appendChild(i); cnt.textContent = got.size; }
      }, 550);
    });
    document.getElementById('total').textContent = all.length;
  }

  // ---------- toys page ----------
  const grid = document.getElementById('grid');
  if (grid){
    const chips = document.getElementById('filters'), q = document.getElementById('q'), sort = document.getElementById('sort'), count = document.getElementById('found');
    const FILTERS = [['all','All toys'],['pop','Pop-Eyed'],['air','Air Pressure'],['tanks','Tanks'],['cars','Cars'],['apm','APM'],['spin','Spin Tops'],['hands','Grabbers'],['puzzle','Puzzles'],['more','More toys'],['xmas','Christmas'],['halloween','Halloween']];
    const PLATFORMS = [['any','Free + members'],['MakerWorld','Free (MakerWorld)'],['Patreon','Members (Patreon)'],['Thangs','Thangs'],['Nexprint','Nexprint']];
    chips.innerHTML = FILTERS.map(f => '<a class="chip" id="f-' + f[0] + '" href="#' + f[0] + '">' + f[1] + '</a>').join('');
    const plat = document.getElementById('platform');
    plat.innerHTML = PLATFORMS.map(p => '<option value="' + p[0] + '">' + p[1] + '</option>').join('');
    const params = new URLSearchParams(location.search);
    if (params.get('q')) q.value = params.get('q');
    if (location.hash === '#patreon'){ plat.value = 'Patreon'; history.replaceState(null, '', location.pathname + location.search + '#all'); }
    function render(){
      // compact view everywhere except when someone searched from the homepage (Louis 11/27)
      document.body.classList.toggle('cat-view', !q.value.trim());
      const DESC = {all:['All toys','Every Patopato toy in one place.'], pop:['Pop-Eyed','Press them and the eyes pop out.'], air:['Air Pressure','Punch it and it flies. One hit launches the ammo.'],
        tanks:['Tanks','Air Pressure tanks that fire ammo. Kids play with them for hours.'], cars:['Cars','Air Pressure cars. More cars are on the way.'],
        apm:['APM','Air Pressure Modules: swap the modules, print less, play more.'], spin:['Spin Tops','Easy-print spin tops and launchers.'],
        hands:['Grabbers','Robot hands and grabbers. Grab anything, even chips.'], puzzle:['Puzzles','Pocket-size sliding puzzles.'],
        more:['More toys','Little gadgets and fun extras.'], xmas:['Christmas','Toys for the holidays.'], halloween:['Halloween','Spooky toys for October.']};
      const d0 = DESC[(location.hash || '#all').slice(1)];
      if (d0){ document.getElementById('cat-title').textContent = d0[0]; document.getElementById('cat-desc').textContent = d0[1] + ' Free toys download on MakerWorld; members-only toys are on Patreon.'; }
      const f = (location.hash || '#all').slice(1), text = q.value.trim().toLowerCase(), p = plat.value;
      chips.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c.id === 'f-' + f));
      const hit = x => f === 'all' || x.s === f || x.z === f || (f === 'apm' && /APM/.test(x.t)) || (f === 'tanks' && /tank/i.test(x.t)) || (f === 'cars' && /(^|[^a-z])car([^a-z]|$)|roadster/i.test(x.t));
      let mw = MW.filter(hit), pat = PAT.filter(hit);
      if (p === 'Patreon') mw = [];
      else if (p === 'MakerWorld') pat = [];
      else if (p !== 'any'){ mw = mw.filter(m => m.x.includes(p)); pat = []; }
      if (text){ mw = mw.filter(m => m.t.toLowerCase().includes(text)); pat = pat.filter(x => x.t.toLowerCase().includes(text)); }
      // one combined list so every sort mixes free and members toys (Louis 11/27)
      const items = mw.map(m => ({kind:'mw', o:m, date:m.p, pop:m.d, price:0}))
        .concat(pat.map(x => ({kind:'pat', o:x, date:x.p || '', pop:-1, price:(x.pr == null ? 999 : x.pr)})));
      const by = {
        pop: (a, b) => b.pop - a.pop || b.date.localeCompare(a.date),
        new: (a, b) => b.date.localeCompare(a.date),
        price: (a, b) => a.price - b.price || b.pop - a.pop
      }[sort.value] || ((a, b) => b.pop - a.pop);
      items.sort(by);
      // Most popular: mix the members toys in at random spots so they show up near the top too (Louis 11/27)
      if ((sort.value || 'pop') === 'pop'){
        const free = items.filter(i => i.kind === 'mw'), paid = items.filter(i => i.kind === 'pat').sort(() => Math.random() - 0.5);
        const mixed = []; let next = 1 + Math.floor(Math.random() * 2);
        free.forEach((it, idx) => { mixed.push(it); if (idx + 1 === next && paid.length){ mixed.push(paid.shift()); next += 2 + Math.floor(Math.random() * 3); } });
        items.splice(0, items.length, ...mixed, ...paid);
      }
      grid.innerHTML = items.map(it => it.kind === 'mw' ? mwCard(it.o) : patCard(it.o)).join('') || '<p class="muted">No toys match. Try another word or platform.</p>';
      count.textContent = (mw.length + pat.length) + ' toys';
      [['show-all','any'],['show-free','MakerWorld'],['show-members','Patreon']].forEach(([id, v]) => { const b = document.getElementById(id); if (b) b.classList.toggle('on', p === v); });
      const h = document.getElementById('toys-title'); if (h) h.textContent = (FILTERS.find(x => x[0] === f) || FILTERS[0])[1];
    }
    plat.addEventListener('change', render);
    const catShow = document.getElementById('cat-show');
    if (catShow){ catShow.value = plat.value === 'MakerWorld' || plat.value === 'Patreon' ? plat.value : 'any'; catShow.addEventListener('change', () => { plat.value = catShow.value; render(); }); }
    const catSort = document.getElementById('cat-sort');
    if (catSort){ catSort.value = sort.value; catSort.addEventListener('change', () => { sort.value = catSort.value; render(); }); sort.addEventListener('change', () => { catSort.value = sort.value; }); }
    [['show-all','any'],['show-free','MakerWorld'],['show-members','Patreon']].forEach(([id, v]) => { const b = document.getElementById(id); if (b) b.addEventListener('click', e => { e.preventDefault(); plat.value = v; render(); }); });
    if (params.get('show') === 'members') plat.value = 'Patreon'; else if (params.get('show') === 'free') plat.value = 'MakerWorld';
    window.addEventListener('hashchange', render); q.addEventListener('input', render); sort.addEventListener('change', render); render();
  }

  // sellers page: best sellers = most downloaded
  const best = document.getElementById('best');
  if (best) best.innerHTML = MW.slice().sort((a, b) => b.d - a.d).slice(0, 8).map(mwCard).join('');
})();
