// ============================================================
//  ADMIN — Payment review grid + approve/reject modal
// ============================================================

function AdminPaymentReviewScreen({ go, token, asTab }) {
  const { t } = useI18n();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [paymentDetail, setPaymentDetail] = useState(null);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [detailError, setDetailError] = useState('');

  const load = () => {
    setLoading(true);
    apiFetch('/admin/orders?status=Placed&pageSize=50', {}, token)
      .then(data => setOrders(Array.isArray(data) ? data : (data?.items || [])))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (token) load(); }, [token]);

  const openDetail = (orderId) => {
    setSelected(orderId);
    setPaymentDetail(null);
    setRejecting(false);
    setReason('');
    setDetailError('');
    apiFetch('/admin/orders/' + orderId + '/payment', {}, token)
      .then(data => setPaymentDetail(data))
      .catch(err => setDetailError(err.message || 'Failed to load payment details.'));
  };

  const handleDecision = async (approved) => {
    if (!selected || !paymentDetail) return;
    setBusy(true); setDetailError('');
    try {
      await apiFetch('/orders/' + selected + '/payment/' + paymentDetail.paymentId + '/approve', {
        method: 'PUT',
        body: JSON.stringify({ approved, ...(approved ? {} : { rejectionReason: reason }) }),
      }, token);
      setSelected(null);
      load();
    } catch (err) {
      setDetailError(err.message || 'Action failed.');
    } finally {
      setBusy(false);
    }
  };

  const content = (
    <React.Fragment>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
        <button className="btn btn--ghost btn--sm" onClick={load}>{t('adminPayment.refresh')}</button>
      </div>

      {loading && <div style={{ color: 'var(--ink-mute)', padding: '32px 0', fontSize: 14 }}>Loading…</div>}

      {!loading && orders.length === 0 && (
        <div style={{ padding: '32px 0', color: 'var(--ink-mute)', fontSize: 14 }}>{t('adminPayment.empty')}</div>
      )}

      {orders.length > 0 && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 120px 110px 120px', padding: '14px 28px', background: 'var(--ivory-2)', borderBottom: '1px solid var(--rule)' }}>
            {['Order', 'Customer', 'Branch', 'Total', 'Action'].map(h => (
              <div key={h} className="eyebrow">{h}</div>
            ))}
          </div>
          {orders.map((o, i) => {
            const oid = o.id || o.orderId || '';
            return (
              <div key={oid} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 120px 110px 120px', padding: '18px 28px', alignItems: 'center', borderBottom: i < orders.length - 1 ? '1px solid var(--rule)' : 'none' }}>
                <div className="mono" style={{ fontSize: 11, letterSpacing: '0.12em' }}>BR-{oid.slice(0, 4).toUpperCase()}</div>
                <div style={{ fontSize: 14 }}>{o.customerName || o.customer || '—'}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-mute)' }}>{o.branchLabel || o.branch || '—'}</div>
                <Price value={o.total || 0} size={13} />
                <button className="btn btn--ink btn--sm" onClick={() => openDetail(oid)}>
                  {t('adminPayment.review')}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* REVIEW MODAL */}
      <Modal open={!!selected} onClose={() => setSelected(null)} width={580}>
        <div style={{ padding: 36 }}>
          <Eyebrow gold>{t('adminPayment.reviewPayment')}</Eyebrow>
          <h3 className="serif" style={{ margin: '12px 0 20px', fontSize: 28 }}>
            BR-{(selected || '').slice(0, 4).toUpperCase()}
          </h3>

          {!paymentDetail && !detailError && (
            <div style={{ color: 'var(--ink-mute)', fontSize: 14 }}>Loading…</div>
          )}

          {detailError && (
            <div style={{ color: 'var(--burgundy)', fontSize: 13, padding: '12px 16px', background: 'rgba(139,30,30,.07)', borderRadius: 10 }}>{detailError}</div>
          )}

          {paymentDetail && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {paymentDetail.imageUrl && (
                <img src={paymentDetail.imageUrl} alt="Receipt"
                  style={{ width: '100%', borderRadius: 12, objectFit: 'cover', maxHeight: 280, border: '1px solid var(--rule)' }} />
              )}

              <div style={{ display: 'flex', gap: 24, fontSize: 13, color: 'var(--ink-soft)' }}>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 6 }}>{t('adminPayment.submitted')}</div>
                  <div>{paymentDetail.submittedAt ? new Date(paymentDetail.submittedAt).toLocaleString() : '—'}</div>
                </div>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 6 }}>Total</div>
                  {paymentDetail.total != null && <Price value={paymentDetail.total} size={13} />}
                </div>
              </div>

              <Hair />

              {rejecting ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <label style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{t('adminPayment.rejectionReason')}</label>
                  <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3}
                    placeholder={t('adminPayment.reasonPlaceholder')}
                    style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--rule)', background: 'var(--paper)', fontSize: 13, resize: 'vertical', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' }} />
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn--ghost btn--sm" onClick={() => setRejecting(false)} disabled={busy}>
                      {t('checkout.back')}
                    </button>
                    <button className="btn btn--ink btn--sm" onClick={() => handleDecision(false)}
                      disabled={busy || !reason.trim()} style={{ opacity: busy || !reason.trim() ? 0.6 : 1 }}>
                      {busy ? '…' : t('adminPayment.confirmReject')}
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn btn--gold" onClick={() => handleDecision(true)}
                    disabled={busy} style={{ flex: 1, opacity: busy ? 0.6 : 1 }}>
                    {busy ? '…' : t('adminPayment.approve')}
                  </button>
                  <button className="btn btn--ghost" onClick={() => setRejecting(true)}
                    disabled={busy} style={{ flex: 1, opacity: busy ? 0.6 : 1 }}>
                    {t('adminPayment.reject')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
    </React.Fragment>
  );

  if (asTab) return content;

  return (
    <div className="screen">
      <section style={{ background: 'var(--cream)', padding: '40px 0 30px', borderBottom: '1px solid var(--rule)' }}>
        <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <button onClick={() => go('admin-dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--ink-mute)', marginBottom: 14, padding: 0 }}>
              ← Dashboard
            </button>
            <Eyebrow gold>{t('adminPayment.kicker')}</Eyebrow>
            <h1 className="serif" style={{ margin: '10px 0 0', fontSize: 52, lineHeight: 1, letterSpacing: '-0.02em' }}>
              {t('adminPayment.title')}
            </h1>
          </div>
        </div>
      </section>
      <section style={{ padding: '40px 0 120px' }}>
        <div className="wrap">
          {content}
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { AdminPaymentReviewScreen });
