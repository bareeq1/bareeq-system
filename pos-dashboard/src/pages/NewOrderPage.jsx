import { useState, useEffect } from 'react';
import { getCatalog, createBranchOrder } from '../api.js';

export default function NewOrderPage({ onCreated }) {
  const [catalog, setCatalog] = useState(null);
  const [lines, setLines] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [catalogError, setCatalogError] = useState(null);

  useEffect(() => {
    getCatalog()
      .then(setCatalog)
      .catch((e) => setCatalogError(e.message));
  }, []);

  const addLine = (item) => {
    const defaultSize = catalog?.sizes?.[0];
    const defaultMilk = catalog?.milks?.[0];
    if (!defaultSize || !defaultMilk) return;
    setLines((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        itemId: item.id,
        nameEn: item.nameEn,
        price: item.price,
        sizeId: defaultSize.id,
        milkId: defaultMilk.id,
        addonIds: [],
        quantity: 1,
        notes: '',
      },
    ]);
  };

  const updateLine = (id, patch) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  const removeLine = (id) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  };

  const submit = async () => {
    if (lines.length === 0) { setError('Add at least one item.'); return; }
    setSubmitting(true);
    setError(null);
    try {
      const items = lines.map((l) => ({
        itemId: l.itemId,
        sizeId: l.sizeId,
        milkId: l.milkId,
        addonIds: l.addonIds,
        notes: l.notes || null,
        quantity: l.quantity,
      }));
      await createBranchOrder(items, paymentMethod, notes || null);
      onCreated();
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (catalogError) return <p style={styles.msg}>Failed to load catalog: {catalogError}</p>;
  if (!catalog) return <p style={styles.msg}>Loading catalog…</p>;

  const total = lines.reduce((sum, l) => {
    const size = catalog.sizes.find((s) => s.id === l.sizeId);
    const milk = catalog.milks.find((m) => m.id === l.milkId);
    const addonTotal = l.addonIds.reduce((a, id) => {
      const addon = catalog.addons.find((ad) => ad.id === id);
      return a + (addon?.price ?? 0);
    }, 0);
    return sum + (l.price + (size?.delta ?? 0) + (milk?.delta ?? 0) + addonTotal) * l.quantity;
  }, 0);

  return (
    <div style={styles.layout}>
      <div style={styles.left}>
        <h3 style={styles.sectionTitle}>Menu</h3>
        {catalog.categories.map((cat) => {
          const catItems = catalog.items.filter((i) => i.categoryId === cat.id);
          if (catItems.length === 0) return null;
          return (
            <div key={cat.id} style={{ marginBottom: 20 }}>
              <div style={styles.catLabel}>{cat.labelEn}</div>
              <div style={styles.itemGrid}>
                {catItems.map((item) => (
                  <button key={item.id} style={styles.itemBtn} onClick={() => addLine(item)}>
                    <span style={styles.itemBtnName}>{item.nameEn}</span>
                    <span style={styles.itemBtnPrice}>EGP {item.price}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={styles.right}>
        <h3 style={styles.sectionTitle}>Order</h3>

        {lines.length === 0 ? (
          <p style={{ color: '#a8a29e', fontSize: 14, marginBottom: 16 }}>Tap items to add them</p>
        ) : (
          <div style={styles.lines}>
            {lines.map((line) => (
              <LineRow
                key={line.id}
                line={line}
                catalog={catalog}
                onChange={(patch) => updateLine(line.id, patch)}
                onRemove={() => removeLine(line.id)}
              />
            ))}
          </div>
        )}

        <div style={styles.field}>
          <label style={styles.label}>Payment</label>
          <div style={styles.payRow}>
            {['Cash', 'Card'].map((m) => (
              <button
                key={m}
                style={payBtn(paymentMethod === m)}
                onClick={() => setPaymentMethod(m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Order notes (optional)</label>
          <input
            style={styles.input}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. table 5, to-go…"
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.totalRow}>
          <span style={styles.totalLabel}>Total</span>
          <span style={styles.totalAmt}>EGP {total.toFixed(2)}</span>
        </div>

        <button
          style={{ ...styles.submitBtn, opacity: submitting ? 0.7 : 1 }}
          disabled={submitting}
          onClick={submit}
        >
          {submitting ? 'Placing…' : `Place Order · EGP ${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}

function LineRow({ line, catalog, onChange, onRemove }) {
  return (
    <div style={styles.lineRow}>
      <div style={styles.lineTop}>
        <span style={styles.lineName}>{line.nameEn}</span>
        <button style={styles.removeBtn} onClick={onRemove}>✕</button>
      </div>
      <div style={styles.lineControls}>
        <select style={styles.select} value={line.sizeId} onChange={(e) => onChange({ sizeId: e.target.value })}>
          {catalog.sizes.map((s) => (
            <option key={s.id} value={s.id}>{s.label} {s.delta > 0 ? `+${s.delta}` : ''}</option>
          ))}
        </select>
        <select style={styles.select} value={line.milkId} onChange={(e) => onChange({ milkId: e.target.value })}>
          {catalog.milks.map((m) => (
            <option key={m.id} value={m.id}>{m.label} {m.delta > 0 ? `+${m.delta}` : ''}</option>
          ))}
        </select>
        <div style={styles.qtyRow}>
          <button style={styles.qtyBtn} onClick={() => onChange({ quantity: Math.max(1, line.quantity - 1) })}>−</button>
          <span style={styles.qty}>{line.quantity}</span>
          <button style={styles.qtyBtn} onClick={() => onChange({ quantity: line.quantity + 1 })}>+</button>
        </div>
      </div>
      <input
        style={{ ...styles.input, marginTop: 6 }}
        placeholder="Item notes…"
        value={line.notes}
        onChange={(e) => onChange({ notes: e.target.value })}
      />
      {catalog.addons.length > 0 && (
        <div style={styles.addonRow}>
          {catalog.addons.map((addon) => {
            const checked = line.addonIds.includes(addon.id);
            return (
              <label key={addon.id} style={styles.addonLabel}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    const next = checked
                      ? line.addonIds.filter((id) => id !== addon.id)
                      : [...line.addonIds, addon.id];
                    onChange({ addonIds: next });
                  }}
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

const payBtn = (active) => ({
  flex: 1, padding: '8px 0', borderRadius: 8,
  border: active ? '2px solid #292524' : '1px solid #e7e5e4',
  background: active ? '#292524' : '#fff',
  color: active ? '#fff' : '#1c1917',
  cursor: 'pointer', fontWeight: active ? 600 : 400, fontSize: 14,
});

const styles = {
  layout: { display: 'grid', gridTemplateColumns: '1fr 400px', gap: 24, alignItems: 'start' },
  left: { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e7e5e4' },
  right: { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e7e5e4', position: 'sticky', top: 24 },
  sectionTitle: { fontSize: 16, fontWeight: 700, marginBottom: 16 },
  catLabel: { fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#a8a29e', textTransform: 'uppercase', marginBottom: 8 },
  itemGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8, marginBottom: 8 },
  itemBtn: {
    display: 'flex', flexDirection: 'column', padding: '10px 12px',
    border: '1px solid #e7e5e4', borderRadius: 8, background: '#fafaf9',
    cursor: 'pointer', textAlign: 'left', gap: 4,
  },
  itemBtnName: { fontSize: 13, fontWeight: 500, color: '#1c1917' },
  itemBtnPrice: { fontSize: 11, color: '#78716c' },
  lines: { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 },
  lineRow: { padding: 12, border: '1px solid #e7e5e4', borderRadius: 8, background: '#fafaf9' },
  lineTop: { display: 'flex', justifyContent: 'space-between', marginBottom: 8 },
  lineName: { fontWeight: 600, fontSize: 14 },
  removeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#a8a29e', fontSize: 14 },
  lineControls: { display: 'flex', gap: 8, alignItems: 'center' },
  select: { flex: 1, padding: '5px 8px', borderRadius: 6, border: '1px solid #e7e5e4', fontSize: 12, background: '#fff' },
  qtyRow: { display: 'flex', alignItems: 'center', gap: 8 },
  qtyBtn: { width: 26, height: 26, borderRadius: 6, border: '1px solid #e7e5e4', background: '#fff', cursor: 'pointer', fontSize: 16, lineHeight: 1 },
  qty: { fontWeight: 600, fontSize: 14, minWidth: 20, textAlign: 'center' },
  addonRow: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  addonLabel: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, cursor: 'pointer' },
  field: { marginBottom: 14 },
  label: { display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: '#78716c' },
  input: { width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e7e5e4', fontSize: 13 },
  payRow: { display: 'flex', gap: 8 },
  error: { fontSize: 13, color: '#dc2626', marginBottom: 10 },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingTop: 12, borderTop: '1px solid #f5f5f4' },
  totalLabel: { fontWeight: 600, fontSize: 15 },
  totalAmt: { fontWeight: 700, fontSize: 18 },
  submitBtn: {
    width: '100%', padding: '12px 0', borderRadius: 10, border: 'none',
    background: '#292524', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer',
  },
  msg: { textAlign: 'center', padding: 40, color: '#78716c' },
};
