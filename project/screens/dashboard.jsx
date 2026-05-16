// ============================================================
//  DASHBOARD
// ============================================================

function DashboardScreen({ go, user, token, orders, rawOrders, favorites, addresses, subscriptions, setCurrentOrderId }) {
  const { t } = useI18n();
  const [tab, setTab] = useState('overview');
  const displayName = user?.fullName || 'Guest';
  const points = user?.sparkles ?? 0;
  const streak = user?.streakCount ?? 0;
  const isAdmin = user?.role === 'Admin' || user?.isAdmin === true;

  const onViewOrder = (orderId) => {
    setCurrentOrderId(orderId);
    go('order-details');
  };

  return (
    <div className="screen">
      {/* DASH HEADER */}
      <section style={{ background: 'var(--cream)', padding: '50px 0 30px', borderBottom: '1px solid var(--rule)' }}>
        <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <Ph tone="gold" label="" aspect="1" style={{ width: 78, height: 78, borderRadius: '50%' }} grain={false} />
            <div>
              <Eyebrow gold>{t('dashboard.welcome')}</Eyebrow>
              <h1 className="serif" style={{ margin: '8px 0 4px', fontSize: 56, lineHeight: 1, letterSpacing: '-0.02em' }}>{displayName}</h1>
              <div style={{ display: 'flex', gap: 14, fontSize: 13, color: 'var(--ink-mute)', alignItems: 'center' }}>
                <span>{t('dashboard.member')}</span>
                <span style={{ color: 'var(--ink-faint)' }}>·</span>
                <span className="mono" style={{ letterSpacing: '0.14em' }}>{points} ✦</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 22 }}>
            {[
              [String(orders.length),  t('dashboard.orders')],
              [String(points),         t('dashboard.sparkles')],
              ['EGP 2,840',            t('dashboard.saved')],
              [String(streak),         t('dashboard.streak')],
            ].map(([k,v]) => (
              <div key={v} style={{ textAlign: 'center', padding: '0 8px' }}>
                <div className="serif" style={{ fontSize: 28, lineHeight: 1 }}>{k}</div>
                <div className="eyebrow" style={{ marginTop: 6 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TABS */}
      <div style={{ borderBottom: '1px solid var(--rule)', background: 'var(--paper)' }}>
        <div className="wrap" style={{ display: 'flex', gap: 4, padding: '14px 32px' }}>
          {[
            ['overview',      t('dashboard.tabs.overview')],
            ['orders',        t('dashboard.tabs.orders')],
            ['favorites',     t('dashboard.tabs.favorites')],
            ['addresses',     t('dashboard.tabs.addresses')],
            ['subscriptions', t('dashboard.tabs.subscriptions')],
            ['settings',      t('dashboard.tabs.settings')],
            ...(isAdmin ? [
              ['admin',           t('dashboard.tabs.admin')],
              ['admin-analytics', t('dashboard.tabs.adminAnalytics')],
            ] : []),
          ].map(([id, label]) => (
            <button key={id} className="tab" data-active={tab === id} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <section style={{ padding: '50px 0 120px' }}>
        <div className="wrap">
          {tab === 'overview'      && <Overview go={go} orders={orders} favorites={favorites} points={points} onViewOrder={onViewOrder} />}
          {tab === 'orders'        && <Orders orders={orders} rawOrders={rawOrders} onViewOrder={onViewOrder} />}
          {tab === 'favorites'     && <Favorites favorites={favorites} />}
          {tab === 'addresses'     && <Addresses addresses={addresses} />}
          {tab === 'subscriptions' && <Subscriptions subscriptions={subscriptions} />}
          {tab === 'settings'      && <Settings user={user} />}
          {tab === 'admin'          && <AdminPaymentReviewScreen go={go} token={token} />}
          {tab === 'admin-analytics' && <AdminAnalyticsDashboardScreen token={token} />}
        </div>
      </section>

      <Footer go={go} />
    </div>
  );
}

function Overview({ go, orders, favorites, points, onViewOrder }) {
  const { t } = useI18n();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 22 }}>
      {/* Recent orders */}
      <div className="card" style={{ padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22 }}>
          <h3 className="serif" style={{ margin: 0, fontSize: 28 }}>{t('dashboard.recent')}</h3>
          <button className="btn btn--ghost btn--sm">{t('common.viewAll')}</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {(orders || []).length === 0 && (
            <div style={{ padding: '24px 0', color: 'var(--ink-mute)', fontSize: 14 }}>No orders yet.</div>
          )}
          {(orders || []).slice(0, 4).map((o, i) => (
            <div key={o.id} style={{ display: 'grid', gridTemplateColumns: '90px 1fr auto auto', alignItems: 'center', gap: 18, padding: '16px 0', borderBottom: i < 3 ? '1px solid var(--rule)' : 'none' }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)', letterSpacing: '0.12em' }}>{o.id}</div>
              <div>
                <div style={{ fontSize: 14 }}>{o.items.join(' · ')}</div>
                <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-faint)', letterSpacing: '0.16em', marginTop: 3 }}>{o.date.toUpperCase()}</div>
              </div>
              <span className="mono" style={{ fontSize: 11, color: 'var(--gold-deep)', letterSpacing: '0.16em' }}>+{o.points} ✦</span>
              <Price value={o.total} size={13} />
            </div>
          ))}
        </div>
      </div>

      {/* Wallet card */}
      <div className="card" style={{ padding: 32, background: 'var(--ink)', color: 'var(--ivory)', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Eyebrow gold style={{ color: 'var(--gold)' }}>{t('dashboard.wallet')}</Eyebrow>
        <div className="serif" style={{ fontSize: 72, lineHeight: 0.9, color: 'var(--gold)' }}>{points}<span style={{ fontSize: 24, opacity: 0.7 }}> ✦</span></div>
        <div style={{ fontSize: 13, color: 'rgba(255,240,225,.7)' }}>Earn more to reach the next tier</div>
        <div style={{ height: 6, background: 'rgba(255,240,225,.15)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: `${Math.min((points / 750) * 100, 100)}%`, height: '100%', background: 'linear-gradient(90deg, var(--gold), var(--gold-deep))' }} />
        </div>
        <Hair style={{ borderColor: 'rgba(255,240,225,.15)'}}/>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn--gold btn--sm" onClick={() => go('rewards')}>View tiers</button>
          <button className="btn btn--ghost-light btn--sm">Redeem</button>
        </div>
      </div>

      {/* Favorites strip */}
      <div className="card" style={{ padding: 32, gridColumn: 'span 2' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
          <h3 className="serif" style={{ margin: 0, fontSize: 28 }}>{t('dashboard.reorder')}</h3>
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '0.16em' }}>{(favorites || []).length} SAVED</span>
        </div>
        {(favorites || []).length === 0 && (
          <div style={{ color: 'var(--ink-mute)', fontSize: 14 }}>No favorites saved yet.</div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {(favorites || []).map(f => (
            <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, borderRadius: 14, border: '1px solid var(--rule)' }}>
              <Ph tone={f.tone} label="" aspect="1" style={{ width: 50, height: 50 }} grain={false} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="serif" style={{ fontSize: 16, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</div>
                <Price value={f.price} size={11} soft />
              </div>
              <button className="btn btn--ink btn--sm">+</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Orders({ orders, rawOrders, onViewOrder }) {
  const { t } = useI18n();
  const rows = orders || [];
  const raw = rawOrders || [];
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '110px 2fr 1fr 90px 90px 100px 80px', padding: '14px 28px', background: 'var(--ivory-2)', borderBottom: '1px solid var(--rule)' }}>
        {['Order', 'Items', 'Date', 'Status', 'Sparkles', 'Total', ''].map(h => (
          <div key={h} className="eyebrow">{h}</div>
        ))}
      </div>
      {rows.length === 0 && (
        <div style={{ padding: '32px 28px', color: 'var(--ink-mute)', fontSize: 14 }}>No orders yet.</div>
      )}
      {rows.map((o, i) => {
        const rawOrder = raw.find(r => `BR-${r.id.slice(0, 4).toUpperCase()}` === o.id);
        return (
          <div key={o.id} style={{ display: 'grid', gridTemplateColumns: '110px 2fr 1fr 90px 90px 100px 80px', padding: '20px 28px', alignItems: 'center', borderBottom: i < rows.length - 1 ? '1px solid var(--rule)' : 'none' }}>
            <div className="mono" style={{ fontSize: 11.5, letterSpacing: '0.12em' }}>{o.id}</div>
            <div style={{ fontSize: 14 }}>{o.items.join(' · ')}</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-mute)' }}>{o.date}</div>
            <Tag tone="ghost">{o.status}</Tag>
            <span className="mono" style={{ fontSize: 11, color: 'var(--gold-deep)', letterSpacing: '0.14em' }}>+{o.points} ✦</span>
            <Price value={o.total} size={13} />
            {rawOrder && onViewOrder && (
              <button className="btn btn--ghost btn--sm" onClick={() => onViewOrder(rawOrder.id)}>View</button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Favorites({ favorites }) {
  const items = favorites || [];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
      {items.length === 0 && (
        <div style={{ gridColumn: 'span 4', padding: '32px 0', color: 'var(--ink-mute)', fontSize: 14 }}>No favorites saved yet.</div>
      )}
      {items.map(f => (
        <ProductCard key={f.id} item={f} onOpen={() => {}} onAdd={() => {}} />
      ))}
    </div>
  );
}

function Addresses({ addresses }) {
  const { t } = useI18n();
  const rows = addresses || [];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
      {rows.map(a => (
        <div key={a.id} className="card" style={{ padding: 24, position: 'relative', minHeight: 180 }}>
          {a.primary && <div style={{ position: 'absolute', top: 16, right: 16 }}><Tag tone="gold">Primary</Tag></div>}
          <Eyebrow>Saved · محفوظ</Eyebrow>
          <h4 className="serif" style={{ margin: '10px 0 4px', fontSize: 24 }}>{a.label}</h4>
          <div style={{ fontSize: 13.5, color: 'var(--ink-mute)' }}>{a.detail}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
            <button className="btn btn--ghost btn--sm">{t('common.edit')}</button>
            <button className="btn btn--ghost btn--sm">{t('common.remove')}</button>
          </div>
        </div>
      ))}
      <div style={{ border: '1px dashed var(--rule)', borderRadius: 18, padding: 24, display: 'grid', placeItems: 'center', color: 'var(--ink-mute)', minHeight: 180 }}>
        <div style={{ textAlign: 'center' }}>
          <div className="serif" style={{ fontSize: 32, color: 'var(--ink-faint)' }}>+</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Add new address</div>
        </div>
      </div>
    </div>
  );
}

function Subscriptions({ subscriptions }) {
  const { t } = useI18n();
  const plans = subscriptions || [];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
      {plans.map((p, i) => (
        <div key={p.id} className={i === 1 ? 'lux-border' : 'card'} style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16, minHeight: 340 }}>
          <Eyebrow gold>Subscription · {String(i+1).padStart(2,'0')}</Eyebrow>
          <h3 className="serif" style={{ margin: 0, fontSize: 32, letterSpacing: '-0.01em' }}>{p.label}</h3>
          <div style={{ fontSize: 13, color: 'var(--ink-mute)', textWrap: 'pretty' }}>{p.sub}</div>
          <Hair />
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--ink-soft)' }}>
            {(p.perks || []).map(perk => <li key={perk} style={{ display: 'flex', gap: 8 }}><span style={{ color: 'var(--gold-deep)' }}>✦</span>{perk}</li>)}
          </ul>
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Price value={p.price} size={20} />
              <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-mute)', letterSpacing: '0.14em', marginLeft: 6 }}>/MO</span>
            </div>
            <button className={i === 1 ? 'btn btn--gold btn--sm' : 'btn btn--ink btn--sm'}>{t('common.subscribe')}</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Settings({ user }) {
  const { t } = useI18n();
  const name  = user?.fullName || '—';
  const email = user?.email    || '—';
  const phone = user?.phone    || '—';
  return (
    <div className="card" style={{ padding: 36, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
      {[
        ['Profile',       [`Name · ${name}`, `Email · ${email}`, `Phone · ${phone}`]],
        ['Preferences',   ['Default milk · Oat','Default size · Double','Sweetness · Less']],
        ['Notifications', ['New drops · On','Streak reminders · On','Coupons · Weekly']],
        ['Privacy',       ['Order history visible · Yes','Personalize offers · Yes','Marketing · Off']],
      ].map(([h, items]) => (
        <div key={h}>
          <Eyebrow gold>{h}</Eyebrow>
          <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map(item => (
              <li key={item} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, paddingBottom: 12, borderBottom: '1px solid var(--rule)' }}>
                <span>{item}</span>
                <span style={{ color: 'var(--ink-mute)', fontSize: 12 }}>{t('common.edit')}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { DashboardScreen, Orders });
