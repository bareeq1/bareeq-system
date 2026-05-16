// ============================================================
//  CHECKOUT — branch selection, delivery, review, payment upload
// ============================================================

function CheckoutScreen({ go, cart, token, setCart, setCurrentOrderId }) {
  const { t, lang } = useI18n();
  const [step, setStep] = useState(1); // 1=branch+method, 2=review, 3=payment
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState('');
  const [method, setMethod] = useState('Pickup');
  const [address, setAddress] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState('');
  const [total, setTotal] = useState(0);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    apiFetch('/branches')
      .then(data => {
        const list = data || [];
        setBranches(list);
        if (list.length > 0) setBranchId(list[0].id);
      })
      .catch(() => {});
  }, []);

  const subtotal = cart.reduce((s, c) => s + (c.finalPrice || c.price) * c.qty, 0);
  const fee = method === 'Delivery' ? 50 : 0;
  const orderTotal = subtotal + fee;

  const canStep1 = branchId && (method === 'Pickup' || address.trim().length > 3);

  async function submitCheckout() {
    if (!token) { setError('Please sign in first.'); return; }
    setBusy(true); setError('');
    try {
      const payload = {
        items: cart.map(item => ({
          itemId: item.id,
          sizeId: item.size || 'single',
          milkId: item.milk || 'fresh',
          addonIds: item.extras || [],
          quantity: item.qty || 1,
          notes: item.notes || '',
        })),
        branchId,
        deliveryMethod: method,
        ...(method === 'Delivery' && { deliveryAddress: address }),
      };
      const res = await apiFetch('/orders/checkout', {
        method: 'POST',
        body: JSON.stringify(payload),
      }, token);
      const oid = res.orderId;
      setOrderId(oid);
      setTotal(res.total || orderTotal);
      setCurrentOrderId(oid);
      setStep(3);
    } catch (err) {
      setError(err.message || 'Checkout failed. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function submitPayment() {
    if (!file) { setError('Please select a receipt image.'); return; }
    setUploading(true); setError('');
    try {
      const form = new FormData();
      form.append('image', file);
      const res = await fetch(`${API_BASE}/orders/${orderId}/payment`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (!res.ok) { const msg = await res.text(); throw new Error(msg || 'Upload failed'); }
      setCart([]);
      go('order-confirmation');
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(f);
  }

  const selectedBranch = branches.find(b => b.id === branchId);

  return (
    <div className="screen">
      <section style={{ background: 'var(--burgundy)', color: 'var(--ivory)', padding: '50px 0 60px' }} className="grain">
        <div className="wrap">
          <Eyebrow gold style={{ color: 'var(--gold)' }}>{t('checkout.kicker')}</Eyebrow>
          <h1 className="serif" style={{ margin: '18px 0 0', fontSize: 72, lineHeight: 0.96, letterSpacing: '-0.02em', fontWeight: 400 }}>
            {t('checkout.title')}
          </h1>
        </div>
      </section>

      {/* STEP PROGRESS */}
      <div style={{ borderBottom: '1px solid var(--rule)', background: 'var(--paper)' }}>
        <div className="wrap" style={{ display: 'flex', gap: 4, padding: '14px 32px' }}>
          {[
            [1, t('checkout.stepBranch')],
            [2, t('checkout.stepReview')],
            [3, t('checkout.stepPayment')],
          ].map(([n, label]) => (
            <button key={n} className="tab" data-active={step === n}
              onClick={() => step > n && setStep(n)}
              style={{ opacity: step < n ? 0.4 : 1, cursor: step > n ? 'pointer' : 'default' }}>
              <span className="mono" style={{ fontSize: 10, marginRight: 6 }}>0{n}</span>{label}
            </button>
          ))}
        </div>
      </div>

      <section style={{ padding: '50px 0 120px' }}>
        <div className="wrap" style={{ maxWidth: 800 }}>

          {/* STEP 1 — Branch + method */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="card" style={{ padding: 32 }}>
                <Eyebrow gold>{t('checkout.branch')}</Eyebrow>
                <h3 className="serif" style={{ margin: '12px 0 20px', fontSize: 28 }}>{t('checkout.selectBranch')}</h3>
                {branches.length === 0 && <div style={{ color: 'var(--ink-mute)', fontSize: 14 }}>Loading…</div>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {branches.map(b => (
                    <label key={b.id} style={{
                      display: 'flex', gap: 16, alignItems: 'flex-start',
                      padding: '18px 20px', borderRadius: 14, cursor: 'pointer',
                      border: `1.5px solid ${branchId === b.id ? 'var(--ink)' : 'var(--rule)'}`,
                      background: branchId === b.id ? 'var(--ivory-2)' : 'var(--paper)',
                      transition: 'border-color .15s, background .15s',
                    }}>
                      <input type="radio" name="branch" value={b.id} checked={branchId === b.id}
                        onChange={() => setBranchId(b.id)}
                        style={{ marginTop: 3, accentColor: 'var(--ink)', flexShrink: 0 }} />
                      <div>
                        <div className="serif" style={{ fontSize: 20, marginBottom: 4 }}>{b.label}</div>
                        <div style={{ fontSize: 13, color: 'var(--ink-mute)' }}>{b.address}</div>
                        {b.hours && (
                          <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-faint)', letterSpacing: '0.1em', marginTop: 4 }}>{b.hours}</div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="card" style={{ padding: 32 }}>
                <Eyebrow gold>{t('checkout.method')}</Eyebrow>
                <h3 className="serif" style={{ margin: '12px 0 20px', fontSize: 28 }}>{t('checkout.howToReceive')}</h3>
                <div style={{ display: 'flex', gap: 12 }}>
                  {['Pickup', 'Delivery'].map(m => (
                    <label key={m} style={{
                      flex: 1, display: 'flex', flexDirection: 'column', gap: 6,
                      alignItems: 'center', padding: '20px 16px', borderRadius: 14, cursor: 'pointer',
                      border: `1.5px solid ${method === m ? 'var(--ink)' : 'var(--rule)'}`,
                      background: method === m ? 'var(--ivory-2)' : 'var(--paper)',
                      transition: 'border-color .15s, background .15s',
                    }}>
                      <input type="radio" name="method" value={m} checked={method === m}
                        onChange={() => setMethod(m)} style={{ accentColor: 'var(--ink)' }} />
                      <span className="serif" style={{ fontSize: 20 }}>
                        {m === 'Pickup' ? t('checkout.pickup') : t('checkout.delivery')}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--ink-mute)', textAlign: 'center' }}>
                        {m === 'Pickup' ? t('checkout.pickupSub') : t('checkout.deliverySub')}
                      </span>
                      <span className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', marginTop: 2, color: m === 'Delivery' ? 'var(--ink)' : 'var(--ink-faint)' }}>
                        {m === 'Pickup' ? t('checkout.free') : 'EGP 50'}
                      </span>
                    </label>
                  ))}
                </div>

                {method === 'Delivery' && (
                  <div style={{ marginTop: 20 }}>
                    <label style={{ display: 'block', fontSize: 13, color: 'var(--ink-soft)', marginBottom: 8 }}>{t('checkout.address')}</label>
                    <textarea value={address} onChange={e => setAddress(e.target.value)}
                      placeholder={t('checkout.addressPlaceholder')} rows={3}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid var(--rule)', background: 'var(--paper)', fontSize: 13.5, resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                  </div>
                )}
              </div>

              {error && (
                <div style={{ color: 'var(--burgundy)', fontSize: 13, padding: '12px 16px', background: 'rgba(139,30,30,.07)', borderRadius: 10 }}>{error}</div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button className="btn btn--ghost" onClick={() => go('menu')}>{t('checkout.backToMenu')}</button>
                <button className="btn btn--ink" onClick={() => { setError(''); setStep(2); }} disabled={!canStep1}>
                  {t('checkout.stepReview')} →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Review */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="card" style={{ padding: 32 }}>
                <Eyebrow gold>{t('checkout.yourOrder')}</Eyebrow>
                <h3 className="serif" style={{ margin: '12px 0 20px', fontSize: 28 }}>{t('checkout.reviewTitle')}</h3>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {cart.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i < cart.length - 1 ? '1px solid var(--rule)' : 'none' }}>
                      <div>
                        <div className="serif" style={{ fontSize: 17 }}>{item.name}</div>
                        <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-faint)', letterSpacing: '0.1em', marginTop: 3 }}>
                          {[item.size, item.milk, ...(item.extras || [])].filter(Boolean).join(' · ').toUpperCase()}
                          {item.qty > 1 && ` · ×${item.qty}`}
                        </div>
                      </div>
                      <Price value={(item.finalPrice || item.price) * item.qty} size={13} />
                    </div>
                  ))}
                </div>
                <Hair style={{ margin: '20px 0' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-soft)' }}>
                    <span>{t('cart.subtotal')}</span><Price value={subtotal} size={13} soft />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-soft)' }}>
                    <span>{t('cart.delivery')}</span>
                    <span className="mono" style={{ fontSize: 13 }}>{method === 'Pickup' ? t('checkout.free') : 'EGP 50'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px dashed var(--rule)', paddingTop: 14, marginTop: 4 }}>
                    <span className="serif" style={{ fontSize: 22 }}>{t('cart.total')}</span>
                    <Price value={orderTotal} size={20} />
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: 24 }}>
                <Eyebrow>{t('checkout.deliveryDetails')}</Eyebrow>
                <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', gap: 12, fontSize: 14 }}>
                    <span style={{ color: 'var(--ink-mute)', minWidth: 120 }}>{t('checkout.branch')}</span>
                    <span className="serif">{selectedBranch?.label || branchId}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 14 }}>
                    <span style={{ color: 'var(--ink-mute)', minWidth: 120 }}>{t('checkout.method')}</span>
                    <span className="serif">{method === 'Pickup' ? t('checkout.pickup') : t('checkout.delivery')}</span>
                  </div>
                  {method === 'Delivery' && address && (
                    <div style={{ display: 'flex', gap: 12, fontSize: 14 }}>
                      <span style={{ color: 'var(--ink-mute)', minWidth: 120 }}>{t('checkout.address')}</span>
                      <span style={{ flex: 1 }}>{address}</span>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div style={{ color: 'var(--burgundy)', fontSize: 13, padding: '12px 16px', background: 'rgba(139,30,30,.07)', borderRadius: 10 }}>{error}</div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <button className="btn btn--ghost" onClick={() => setStep(1)}>{t('checkout.back')}</button>
                <button className="btn btn--gold" onClick={submitCheckout} disabled={busy} style={{ opacity: busy ? 0.6 : 1 }}>
                  {busy ? '…' : `${t('checkout.placeOrder')} →`}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Payment upload */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="card" style={{ padding: 32, background: 'var(--ink)', color: 'var(--ivory)' }}>
                <Eyebrow gold style={{ color: 'var(--gold)' }}>{t('checkout.instapayKicker')}</Eyebrow>
                <h3 className="serif" style={{ margin: '12px 0 8px', fontSize: 28 }}>{t('checkout.instapayTitle')}</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,240,225,.75)', margin: '0 0 20px' }}>{t('checkout.instapayLead')}</p>
                <div style={{ background: 'rgba(255,240,225,.08)', borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--gold)', marginBottom: 6 }}>{t('checkout.instapayNumber')}</div>
                    <div className="mono" style={{ fontSize: 22, letterSpacing: '0.08em' }}>01110387361</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--gold)', marginBottom: 6 }}>TOTAL</div>
                    <div className="mono" style={{ fontSize: 22 }}>EGP {(total || orderTotal).toFixed(0)}</div>
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: 32 }}>
                <Eyebrow gold>{t('checkout.uploadReceipt')}</Eyebrow>
                <h3 className="serif" style={{ margin: '12px 0 8px', fontSize: 28 }}>{t('checkout.uploadTitle')}</h3>
                <p style={{ fontSize: 14, color: 'var(--ink-mute)', margin: '0 0 20px' }}>{t('checkout.uploadLead')}</p>
                <div onClick={() => fileRef.current?.click()} style={{
                  border: `2px dashed ${file ? 'var(--ink)' : 'var(--rule)'}`,
                  borderRadius: 14, padding: '32px 24px', textAlign: 'center', cursor: 'pointer',
                  transition: 'border-color .2s',
                  background: file ? 'var(--ivory-2)' : 'transparent',
                }}>
                  {preview ? (
                    <img src={preview} alt="Receipt" style={{ maxHeight: 200, maxWidth: '100%', borderRadius: 8, objectFit: 'contain' }} />
                  ) : (
                    <div>
                      <div style={{ fontSize: 32, marginBottom: 12, color: 'var(--ink-faint)' }}>↑</div>
                      <div style={{ fontSize: 14, color: 'var(--ink-mute)' }}>{t('checkout.uploadCta')}</div>
                      <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-faint)', letterSpacing: '0.12em', marginTop: 6 }}>JPG · PNG · PDF · MAX 5MB</div>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={handleFile} style={{ display: 'none' }} />
                </div>
                {file && (
                  <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: 'var(--ink-soft)' }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                    <button onClick={() => { setFile(null); setPreview(''); }} style={{ fontSize: 12, color: 'var(--ink-mute)', textDecoration: 'underline', flexShrink: 0, marginLeft: 12 }}>
                      {t('common.remove')}
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div style={{ color: 'var(--burgundy)', fontSize: 13, padding: '12px 16px', background: 'rgba(139,30,30,.07)', borderRadius: 10 }}>{error}</div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn--gold btn--block" onClick={submitPayment}
                  disabled={!file || uploading} style={{ opacity: !file || uploading ? 0.6 : 1 }}>
                  {uploading ? '…' : `${t('checkout.submit')} →`}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { CheckoutScreen });
