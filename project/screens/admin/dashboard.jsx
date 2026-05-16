// ============================================================
//  ADMIN — Analytics dashboard
// ============================================================

function AdminAnalyticsDashboardScreen({ token }) {
  const { t, lang } = useI18n();
  const [period, setPeriod] = useState('day');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = (p) => {
    setLoading(true);
    setError('');
    apiFetch('/admin/dashboard?period=' + p, {}, token)
      .then(d => setData(d))
      .catch(err => setError(err.message || t('adminDashboard.errorLoad')))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (token) load(period); }, [token]);

  const changePeriod = (p) => {
    setPeriod(p);
    load(p);
  };

  const PERIODS = [
    ['day',   t('adminDashboard.day')],
    ['month', t('adminDashboard.month')],
    ['year',  t('adminDashboard.year')],
  ];

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <Eyebrow gold>{t('adminDashboard.kicker')}</Eyebrow>
        <h2 className="serif" style={{ margin: '10px 0 28px', fontSize: 40, lineHeight: 1, letterSpacing: '-0.02em' }}>
          {t('adminDashboard.title')}
        </h2>
      </div>

      {/* Period filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
        {PERIODS.map(([id, label]) => (
          <button
            key={id}
            className={'btn btn--sm ' + (period === id ? 'btn--ink' : 'btn--ghost')}
            onClick={() => changePeriod(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ color: 'var(--ink-mute)', fontSize: 14, padding: '24px 0' }}>
          {t('adminDashboard.loading')}
        </div>
      )}

      {error && (
        <div style={{ color: 'var(--burgundy)', fontSize: 13, padding: '12px 16px', background: 'rgba(139,30,30,.07)', borderRadius: 10, marginBottom: 24 }}>
          {error}
        </div>
      )}

      {!loading && data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* Metric cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="card" style={{ padding: 32 }}>
              <Eyebrow gold>{t('adminDashboard.totalOrders')}</Eyebrow>
              <div className="serif" style={{ fontSize: 56, lineHeight: 1, marginTop: 14 }}>
                {data.totalOrders}
              </div>
            </div>
            <div className="card" style={{ padding: 32 }}>
              <Eyebrow gold>{t('adminDashboard.totalRevenue')}</Eyebrow>
              <div className="serif" style={{ fontSize: 56, lineHeight: 1, marginTop: 14 }}>
                <Price value={data.totalRevenue} size={48} />
              </div>
            </div>
          </div>

          {/* Top 5 beverages */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '22px 28px 16px' }}>
              <Eyebrow gold>{t('adminDashboard.topBeverages')}</Eyebrow>
            </div>
            <Hair />
            {data.topBeverages.length === 0 && (
              <div style={{ padding: '24px 28px', color: 'var(--ink-mute)', fontSize: 14 }}>
                {t('adminDashboard.noBeverages')}
              </div>
            )}
            {data.topBeverages.map((b, i) => (
              <div key={b.itemId} style={{
                display: 'grid',
                gridTemplateColumns: '36px 1fr 80px',
                alignItems: 'center',
                gap: 16,
                padding: '16px 28px',
                borderBottom: i < data.topBeverages.length - 1 ? '1px solid var(--rule)' : 'none'
              }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '0.12em' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <div style={{ fontSize: 15 }}>
                    {lang === 'ar' ? b.nameAr : b.nameEn}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-mute)', marginTop: 2 }}>
                    {lang === 'ar' ? b.nameEn : b.nameAr}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="mono" style={{ fontSize: 13, color: 'var(--gold-deep)', letterSpacing: '0.12em' }}>
                    ×{b.totalQuantity}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}

Object.assign(window, { AdminAnalyticsDashboardScreen });
