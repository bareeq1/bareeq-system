// ============================================================
//  BRANCH STAFF — Branch orders dashboard
// ============================================================

function BranchOrdersScreen({ go, token, user, catalog }) {
  const { t, lang } = useI18n();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newOrderOpen, setNewOrderOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(null); // orderId
  const [confirmPayMethod, setConfirmPayMethod] = useState('Cash');
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [confirmError, setConfirmError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    apiFetch('/orders/branch-staff?pageSize=50', {}, token)
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(err => setError(err.message || 'Failed to load orders.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (token) load(); }, [token]);

  const handleConfirmPayment = async () => {
    if (!confirmOpen) return;
    setConfirmBusy(true);
    setConfirmError('');
    try {
      await apiFetch(`/orders/${confirmOpen}/confirm-payment`, {
        method: 'POST',
        body: JSON.stringify({ paymentMethod: confirmPayMethod }),
      }, token);
      setConfirmOpen(null);
      load();
    } catch (err) {
      setConfirmError(err.message || 'Failed to confirm payment.');
    } finally {
      setConfirmBusy(false);
    }
  };

  const statusColor = (status) => {
    if (status === 'Confirmed') return 'var(--gold)';
    if (status === 'Placed') return 'var(--ink-soft)';
    if (status === 'Cancelled') return 'var(--burgundy)';
    return 'var(--ink-mute)';
  };

  return (
    <div className="screen">
      {/* HEADER */}
      <section style={{ background: 'var(--cream)', padding: '40px 0 30px', borderBottom: '1px solid var(--rule)' }}>
        <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <Eyebrow gold>Branch Staff</Eyebrow>
            <h1 className="serif" style={{ margin: '10px 0 0', fontSize: 52, lineHeight: 1, letterSpacing: '-0.02em' }}>
              Branch Orders
            </h1>
            {user?.branchLabel && (
              <p style={{ margin: '8px 0 0', fontSize: 14, color: 'var(--ink-mute)' }}>
                {user.branchLabel}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn--ghost btn--sm" onClick={load}>Refresh</button>
            <button className="btn btn--ink btn--sm" onClick={() => setNewOrderOpen(true)}>+ New Order</button>
          </div>
        </div>
      </section>

      {/* ORDER LIST */}
      <section style={{ padding: '40px 0 120px' }}>
        <div className="wrap">
          {loading && (
            <div style={{ color: 'var(--ink-mute)', padding: '32px 0', fontSize: 14 }}>Loading…</div>
          )}

          {error && (
            <div style={{ color: 'var(--burgundy)', fontSize: 13, padding: '12px 16px', background: 'rgba(139,30,30,.07)', borderRadius: 10, marginBottom: 20 }}>
              {error}
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div style={{ padding: '32px 0', color: 'var(--ink-mute)', fontSize: 14 }}>
              No orders yet. Use "+ New Order" to create the first one.
            </div>
          )}

          {orders.length > 0 && (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 100px 90px 110px 130px', padding: '14px 28px', background: 'var(--ivory-2)', borderBottom: '1px solid var(--rule)' }}>
                {['Order', 'Customer', 'Total', 'Status', 'Payment', 'Date'].map(h => (
                  <div key={h} className="eyebrow">{h}</div>
                ))}
              </div>

              {orders.map((o, i) => {
                const oid = (o.orderId || o.id || '').toString();
                const when = o.createdAt ? new Date(o.createdAt).toLocaleDateString(undefined, { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—';
                return (
                  <div key={oid} style={{
                    display: 'grid',
                    gridTemplateColumns: '110px 1fr 100px 90px 110px 130px',
                    padding: '16px 28px',
                    alignItems: 'center',
                    borderBottom: i < orders.length - 1 ? '1px solid var(--rule)' : 'none',
                  }}>
                    <div className="mono" style={{ fontSize: 11, letterSpacing: '0.12em' }}>
                      BR-{oid.slice(0, 4).toUpperCase()}
                    </div>
                    <div style={{ fontSize: 14 }}>{o.customerName || '—'}</div>
                    <Price value={o.total || 0} size={13} />
                    <div style={{ fontSize: 12, fontWeight: 600, color: statusColor(o.status) }}>
                      {o.status}
                    </div>
                    <div style={{ fontSize: 13 }}>
                      {o.status === 'Placed' ? (
                        <button className="btn btn--ghost btn--sm" style={{ fontSize: 11 }}
                          onClick={() => { setConfirmOpen(oid); setConfirmPayMethod('Cash'); setConfirmError(''); }}>
                          Confirm
                        </button>
                      ) : (
                        <span style={{ color: 'var(--ink-mute)', fontSize: 12 }}>{o.paymentStatus || '—'}</span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--ink-mute)' }}>{when}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CONFIRM PAYMENT MODAL */}
      <Modal open={!!confirmOpen} onClose={() => setConfirmOpen(null)} width={440}>
        <div style={{ padding: 36 }}>
          <Eyebrow gold>Confirm Payment</Eyebrow>
          <h3 className="serif" style={{ margin: '12px 0 20px', fontSize: 28 }}>
            BR-{(confirmOpen || '').slice(0, 4).toUpperCase()}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label style={{ fontSize: 13, color: 'var(--ink-soft)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              Payment Method
              <div style={{ display: 'flex', gap: 10 }}>
                {['Cash', 'Card'].map(m => (
                  <button key={m} onClick={() => setConfirmPayMethod(m)}
                    className={confirmPayMethod === m ? 'btn btn--ink btn--sm' : 'btn btn--ghost btn--sm'}>
                    {m}
                  </button>
                ))}
              </div>
            </label>

            {confirmError && (
              <div style={{ color: 'var(--burgundy)', fontSize: 13, padding: '10px 14px', background: 'rgba(139,30,30,.07)', borderRadius: 8 }}>
                {confirmError}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn--ghost" style={{ flex: 1 }} onClick={() => setConfirmOpen(null)} disabled={confirmBusy}>
                Cancel
              </button>
              <button className="btn btn--gold" style={{ flex: 1, opacity: confirmBusy ? 0.6 : 1 }}
                onClick={handleConfirmPayment} disabled={confirmBusy}>
                {confirmBusy ? '…' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* NEW ORDER MODAL */}
      {newOrderOpen && (
        <NewBranchOrderModal
          token={token}
          catalog={catalog}
          onClose={() => setNewOrderOpen(false)}
          onSuccess={() => { setNewOrderOpen(false); load(); }}
        />
      )}
    </div>
  );
}

// ============================================================
//  NEW ORDER MODAL
// ============================================================
function NewBranchOrderModal({ token, catalog, onClose, onSuccess }) {
  const { lang } = useI18n();
  const items = catalog?.ITEMS || [];
  const sizes = catalog?.SIZES || [];
  const milks = catalog?.MILKS || [];
  const addons = catalog?.ADDONS || [];

  const defaultSize = sizes[0]?.id || '';
  const defaultMilk = milks[0]?.id || '';

  const [cart, setCart] = useState([]);
  const [payMethod, setPayMethod] = useState('Cash');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerItem, setPickerItem] = useState(null);
  const [pickerSize, setPickerSize] = useState(defaultSize);
  const [pickerMilk, setPickerMilk] = useState(defaultMilk);
  const [pickerAddons, setPickerAddons] = useState([]);
  const [pickerQty, setPickerQty] = useState(1);

  const openPicker = (item) => {
    setPickerItem(item);
    setPickerSize(defaultSize);
    setPickerMilk(defaultMilk);
    setPickerAddons([]);
    setPickerQty(1);
    setPickerOpen(true);
  };

  const addToCart = () => {
    if (!pickerItem) return;
    const size = sizes.find(s => s.id === pickerSize);
    const milk = milks.find(m => m.id === pickerMilk);
    const selectedAddons = addons.filter(a => pickerAddons.includes(a.id));
    const unitPrice = pickerItem.price + (size?.delta || 0) + (milk?.delta || 0) + selectedAddons.reduce((s, a) => s + a.price, 0);
    setCart(c => [...c, {
      key: Date.now(),
      itemId: pickerItem.id,
      name: lang === 'ar' ? pickerItem.ar : pickerItem.name,
      sizeId: pickerSize,
      milkId: pickerMilk,
      addonIds: pickerAddons,
      quantity: pickerQty,
      unitPrice,
    }]);
    setPickerOpen(false);
  };

  const removeFromCart = (key) => setCart(c => c.filter(x => x.key !== key));

  const subtotal = cart.reduce((s, x) => s + x.unitPrice * x.quantity, 0);

  const submit = async () => {
    if (!cart.length) { setError('Add at least one item.'); return; }
    setBusy(true); setError('');
    try {
      await apiFetch('/orders/branch', {
        method: 'POST',
        body: JSON.stringify({
          items: cart.map(x => ({
            itemId: x.itemId,
            sizeId: x.sizeId,
            milkId: x.milkId,
            addonIds: x.addonIds,
            quantity: x.quantity,
          })),
          paymentMethod: payMethod,
        }),
      }, token);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create order.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open onClose={onClose} width={640}>
      <div style={{ padding: 36, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <Eyebrow gold>Branch Staff</Eyebrow>
          <h3 className="serif" style={{ margin: '10px 0 0', fontSize: 32 }}>New Order</h3>
        </div>

        {/* ITEM LIST */}
        <div>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Menu Items</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
            {items.map(item => (
              <button key={item.id} onClick={() => openPicker(item)}
                style={{
                  padding: '12px 14px', borderRadius: 12, border: '1px solid var(--rule)',
                  background: 'var(--paper)', cursor: 'pointer', textAlign: 'left',
                  display: 'flex', flexDirection: 'column', gap: 4,
                  transition: 'border-color .15s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--ink)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--rule)'}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{lang === 'ar' ? item.ar : item.name}</span>
                <Price value={item.price} size={12} />
              </button>
            ))}
          </div>
        </div>

        <Hair />

        {/* CART SUMMARY */}
        <div>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Order Items</div>
          {cart.length === 0 ? (
            <p style={{ color: 'var(--ink-mute)', fontSize: 13 }}>No items added yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {cart.map(x => (
                <div key={x.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                  <span>{x.quantity}× {x.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <Price value={x.unitPrice * x.quantity} size={13} />
                    <button onClick={() => removeFromCart(x.key)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-mute)', fontSize: 16, lineHeight: 1 }}>
                      ×
                    </button>
                  </div>
                </div>
              ))}
              <Hair />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: 14 }}>
                <span>Total</span>
                <Price value={subtotal} size={14} />
              </div>
            </div>
          )}
        </div>

        {/* PAYMENT METHOD */}
        <div>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Payment Method</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {['Cash', 'Card'].map(m => (
              <button key={m} onClick={() => setPayMethod(m)}
                className={payMethod === m ? 'btn btn--ink btn--sm' : 'btn btn--ghost btn--sm'}>
                {m}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ color: 'var(--burgundy)', fontSize: 13, padding: '10px 14px', background: 'rgba(139,30,30,.07)', borderRadius: 8 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn--ghost" style={{ flex: 1 }} onClick={onClose} disabled={busy}>Cancel</button>
          <button className="btn btn--gold" style={{ flex: 1, opacity: busy || !cart.length ? 0.6 : 1 }}
            onClick={submit} disabled={busy || !cart.length}>
            {busy ? '…' : `Place Order · ${subtotal > 0 ? subtotal + ' EGP' : ''}`}
          </button>
        </div>
      </div>

      {/* ITEM CUSTOMIZER */}
      {pickerOpen && pickerItem && (
        <div style={{
          position: 'absolute', inset: 0, background: 'var(--paper)', borderRadius: 'inherit',
          padding: 36, display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <Eyebrow>Customize</Eyebrow>
              <h3 className="serif" style={{ margin: '8px 0 0', fontSize: 28 }}>
                {lang === 'ar' ? pickerItem.ar : pickerItem.name}
              </h3>
            </div>
            <button onClick={() => setPickerOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--ink-mute)' }}>×</button>
          </div>

          {sizes.length > 0 && (
            <div>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Size</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {sizes.map(s => (
                  <button key={s.id} onClick={() => setPickerSize(s.id)}
                    className={pickerSize === s.id ? 'btn btn--ink btn--sm' : 'btn btn--ghost btn--sm'}>
                    {s.label}{s.delta !== 0 ? ` +${s.delta}` : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

          {milks.length > 0 && (
            <div>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Milk</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {milks.map(m => (
                  <button key={m.id} onClick={() => setPickerMilk(m.id)}
                    className={pickerMilk === m.id ? 'btn btn--ink btn--sm' : 'btn btn--ghost btn--sm'}>
                    {m.label}{m.delta !== 0 ? ` +${m.delta}` : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

          {addons.length > 0 && (
            <div>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Add-ons</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {addons.map(a => {
                  const selected = pickerAddons.includes(a.id);
                  return (
                    <button key={a.id} onClick={() => setPickerAddons(prev =>
                      selected ? prev.filter(x => x !== a.id) : [...prev, a.id]
                    )}
                      className={selected ? 'btn btn--ink btn--sm' : 'btn btn--ghost btn--sm'}>
                      {a.label} +{a.price}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Quantity</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button className="btn btn--ghost btn--sm" onClick={() => setPickerQty(q => Math.max(1, q - 1))}>−</button>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 16, minWidth: 24, textAlign: 'center' }}>{pickerQty}</span>
              <button className="btn btn--ghost btn--sm" onClick={() => setPickerQty(q => q + 1)}>+</button>
            </div>
          </div>

          <button className="btn btn--gold" onClick={addToCart} style={{ marginTop: 8 }}>
            Add to Order
          </button>
        </div>
      )}
    </Modal>
  );
}

Object.assign(window, { BranchOrdersScreen });
