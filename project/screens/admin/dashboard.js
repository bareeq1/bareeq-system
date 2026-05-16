// ============================================================
//  ADMIN — Analytics dashboard
// ============================================================

function AdminAnalyticsDashboardScreen({
  token
}) {
  const {
    t,
    lang
  } = useI18n();
  const [period, setPeriod] = useState('day');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = p => {
    setLoading(true);
    setError('');
    apiFetch('/admin/dashboard?period=' + p, {}, token).then(d => setData(d)).catch(err => setError(err.message || t('adminDashboard.errorLoad'))).finally(() => setLoading(false));
  };
  useEffect(() => {
    if (token) load(period);
  }, [token]);
  const changePeriod = p => {
    setPeriod(p);
    load(p);
  };
  const PERIODS = [['day', t('adminDashboard.day')], ['month', t('adminDashboard.month')], ['year', t('adminDashboard.year')]];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, t('adminDashboard.kicker')), /*#__PURE__*/React.createElement("h2", {
    className: "serif",
    style: {
      margin: '10px 0 28px',
      fontSize: 40,
      lineHeight: 1,
      letterSpacing: '-0.02em'
    }
  }, t('adminDashboard.title'))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 32
    }
  }, PERIODS.map(([id, label]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    className: 'btn btn--sm ' + (period === id ? 'btn--ink' : 'btn--ghost'),
    onClick: () => changePeriod(id)
  }, label))), loading && /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--ink-mute)',
      fontSize: 14,
      padding: '24px 0'
    }
  }, t('adminDashboard.loading')), error && /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--burgundy)',
      fontSize: 13,
      padding: '12px 16px',
      background: 'rgba(139,30,30,.07)',
      borderRadius: 10,
      marginBottom: 24
    }
  }, error), !loading && data && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 32
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, t('adminDashboard.totalOrders')), /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 56,
      lineHeight: 1,
      marginTop: 14
    }
  }, data.totalOrders)), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 32
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, t('adminDashboard.totalRevenue')), /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 56,
      lineHeight: 1,
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(Price, {
    value: data.totalRevenue,
    size: 48
  })))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 0,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px 28px 16px'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, t('adminDashboard.topBeverages'))), /*#__PURE__*/React.createElement(Hair, null), data.topBeverages.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 28px',
      color: 'var(--ink-mute)',
      fontSize: 14
    }
  }, t('adminDashboard.noBeverages')), data.topBeverages.map((b, i) => /*#__PURE__*/React.createElement("div", {
    key: b.itemId,
    style: {
      display: 'grid',
      gridTemplateColumns: '36px 1fr 80px',
      alignItems: 'center',
      gap: 16,
      padding: '16px 28px',
      borderBottom: i < data.topBeverages.length - 1 ? '1px solid var(--rule)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      color: 'var(--ink-faint)',
      letterSpacing: '0.12em'
    }
  }, String(i + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15
    }
  }, lang === 'ar' ? b.nameAr : b.nameEn), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--ink-mute)',
      marginTop: 2
    }
  }, lang === 'ar' ? b.nameEn : b.nameAr)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 13,
      color: 'var(--gold-deep)',
      letterSpacing: '0.12em'
    }
  }, "\xD7", b.totalQuantity)))))));
}
Object.assign(window, {
  AdminAnalyticsDashboardScreen
});
