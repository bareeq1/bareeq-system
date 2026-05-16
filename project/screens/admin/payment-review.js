// ============================================================
//  ADMIN — Payment review grid + approve/reject modal
// ============================================================

function AdminPaymentReviewScreen({
  go,
  token,
  asTab
}) {
  const {
    t
  } = useI18n();
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
    apiFetch('/admin/orders?status=Placed&pageSize=50', {}, token).then(data => setOrders(Array.isArray(data) ? data : data?.items || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => {
    if (token) load();
  }, [token]);
  const openDetail = orderId => {
    setSelected(orderId);
    setPaymentDetail(null);
    setRejecting(false);
    setReason('');
    setDetailError('');
    apiFetch('/admin/orders/' + orderId + '/payment', {}, token).then(data => setPaymentDetail(data)).catch(err => setDetailError(err.message || 'Failed to load payment details.'));
  };
  const handleDecision = async approved => {
    if (!selected || !paymentDetail) return;
    setBusy(true);
    setDetailError('');
    try {
      await apiFetch('/orders/' + selected + '/payment/' + paymentDetail.paymentId + '/approve', {
        method: 'PUT',
        body: JSON.stringify({
          approved,
          ...(approved ? {} : {
            rejectionReason: reason
          })
        })
      }, token);
      setSelected(null);
      load();
    } catch (err) {
      setDetailError(err.message || 'Action failed.');
    } finally {
      setBusy(false);
    }
  };
  const content = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm",
    onClick: load
  }, t('adminPayment.refresh'))), loading && /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--ink-mute)',
      padding: '32px 0',
      fontSize: 14
    }
  }, "Loading\u2026"), !loading && orders.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '32px 0',
      color: 'var(--ink-mute)',
      fontSize: 14
    }
  }, t('adminPayment.empty')), orders.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 0,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '110px 1fr 120px 110px 120px',
      padding: '14px 28px',
      background: 'var(--ivory-2)',
      borderBottom: '1px solid var(--rule)'
    }
  }, ['Order', 'Customer', 'Branch', 'Total', 'Action'].map(h => /*#__PURE__*/React.createElement("div", {
    key: h,
    className: "eyebrow"
  }, h))), orders.map((o, i) => {
    const oid = o.id || o.orderId || '';
    return /*#__PURE__*/React.createElement("div", {
      key: oid,
      style: {
        display: 'grid',
        gridTemplateColumns: '110px 1fr 120px 110px 120px',
        padding: '18px 28px',
        alignItems: 'center',
        borderBottom: i < orders.length - 1 ? '1px solid var(--rule)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 11,
        letterSpacing: '0.12em'
      }
    }, "BR-", oid.slice(0, 4).toUpperCase()), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14
      }
    }, o.customerName || o.customer || '—'), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: 'var(--ink-mute)'
      }
    }, o.branchLabel || o.branch || '—'), /*#__PURE__*/React.createElement(Price, {
      value: o.total || 0,
      size: 13
    }), /*#__PURE__*/React.createElement("button", {
      className: "btn btn--ink btn--sm",
      onClick: () => openDetail(oid)
    }, t('adminPayment.review')));
  })), /*#__PURE__*/React.createElement(Modal, {
    open: !!selected,
    onClose: () => setSelected(null),
    width: 580
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 36
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, t('adminPayment.reviewPayment')), /*#__PURE__*/React.createElement("h3", {
    className: "serif",
    style: {
      margin: '12px 0 20px',
      fontSize: 28
    }
  }, "BR-", (selected || '').slice(0, 4).toUpperCase()), !paymentDetail && !detailError && /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--ink-mute)',
      fontSize: 14
    }
  }, "Loading\u2026"), detailError && /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--burgundy)',
      fontSize: 13,
      padding: '12px 16px',
      background: 'rgba(139,30,30,.07)',
      borderRadius: 10
    }
  }, detailError), paymentDetail && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, paymentDetail.imageUrl && /*#__PURE__*/React.createElement("img", {
    src: paymentDetail.imageUrl,
    alt: "Receipt",
    style: {
      width: '100%',
      borderRadius: 12,
      objectFit: 'cover',
      maxHeight: 280,
      border: '1px solid var(--rule)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      fontSize: 13,
      color: 'var(--ink-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 6
    }
  }, t('adminPayment.submitted')), /*#__PURE__*/React.createElement("div", null, paymentDetail.submittedAt ? new Date(paymentDetail.submittedAt).toLocaleString() : '—')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 6
    }
  }, "Total"), paymentDetail.total != null && /*#__PURE__*/React.createElement(Price, {
    value: paymentDetail.total,
    size: 13
  }))), /*#__PURE__*/React.createElement(Hair, null), rejecting ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 13,
      color: 'var(--ink-soft)'
    }
  }, t('adminPayment.rejectionReason')), /*#__PURE__*/React.createElement("textarea", {
    value: reason,
    onChange: e => setReason(e.target.value),
    rows: 3,
    placeholder: t('adminPayment.reasonPlaceholder'),
    style: {
      padding: '12px 14px',
      borderRadius: 10,
      border: '1px solid var(--rule)',
      background: 'var(--paper)',
      fontSize: 13,
      resize: 'vertical',
      fontFamily: 'inherit',
      width: '100%',
      boxSizing: 'border-box'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm",
    onClick: () => setRejecting(false),
    disabled: busy
  }, t('checkout.back')), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ink btn--sm",
    onClick: () => handleDecision(false),
    disabled: busy || !reason.trim(),
    style: {
      opacity: busy || !reason.trim() ? 0.6 : 1
    }
  }, busy ? '…' : t('adminPayment.confirmReject')))) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--gold",
    onClick: () => handleDecision(true),
    disabled: busy,
    style: {
      flex: 1,
      opacity: busy ? 0.6 : 1
    }
  }, busy ? '…' : t('adminPayment.approve')), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost",
    onClick: () => setRejecting(true),
    disabled: busy,
    style: {
      flex: 1,
      opacity: busy ? 0.6 : 1
    }
  }, t('adminPayment.reject')))))));
  if (asTab) return content;
  return /*#__PURE__*/React.createElement("div", {
    className: "screen"
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--cream)',
      padding: '40px 0 30px',
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
    onClick: () => go('admin-dashboard'),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: 13,
      color: 'var(--ink-mute)',
      marginBottom: 14,
      padding: 0
    }
  }, "\u2190 Dashboard"), /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, t('adminPayment.kicker')), /*#__PURE__*/React.createElement("h1", {
    className: "serif",
    style: {
      margin: '10px 0 0',
      fontSize: 52,
      lineHeight: 1,
      letterSpacing: '-0.02em'
    }
  }, t('adminPayment.title'))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '40px 0 120px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, content)));
}
Object.assign(window, {
  AdminPaymentReviewScreen
});
