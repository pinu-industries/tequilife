(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const money = n => '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 0 });

  /* ---------- Catálogo (precios del sitio actual) ---------- */
  const PRODUCTS = [
    { id:'duo-mix',    name:'Duo Pack Rosa & Azul',     sub:'Una botella de cada color',  price:820,  tone:'mix',   cats:['rosa','azul','mix'],  img:'p-duo-mix' },
    { id:'duo-rosa',   name:'Duo Pack Rosa',            sub:'Premium Blanco',             price:799,  tone:'rosa',  cats:['rosa'],               img:'p-duo-rosa' },
    { id:'duo-azul',   name:'Duo Pack Azul',            sub:'Exclusivo Reposado',         price:849,  tone:'azul',  cats:['azul'],               img:'p-duo-azul' },
    { id:'duo-anejo',  name:'Duo Pack Selecto Añejo',   sub:'Selecto Añejo',              price:1340, tone:'anejo', cats:['anejo'],              img:'p-duo-anejo' },
    { id:'six-mix',    name:'Six Pack Rosa & Azul',     sub:'Rosa y Azul',                price:2295, tone:'mix',   cats:['rosa','azul','mix'],  img:'p-six-mix' },
    { id:'six-rosa',   name:'Six Pack Rosa',            sub:'Premium Blanco',             price:2199, tone:'rosa',  cats:['rosa'],               img:'p-six-rosa' },
    { id:'six-azul',   name:'Six Pack Azul',            sub:'Exclusivo Reposado',         price:2399, tone:'azul',  cats:['azul'],               img:'p-six-azul' },
    { id:'six-anejo',  name:'Six Pack Selecto Añejo',   sub:'Selecto Añejo',              price:3540, tone:'anejo', cats:['anejo'],              img:'p-six-anejo' },
    { id:'doce-rosa',  name:'Doce Pack Rosa',           sub:'12 botellas · Premium Blanco',  price:4200, tone:'rosa', cats:['rosa','doce'],     img:'p-doce-rosa', gift:true },
    { id:'doce-azul',  name:'Doce Pack Azul',           sub:'12 botellas · Exclusivo Reposado', price:4440, tone:'azul', cats:['azul','doce'],   img:'p-doce-azul', gift:true },
    { id:'m6-rosa',    name:'6 Minis Rosa',             sub:'Botellas mini',              price:599,  tone:'rosa',  cats:['rosa','minis'],       img:'p-6mini-rosa' },
    { id:'m6-azul',    name:'6 Minis Azul',             sub:'Botellas mini',              price:660,  tone:'azul',  cats:['azul','minis'],       img:'p-6mini-azul' },
    { id:'m12-rosa',   name:'12 Minis Rosa',            sub:'Botellas mini',              price:1080, tone:'rosa',  cats:['rosa','minis'],       img:'p-12mini-rosa' },
    { id:'m12-azul',   name:'12 Minis Azul',            sub:'Botellas mini',              price:1090, tone:'azul',  cats:['azul','minis'],       img:'p-12mini-azul' },
    { id:'m12-mix',    name:'12 Minis Rosa & Azul',     sub:'Botellas mini',              price:1130, tone:'mix',   cats:['rosa','azul','mix','minis'], img:'p-12mini-mix' },
    { id:'m24-mix',    name:'24 Minis Rosa & Azul',     sub:'Botellas mini',              price:2140, tone:'mix',   cats:['rosa','azul','mix','minis'], img:'p-24mini-mix' },
  ];
  const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));

  const FILTERS = [
    { id:'all',   label:'Todos' },
    { id:'rosa',  label:'Rosa',  dot:'var(--rosa-deep)' },
    { id:'azul',  label:'Azul',  dot:'var(--azul-deep)' },
    { id:'anejo', label:'Añejo', dot:'var(--anejo-deep)' },
    { id:'mix',   label:'Rosa & Azul' },
    { id:'minis', label:'Minis' },
    { id:'doce',  label:'Packs de 12' },
  ];
  let activeFilter = 'all';

  /* ---------- Carrito ---------- */
  const KEY = 'tqlf-cart';
  let cart = {};
  try { cart = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { cart = {}; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch {} };
  const count = () => Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = () => Object.entries(cart).reduce((a, [id, q]) => a + byId[id].price * q, 0);

  function add(id, from) {
    cart[id] = (cart[id] || 0) + 1;
    save(); renderCart(); bumpCount();
    showToast(`${byId[id].name} agregado`);
    if (from) {
      from.classList.add('is-added');
      const label = from.querySelector('.add-label');
      if (label) { label.textContent = 'Agregado'; }
      setTimeout(() => { from.classList.remove('is-added'); if (label) label.textContent = 'Agregar'; }, 1400);
    }
  }
  function setQty(id, q) { if (q <= 0) delete cart[id]; else cart[id] = q; save(); renderCart(); }

  function bumpCount() {
    const b = $('#cart-open'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
  }

  function renderCart() {
    const n = count();
    $('#cart-count').textContent = n;
    $('#cart-open').setAttribute('aria-label', `Abrir carrito, ${n} ${n === 1 ? 'producto' : 'productos'}`);
    const body = $('#drawer-body'), foot = $('#drawer-foot');
    if (!n) {
      body.innerHTML = `<div class="drawer-empty"><svg class="icon" aria-hidden="true"><use href="#i-bag"/></svg><p>Tu carrito está vacío.<br>Elige tu color y empieza tu historia.</p><a href="#tienda" class="btn btn-solid" data-close>Ir a la tienda</a></div>`;
      foot.hidden = true; return;
    }
    foot.hidden = false;
    body.innerHTML = Object.entries(cart).map(([id, q]) => {
      const p = byId[id];
      return `<div class="line">
        <img src="assets/${p.img}.webp" alt="" width="76" height="76">
        <div>
          <h3>${p.name}</h3>
          <p class="lp">${money(p.price)} c/u</p>
          <div style="display:flex;align-items:center">
            <div class="qty" role="group" aria-label="Cantidad de ${p.name}">
              <button data-dec="${id}" aria-label="Quitar uno"><svg class="icon" aria-hidden="true"><use href="#i-minus"/></svg></button>
              <output aria-live="polite">${q}</output>
              <button data-inc="${id}" aria-label="Agregar uno"><svg class="icon" aria-hidden="true"><use href="#i-plus"/></svg></button>
            </div>
            <button class="remove" data-rm="${id}">Eliminar</button>
          </div>
        </div>
        <span class="line-total">${money(p.price * q)}</span>
      </div>`;
    }).join('');
    const hasGift = Object.keys(cart).some(id => byId[id].gift);
    foot.innerHTML = `
      <div class="row"><span>Subtotal</span><span>${money(subtotal())}</span></div>
      <div class="row"><span>Envío a todo México</span><span class="ship-ok">Incluido</span></div>
      <div class="row total"><span>Total</span><span>${money(subtotal())}</span></div>
      ${hasGift ? `<p class="gift-note"><svg class="icon" aria-hidden="true"><use href="#i-gift"/></svg>Tu pedido incluye la piñata de regalo.</p>` : ''}
      <button class="btn btn-solid" id="checkout">Pagar de forma segura <svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></button>`;
  }

  $('#drawer-body').addEventListener('click', e => {
    const t = e.target.closest('button,[data-close]'); if (!t) return;
    if (t.dataset.inc) setQty(t.dataset.inc, cart[t.dataset.inc] + 1);
    if (t.dataset.dec) setQty(t.dataset.dec, cart[t.dataset.dec] - 1);
    if (t.dataset.rm) setQty(t.dataset.rm, 0);
    if (t.hasAttribute('data-close')) closeCart();
  });
  $('#drawer-foot').addEventListener('click', e => {
    if (e.target.closest('#checkout')) showToast('Demo: aquí continúa el pago seguro', false);
  });

  let lastFocus;
  function openCart() {
    lastFocus = document.activeElement;
    $('#toast').classList.remove('is-show');
    $('#drawer').classList.add('is-open'); $('#scrim').classList.add('is-open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('#cart-close').focus(), 60);
  }
  function closeCart() {
    $('#drawer').classList.remove('is-open'); $('#scrim').classList.remove('is-open');
    document.body.style.overflow = '';
    lastFocus && lastFocus.focus && lastFocus.focus();
  }
  $('#cart-open').addEventListener('click', openCart);
  $('#cart-close').addEventListener('click', closeCart);
  $('#scrim').addEventListener('click', closeCart);

  /* ---------- Toast ---------- */
  let toastT;
  function showToast(msg, withAction = true) {
    $('#toast-text').textContent = msg;
    $('#toast-view').hidden = !withAction;
    $('#toast').classList.add('is-show');
    clearTimeout(toastT); toastT = setTimeout(() => $('#toast').classList.remove('is-show'), 3200);
  }
  $('#toast-view').addEventListener('click', () => { $('#toast').classList.remove('is-show'); openCart(); });

  /* ---------- Tienda ---------- */
  function renderFilters() {
    $('#filters').innerHTML = FILTERS.map(f => {
      const n = f.id === 'all' ? PRODUCTS.length : PRODUCTS.filter(p => p.cats.includes(f.id)).length;
      return `<button class="chip" data-filter="${f.id}" aria-pressed="${f.id === activeFilter}">${f.dot ? `<i style="background:${f.dot}"></i>` : ''}${f.label} <span class="count">${n}</span></button>`;
    }).join('');
  }
  function renderGrid() {
    const list = activeFilter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cats.includes(activeFilter));
    $('#grid').innerHTML = list.length ? list.map(p => `
      <article class="card" data-tone="${p.tone}">
        <div class="card-media">
          <img src="assets/${p.img}.webp" alt="${p.name}" width="700" height="700" loading="lazy">
          ${p.gift ? `<span class="tag tag-gift"><svg class="icon" aria-hidden="true"><use href="#i-gift"/></svg>Piñata de regalo</span>` : ''}
        </div>
        <div class="card-body">
          <div><h3>${p.name}</h3><p class="card-sub">${p.sub}</p></div>
          <div class="card-foot">
            <span class="price">${money(p.price)}</span>
            <button class="add" data-add="${p.id}" aria-label="Agregar ${p.name} al carrito"><svg class="icon" aria-hidden="true"><use href="#i-plus"/></svg><span class="add-label">Agregar</span></button>
          </div>
        </div>
      </article>`).join('') : `<p class="empty">No hay productos en esta categoría.</p>`;
  }
  function setFilter(id) { activeFilter = id; renderFilters(); renderGrid(); }
  $('#filters').addEventListener('click', e => { const b = e.target.closest('[data-filter]'); if (b) setFilter(b.dataset.filter); });
  $('#grid').addEventListener('click', e => { const b = e.target.closest('[data-add]'); if (b) add(b.dataset.add, b); });
  $$('[data-filter-link]').forEach(a => a.addEventListener('click', () => setFilter(a.dataset.filterLink)));

  /* ---------- Hero: elige tu color ---------- */
  const TONES = {
    rosa:  { word:'ROSA',  type:'Premium Blanco',     product:'duo-rosa' },
    azul:  { word:'AZUL',  type:'Exclusivo Reposado', product:'duo-azul' },
    anejo: { word:'AÑEJO', type:'Selecto Añejo',      product:'duo-anejo' },
  };
  let tone = 'rosa';
  const hero = $('#inicio'), word = $('#stage-word');
  function setTone(t) {
    if (t === tone) return; tone = t;
    const d = TONES[t], p = byId[d.product];
    hero.dataset.tone = t;
    $$('.arch img').forEach(img => img.classList.toggle('is-active', img.dataset.tone === t));
    word.classList.add('is-out');
    setTimeout(() => { word.textContent = d.word; word.classList.remove('is-out'); }, 260);
    $('#hero-type').textContent = d.type;
    $('#hero-price').textContent = money(p.price);
    $('#hero-add-label').textContent = `Agregar ${p.name}`;
  }
  $$('input[name="tone"]').forEach(r => r.addEventListener('change', () => setTone(r.value)));
  $('#hero-add').addEventListener('click', e => add(TONES[tone].product));

  /* ---------- Header / menú ---------- */
  const header = $('#header');
  const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const menu = $('#mobile-menu');
  const openMenu = () => { menu.classList.add('is-open'); $('#menu-open').setAttribute('aria-expanded','true'); document.body.style.overflow='hidden'; setTimeout(()=>$('#menu-close').focus(),80); };
  const closeMenu = () => { menu.classList.remove('is-open'); $('#menu-open').setAttribute('aria-expanded','false'); document.body.style.overflow=''; };
  $('#menu-open').addEventListener('click', openMenu);
  $('#menu-close').addEventListener('click', closeMenu);
  $$('#mobile-menu nav a').forEach(a => a.addEventListener('click', closeMenu));

  // Sección activa en el menú
  const links = $$('.nav a');
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) links.forEach(l => l.setAttribute('aria-current', l.getAttribute('href') === '#' + en.target.id)); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['inicio','tienda','cocteles','historia','blog'].forEach(id => io.observe(document.getElementById(id)));

  addEventListener('keydown', e => { if (e.key === 'Escape') { closeCart(); closeMenu(); } });

  /* ---------- Promo ---------- */
  $('#promo-close').addEventListener('click', () => $('#promo').remove());

  /* ---------- Edad ---------- */
  const gate = $('#gate');
  const skipGate = new URLSearchParams(location.search).has('demo');
  let ok = false; try { ok = localStorage.getItem('tqlf-age') === '1'; } catch {}
  if (!ok && !skipGate) { gate.hidden = false; document.body.style.overflow = 'hidden'; $('#gate-yes').focus(); }
  $('#gate-yes').addEventListener('click', () => { try { localStorage.setItem('tqlf-age','1'); } catch {} gate.hidden = true; document.body.style.overflow = ''; });
  $('#gate-no').addEventListener('click', () => { $('#gate-msg').textContent = 'Lo sentimos, necesitas ser mayor de edad para visitar este sitio.'; });

  /* ---------- Newsletter ---------- */
  $('#club-form').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.currentTarget;
    const checks = [
      ['#f-name', '#e-name', v => v.trim() ? '' : 'Escribe tu nombre.'],
      ['#f-last', '#e-last', v => v.trim() ? '' : 'Escribe tu apellido.'],
      ['#f-mail', '#e-mail', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Revisa tu correo: debe verse como nombre@correo.com.'],
    ];
    let first;
    checks.forEach(([i, er, fn]) => { const el = $(i), m = fn(el.value); $(er).textContent = m; el.setAttribute('aria-invalid', !!m); if (m && !first) first = el; });
    const okBox = $('#f-ok'); $('#e-ok').textContent = okBox.checked ? '' : 'Marca la casilla para suscribirte.';
    if (!okBox.checked && !first) first = okBox;
    if (first) { first.focus(); return; }
    f.innerHTML = `<div class="form-done"><h3>¡Bienvenido a la familia, ${$('#f-name').value.trim()}!</h3><p>Te enviamos tu código del 10% a tu correo.</p></div>`;
  });

  renderFilters(); renderGrid(); renderCart();
})();
