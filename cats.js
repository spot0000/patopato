/* Apple-style category strip with flat 2D silhouette icons (Louis 11/26). */
(function(){
  const box = document.getElementById('catstrip');
  if (!box) return;
  const INK = '#22251f', OR = '#ef7d1a', W = '#ffffff';
  const ICONS = {
    // Pop-Eyed: round body, two eyes popping up on springs
    pop: `<rect x="12" y="28" width="40" height="30" rx="14" fill="${INK}"/>
      <path d="M24 28v-4M40 28v-4" stroke="${OR}" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 2"/>
      <circle cx="24" cy="15" r="9" fill="${W}" stroke="${INK}" stroke-width="3"/><circle cx="40" cy="15" r="9" fill="${W}" stroke="${INK}" stroke-width="3"/>
      <circle cx="26" cy="16" r="3.5" fill="${INK}"/><circle cx="42" cy="16" r="3.5" fill="${INK}"/>`,
    // Air Pressure: tank side view firing ammo
    air: `<rect x="6" y="42" width="44" height="13" rx="6.5" fill="${INK}"/>
      <circle cx="14" cy="48.5" r="3" fill="${W}"/><circle cx="24" cy="48.5" r="3" fill="${W}"/><circle cx="34" cy="48.5" r="3" fill="${W}"/><circle cx="43" cy="48.5" r="3" fill="${W}"/>
      <rect x="10" y="32" width="36" height="11" rx="3" fill="${INK}"/><rect x="16" y="22" width="20" height="12" rx="4" fill="${INK}"/>
      <rect x="34" y="25" width="18" height="5" rx="2" fill="${INK}"/><circle cx="58" cy="27.5" r="3.5" fill="${OR}"/>
      <path d="M50 18l4-3M50 37l4 3" stroke="${OR}" stroke-width="2.5" stroke-linecap="round"/>`,
    // APM: press-button module, punch it and the rocket flies
    apm: `<rect x="10" y="52" width="44" height="6" rx="3" fill="${INK}"/>
      <path d="M18 52l3-14h22l3 14z" fill="${INK}"/><ellipse cx="32" cy="38" rx="13" ry="4.5" fill="${OR}"/>
      <path d="M32 4l5 9h-10z" fill="${OR}"/><rect x="28.5" y="13" width="7" height="10" rx="1.5" fill="${OR}"/>
      <path d="M22 18l-4-3M42 18l4-3M32 27v4" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`,
    // Spin tops: top with spin marks
    spin: `<rect x="29.5" y="5" width="5" height="13" rx="2.5" fill="${INK}"/>
      <ellipse cx="32" cy="24" rx="22" ry="7" fill="${INK}"/><path d="M11 25L32 57L53 25z" fill="${INK}"/>
      <ellipse cx="32" cy="23" rx="15" ry="3.5" fill="${OR}"/>
      <path d="M6 40c3 4 7 6 12 7M58 40c-3 4-7 6-12 7" stroke="${OR}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    // Grabbers: trigger grabber with claw
    hands: `<circle cx="13" cy="46" r="7" fill="none" stroke="${INK}" stroke-width="4.5"/>
      <path d="M19 42L44 24" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
      <path d="M44 24c4-9 12-10 15-6M44 24c9-3 13 3 11 7" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      <circle cx="57" cy="24" r="3.5" fill="${OR}"/>`,
    // Puzzles: 3x3 sliding puzzle with one gap
    puzzle: `<rect x="8" y="8" width="48" height="48" rx="8" fill="${INK}"/>
      <g fill="${W}"><rect x="13" y="13" width="11" height="11" rx="2.5"/><rect x="26.5" y="13" width="11" height="11" rx="2.5"/><rect x="40" y="13" width="11" height="11" rx="2.5"/>
      <rect x="13" y="26.5" width="11" height="11" rx="2.5"/><rect x="40" y="26.5" width="11" height="11" rx="2.5"/>
      <rect x="13" y="40" width="11" height="11" rx="2.5"/><rect x="26.5" y="40" width="11" height="11" rx="2.5"/></g>
      <rect x="40" y="40" width="11" height="11" rx="2.5" fill="${OR}"/>`,
    // All toys: four small shapes
    all: `<circle cx="20" cy="20" r="11" fill="${INK}"/><rect x="34" y="9" width="22" height="22" rx="5" fill="${OR}"/>
      <path d="M20 35l12 20H8z" fill="${OR}"/><rect x="34" y="36" width="22" height="18" rx="9" fill="${INK}"/>`
  };
  const CATS = [['pop','Pop-Eyed'],['air','Air Pressure'],['apm','APM'],['spin','Spin Tops'],['hands','Grabbers'],['puzzle','Puzzles'],['all','All Toys']];
  const here = (location.hash || '').slice(1);
  box.innerHTML = CATS.map(([id, name]) =>
    '<a class="cat' + (here === id ? ' on' : '') + '" href="toys.html#' + id + '"><span class="ico"><svg viewBox="0 0 64 64" aria-hidden="true">' + ICONS[id] + '</svg></span><span>' + name + '</span></a>').join('');
  window.addEventListener('hashchange', () => {
    const h = location.hash.slice(1);
    box.querySelectorAll('.cat').forEach(a => a.classList.toggle('on', a.getAttribute('href') === 'toys.html#' + h));
  });
})();
