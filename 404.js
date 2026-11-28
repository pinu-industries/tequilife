(() => {
  const $ = s => document.querySelector(s);

  // Contador del carrito (mismo almacenamiento que la tienda)
  let n = 0;
  try { n = Object.values(JSON.parse(localStorage.getItem('tqlf-cart')) || {}).reduce((a, b) => a + b, 0); } catch {}
  $('#cart-count').textContent = n;
  $('#cart-link').setAttribute('aria-label', `Ver carrito, ${n} ${n === 1 ? 'producto' : 'productos'}`);

  // Menú móvil
  const menu = $('#mobile-menu');
  const isolate = el => [...document.body.children].forEach(c => { if (c.tagName !== 'SCRIPT') c.inert = !!el && c !== el; });
  // El menú nace donde está el botón ☰, y su logo y su ✕ quedan encima de los del header
  const placeMenu = () => {
    const b = $('#menu-open').getBoundingClientRect();
    const top = menu.querySelector('.mobile-menu-top');
    menu.style.setProperty('--mx', `${b.left + b.width / 2}px`);
    menu.style.setProperty('--my', `${b.top + b.height / 2}px`);
    menu.style.setProperty('--top', `${b.top - (top.offsetHeight - b.height) / 2}px`);
    menu.querySelector('.logo').style.width = `${$('#header .logo').offsetWidth}px`;
  };
  const open = () => { placeMenu(); isolate(menu); menu.classList.add('is-open'); $('#menu-open').setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; setTimeout(() => $('#menu-close').focus(), 80); };
  const close = () => { if (!menu.classList.contains('is-open')) return; isolate(null); menu.classList.remove('is-open'); $('#menu-open').setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; $('#menu-open').focus({ preventScroll: true }); };
  $('#menu-open').addEventListener('click', open);
  $('#menu-close').addEventListener('click', close);
  // Si la pantalla cambia con el menú abierto, se vuelve a alinear (o se cierra si ya no hay botón ☰)
  addEventListener('resize', () => { if (!menu.classList.contains('is-open')) return; $('#menu-open').offsetParent ? placeMenu() : close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  // La página "recupera su color": al pasar sobre un número o un tequila, el fondo toma ese color
  const page = $('#nf');
  document.querySelectorAll('.nf-digits [data-tone], .nf-pick').forEach(el => {
    el.addEventListener('pointerenter', () => { page.dataset.tone = el.dataset.tone; });
    el.addEventListener('focus', () => { page.dataset.tone = el.dataset.tone; });
  });
  document.querySelectorAll('.nf-digits, .nf-picks').forEach(el => {
    el.addEventListener('pointerleave', () => { page.dataset.tone = 'none'; });
  });

  // Header compacto al bajar
  const header = $('#header');
  const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
})();
