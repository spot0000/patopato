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
  const mwUrl = id => 'https://makerworld.com/en/models/' + id;

  // header + footer
  const here = (location.pathname.split('/').pop() || 'index.html');
  const top = document.getElementById('top');
  if (top) top.innerHTML = '<div class="wrap"><a class="logo" href="index.html">Patopato</a><nav class="nav" aria-label="Main">' +
    '<a href="toys.html">All toys</a><a class="hide-s" href="toys.html#pop">Pop-Eyed</a><a class="hide-s" href="toys.html#air">Air Pressure</a>' +
    '<a href="sellers.html">Sellers</a><a class="hide-s" href="about.html">About</a>' +
    '<a class="btn small" href="' + LINKS.patreon + '" target="_blank" rel="noopener">Join on Patreon</a></nav></div>';
  const foot = document.getElementById('foot');
  if (foot) foot.innerHTML = '<div class="wrap"><a class="logo" href="index.html" style="color:#fff">Patopato</a>' +
    '<p>Toys by Louis, a mechanical engineer and a dad of two boys. Even the springs are 3D printed.</p>' +
    '<div class="links"><a href="' + LINKS.mw + '" target="_blank" rel="noopener">MakerWorld</a><a href="' + LINKS.patreon + '" target="_blank" rel="noopener">Patreon</a>' +
    '<a href="' + LINKS.thangs + '" target="_blank" rel="noopener">Thangs</a><a href="' + LINKS.nexprint + '" target="_blank" rel="noopener">Nexprint</a>' +
    '<a href="' + LINKS.course + '" target="_blank" rel="noopener">MakerWorld course</a><a href="' + LINKS.yt + '" target="_blank" rel="noopener">YouTube</a>' +
    '<a href="' + LINKS.ig + '" target="_blank" rel="noopener">Instagram</a><a href="sellers.html">Sell Patopato toys</a><a href="about.html">About</a></div>' +
    '<small>© ' + new Date().getFullYear() + ' Patopato Design</small></div>';

  // cards
  function mwCard(m){
    const tags = m.x.map(t => '<span class="tag">' + esc(t) + '</span>').join('');
    return '<a class="toy" href="' + mwUrl(m.id) + '" target="_blank" rel="noopener"><img loading="lazy" src="img/' + m.id + '.jpg" alt="' + esc(m.t) + '">' +
      '<div class="body"><b>' + esc(m.t) + '</b><div class="meta"><span>' + k(m.d) + ' downloads</span>' + tags + '</div><span class="go">Download on MakerWorld ›</span></div></a>';
  }
  function patCard(p){
    return '<a class="toy" href="' + p.u + '" target="_blank" rel="noopener"><img loading="lazy" src="img/' + p.img + '" alt="' + esc(p.t) + '">' +
      '<div class="body"><b>' + esc(p.t) + '</b><div class="meta"><span class="tag pat">Only on Patreon</span></div><span class="go">Get it on Patreon ›</span></div></a>';
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
    const S = [['pop','Pop-Eyed','Press them and the eyes pop out','2144875'],['air','Air Pressure','Punch it and it flies','726755'],['hands','Robot hands','Grab anything, even chips','850566'],['spin','Spin & fly','Spin tops and launchers','702556'],['puzzle','Puzzles','Pocket-size brain teasers','2938577']];
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
      .concat(PAT.map(p => ({img:'img/' + p.img, t:p.t, u:p.u, where:'Get it on Patreon'})));
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
    const FILTERS = [['all','All toys'],['pop','Pop-Eyed'],['air','Air Pressure'],['hands','Robot hands'],['spin','Spin & fly'],['puzzle','Puzzles'],['more','More toys'],['xmas','Christmas'],['halloween','Halloween']];
    const PLATFORMS = [['any','Every platform'],['MakerWorld','MakerWorld'],['Patreon','Only on Patreon'],['Thangs','Thangs'],['Nexprint','Nexprint']];
    chips.innerHTML = FILTERS.map(f => '<a class="chip" id="f-' + f[0] + '" href="#' + f[0] + '">' + f[1] + '</a>').join('');
    const plat = document.getElementById('platform');
    plat.innerHTML = PLATFORMS.map(p => '<option value="' + p[0] + '">' + p[1] + '</option>').join('');
    const params = new URLSearchParams(location.search);
    if (params.get('q')) q.value = params.get('q');
    if (location.hash === '#patreon'){ plat.value = 'Patreon'; history.replaceState(null, '', location.pathname + location.search + '#all'); }
    function render(){
      const f = (location.hash || '#all').slice(1), text = q.value.trim().toLowerCase(), p = plat.value;
      chips.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c.id === 'f-' + f));
      let mw = MW.filter(m => f === 'all' || m.s === f || m.z === f), pat = PAT.filter(x => f === 'all' || x.s === f || x.z === f);
      if (p === 'Patreon') mw = [];
      else if (p === 'MakerWorld') pat = [];
      else if (p !== 'any'){ mw = mw.filter(m => m.x.includes(p)); pat = []; }
      if (text){ mw = mw.filter(m => m.t.toLowerCase().includes(text)); pat = pat.filter(x => x.t.toLowerCase().includes(text)); }
      mw = mw.slice().sort(sort.value === 'new' ? (a, b) => b.p.localeCompare(a.p) : (a, b) => b.d - a.d);
      grid.innerHTML = (mw.map(mwCard).join('') + pat.map(patCard).join('')) || '<p class="muted">No toys match. Try another word or platform.</p>';
      count.textContent = (mw.length + pat.length) + ' toys';
      const h = document.getElementById('toys-title'); if (h) h.textContent = (FILTERS.find(x => x[0] === f) || FILTERS[0])[1];
    }
    plat.addEventListener('change', render);
    window.addEventListener('hashchange', render); q.addEventListener('input', render); sort.addEventListener('change', render); render();
  }

  // sellers page: best sellers = most downloaded
  const best = document.getElementById('best');
  if (best) best.innerHTML = MW.slice().sort((a, b) => b.d - a.d).slice(0, 8).map(mwCard).join('');
})();
