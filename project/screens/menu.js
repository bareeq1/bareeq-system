// ============================================================
//  MENU — interactive ordering, category filters, cart drawer
// ============================================================

function MenuScreen({
  go,
  addToCart,
  openProduct,
  cart
}) {
  const {
    lang,
    t
  } = useI18n();
  const [activeCat, setActiveCat] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('curated');
  const items = useMemo(() => {
    let list = window.BAREEQ.ITEMS.slice();
    if (activeCat !== 'all') list = list.filter(i => i.cat === activeCat);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(i => (i.name + i.ar + i.desc).toLowerCase().includes(q));
    }
    if (sort === 'low') list.sort((a, b) => a.price - b.price);
    if (sort === 'high') list.sort((a, b) => b.price - a.price);
    if (sort === 'cal') list.sort((a, b) => (a.calories ?? 9999) - (b.calories ?? 9999));
    return list;
  }, [activeCat, query, sort]);
  const grouped = useMemo(() => {
    if (activeCat !== 'all') return [{
      cat: activeCat,
      items
    }];
    const map = new Map();
    items.forEach(i => {
      if (!map.has(i.cat)) map.set(i.cat, []);
      map.get(i.cat).push(i);
    });
    return [...map.entries()].map(([cat, items]) => ({
      cat,
      items
    }));
  }, [items, activeCat]);
  return /*#__PURE__*/React.createElement("div", {
    className: "screen"
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--burgundy)',
      color: 'var(--ivory)',
      padding: '50px 0 60px',
      position: 'relative'
    },
    className: "grain"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap-wide",
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      alignItems: 'end',
      gap: 60
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true,
    style: {
      color: 'var(--gold)'
    }
  }, t('menu.kicker')), /*#__PURE__*/React.createElement("h1", {
    className: "serif",
    style: {
      margin: '18px 0 0',
      fontSize: 96,
      lineHeight: 0.96,
      letterSpacing: '-0.02em',
      fontWeight: 400
    }
  }, t('menu.title1'), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", {
    style: {
      color: 'var(--gold)'
    }
  }, t('menu.title2')))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "arabic",
    style: {
      fontSize: 32,
      color: 'var(--gold)',
      textAlign: 'right'
    }
  }, lang === 'en' ? 'ثمانية وأربعون سببًا للعودة' : 'Forty-eight reasons to come back'), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      color: 'rgba(255,240,225,0.6)',
      fontSize: 11,
      letterSpacing: '0.2em',
      textAlign: 'right'
    }
  }, t('menu.edition'), /*#__PURE__*/React.createElement("br", null), "HELWAN \xB7 4 \u2014 7 \u2014 2026")))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 64,
      zIndex: 30,
      background: 'color-mix(in oklch, var(--ivory) 92%, transparent)',
      backdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--rule)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      padding: '18px 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: query,
    onChange: e => setQuery(e.target.value),
    placeholder: t('common.search'),
    style: {
      width: '100%',
      padding: '12px 16px 12px 42px',
      borderRadius: 999,
      border: '1px solid var(--rule)',
      background: 'var(--paper)',
      fontSize: 14,
      outline: 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 16,
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--ink-mute)'
    }
  }, "\u2315")), /*#__PURE__*/React.createElement("select", {
    value: sort,
    onChange: e => setSort(e.target.value),
    style: {
      padding: '12px 16px',
      borderRadius: 999,
      border: '1px solid var(--rule)',
      background: 'var(--paper)',
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "curated"
  }, t('menu.sortCurated')), /*#__PURE__*/React.createElement("option", {
    value: "low"
  }, t('menu.sortLow')), /*#__PURE__*/React.createElement("option", {
    value: "high"
  }, t('menu.sortHigh')), /*#__PURE__*/React.createElement("option", {
    value: "cal"
  }, t('menu.sortCal')))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      overflowX: 'auto',
      paddingBottom: 2
    },
    className: "no-scrollbar"
  }, /*#__PURE__*/React.createElement("button", {
    className: "chip",
    "data-active": activeCat === 'all',
    onClick: () => setActiveCat('all')
  }, t('menu.all'), " \xB7 ", window.BAREEQ.ITEMS.length), window.BAREEQ.CATEGORIES.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.id,
    className: "chip",
    "data-active": activeCat === c.id,
    onClick: () => setActiveCat(c.id)
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.7
    }
  }, c.glyph), lang === 'ar' ? c.ar : c.label, ' ', /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.55,
      fontFamily: 'var(--f-mono)',
      fontSize: 10
    }
  }, window.BAREEQ.ITEMS.filter(i => i.cat === c.id).length)))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '50px 0 120px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, grouped.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: 80,
      color: 'var(--ink-mute)'
    }
  }, t('menu.noResults'), " \"", query, "\"."), grouped.map(({
    cat,
    items: catItems
  }) => {
    const c = window.BAREEQ.CATEGORIES.find(x => x.id === cat);
    return /*#__PURE__*/React.createElement("div", {
      key: cat,
      style: {
        marginBottom: 80
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 18
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "serif",
      style: {
        fontSize: 48,
        color: 'var(--gold-deep)',
        lineHeight: 1
      }
    }, c.glyph), /*#__PURE__*/React.createElement("h3", {
      className: "serif",
      style: {
        fontSize: 44,
        margin: 0,
        letterSpacing: '-0.015em'
      }
    }, lang === 'ar' ? c.ar : c.label), /*#__PURE__*/React.createElement("span", {
      className: lang === 'ar' ? 'serif' : 'arabic',
      style: {
        fontSize: 28,
        color: 'var(--ink-mute)'
      }
    }, lang === 'ar' ? c.label : c.ar)), /*#__PURE__*/React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 11,
        color: 'var(--ink-faint)',
        letterSpacing: '0.18em'
      }
    }, String(catItems.length).padStart(2, '0'), " ", t('common.items'))), /*#__PURE__*/React.createElement(Hair, {
      style: {
        marginBottom: 24
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 22
      }
    }, catItems.map(it => /*#__PURE__*/React.createElement(ProductCard, {
      key: it.id,
      item: it,
      onOpen: openProduct,
      onAdd: addToCart
    }))));
  }))), /*#__PURE__*/React.createElement(Footer, {
    go: go
  }));
}

// ============================================================
//  PRODUCT DETAIL MODAL
// ============================================================
function ProductDetail({
  item,
  onClose,
  onAdd
}) {
  if (!item) return null;
  const {
    lang,
    t
  } = useI18n();
  const [size, setSize] = useState('single');
  const [milk, setMilk] = useState('fresh');
  const [extras, setExtras] = useState([]);
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');
  const sizeDelta = window.BAREEQ.SIZES.find(s => s.id === size)?.delta || 0;
  const milkDelta = window.BAREEQ.MILKS.find(m => m.id === milk)?.delta || 0;
  const extrasDelta = window.BAREEQ.ADDONS.filter(a => extras.includes(a.id)).reduce((sum, a) => sum + a.price, 0);
  const total = (item.price + sizeDelta + milkDelta + extrasDelta) * qty;
  const toggleExtra = id => setExtras(e => e.includes(id) ? e.filter(x => x !== id) : [...e, id]);
  const pairs = window.BAREEQ.ITEMS.filter(i => i.cat === 'cookies' || i.cat === 'bakery').slice(0, 3);
  return /*#__PURE__*/React.createElement(Modal, {
    open: !!item,
    onClose: onClose
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      minHeight: 600
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      background: 'var(--cream)'
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    tone: item.tone,
    label: item.name,
    radius: 0,
    aspect: "auto",
    style: {
      position: 'absolute',
      inset: 0,
      height: '100%'
    }
  }), item.flag && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 20,
      left: 20
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    tone: item.flag === 'bestseller' ? 'gold' : 'burgundy'
  }, item.flag)), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      position: 'absolute',
      top: 16,
      right: 16,
      width: 36,
      height: 36,
      borderRadius: 999,
      background: 'rgba(255,255,255,.9)',
      backdropFilter: 'blur(6px)',
      display: 'grid',
      placeItems: 'center',
      fontSize: 18
    }
  }, "\xD7"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      color: 'var(--ivory)',
      mixBlendMode: 'difference'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.2em'
    }
  }, item.calories != null ? `${item.calories} KCAL · ` : '', item.cat.toUpperCase()))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 36,
      display: 'flex',
      flexDirection: 'column',
      gap: 22,
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, window.BAREEQ.CATEGORIES.find(c => c.id === item.cat)?.label), /*#__PURE__*/React.createElement("h2", {
    className: "serif",
    style: {
      margin: '12px 0 4px',
      fontSize: 40,
      lineHeight: 1.05,
      letterSpacing: '-0.015em'
    }
  }, lang === 'ar' ? item.ar : item.name), /*#__PURE__*/React.createElement("div", {
    className: "arabic",
    style: {
      fontSize: 22,
      color: 'var(--ink-mute)',
      direction: 'rtl',
      textAlign: 'left'
    }
  }, lang === 'ar' ? item.name : item.ar), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '14px 0 0',
      color: 'var(--ink-soft)',
      fontSize: 14,
      textWrap: 'pretty'
    }
  }, item.desc)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, t('product.ingredients')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 12
    }
  }, item.desc.split(/[,·]/).map(s => s.trim()).filter(Boolean).map(s => /*#__PURE__*/React.createElement("span", {
    key: s,
    style: {
      padding: '5px 10px',
      borderRadius: 999,
      background: 'var(--ivory-2)',
      fontSize: 11.5,
      color: 'var(--ink-soft)'
    }
  }, s)))), /*#__PURE__*/React.createElement(Hair, null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, t('product.size')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 10
    }
  }, window.BAREEQ.SIZES.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    className: "chip",
    "data-active": size === s.id,
    onClick: () => setSize(s.id),
    style: {
      flex: 1,
      justifyContent: 'center'
    }
  }, s.label, s.delta > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.6,
      fontFamily: 'var(--f-mono)',
      fontSize: 10
    }
  }, "+", s.delta))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, t('product.milk')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 10
    }
  }, window.BAREEQ.MILKS.map(m => /*#__PURE__*/React.createElement("button", {
    key: m.id,
    className: "chip",
    "data-active": milk === m.id,
    onClick: () => setMilk(m.id)
  }, m.label, m.delta > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.6,
      fontFamily: 'var(--f-mono)',
      fontSize: 10
    }
  }, "+", m.delta))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, t('product.addons')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 10
    }
  }, window.BAREEQ.ADDONS.map(a => /*#__PURE__*/React.createElement("button", {
    key: a.id,
    className: "chip",
    "data-active": extras.includes(a.id),
    onClick: () => toggleExtra(a.id)
  }, a.label, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.6,
      fontFamily: 'var(--f-mono)',
      fontSize: 10
    }
  }, "+", a.price))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, t('product.notes')), /*#__PURE__*/React.createElement("input", {
    value: notes,
    onChange: e => setNotes(e.target.value),
    placeholder: t('product.notesPlaceholder'),
    style: {
      width: '100%',
      marginTop: 10,
      padding: '12px 14px',
      borderRadius: 12,
      border: '1px solid var(--rule)',
      background: 'var(--paper)',
      fontSize: 13
    }
  })), /*#__PURE__*/React.createElement(Hair, null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, t('product.pairs')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginTop: 12
    }
  }, pairs.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flex: 1,
      padding: 10,
      borderRadius: 12,
      border: '1px solid var(--rule)'
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    tone: p.tone,
    label: "",
    aspect: "1",
    style: {
      width: 42,
      height: 42
    },
    grain: false
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 14,
      lineHeight: 1.2
    }
  }, lang === 'ar' ? p.ar : p.name), /*#__PURE__*/React.createElement(Price, {
    value: p.price,
    size: 11,
    soft: true
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      bottom: -36,
      background: 'var(--paper)',
      paddingTop: 16,
      marginTop: 'auto',
      display: 'flex',
      gap: 14,
      alignItems: 'center',
      borderTop: '1px solid var(--rule)',
      paddingBottom: 0
    }
  }, /*#__PURE__*/React.createElement(Qty, {
    value: qty,
    onChange: setQty
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ink btn--block",
    onClick: () => {
      onAdd({
        ...item,
        size,
        milk,
        extras,
        qty,
        notes,
        finalPrice: total / qty
      });
      onClose();
    },
    style: {
      flex: 1
    }
  }, t('product.addToCart'), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      opacity: 0.8,
      fontFamily: 'var(--f-mono)'
    }
  }, t('common.currency'), " ", total.toFixed(0)))))));
}

// ============================================================
//  CART DRAWER
// ============================================================
function CartDrawer({
  open,
  onClose,
  cart,
  setCart,
  go
}) {
  const {
    lang,
    t
  } = useI18n();
  const isRtl = lang === 'ar';
  const subtotal = cart.reduce((s, c) => s + (c.finalPrice || c.price) * c.qty, 0);
  const points = Math.floor(subtotal / 10);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 80,
      pointerEvents: open ? 'auto' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(20,12,8,.4)',
      backdropFilter: 'blur(6px)',
      opacity: open ? 1 : 0,
      transition: 'opacity .3s ease'
    }
  }), /*#__PURE__*/React.createElement("aside", {
    style: {
      position: 'absolute',
      ...(isRtl ? {
        left: 0
      } : {
        right: 0
      }),
      top: 0,
      bottom: 0,
      width: 460,
      background: 'var(--paper)',
      ...(isRtl ? {
        borderRight: '1px solid var(--rule)'
      } : {
        borderLeft: '1px solid var(--rule)'
      }),
      transform: open ? 'translateX(0)' : isRtl ? 'translateX(-100%)' : 'translateX(100%)',
      transition: 'transform .35s cubic-bezier(.2,.7,.2,1)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px 26px',
      borderBottom: '1px solid var(--rule)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, t('cart.eyebrow')), /*#__PURE__*/React.createElement("h3", {
    className: "serif",
    style: {
      margin: '6px 0 0',
      fontSize: 26
    }
  }, t('cart.title'))), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      fontSize: 22,
      color: 'var(--ink-mute)'
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto',
      padding: '20px 26px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, cart.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '60px 20px',
      color: 'var(--ink-mute)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 28,
      color: 'var(--ink-faint)'
    }
  }, "\u2014"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, t('common.empty')), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm",
    style: {
      marginTop: 18
    },
    onClick: () => {
      onClose();
      go('menu');
    }
  }, t('common.browse'))), cart.map((item, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    tone: item.tone,
    label: "",
    aspect: "1",
    style: {
      width: 64,
      height: 64,
      flexShrink: 0
    },
    grain: false
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 17,
      lineHeight: 1.2
    }
  }, item.name), /*#__PURE__*/React.createElement(Price, {
    value: (item.finalPrice || item.price) * item.qty,
    size: 13
  })), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: 'var(--ink-mute)',
      letterSpacing: '0.1em',
      marginTop: 4
    }
  }, [item.size, item.milk, ...(item.extras || [])].filter(Boolean).join(' · ').toUpperCase()), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(Qty, {
    value: item.qty,
    onChange: v => setCart(c => c.map((x, idx) => idx === i ? {
      ...x,
      qty: v
    } : x))
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setCart(c => c.filter((_, idx) => idx !== i)),
    style: {
      fontSize: 11,
      color: 'var(--ink-mute)',
      textDecoration: 'underline'
    }
  }, t('common.remove'))))))), cart.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 26px',
      borderTop: '1px solid var(--rule)',
      background: 'var(--ivory)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 13,
      color: 'var(--ink-soft)',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", null, t('cart.subtotal')), /*#__PURE__*/React.createElement(Price, {
    value: subtotal,
    size: 13,
    soft: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 13,
      color: 'var(--ink-soft)',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", null, t('cart.delivery')), /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, t('cart.free'), " \xB7 \u2726", points)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      borderTop: '1px dashed var(--rule)',
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "serif",
    style: {
      fontSize: 22
    }
  }, t('cart.total')), /*#__PURE__*/React.createElement(Price, {
    value: subtotal,
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--burgundy)',
      color: 'var(--ivory)',
      padding: '10px 14px',
      borderRadius: 12,
      marginTop: 14,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("span", null, t('cart.earn'), " ", /*#__PURE__*/React.createElement("strong", null, points, " ", t('cart.sparkles')), " \u2726"), /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.7
    }
  }, "250 \u2192 ", t('cart.toSilver'))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--gold btn--block",
    style: {
      marginTop: 14
    }
  }, t('common.checkout')))));
}
Object.assign(window, {
  MenuScreen,
  ProductDetail,
  CartDrawer
});
