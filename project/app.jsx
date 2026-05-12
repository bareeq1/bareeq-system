// ============================================================
//  Bareeq · App shell
// ============================================================

const { useState: useS, useEffect: useE } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "warm",
  "lang": "bi",
  "density": 1
}/*EDITMODE-END*/;

function App() {
  const [screen, setScreen] = useS('home');
  const [cart, setCart] = useS([]);
  const [drawerOpen, setDrawerOpen] = useS(false);
  const [openedItem, setOpenedItem] = useS(null);
  const [t, setT] = useTweaks(TWEAK_DEFAULTS);

  useE(() => {
    document.documentElement.dataset.palette = t.palette;
  }, [t.palette]);

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
              ['home', 'Home'],
              ['menu', 'Menu'],
              ['rewards', 'Rewards'],
              ['dashboard', 'Account'],
            ].map(([id, label]) => (
              <button key={id} className="tab" data-active={screen === id} onClick={() => { setScreen(id); window.scrollTo({ top: 0, behavior: 'auto' }); }}>{label}</button>
            ))}
          </div>
          <div className="topnav__right">
            <button
              className="icon-btn"
              onClick={() => setT('lang', t.lang === 'bi' ? 'en' : t.lang === 'en' ? 'ar' : 'bi')}
              title="Language"
            >
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.08em' }}>
                {t.lang === 'bi' ? 'AR/EN' : t.lang === 'en' ? 'EN' : 'AR'}
              </span>
            </button>
            <button className="icon-btn" title="Wishlist">♡</button>
            <button className="icon-btn" onClick={() => setDrawerOpen(true)} title="Cart" style={{ position: 'relative' }}>
              <span style={{ fontSize: 14 }}>◯</span>
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: -4, right: -4, background: 'var(--burgundy)', color: 'var(--ivory)', borderRadius: 999, fontSize: 10, padding: '2px 6px', fontFamily: 'var(--f-mono)', border: '2px solid var(--ivory)' }}>{cartCount}</span>
              )}
            </button>
            <button className="btn btn--ink btn--sm" onClick={() => setScreen('menu')}>Order →</button>
          </div>
        </div>
      </nav>

      {/* SCREENS */}
      {screen === 'home' && <HomeScreen go={setScreen} addToCart={addToCart} openProduct={openProduct} lang={t.lang} />}
      {screen === 'menu' && <MenuScreen go={setScreen} addToCart={addToCart} openProduct={openProduct} cart={cart} lang={t.lang} />}
      {screen === 'rewards' && <RewardsScreen go={setScreen} />}
      {screen === 'dashboard' && <DashboardScreen go={setScreen} />}

      {/* CART DRAWER (global) */}
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} cart={cart} setCart={setCart} go={setScreen} />

      {/* PRODUCT MODAL */}
      <ProductDetail item={openedItem} onClose={() => setOpenedItem(null)} onAdd={addToCart} />

      {/* MOBILE BOTTOM NAV — appears on <768px via CSS */}
      <nav className="mobile-bottom-nav">
        {[
          ['home',      'Home',    '⌂'],
          ['menu',      'Menu',    '☰'],
          ['rewards',   'Rewards', '✦'],
          ['dashboard', 'Account', '◔'],
        ].map(([id, label, glyph]) => (
          <button key={id} data-active={screen === id} onClick={() => { setScreen(id); window.scrollTo({ top: 0 }); }}>
            <span className="glyph">{glyph}</span>
            <span>{label}</span>
          </button>
        ))}
        <button onClick={() => setDrawerOpen(true)} style={{ position: 'relative' }}>
          <span className="glyph">◯</span>
          <span>Cart{cartCount > 0 ? ` · ${cartCount}` : ''}</span>
        </button>
      </nav>

      {/* TWEAKS */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Palette" />
        <TweakRadio label="Tone" value={t.palette} onChange={(v) => setT('palette', v)}
          options={[
            { value: 'warm', label: 'Warm' },
            { value: 'sand', label: 'Sand' },
            { value: 'midnight', label: 'Night' },
          ]} />
        <TweakSection label="Language" />
        <TweakRadio label="Mode" value={t.lang} onChange={(v) => setT('lang', v)}
          options={[
            { value: 'en', label: 'EN' },
            { value: 'ar', label: 'AR' },
            { value: 'bi', label: 'Both' },
          ]} />
        <TweakSection label="Quick jump" />
        <TweakButton label="Home" onClick={() => setScreen('home')} />
        <TweakButton label="Menu" onClick={() => setScreen('menu')} />
        <TweakButton label="Rewards" onClick={() => setScreen('rewards')} />
        <TweakButton label="Account" onClick={() => setScreen('dashboard')} />
        <TweakSection label="Demo" />
        <TweakButton label="Add Pistachio Latte" onClick={() => { addToCart(window.BAREEQ.ITEMS.find(i => i.id === 'pis')); }} />
        <TweakButton label="Open product modal" onClick={() => setOpenedItem(window.BAREEQ.ITEMS.find(i => i.id === 'mdl'))} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
