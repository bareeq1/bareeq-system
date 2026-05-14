// ============================================================
//  ORDER CONFIRMATION — shown after payment receipt is uploaded
// ============================================================

function OrderConfirmationScreen({ go, currentOrderId }) {
  const { t } = useI18n();
  const shortId = currentOrderId ? `BR-${currentOrderId.slice(0, 4).toUpperCase()}` : '—';

  return (
    <div className="screen">
      <section style={{ padding: '100px 0 120px', textAlign: 'center' }}>
        <div className="wrap" style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ fontSize: 64, color: 'var(--gold-deep)', marginBottom: 24 }}>✦</div>
          <Eyebrow gold style={{ justifyContent: 'center' }}>{t('orderConfirmation.kicker')}</Eyebrow>
          <h1 className="serif" style={{ margin: '18px 0 12px', fontSize: 64, lineHeight: 0.96, letterSpacing: '-0.02em' }}>
            {t('orderConfirmation.title')}
          </h1>
          <p style={{ fontSize: 16, color: 'var(--ink-mute)', margin: '0 0 36px', textWrap: 'pretty' }}>
            {t('orderConfirmation.lead')}
          </p>

          <div style={{ background: 'var(--ivory-2)', borderRadius: 18, padding: '24px 32px', marginBottom: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--rule)' }}>
            <div style={{ textAlign: 'left' }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>{t('orderConfirmation.orderId')}</div>
              <div className="mono" style={{ fontSize: 20, letterSpacing: '0.12em' }}>{shortId}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>{t('orderConfirmation.status')}</div>
              <Tag tone="ghost">{t('orderConfirmation.pending')}</Tag>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn--ink" onClick={() => go('order-details')}>
              {t('orderConfirmation.trackOrder')}
            </button>
            <button className="btn btn--ghost" onClick={() => go('menu')}>
              {t('orderConfirmation.backToMenu')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { OrderConfirmationScreen });
