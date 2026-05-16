// ============================================================
//  Bareeq · App shell
// ============================================================

const { useState: useS, useEffect: useE, useMemo: useM } = React;

const API_BASE = (localStorage.getItem('bareeq.api') || 'https://bareeq.runasp.net').replace(/\/$/, '');

const GOOGLE_CLIENT_ID = '96562673434-lqr790jcs92b5usfdhlsnif2flirap86.apps.googleusercontent.com';

const readStoredToken = () => {
  try { return localStorage.getItem('bareeq.token') || ''; } catch { return ''; }
};

async function apiFetch(path, options = {}, token = '') {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (response.status === 401) {
    try { localStorage.removeItem('bareeq.token'); } catch {}
    throw new Error('Session expired. Please sign in again.');
  }
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

const mapCatalog = (payload) => {
  if (!payload) return null;
  return {
    CATEGORIES: payload.categories.map((c) => ({ id: c.id, label: c.labelEn, ar: c.labelAr, glyph: c.glyph })),
    ITEMS: payload.items.map((i) => ({
      id: i.id,
      cat: i.categoryId,
      name: i.nameEn,
      ar: i.nameAr,
      desc: i.description,
      price: i.price,
      tone: i.tone,
      flag: i.flag,
      calories: i.calories
    })),
    ADDONS: payload.addons.map((a) => ({ id: a.id, label: a.label, price: a.price })),
    MILKS: payload.milks.map((m) => ({ id: m.id, label: m.label, delta: m.delta })),
    SIZES: payload.sizes.map((s) => ({ id: s.id, label: s.label, delta: s.delta }))
  };
};

const mapLoyalty = (payload) => {
  if (!payload) return null;
  return {
    TIERS: payload.tiers.map((t) => ({ id: t.id, label: t.label, min: t.minPoints, max: t.maxPoints, perks: t.perks })),
    BADGES: payload.badges.map((b) => ({ id: b.id, label: b.label, sub: b.description, earned: b.earned, glyph: b.glyph })),
    COUPONS: payload.coupons.map((c) => ({ id: c.id, label: c.label, sub: c.description, expiry: c.expiryText, flavor: c.flavor }))
  };
};

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
  const [catalog, setCatalog] = useS(null);
  const [loyalty, setLoyalty] = useS(null);
  const [plans, setPlans] = useS([]);
  const [orders, setOrders] = useS([]);
  const [favorites, setFavorites] = useS([]);
  const [addresses, setAddresses] = useS([]);
  const [user, setUser] = useS(null);
  const [token, setToken] = useS(readStoredToken);
  const [checkoutBusy, setCheckoutBusy] = useS(false);
  const [loginOpen, setLoginOpen] = useS(false);
  const [loginBusy, setLoginBusy] = useS(false);
  const [currentOrderId, setCurrentOrderId] = useS('');

  useE(() => {
    document.documentElement.dataset.palette = tw.palette;
  }, [tw.palette]);

  useE(() => {
    let active = true;
    apiFetch('/catalog')
      .then((data) => active && setCatalog(mapCatalog(data)))
      .catch(() => {});
    apiFetch('/subscriptions/plans')
      .then((data) => active && setPlans(data || []))
      .catch(() => {});
    return () => { active = false; };
  }, []);

  useE(() => {
    try {
      if (token) localStorage.setItem('bareeq.token', token);
      else localStorage.removeItem('bareeq.token');
    } catch {}
  }, [token]);

  useE(() => {
    let active = true;
    if (!token) {
      setUser(null);
      setLoyalty(null);
      setOrders([]);
      setFavorites([]);
      setAddresses([]);
      return () => {};
    }

    apiFetch('/me', {}, token)
      .then((data) => active && setUser(data))
      .catch(() => {});
    apiFetch('/loyalty/summary', {}, token)
      .then((data) => active && setLoyalty(data))
      .catch(() => {});
    apiFetch('/orders', {}, token)
      .then((data) => active && setOrders(data || []))
      .catch(() => {});
    apiFetch('/favorites', {}, token)
      .then((data) => active && setFavorites(data || []))
      .catch(() => {});
    apiFetch('/addresses', {}, token)
      .then((data) => active && setAddresses(data || []))
      .catch(() => {});

    return () => { active = false; };
  }, [token]);

  const mergedData = useM(() => {
    const base = window.BAREEQ || {};
    const catalogData = catalog || {};
    const loyaltyData = mapLoyalty(loyalty) || {};
    return { ...base, ...catalogData, ...loyaltyData };
  }, [catalog, loyalty]);

  const favoriteItems = useM(() => {
    if (!favorites.length) return [];
    const items = mergedData.ITEMS || [];
    return favorites.map((fav) => {
      const full = items.find((item) => item.id === fav.itemId);
      if (full) return full;
      return { id: fav.itemId, name: fav.nameEn, ar: fav.nameAr, price: fav.price, tone: fav.tone };
    });
  }, [favorites, mergedData]);

  const addressList = useM(() =>
    addresses.map((a) => ({ id: a.id, label: a.label, detail: a.detail, primary: a.isPrimary })),
  [addresses]);

  const orderRows = useM(() => {
    if (!orders.length) return [];
    return orders.map((o) => {
      const when = new Date(o.createdAt);
      const date = `${when.toLocaleDateString(undefined, { month: 'short', day: '2-digit' })} · ${when.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
      return {
        id: `BR-${o.id.slice(0, 4).toUpperCase()}`,
        date,
        items: o.items.map((i) => i.nameEn),
        total: o.subtotal,
        status: o.status,
        points: o.points
      };
    });
  }, [orders]);

  const subscriptionPlans = useM(() =>
    plans.map((plan) => ({
      id: plan.id,
      label: plan.label,
      price: plan.price,
      sub: plan.description,
      perks: plan.perks || []
    })),
  [plans]);

  const handleCheckout = () => {
    if (!token) { setLoginOpen(true); return; }
    if (!cart.length) return;
    setDrawerOpen(false);
    setScreen('checkout');
  };

  const refreshOrders = () => {
    if (!token) return;
    apiFetch('/orders', {}, token)
      .then(data => setOrders(data || []))
      .catch(() => {});
  };

  const handleGoogleLogin = () => {
    if (!window.google?.accounts?.oauth2) {
      alert('Google Sign-In is not loaded yet. Please wait a moment and try again.');
      return;
    }
    if (!GOOGLE_CLIENT_ID) {
      alert('GOOGLE_CLIENT_ID is not configured.');
      return;
    }
    setLoginBusy(true);
    const client = window.google.accounts.oauth2.initCodeClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'openid email profile',
      ux_mode: 'popup',
      callback: async (response) => {
        if (!response.code) { setLoginBusy(false); return; }
        try {
          const data = await apiFetch('/auth/google', {
            method: 'POST',
            body: JSON.stringify({ code: response.code, redirectUri: 'postmessage' }),
          });
          setToken(data.accessToken);
          setUser(data.user);
          setLoginOpen(false);
          if (data.user?.role === 'Admin') setScreen('admin-payments');
          else if (data.user?.role === 'BranchStaff') setScreen('kds-board');
        } catch (err) {
          alert(err.message || 'Sign-in failed. Check the console for details.');
        } finally {
          setLoginBusy(false);
        }
      },
    });
    client.requestCode();
  };

  const handleSignOut = () => { setToken(''); setUser(null); };

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
  const displayName = user?.fullName || 'Guest';
  const isBranchStaff = user?.role === 'BranchStaff';
  const goHome = () => setScreen(isBranchStaff ? 'branch-orders' : 'home');

  return (
    <div className="shell">
      {/* TOP NAV */}
      <nav className="topnav">
        <div className="topnav__inner">
          <button onClick={goHome} className="topnav__logo">
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
                onClick={() => { setScreen(isBranchStaff && id === 'home' ? 'branch-orders' : id); window.scrollTo({ top: 0, behavior: 'auto' }); }}>
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
            {token ? (
              <button className="icon-btn" title={`Signed in as ${displayName} — click to sign out`} onClick={handleSignOut}>
                ⏻
              </button>
            ) : (
              <button className="icon-btn" title="Sign in with Google" onClick={() => setLoginOpen(true)}>
                ⇥
              </button>
            )}
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
        {screen === 'home'               && <HomeScreen go={setScreen} addToCart={addToCart} openProduct={openProduct} data={mergedData} />}
        {screen === 'menu'               && <MenuScreen go={setScreen} addToCart={addToCart} openProduct={openProduct} cart={cart} data={mergedData} onCheckout={handleCheckout} checkoutBusy={checkoutBusy} />}
        {screen === 'rewards'            && <RewardsScreen go={setScreen} data={mergedData} loyalty={loyalty} />}
        {screen === 'dashboard'          && <DashboardScreen go={setScreen} user={user} token={token} orders={orderRows} rawOrders={orders} favorites={favoriteItems} addresses={addressList} subscriptions={subscriptionPlans} setCurrentOrderId={setCurrentOrderId} />}
        {screen === 'checkout'           && <CheckoutScreen go={setScreen} cart={cart} token={token} setCart={setCart} setCurrentOrderId={setCurrentOrderId} />}
        {screen === 'order-confirmation' && <OrderConfirmationScreen go={setScreen} currentOrderId={currentOrderId} />}
        {screen === 'order-details'      && <OrderDetailsScreen go={setScreen} currentOrderId={currentOrderId} token={token} />}
        {screen === 'admin-payments'     && <AdminPaymentReviewScreen go={setScreen} token={token} />}
        {screen === 'kds-board'          && <KdsBoardScreen go={setScreen} token={token} user={user} />}
        {screen === 'new-order'          && <NewOrderScreen go={setScreen} token={token} data={mergedData} />}
      </main>

      {/* CART DRAWER (global) */}
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} cart={cart} setCart={setCart} go={setScreen} data={mergedData} onCheckout={handleCheckout} checkoutBusy={checkoutBusy} />

      {/* PRODUCT MODAL */}
      <ProductDetail item={openedItem} onClose={() => setOpenedItem(null)} onAdd={addToCart} data={mergedData} />

      {/* MOBILE BOTTOM NAV — appears on <768px via CSS */}
      <nav className="mobile-bottom-nav">
        {[
          ['home',      tr('nav.home'),    '⌂'],
          ['menu',      tr('nav.menu'),    '☰'],
          ['rewards',   tr('nav.rewards'), '✦'],
          ['dashboard', tr('nav.account'), '◔'],
        ].map(([id, label, glyph]) => (
          <button key={id} data-active={screen === id} onClick={() => { setScreen(isBranchStaff && id === 'home' ? 'branch-orders' : id); window.scrollTo({ top: 0 }); }}>
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
        <TweakButton label="Home"    onClick={goHome} />
        <TweakButton label="Menu"    onClick={() => setScreen('menu')} />
        <TweakButton label="Rewards" onClick={() => setScreen('rewards')} />
        <TweakButton label="Account" onClick={() => setScreen('dashboard')} />
        <TweakSection label="Demo" />
        <TweakButton label="Add Pistachio Latte"  onClick={() => { addToCart(window.BAREEQ.ITEMS.find(i => i.id === 'pis')); }} />
        <TweakButton label="Open product modal"   onClick={() => setOpenedItem(window.BAREEQ.ITEMS.find(i => i.id === 'mdl'))} />
      </TweaksPanel>

      {/* LOGIN MODAL */}
      <LoginModal open={loginOpen} busy={loginBusy} onClose={() => setLoginOpen(false)} onGoogle={handleGoogleLogin} />
    </div>
  );
}

// ============================================================
//  LOGIN MODAL
// ============================================================
function LoginModal({ open, busy, onClose, onGoogle }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(20,12,8,.55)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--paper)', borderRadius: 20, padding: '48px 44px',
        width: 420, maxWidth: '92vw', position: 'relative',
        boxShadow: '0 32px 80px -20px rgba(20,12,8,.45)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28,
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16,
          fontSize: 20, color: 'var(--ink-mute)', background: 'none', border: 'none', cursor: 'pointer',
        }}>×</button>

        <div style={{ textAlign: 'center' }}>
          <Logo size={32} />
          <h2 className="serif" style={{ margin: '18px 0 6px', fontSize: 32, letterSpacing: '-0.015em' }}>
            Welcome back
          </h2>
          <p style={{ fontSize: 14, color: 'var(--ink-mute)', margin: 0, textWrap: 'pretty' }}>
            Sign in to earn sparkles, save favorites, and track your orders.
          </p>
        </div>

        <button
          onClick={onGoogle}
          disabled={busy}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            padding: '14px 20px', borderRadius: 999,
            border: '1px solid var(--rule)', background: busy ? 'var(--ivory-2)' : 'var(--paper)',
            fontSize: 14, fontWeight: 500, cursor: busy ? 'default' : 'pointer',
            color: 'var(--ink)', transition: 'background .15s, border-color .15s',
          }}
          onMouseEnter={e => { if (!busy) e.currentTarget.style.borderColor = 'var(--ink)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--rule)'; }}
        >
          {busy ? (
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12, letterSpacing: '0.1em', opacity: 0.6 }}>SIGNING IN…</span>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        <p style={{ fontSize: 11.5, color: 'var(--ink-faint)', textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
          By signing in you agree to our terms. Your Google account name and email are used only to identify you.
        </p>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <LangProvider>
    <App />
  </LangProvider>
);
