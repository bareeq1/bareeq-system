// ============================================================
//  ORDER CONFIRMATION — shown after payment receipt is uploaded
// ============================================================

function OrderConfirmationScreen({
  go,
  currentOrderId
}) {
  const {
    t
  } = useI18n();
  const shortId = currentOrderId ? `BR-${currentOrderId.slice(0, 4).toUpperCase()}` : '—';
  return /*#__PURE__*/React.createElement("div", {
    className: "screen"
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '100px 0 120px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      maxWidth: 560,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 64,
      color: 'var(--gold-deep)',
      marginBottom: 24
    }
  }, "\u2726"), /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true,
    style: {
      justifyContent: 'center'
    }
  }, t('orderConfirmation.kicker')), /*#__PURE__*/React.createElement("h1", {
    className: "serif",
    style: {
      margin: '18px 0 12px',
      fontSize: 64,
      lineHeight: 0.96,
      letterSpacing: '-0.02em'
    }
  }, t('orderConfirmation.title')), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      color: 'var(--ink-mute)',
      margin: '0 0 36px',
      textWrap: 'pretty'
    }
  }, t('orderConfirmation.lead')), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--ivory-2)',
      borderRadius: 18,
      padding: '24px 32px',
      marginBottom: 36,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: '1px solid var(--rule)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 8
    }
  }, t('orderConfirmation.orderId')), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 20,
      letterSpacing: '0.12em'
    }
  }, shortId)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 8
    }
  }, t('orderConfirmation.status')), /*#__PURE__*/React.createElement(Tag, {
    tone: "ghost"
  }, t('orderConfirmation.pending')))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ink",
    onClick: () => go('order-details')
  }, t('orderConfirmation.trackOrder')), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost",
    onClick: () => go('menu')
  }, t('orderConfirmation.backToMenu'))))));
}
Object.assign(window, {
  OrderConfirmationScreen
});
