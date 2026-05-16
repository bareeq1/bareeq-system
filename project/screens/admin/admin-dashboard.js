// ============================================================
//  ADMIN — Main dashboard with tabs
// ============================================================

function AdminDashboardScreen({
  go,
  token,
  user
}) {
  const [tab, setTab] = useState('payments');
  const displayName = user?.fullName || 'Admin';
  const TABS = [['payments', 'Payment Reviews'], ['analytics', 'Analytics']];
  return /*#__PURE__*/React.createElement("div", {
    className: "screen"
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--cream)',
      padding: '50px 0 30px',
      borderBottom: '1px solid var(--rule)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, "Admin"), /*#__PURE__*/React.createElement("h1", {
    className: "serif",
    style: {
      margin: '10px 0 0',
      fontSize: 52,
      lineHeight: 1,
      letterSpacing: '-0.02em'
    }
  }, "Dashboard.")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink-mute)'
    }
  }, displayName))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: '1px solid var(--rule)',
      background: 'var(--paper)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      display: 'flex',
      gap: 4,
      padding: '14px 32px'
    }
  }, TABS.map(([id, label]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    className: "tab",
    "data-active": tab === id,
    onClick: () => setTab(id)
  }, label)))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '50px 0 120px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, tab === 'payments' && /*#__PURE__*/React.createElement(AdminPaymentReviewScreen, {
    asTab: true,
    go: go,
    token: token
  }), tab === 'analytics' && /*#__PURE__*/React.createElement(AdminAnalyticsDashboardScreen, {
    token: token
  }))), /*#__PURE__*/React.createElement(Footer, {
    go: go
  }));
}
Object.assign(window, {
  AdminDashboardScreen
});
