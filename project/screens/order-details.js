// ============================================================
//  ORDER DETAILS — live status polling via useOrderPolling
// ============================================================

function useOrderPolling(orderId, token, interval) {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const ms = interval || 5000;
  useEffect(() => {
    if (!orderId || !token) return;
    let active = true;
    const poll = () => {
      apiFetch('/orders/' + orderId, {}, token).then(data => {
        if (active) {
          setOrder(data);
          setError('');
        }
      }).catch(err => {
        if (active) setError(err.message || 'Failed to load order.');
      });
    };
    poll();
    const id = setInterval(poll, ms);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [orderId, token, ms]);
  return {
    order,
    error
  };
}
const STATUS_STEPS = ['Placed', 'Confirmed', 'Ready', 'Completed'];
function OrderDetailsScreen({
  go,
  currentOrderId,
  token
}) {
  const {
    t
  } = useI18n();
  const {
    order,
    error
  } = useOrderPolling(currentOrderId, token);
  const currentStep = order ? Math.max(0, STATUS_STEPS.indexOf(order.status)) : -1;
  if (!currentOrderId) {
    return /*#__PURE__*/React.createElement("div", {
      className: "screen"
    }, /*#__PURE__*/React.createElement("section", {
      style: {
        padding: '100px 0',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "wrap",
      style: {
        maxWidth: 480,
        margin: '0 auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "serif",
      style: {
        fontSize: 28,
        color: 'var(--ink-faint)'
      }
    }, "\u2014"), /*#__PURE__*/React.createElement("p", {
      style: {
        color: 'var(--ink-mute)',
        marginTop: 16
      }
    }, "No order selected."), /*#__PURE__*/React.createElement("button", {
      className: "btn btn--ghost btn--sm",
      style: {
        marginTop: 20
      },
      onClick: () => go('dashboard')
    }, t('dashboard.tabs.orders')))));
  }
  const shortId = `BR-${currentOrderId.slice(0, 4).toUpperCase()}`;
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
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => go('dashboard'),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: 13,
      color: 'var(--ink-mute)',
      marginBottom: 14,
      padding: 0
    }
  }, "\u2190 ", t('dashboard.tabs.orders')), /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, t('orderDetails.kicker')), /*#__PURE__*/React.createElement("h1", {
    className: "serif",
    style: {
      margin: '10px 0 0',
      fontSize: 52,
      lineHeight: 1,
      letterSpacing: '-0.02em'
    }
  }, shortId)), order && /*#__PURE__*/React.createElement(Tag, {
    tone: order.status === 'Completed' ? 'gold' : order.status === 'Ready' ? 'sage' : 'ghost'
  }, order.status))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '50px 0 120px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      maxWidth: 900,
      margin: '0 auto'
    }
  }, error && /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--burgundy)',
      fontSize: 13,
      padding: '12px 16px',
      background: 'rgba(139,30,30,.07)',
      borderRadius: 10,
      marginBottom: 24
    }
  }, error), !order && !error && /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--ink-mute)',
      fontSize: 14,
      padding: '24px 0'
    }
  }, "Loading\u2026"), order && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 36
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, t('orderDetails.status')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      marginTop: 28
    }
  }, STATUS_STEPS.map((s, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: s
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: '50%',
      background: i <= currentStep ? 'var(--ink)' : 'var(--ivory-2)',
      border: `2px solid ${i <= currentStep ? 'var(--ink)' : 'var(--rule)'}`,
      display: 'grid',
      placeItems: 'center',
      color: i <= currentStep ? 'var(--ivory)' : 'var(--ink-faint)',
      fontSize: 13,
      transition: 'background .4s, border-color .4s'
    }
  }, i < currentStep ? '✓' : /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 9
    }
  }, "0", i + 1)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontSize: 12,
      textAlign: 'center',
      fontWeight: i === currentStep ? 600 : 400,
      color: i <= currentStep ? 'var(--ink)' : 'var(--ink-faint)'
    }
  }, s)), i < STATUS_STEPS.length - 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 2,
      height: 2,
      background: i < currentStep ? 'var(--ink)' : 'var(--rule)',
      transition: 'background .4s',
      marginBottom: 28,
      flexShrink: 0
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.3fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 28
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, t('checkout.yourOrder')), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      display: 'flex',
      flexDirection: 'column'
    }
  }, (order.items || []).map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 14,
      padding: '12px 0',
      borderBottom: i < order.items.length - 1 ? '1px solid var(--rule)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("span", null, it.nameEn, it.quantity > 1 ? ` ×${it.quantity}` : ''), /*#__PURE__*/React.createElement(Price, {
    value: it.lineTotal || it.price * it.quantity,
    size: 13
  })))), /*#__PURE__*/React.createElement(Hair, {
    style: {
      margin: '16px 0'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 13,
      color: 'var(--ink-soft)'
    }
  }, /*#__PURE__*/React.createElement("span", null, t('cart.subtotal')), /*#__PURE__*/React.createElement(Price, {
    value: order.subtotal,
    size: 13,
    soft: true
  })), order.deliveryFee > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 13,
      color: 'var(--ink-soft)'
    }
  }, /*#__PURE__*/React.createElement("span", null, t('cart.delivery')), /*#__PURE__*/React.createElement(Price, {
    value: order.deliveryFee / 100,
    size: 13,
    soft: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      borderTop: '1px dashed var(--rule)',
      paddingTop: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "serif",
    style: {
      fontSize: 18
    }
  }, t('cart.total')), /*#__PURE__*/React.createElement(Price, {
    value: order.total,
    size: 16
  }))), order.branchLabel && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      paddingTop: 16,
      borderTop: '1px solid var(--rule)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-faint)',
      marginBottom: 4
    }
  }, t('checkout.branch')), /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 16
    }
  }, order.branchLabel))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 28
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, t('orderDetails.payment')), !order.payment ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      color: 'var(--ink-mute)',
      fontSize: 14
    }
  }, t('orderDetails.noPayment')) : /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--ink-soft)'
    }
  }, t('orderDetails.paymentStatus')), /*#__PURE__*/React.createElement(Tag, {
    tone: order.payment.status === 'Approved' ? 'gold' : order.payment.status === 'Rejected' ? 'burgundy' : 'ghost'
  }, order.payment.status)), order.payment.status === 'Rejected' && order.payment.rejectionReason && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 14px',
      background: 'rgba(139,30,30,.07)',
      borderRadius: 10,
      fontSize: 13,
      color: 'var(--burgundy)'
    }
  }, order.payment.rejectionReason), order.payment.imageUrl && /*#__PURE__*/React.createElement("img", {
    src: order.payment.imageUrl,
    alt: "Receipt",
    style: {
      width: '100%',
      borderRadius: 10,
      objectFit: 'cover',
      maxHeight: 200
    }
  }))))))));
}
Object.assign(window, {
  OrderDetailsScreen,
  useOrderPolling
});
