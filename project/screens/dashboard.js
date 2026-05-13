// ============================================================
//  DASHBOARD
// ============================================================

function DashboardScreen({
  go,
  user,
  orders,
  favorites,
  addresses,
  subscriptions
}) {
  const {
    t
  } = useI18n();
  const [tab, setTab] = useState('overview');
  const displayName = user?.fullName || 'Guest';
  const points = user?.sparkles ?? 0;
  const streak = user?.streakCount ?? 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "screen"
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--cream)',
      padding: '50px 0 30px',
      borderBottom: '1px solid var(--rule)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    tone: "gold",
    label: "",
    aspect: "1",
    style: {
      width: 78,
      height: 78,
      borderRadius: '50%'
    },
    grain: false
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, t('dashboard.welcome')), /*#__PURE__*/React.createElement("h1", {
    className: "serif",
    style: {
      margin: '8px 0 4px',
      fontSize: 56,
      lineHeight: 1,
      letterSpacing: '-0.02em'
    }
  }, displayName), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      fontSize: 13,
      color: 'var(--ink-mute)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", null, t('dashboard.member')), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-faint)'
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      letterSpacing: '0.14em'
    }
  }, points, " \u2726")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 22
    }
  }, [[String(orders.length), t('dashboard.orders')], [String(points), t('dashboard.sparkles')], ['EGP 2,840', t('dashboard.saved')], [String(streak), t('dashboard.streak')]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: v,
    style: {
      textAlign: 'center',
      padding: '0 8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 28,
      lineHeight: 1
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginTop: 6
    }
  }, v)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: '1px solid var(--rule)',
      background: 'var(--paper)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      display: 'flex',
      gap: 4,
      padding: '14px 32px'
    }
  }, [['overview', t('dashboard.tabs.overview')], ['orders', t('dashboard.tabs.orders')], ['favorites', t('dashboard.tabs.favorites')], ['addresses', t('dashboard.tabs.addresses')], ['subscriptions', t('dashboard.tabs.subscriptions')], ['settings', t('dashboard.tabs.settings')]].map(([id, label]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    className: "tab",
    "data-active": tab === id,
    onClick: () => setTab(id)
  }, label)))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '50px 0 120px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, tab === 'overview' && /*#__PURE__*/React.createElement(Overview, {
    go: go,
    orders: orders,
    favorites: favorites,
    points: points
  }), tab === 'orders' && /*#__PURE__*/React.createElement(Orders, {
    orders: orders
  }), tab === 'favorites' && /*#__PURE__*/React.createElement(Favorites, {
    favorites: favorites
  }), tab === 'addresses' && /*#__PURE__*/React.createElement(Addresses, {
    addresses: addresses
  }), tab === 'subscriptions' && /*#__PURE__*/React.createElement(Subscriptions, {
    subscriptions: subscriptions
  }), tab === 'settings' && /*#__PURE__*/React.createElement(Settings, {
    user: user
  }))), /*#__PURE__*/React.createElement(Footer, {
    go: go
  }));
}
function Overview({
  go,
  orders,
  favorites,
  points
}) {
  const {
    t
  } = useI18n();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("h3", {
    className: "serif",
    style: {
      margin: 0,
      fontSize: 28
    }
  }, t('dashboard.recent')), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm"
  }, t('common.viewAll'))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, (orders || []).length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 0',
      color: 'var(--ink-mute)',
      fontSize: 14
    }
  }, "No orders yet."), (orders || []).slice(0, 4).map((o, i) => /*#__PURE__*/React.createElement("div", {
    key: o.id,
    style: {
      display: 'grid',
      gridTemplateColumns: '90px 1fr auto auto',
      alignItems: 'center',
      gap: 18,
      padding: '16px 0',
      borderBottom: i < 3 ? '1px solid var(--rule)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      color: 'var(--ink-mute)',
      letterSpacing: '0.12em'
    }
  }, o.id), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14
    }
  }, o.items.join(' · ')), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10.5,
      color: 'var(--ink-faint)',
      letterSpacing: '0.16em',
      marginTop: 3
    }
  }, o.date.toUpperCase())), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 11,
      color: 'var(--gold-deep)',
      letterSpacing: '0.16em'
    }
  }, "+", o.points, " \u2726"), /*#__PURE__*/React.createElement(Price, {
    value: o.total,
    size: 13
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 32,
      background: 'var(--ink)',
      color: 'var(--ivory)',
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true,
    style: {
      color: 'var(--gold)'
    }
  }, t('dashboard.wallet')), /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 72,
      lineHeight: 0.9,
      color: 'var(--gold)'
    }
  }, points, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 24,
      opacity: 0.7
    }
  }, " \u2726")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'rgba(255,240,225,.7)'
    }
  }, "Earn more to reach the next tier"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      background: 'rgba(255,240,225,.15)',
      borderRadius: 999,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${Math.min(points / 750 * 100, 100)}%`,
      height: '100%',
      background: 'linear-gradient(90deg, var(--gold), var(--gold-deep))'
    }
  })), /*#__PURE__*/React.createElement(Hair, {
    style: {
      borderColor: 'rgba(255,240,225,.15)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--gold btn--sm",
    onClick: () => go('rewards')
  }, "View tiers"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost-light btn--sm"
  }, "Redeem"))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 32,
      gridColumn: 'span 2'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("h3", {
    className: "serif",
    style: {
      margin: 0,
      fontSize: 28
    }
  }, t('dashboard.reorder')), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 11,
      color: 'var(--ink-faint)',
      letterSpacing: '0.16em'
    }
  }, (favorites || []).length, " SAVED")), (favorites || []).length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--ink-mute)',
      fontSize: 14
    }
  }, "No favorites saved yet."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 16
    }
  }, (favorites || []).map(f => /*#__PURE__*/React.createElement("div", {
    key: f.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: 14,
      borderRadius: 14,
      border: '1px solid var(--rule)'
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    tone: f.tone,
    label: "",
    aspect: "1",
    style: {
      width: 50,
      height: 50
    },
    grain: false
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 16,
      lineHeight: 1.2,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, f.name), /*#__PURE__*/React.createElement(Price, {
    value: f.price,
    size: 11,
    soft: true
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ink btn--sm"
  }, "+"))))));
}
function Orders({
  orders
}) {
  const {
    t
  } = useI18n();
  const rows = orders || [];
  return /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 0,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '110px 2fr 1fr 90px 90px 110px',
      padding: '14px 28px',
      background: 'var(--ivory-2)',
      borderBottom: '1px solid var(--rule)'
    }
  }, ['Order', 'Items', 'Date', 'Status', 'Sparkles', 'Total'].map(h => /*#__PURE__*/React.createElement("div", {
    key: h,
    className: "eyebrow"
  }, h))), rows.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '32px 28px',
      color: 'var(--ink-mute)',
      fontSize: 14
    }
  }, "No orders yet."), rows.map((o, i) => /*#__PURE__*/React.createElement("div", {
    key: o.id,
    style: {
      display: 'grid',
      gridTemplateColumns: '110px 2fr 1fr 90px 90px 110px',
      padding: '20px 28px',
      alignItems: 'center',
      borderBottom: i < rows.length - 1 ? '1px solid var(--rule)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11.5,
      letterSpacing: '0.12em'
    }
  }, o.id), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14
    }
  }, o.items.join(' · ')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--ink-mute)'
    }
  }, o.date), /*#__PURE__*/React.createElement(Tag, {
    tone: "ghost"
  }, o.status), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 11,
      color: 'var(--gold-deep)',
      letterSpacing: '0.14em'
    }
  }, "+", o.points, " \u2726"), /*#__PURE__*/React.createElement(Price, {
    value: o.total,
    size: 13
  }))));
}
function Favorites({
  favorites
}) {
  const items = favorites || [];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 18
    }
  }, items.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 4',
      padding: '32px 0',
      color: 'var(--ink-mute)',
      fontSize: 14
    }
  }, "No favorites saved yet."), items.map(f => /*#__PURE__*/React.createElement(ProductCard, {
    key: f.id,
    item: f,
    onOpen: () => {},
    onAdd: () => {}
  })));
}
function Addresses({
  addresses
}) {
  const {
    t
  } = useI18n();
  const rows = addresses || [];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 18
    }
  }, rows.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.id,
    className: "card",
    style: {
      padding: 24,
      position: 'relative',
      minHeight: 180
    }
  }, a.primary && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 16,
      right: 16
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    tone: "gold"
  }, "Primary")), /*#__PURE__*/React.createElement(Eyebrow, null, "Saved \xB7 \u0645\u062D\u0641\u0648\u0638"), /*#__PURE__*/React.createElement("h4", {
    className: "serif",
    style: {
      margin: '10px 0 4px',
      fontSize: 24
    }
  }, a.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--ink-mute)'
    }
  }, a.detail), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm"
  }, t('common.edit')), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm"
  }, t('common.remove'))))), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px dashed var(--rule)',
      borderRadius: 18,
      padding: 24,
      display: 'grid',
      placeItems: 'center',
      color: 'var(--ink-mute)',
      minHeight: 180
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 32,
      color: 'var(--ink-faint)'
    }
  }, "+"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      marginTop: 4
    }
  }, "Add new address"))));
}
function Subscriptions({
  subscriptions
}) {
  const {
    t
  } = useI18n();
  const plans = subscriptions || [];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 20
    }
  }, plans.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    className: i === 1 ? 'lux-border' : 'card',
    style: {
      padding: 32,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      minHeight: 340
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, "Subscription \xB7 ", String(i + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("h3", {
    className: "serif",
    style: {
      margin: 0,
      fontSize: 32,
      letterSpacing: '-0.01em'
    }
  }, p.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink-mute)',
      textWrap: 'pretty'
    }
  }, p.sub), /*#__PURE__*/React.createElement(Hair, null), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      fontSize: 13,
      color: 'var(--ink-soft)'
    }
  }, (p.perks || []).map(perk => /*#__PURE__*/React.createElement("li", {
    key: perk,
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--gold-deep)'
    }
  }, "\u2726"), perk))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Price, {
    value: p.price,
    size: 20
  }), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 10.5,
      color: 'var(--ink-mute)',
      letterSpacing: '0.14em',
      marginLeft: 6
    }
  }, "/MO")), /*#__PURE__*/React.createElement("button", {
    className: i === 1 ? 'btn btn--gold btn--sm' : 'btn btn--ink btn--sm'
  }, t('common.subscribe'))))));
}
function Settings({
  user
}) {
  const {
    t
  } = useI18n();
  const name = user?.fullName || '—';
  const email = user?.email || '—';
  const phone = user?.phone || '—';
  return /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 36,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 32
    }
  }, [['Profile', [`Name · ${name}`, `Email · ${email}`, `Phone · ${phone}`]], ['Preferences', ['Default milk · Oat', 'Default size · Double', 'Sweetness · Less']], ['Notifications', ['New drops · On', 'Streak reminders · On', 'Coupons · Weekly']], ['Privacy', ['Order history visible · Yes', 'Personalize offers · Yes', 'Marketing · Off']]].map(([h, items]) => /*#__PURE__*/React.createElement("div", {
    key: h
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, h), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: '14px 0 0',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, items.map(item => /*#__PURE__*/React.createElement("li", {
    key: item,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 13.5,
      paddingBottom: 12,
      borderBottom: '1px solid var(--rule)'
    }
  }, /*#__PURE__*/React.createElement("span", null, item), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-mute)',
      fontSize: 12
    }
  }, t('common.edit'))))))));
}
Object.assign(window, {
  DashboardScreen
});
