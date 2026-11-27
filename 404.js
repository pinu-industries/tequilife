(() => {
  const $ = s => document.querySelector(s);

  // Contador del carrito (mismo almacenamiento que la tienda)
  let n = 0;
  try { n = Object.values(JSON.parse(localStorage.getItem('tqlf-cart')) || {}).reduce((a, b) => a + b, 0); } catch {}
  $('#cart-count').textContent = n;
  $('#cart-link').setAttribute('aria-label', `Ver carrito, ${n} ${n === 1 ? 'producto' : 'productos'}`);

  // Menú móvil
  const menu = $('#mobile-menu');
  const open = () => { menu.classList.add('is-open'); $('#menu-open').setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; setTimeout(() => $('#menu-close').focus(), 80); };
  const close = () => { menu.classList.remove('is-open'); $('#menu-open').setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };
  $('#menu-open').addEventListener('click', open);
  $('#menu-close').addEventListener('click', close);
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
