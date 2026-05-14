// ============================================================
//  NEW ORDER — POS order creation for branch staff
//  Globals used: apiFetch, useState, useEffect
// ============================================================

function NewOrderScreen({ go, token, data }) {
  const [lines, setLines] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const categories = data.CATEGORIES || [];
  const items      = data.ITEMS || [];
  const sizes      = data.SIZES || [];
  const milks      = data.MILKS || [];
  const addons     = data.ADDONS || [];

  const addLine = (item) => {
    if (!sizes.length || !milks.length) return;
    setLines(prev => [...prev, {
      _id: Math.random().toString(36).slice(2),
      itemId: item.id,
      name: item.name,
      price: item.price,
      sizeId: sizes[0].id,
      milkId: milks[0].id,
      addonIds: [],
      quantity: 1,
      notes: ''
    }]);
  };

  const updateLine = (_id, patch) =>
    setLines(prev => prev.map(l => l._id === _id ? { ...l, ...patch } : l));

  const removeLine = (_id) =>
    setLines(prev => prev.filter(l => l._id !== _id));

  const total = lines.reduce((sum, l) => {
    const size = sizes.find(s => s.id === l.sizeId);
    const milk = milks.find(m => m.id === l.milkId);
    const addonSum = l.addonIds.reduce((a, id) => {
      const addon = addons.find(ad => ad.id === id);
      return a + (addon?.price ?? 0);
    }, 0);
    return sum + (l.price + (size?.delta ?? 0) + (milk?.delta ?? 0) + addonSum) * l.quantity;
  }, 0);

  const handleSubmit = () => {
    if (!lines.length) { setError('Add at least one item.'); return; }
    setSubmitting(true);
    setError(null);
    apiFetch('/orders/branch', {
      method: 'POST',
      body: JSON.stringify({
        items: lines.map(l => ({
          itemId: l.itemId,
          sizeId: l.sizeId,
          milkId: l.milkId,
          addonIds: l.addonIds,
          notes: l.notes || null,
          quantity: l.quantity
        })),
        paymentMethod,
        notes: notes || null
      })
    }, token)
      .then(() => go('kds-board'))
      .catch(err => { setError(err.message); setSubmitting(false); });
  };

  return (
    <div style={{ padding: '24px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => go('kds-board')}
          style={{ fontSize: 18, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-mute)', padding: 0 }}
        >
          ←
        </button>
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', margin: 0 }}>New Order</h2>
      </div>

      {!categories.length ? (
        <p style={{ color: 'var(--ink-mute)' }}>Loading catalog…</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 24, alignItems: 'start' }}>
          {/* Catalog picker */}
          <div style={{ background: 'var(--paper)', borderRadius: 12, padding: 20, border: '1px solid var(--rule)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, margin: '0 0 16px' }}>Menu</h3>
            {categories.map(cat => {
              const catItems = items.filter(i => i.cat === cat.id);
              if (!catItems.length) return null;
              return (
                <div key={cat.id} style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 8 }}>
                    {cat.label}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
                    {catItems.map(item => (
                      <button key={item.id}
                        onClick={() => addLine(item)}
                        style={{ display: 'flex', flexDirection: 'column', padding: '10px 12px', border: '1px solid var(--rule)', borderRadius: 8, background: 'var(--ivory)', cursor: 'pointer', textAlign: 'left', gap: 4 }}
                      >
                        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{item.name}</span>
                        <span style={{ fontSize: 11, color: 'var(--ink-mute)' }}>EGP {item.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order summary */}
          <div style={{ background: 'var(--paper)', borderRadius: 12, padding: 20, border: '1px solid var(--rule)', position: 'sticky', top: 80 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 16px' }}>Order</h3>

            {!lines.length && (
              <p style={{ fontSize: 14, color: 'var(--ink-mute)', marginBottom: 16 }}>Tap items to add them</p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              {lines.map(line => (
                <NewOrderLine key={line._id}
                  line={line}
                  sizes={sizes}
                  milks={milks}
                  addons={addons}
                  onChange={patch => updateLine(line._id, patch)}
                  onRemove={() => removeLine(line._id)}
                />
              ))}
            </div>

            {/* Payment method */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mute)', marginBottom: 6 }}>Payment</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['Cash', 'Card'].map(m => (
                  <button key={m}
                    onClick={() => setPaymentMethod(m)}
                    style={{
                      flex: 1, padding: '8px 0', borderRadius: 8,
                      border: paymentMethod === m ? '2px solid var(--burgundy)' : '1px solid var(--rule)',
                      background: paymentMethod === m ? 'var(--burgundy)' : 'var(--paper)',
                      color: paymentMethod === m ? '#fff' : 'var(--ink)',
                      cursor: 'pointer', fontWeight: paymentMethod === m ? 600 : 400, fontSize: 14
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Order notes */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mute)', marginBottom: 6 }}>Order notes (optional)</div>
              <input
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. table 5, to-go…"
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--rule)', fontSize: 13, background: 'var(--paper)', color: 'var(--ink)', boxSizing: 'border-box' }}
              />
            </div>

            {error && <p style={{ fontSize: 13, color: '#dc2626', marginBottom: 10 }}>{error}</p>}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingTop: 12, borderTop: '1px solid var(--rule)' }}>
              <span style={{ fontWeight: 600, fontSize: 15 }}>Total</span>
              <span style={{ fontWeight: 700, fontSize: 18 }}>EGP {total.toFixed(2)}</span>
            </div>

            <button
              disabled={submitting}
              onClick={handleSubmit}
              style={{ width: '100%', padding: '12px 0', borderRadius: 10, border: 'none', background: 'var(--burgundy)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: submitting ? 'default' : 'pointer', opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? 'Placing…' : `Place Order · EGP ${total.toFixed(2)}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function NewOrderLine({ line, sizes, milks, addons, onChange, onRemove }) {
  const selectStyle = { flex: 1, padding: '5px 8px', borderRadius: 6, border: '1px solid var(--rule)', fontSize: 12, background: 'var(--paper)', color: 'var(--ink)' };

  return (
    <div style={{ padding: 12, border: '1px solid var(--rule)', borderRadius: 8, background: 'var(--ivory)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>{line.name}</span>
        <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-mute)', fontSize: 14 }}>✕</button>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
        <select style={selectStyle} value={line.sizeId} onChange={e => onChange({ sizeId: e.target.value })}>
          {sizes.map(s => (
            <option key={s.id} value={s.id}>{s.label}{s.delta > 0 ? ` +${s.delta}` : ''}</option>
          ))}
        </select>
        <select style={selectStyle} value={line.milkId} onChange={e => onChange({ milkId: e.target.value })}>
          {milks.map(m => (
            <option key={m.id} value={m.id}>{m.label}{m.delta > 0 ? ` +${m.delta}` : ''}</option>
          ))}
        </select>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid var(--rule)', background: 'var(--paper)', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => onChange({ quantity: Math.max(1, line.quantity - 1) })}
          >−</button>
          <span style={{ fontWeight: 600, fontSize: 14, minWidth: 18, textAlign: 'center' }}>{line.quantity}</span>
          <button
            style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid var(--rule)', background: 'var(--paper)', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => onChange({ quantity: line.quantity + 1 })}
          >+</button>
        </div>
      </div>

      <input
        value={line.notes}
        onChange={e => onChange({ notes: e.target.value })}
        placeholder="Item notes…"
        style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid var(--rule)', fontSize: 12, background: 'var(--paper)', color: 'var(--ink)', boxSizing: 'border-box', marginBottom: addons.length ? 6 : 0 }}
      />

      {addons.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
          {addons.map(addon => {
            const checked = line.addonIds.includes(addon.id);
            return (
              <label key={addon.id} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, cursor: 'pointer' }}>
                <input type="checkbox" checked={checked}
                  onChange={() => onChange({
                    addonIds: checked
                      ? line.addonIds.filter(id => id !== addon.id)
                      : [...line.addonIds, addon.id]
                  })}
                />
                {addon.label} +{addon.price}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
