// ============================================================
//  ADMIN — Main dashboard with tabs
// ============================================================

function AdminDashboardScreen({ go, token, user }) {
  const [tab, setTab] = useState('payments');
  const displayName = user?.fullName || 'Admin';

  const TABS = [
    ['payments',  'Payment Reviews'],
    ['analytics', 'Analytics'],
  ];

  return (
    <div className="screen">
      <section style={{ background: 'var(--cream)', padding: '50px 0 30px', borderBottom: '1px solid var(--rule)' }}>
        <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <Eyebrow gold>Admin</Eyebrow>
            <h1 className="serif" style={{ margin: '10px 0 0', fontSize: 52, lineHeight: 1, letterSpacing: '-0.02em' }}>
              Dashboard.
            </h1>
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-mute)' }}>{displayName}</div>
        </div>
      </section>

      <div style={{ borderBottom: '1px solid var(--rule)', background: 'var(--paper)' }}>
        <div className="wrap" style={{ display: 'flex', gap: 4, padding: '14px 32px' }}>
          {TABS.map(([id, label]) => (
            <button key={id} className="tab" data-active={tab === id} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>
      </div>

      <section style={{ padding: '50px 0 120px' }}>
        <div className="wrap">
          {tab === 'payments'  && <AdminPaymentReviewScreen asTab go={go} token={token} />}
          {tab === 'analytics' && <AdminAnalyticsDashboardScreen token={token} />}
        </div>
      </section>

      <Footer go={go} />
    </div>
  );
}

Object.assign(window, { AdminDashboardScreen });
