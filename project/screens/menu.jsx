// ============================================================
//  MENU — interactive ordering, category filters, cart drawer
// ============================================================

function MenuScreen({ go, addToCart, openProduct, cart, lang }) {
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
    if (sort === 'low') list.sort((a,b) => a.price - b.price);
    if (sort === 'high') list.sort((a,b) => b.price - a.price);
    if (sort === 'cal') list.sort((a,b) => (a.calories ?? 9999) - (b.calories ?? 9999));
    return list;
  }, [activeCat, query, sort]);

  const grouped = useMemo(() => {
    if (activeCat !== 'all') return [{ cat: activeCat, items }];
    const map = new Map();
    items.forEach(i => {
      if (!map.has(i.cat)) map.set(i.cat, []);
      map.get(i.cat).push(i);
    });
    return [...map.entries()].map(([cat, items]) => ({ cat, items }));
  }, [items, activeCat]);

  return (
    <div className="screen">
      {/* MENU MASTHEAD */}
      <section style={{ background: 'var(--burgundy)', color: 'var(--ivory)', padding: '50px 0 60px', position: 'relative' }} className="grain">
        <div className="wrap-wide" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', alignItems: 'end', gap: 60 }}>
          <div>
            <Eyebrow gold style={{ color: 'var(--gold)' }}>The Menu · القائمة</Eyebrow>
            <h1 className="serif" style={{ margin: '18px 0 0', fontSize: 96, lineHeight: 0.96, letterSpacing: '-0.02em', fontWeight: 400 }}>
              Forty-eight reasons<br/>
              <em style={{ color: 'var(--gold)' }}>to come back.</em>
            </h1>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-end' }}>
            <div className="arabic" style={{ fontSize: 32, color: 'var(--gold)', textAlign: 'right' }}>ثمانية وأربعون سببًا للعودة</div>
            <div className="mono" style={{ color: 'rgba(255,240,225,0.6)', fontSize: 11, letterSpacing: '0.2em', textAlign: 'right' }}>
              EDITION · SS 26<br/>HELWAN · 4 — 7 — 2026
            </div>
          </div>
        </div>
      </section>

      {/* STICKY FILTER BAR */}
      <div style={{ position: 'sticky', top: 64, zIndex: 30, background: 'color-mix(in oklch, var(--ivory) 92%, transparent)', backdropFilter: 'blur(14px)', borderBottom: '1px solid var(--rule)' }}>
        <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '18px 32px' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search the menu · ابحث"
                style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: 999, border: '1px solid var(--rule)', background: 'var(--paper)', fontSize: 14, outline: 'none' }}
              />
              <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-mute)' }}>⌕</span>
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '12px 16px', borderRadius: 999, border: '1px solid var(--rule)', background: 'var(--paper)', fontSize: 13 }}>
              <option value="curated">Curated</option>
              <option value="low">Price · low to high</option>
              <option value="high">Price · high to low</option>
              <option value="cal">Calories · light first</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }} className="no-scrollbar">
            <button className="chip" data-active={activeCat === 'all'} onClick={() => setActiveCat('all')}>All · {window.BAREEQ.ITEMS.length}</button>
            {window.BAREEQ.CATEGORIES.map(c => (
              <button key={c.id} className="chip" data-active={activeCat === c.id} onClick={() => setActiveCat(c.id)}>
                <span style={{ opacity: 0.7 }}>{c.glyph}</span>
                {c.label} <span style={{ opacity: 0.55, fontFamily: 'var(--f-mono)', fontSize: 10 }}>{window.BAREEQ.ITEMS.filter(i => i.cat === c.id).length}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GROUPED LISTING */}
      <section style={{ padding: '50px 0 120px' }}>
        <div className="wrap">
          {grouped.length === 0 && <div style={{ textAlign: 'center', padding: 80, color: 'var(--ink-mute)' }}>Nothing matches “{query}”.</div>}
          {grouped.map(({ cat, items }) => {
            const c = window.BAREEQ.CATEGORIES.find(x => x.id === cat);
            return (
              <div key={cat} style={{ marginBottom: 80 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
                    <span className="serif" style={{ fontSize: 48, color: 'var(--gold-deep)', lineHeight: 1 }}>{c.glyph}</span>
                    <h3 className="serif" style={{ fontSize: 44, margin: 0, letterSpacing: '-0.015em' }}>{c.label}</h3>
                    <span className="arabic" style={{ fontSize: 28, color: 'var(--ink-mute)' }}>{c.ar}</span>
                  </div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '0.18em' }}>{String(items.length).padStart(2,'0')} ITEMS</div>
                </div>
                <Hair style={{ marginBottom: 24 }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
                  {items.map(it => (
                    <ProductCard key={it.id} item={it} lang={lang} onOpen={openProduct} onAdd={addToCart} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer go={go} />
    </div>
  );
}

// ============================================================
//  PRODUCT DETAIL MODAL
// ============================================================
function ProductDetail({ item, onClose, onAdd }) {
  if (!item) return null;
  const [size, setSize] = useState('single');
  const [milk, setMilk] = useState('fresh');
  const [extras, setExtras] = useState([]);
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');

  const sizeDelta = window.BAREEQ.SIZES.find(s => s.id === size)?.delta || 0;
  const milkDelta = window.BAREEQ.MILKS.find(m => m.id === milk)?.delta || 0;
  const extrasDelta = window.BAREEQ.ADDONS.filter(a => extras.includes(a.id)).reduce((sum, a) => sum + a.price, 0);
  const total = (item.price + sizeDelta + milkDelta + extrasDelta) * qty;

  const toggleExtra = (id) => setExtras(e => e.includes(id) ? e.filter(x => x !== id) : [...e, id]);

  const pairs = window.BAREEQ.ITEMS.filter(i => i.cat === 'cookies' || i.cat === 'bakery').slice(0, 3);

  return (
    <Modal open={!!item} onClose={onClose}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 600 }}>
        {/* LEFT — imagery */}
        <div style={{ position: 'relative', background: 'var(--cream)' }}>
          <Ph tone={item.tone} label={item.name} radius={0} aspect="auto" style={{ position: 'absolute', inset: 0, height: '100%' }} />
          {item.flag && <div style={{ position: 'absolute', top: 20, left: 20 }}><Tag tone={item.flag === 'bestseller' ? 'gold' : 'burgundy'}>{item.flag}</Tag></div>}
          <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, width: 36, height: 36, borderRadius: 999, background: 'rgba(255,255,255,.9)', backdropFilter: 'blur(6px)', display: 'grid', placeItems: 'center', fontSize: 18 }}>×</button>
          <div style={{ position: 'absolute', bottom: 20, left: 20, color: 'var(--ivory)', mixBlendMode: 'difference' }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.2em' }}>{(item.calories != null ? `${item.calories} KCAL · ` : '')}{item.cat.toUpperCase()}</div>
          </div>
        </div>

        {/* RIGHT — config */}
        <div style={{ padding: 36, display: 'flex', flexDirection: 'column', gap: 22, overflow: 'auto' }}>
          <div>
            <Eyebrow gold>{window.BAREEQ.CATEGORIES.find(c => c.id === item.cat)?.label}</Eyebrow>
            <h2 className="serif" style={{ margin: '12px 0 4px', fontSize: 40, lineHeight: 1.05, letterSpacing: '-0.015em' }}>{item.name}</h2>
            <div className="arabic" style={{ fontSize: 22, color: 'var(--ink-mute)', direction: 'rtl', textAlign: 'left' }}>{item.ar}</div>
            <p style={{ margin: '14px 0 0', color: 'var(--ink-soft)', fontSize: 14, textWrap: 'pretty' }}>{item.desc}</p>
          </div>

          {/* Ingredients */}
          <div>
            <Eyebrow>Ingredients · مكونات</Eyebrow>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
              {item.desc.split(/[,·]/).map((s,i) => s.trim()).filter(Boolean).map(s => (
                <span key={s} style={{ padding: '5px 10px', borderRadius: 999, background: 'var(--ivory-2)', fontSize: 11.5, color: 'var(--ink-soft)' }}>{s}</span>
              ))}
            </div>
          </div>

          <Hair />

          {/* Size */}
          <div>
            <Eyebrow>Size · الحجم</Eyebrow>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              {window.BAREEQ.SIZES.map(s => (
                <button key={s.id} className="chip" data-active={size === s.id} onClick={() => setSize(s.id)} style={{ flex: 1, justifyContent: 'center' }}>
                  {s.label}{s.delta > 0 && <span style={{ opacity: 0.6, fontFamily: 'var(--f-mono)', fontSize: 10 }}>+{s.delta}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Milk */}
          <div>
            <Eyebrow>Milk · الحليب</Eyebrow>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
              {window.BAREEQ.MILKS.map(m => (
                <button key={m.id} className="chip" data-active={milk === m.id} onClick={() => setMilk(m.id)}>
                  {m.label}{m.delta > 0 && <span style={{ opacity: 0.6, fontFamily: 'var(--f-mono)', fontSize: 10 }}>+{m.delta}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          <div>
            <Eyebrow>Add a touch · إضافات</Eyebrow>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
              {window.BAREEQ.ADDONS.map(a => (
                <button key={a.id} className="chip" data-active={extras.includes(a.id)} onClick={() => toggleExtra(a.id)}>
                  {a.label} <span style={{ opacity: 0.6, fontFamily: 'var(--f-mono)', fontSize: 10 }}>+{a.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Eyebrow>Barista notes</Eyebrow>
            <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Less sweet, extra hot…" style={{ width: '100%', marginTop: 10, padding: '12px 14px', borderRadius: 12, border: '1px solid var(--rule)', background: 'var(--paper)', fontSize: 13 }} />
          </div>

          <Hair />

          {/* Pairings */}
          <div>
            <Eyebrow gold>Pairs well with</Eyebrow>
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              {pairs.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, padding: 10, borderRadius: 12, border: '1px solid var(--rule)' }}>
                  <Ph tone={p.tone} label="" aspect="1" style={{ width: 42, height: 42 }} grain={false} />
                  <div style={{ flex: 1 }}>
                    <div className="serif" style={{ fontSize: 14, lineHeight: 1.2 }}>{p.name}</div>
                    <Price value={p.price} size={11} soft />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add to cart */}
          <div style={{ position: 'sticky', bottom: -36, background: 'var(--paper)', paddingTop: 16, marginTop: 'auto', display: 'flex', gap: 14, alignItems: 'center', borderTop: '1px solid var(--rule)', paddingBottom: 0 }}>
            <Qty value={qty} onChange={setQty} />
            <button className="btn btn--ink btn--block" onClick={() => { onAdd({ ...item, size, milk, extras, qty, notes, finalPrice: total / qty }); onClose(); }} style={{ flex: 1 }}>
              Add to cart <span style={{ marginLeft: 'auto', opacity: 0.8, fontFamily: 'var(--f-mono)' }}>EGP {total.toFixed(0)}</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ============================================================
//  CART DRAWER
// ============================================================
function CartDrawer({ open, onClose, cart, setCart, go }) {
  const subtotal = cart.reduce((s, c) => s + (c.finalPrice || c.price) * c.qty, 0);
  const points = Math.floor(subtotal / 10);
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 80,
      pointerEvents: open ? 'auto' : 'none',
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(20,12,8,.4)',
        backdropFilter: 'blur(6px)',
        opacity: open ? 1 : 0,
        transition: 'opacity .3s ease',
      }}/>
      <aside style={{
        position: 'absolute', right: 0, top: 0, bottom: 0,
        width: 460, background: 'var(--paper)',
        borderLeft: '1px solid var(--rule)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform .35s cubic-bezier(.2,.7,.2,1)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '22px 26px', borderBottom: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Eyebrow gold>Your order · طلبك</Eyebrow>
            <h3 className="serif" style={{ margin: '6px 0 0', fontSize: 26 }}>The Cart</h3>
          </div>
          <button onClick={onClose} style={{ fontSize: 22, color: 'var(--ink-mute)' }}>×</button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '20px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {cart.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--ink-mute)' }}>
              <div className="serif" style={{ fontSize: 28, color: 'var(--ink-faint)' }}>—</div>
              <div style={{ marginTop: 12 }}>Your cart is empty.</div>
              <button className="btn btn--ghost btn--sm" style={{ marginTop: 18 }} onClick={() => { onClose(); go('menu'); }}>Browse menu →</button>
            </div>
          )}
          {cart.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 14 }}>
              <Ph tone={item.tone} label="" aspect="1" style={{ width: 64, height: 64, flexShrink: 0 }} grain={false} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div className="serif" style={{ fontSize: 17, lineHeight: 1.2 }}>{item.name}</div>
                  <Price value={(item.finalPrice || item.price) * item.qty} size={13} />
                </div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.1em', marginTop: 4 }}>
                  {[item.size, item.milk, ...(item.extras || [])].filter(Boolean).join(' · ').toUpperCase()}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                  <Qty value={item.qty} onChange={(v) => setCart(c => c.map((x, idx) => idx === i ? { ...x, qty: v } : x))} />
                  <button onClick={() => setCart(c => c.filter((_, idx) => idx !== i))} style={{ fontSize: 11, color: 'var(--ink-mute)', textDecoration: 'underline' }}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: '20px 26px', borderTop: '1px solid var(--rule)', background: 'var(--ivory)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-soft)', marginBottom: 8 }}>
              <span>Subtotal</span><Price value={subtotal} size={13} soft />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-soft)', marginBottom: 14 }}>
              <span>Delivery</span><span className="mono">FREE · ✦{points}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px dashed var(--rule)', paddingTop: 14 }}>
              <span className="serif" style={{ fontSize: 22 }}>Total</span>
              <Price value={subtotal} size={20} />
            </div>
            <div style={{ background: 'var(--burgundy)', color: 'var(--ivory)', padding: '10px 14px', borderRadius: 12, marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
              <span>You'll earn <strong>{points} sparkles</strong> ✦</span>
              <span style={{ opacity: 0.7 }}>250 → Silver</span>
            </div>
            <button className="btn btn--gold btn--block" style={{ marginTop: 14 }}>Checkout →</button>
          </div>
        )}
      </aside>
    </div>
  );
}

Object.assign(window, { MenuScreen, ProductDetail, CartDrawer });
