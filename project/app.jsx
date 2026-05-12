// ============================================================
//  Bareeq · App shell
// ============================================================

const { useState: useS, useEffect: useE } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "warm",
  "density": 1
}/*EDITMODE-END*/;

function App() {
  const [screen, setScreen] = useS('home');
  const [cart, setCart] = useS([]);
  const [drawerOpen, setDrawerOpen] = useS(false);
  const [openedItem, setOpenedItem] = useS(null);
  const [tw, setTw] = useTweaks(TWEAK_DEFAULTS);
  const { lang, toggle, t: tr } = useI18n();

  useE(() => {
    document.documentElement.dataset.palette = tw.palette;
  }, [tw.palette]);

  const addToCart = (item) => {
    setCart(c => {
      const existing = c.findIndex(x => x.id === item.id && !x.notes);
      if (existing >= 0 && !item.qty) {
        const copy = c.slice();
        copy[existing] = { ...copy[existing], qty: copy[existing].qty + 1 };
        return copy;
      }
      return [...c, { ...item, qty: item.qty || 1 }];
    });
    setDrawerOpen(true);
  };

  const openProduct = (item) => setOpenedItem(item);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  return (
    <div className="shell">
      {/* TOP NAV */}
      <nav className="topnav">
        <div className="topnav__inner">
          <button onClick={() => setScreen('home')} className="topnav__logo">
            <Logo size={26} />
          </button>
          <div className="topnav__center">
            {[
              ['home',      tr('nav.home')],
              ['menu',      tr('nav.menu')],
              ['rewards',   tr('nav.rewards')],
              ['dashboard', tr('nav.account')],
            ].map(([id, label]) => (
              <button key={id} className="tab" data-active={screen === id}
                onClick={() => { setScreen(id); window.scrollTo({ top: 0, behavior: 'auto' }); }}>
                {label}
              </button>
            ))}
          </div>
          <div className="topnav__right">
            <button
              className="icon-btn"
              onClick={toggle}
              title="Language"
            >
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.08em' }}>
                {tr('nav.language')}
              </span>
            </button>
            <button className="icon-btn" title="Wishlist">♡</button>
            <button className="icon-btn" onClick={() => setDrawerOpen(true)} title="Cart" style={{ position: 'relative' }}>
              <span style={{ fontSize: 14 }}>◯</span>
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: -4, right: -4, background: 'var(--burgundy)', color: 'var(--ivory)', borderRadius: 999, fontSize: 10, padding: '2px 6px', fontFamily: 'var(--f-mono)', border: '2px solid var(--ivory)' }}>{cartCount}</span>
              )}
            </button>
            <button className="btn btn--ink btn--sm" onClick={() => setScreen('menu')}>{tr('nav.order')}</button>
          </div>
        </div>
      </nav>

      {/* SCREENS */}
      <main>
        {screen === 'home'      && <HomeScreen go={setScreen} addToCart={addToCart} openProduct={openProduct} />}
        {screen === 'menu'      && <MenuScreen go={setScreen} addToCart={addToCart} openProduct={openProduct} cart={cart} />}
        {screen === 'rewards'   && <RewardsScreen go={setScreen} />}
        {screen === 'dashboard' && <DashboardScreen go={setScreen} />}
      </main>

      {/* CART DRAWER (global) */}
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} cart={cart} setCart={setCart} go={setScreen} />

      {/* PRODUCT MODAL */}
      <ProductDetail item={openedItem} onClose={() => setOpenedItem(null)} onAdd={addToCart} />

      {/* MOBILE BOTTOM NAV — appears on <768px via CSS */}
      <nav className="mobile-bottom-nav">
        {[
          ['home',      tr('nav.home'),    '⌂'],
          ['menu',      tr('nav.menu'),    '☰'],
          ['rewards',   tr('nav.rewards'), '✦'],
          ['dashboard', tr('nav.account'), '◔'],
        ].map(([id, label, glyph]) => (
          <button key={id} data-active={screen === id} onClick={() => { setScreen(id); window.scrollTo({ top: 0 }); }}>
            <span className="glyph">{glyph}</span>
            <span>{label}</span>
          </button>
        ))}
        <button onClick={() => setDrawerOpen(true)} style={{ position: 'relative' }}>
          <span className="glyph">◯</span>
          <span>{tr('nav.cart')}{cartCount > 0 ? ` · ${cartCount}` : ''}</span>
        </button>
      </nav>

      {/* TWEAKS */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Palette" />
        <TweakRadio label="Tone" value={tw.palette} onChange={(v) => setTw('palette', v)}
          options={[
            { value: 'warm', label: 'Warm' },
            { value: 'sand', label: 'Sand' },
            { value: 'midnight', label: 'Night' },
          ]} />
        <TweakSection label="Quick jump" />
        <TweakButton label="Home"    onClick={() => setScreen('home')} />
        <TweakButton label="Menu"    onClick={() => setScreen('menu')} />
        <TweakButton label="Rewards" onClick={() => setScreen('rewards')} />
        <TweakButton label="Account" onClick={() => setScreen('dashboard')} />
        <TweakSection label="Demo" />
        <TweakButton label="Add Pistachio Latte"  onClick={() => { addToCart(window.BAREEQ.ITEMS.find(i => i.id === 'pis')); }} />
        <TweakButton label="Open product modal"   onClick={() => setOpenedItem(window.BAREEQ.ITEMS.find(i => i.id === 'mdl'))} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <LangProvider>
    <App />
  </LangProvider>
);
