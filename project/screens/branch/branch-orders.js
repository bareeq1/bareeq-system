// ============================================================
//  BRANCH STAFF — Branch orders dashboard
// ============================================================

function BranchOrdersScreen({
  go,
  token,
  user,
  catalog
}) {
  const {
    t,
    lang
  } = useI18n();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newOrderOpen, setNewOrderOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(null); // orderId
  const [confirmPayMethod, setConfirmPayMethod] = useState('Cash');
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [confirmError, setConfirmError] = useState('');
  const load = () => {
    setLoading(true);
    setError('');
    apiFetch('/orders/branch-staff?pageSize=50', {}, token).then(data => setOrders(Array.isArray(data) ? data : [])).catch(err => setError(err.message || 'Failed to load orders.')).finally(() => setLoading(false));
  };
  useEffect(() => {
    if (token) load();
  }, [token]);
  const handleConfirmPayment = async () => {
    if (!confirmOpen) return;
    setConfirmBusy(true);
    setConfirmError('');
    try {
      await apiFetch(`/orders/${confirmOpen}/confirm-payment`, {
        method: 'POST',
        body: JSON.stringify({
          paymentMethod: confirmPayMethod
        })
      }, token);
      setConfirmOpen(null);
      load();
    } catch (err) {
      setConfirmError(err.message || 'Failed to confirm payment.');
    } finally {
      setConfirmBusy(false);
    }
  };
  const statusColor = status => {
    if (status === 'Confirmed') return 'var(--gold)';
    if (status === 'Placed') return 'var(--ink-soft)';
    if (status === 'Cancelled') return 'var(--burgundy)';
    return 'var(--ink-mute)';
  };
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
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, "Branch Staff"), /*#__PURE__*/React.createElement("h1", {
    className: "serif",
    style: {
      margin: '10px 0 0',
      fontSize: 52,
      lineHeight: 1,
      letterSpacing: '-0.02em'
    }
  }, "Branch Orders"), user?.branchLabel && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 14,
      color: 'var(--ink-mute)'
    }
  }, user.branchLabel)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm",
    onClick: load
  }, "Refresh"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ink btn--sm",
    onClick: () => setNewOrderOpen(true)
  }, "+ New Order")))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '40px 0 120px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, loading && /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--ink-mute)',
      padding: '32px 0',
      fontSize: 14
    }
  }, "Loading\u2026"), error && /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--burgundy)',
      fontSize: 13,
      padding: '12px 16px',
      background: 'rgba(139,30,30,.07)',
      borderRadius: 10,
      marginBottom: 20
    }
  }, error), !loading && !error && orders.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '32px 0',
      color: 'var(--ink-mute)',
      fontSize: 14
    }
  }, "No orders yet. Use \"+ New Order\" to create the first one."), orders.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 0,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '110px 1fr 100px 90px 110px 130px',
      padding: '14px 28px',
      background: 'var(--ivory-2)',
      borderBottom: '1px solid var(--rule)'
    }
  }, ['Order', 'Customer', 'Total', 'Status', 'Payment', 'Date'].map(h => /*#__PURE__*/React.createElement("div", {
    key: h,
    className: "eyebrow"
  }, h))), orders.map((o, i) => {
    const oid = (o.orderId || o.id || '').toString();
    const when = o.createdAt ? new Date(o.createdAt).toLocaleDateString(undefined, {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }) : '—';
    return /*#__PURE__*/React.createElement("div", {
      key: oid,
      style: {
        display: 'grid',
        gridTemplateColumns: '110px 1fr 100px 90px 110px 130px',
        padding: '16px 28px',
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
    }, o.customerName || '—'), /*#__PURE__*/React.createElement(Price, {
      value: o.total || 0,
      size: 13
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: statusColor(o.status)
      }
    }, o.status), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13
      }
    }, o.status === 'Placed' ? /*#__PURE__*/React.createElement("button", {
      className: "btn btn--ghost btn--sm",
      style: {
        fontSize: 11
      },
      onClick: () => {
        setConfirmOpen(oid);
        setConfirmPayMethod('Cash');
        setConfirmError('');
      }
    }, "Confirm") : /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--ink-mute)',
        fontSize: 12
      }
    }, o.paymentStatus || '—')), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--ink-mute)'
      }
    }, when));
  })))), /*#__PURE__*/React.createElement(Modal, {
    open: !!confirmOpen,
    onClose: () => setConfirmOpen(null),
    width: 440
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 36
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, "Confirm Payment"), /*#__PURE__*/React.createElement("h3", {
    className: "serif",
    style: {
      margin: '12px 0 20px',
      fontSize: 28
    }
  }, "BR-", (confirmOpen || '').slice(0, 4).toUpperCase()), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 13,
      color: 'var(--ink-soft)',
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, "Payment Method", /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, ['Cash', 'Card'].map(m => /*#__PURE__*/React.createElement("button", {
    key: m,
    onClick: () => setConfirmPayMethod(m),
    className: confirmPayMethod === m ? 'btn btn--ink btn--sm' : 'btn btn--ghost btn--sm'
  }, m)))), confirmError && /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--burgundy)',
      fontSize: 13,
      padding: '10px 14px',
      background: 'rgba(139,30,30,.07)',
      borderRadius: 8
    }
  }, confirmError), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost",
    style: {
      flex: 1
    },
    onClick: () => setConfirmOpen(null),
    disabled: confirmBusy
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--gold",
    style: {
      flex: 1,
      opacity: confirmBusy ? 0.6 : 1
    },
    onClick: handleConfirmPayment,
    disabled: confirmBusy
  }, confirmBusy ? '…' : 'Confirm Payment'))))), newOrderOpen && /*#__PURE__*/React.createElement(NewBranchOrderModal, {
    token: token,
    catalog: catalog,
    onClose: () => setNewOrderOpen(false),
    onSuccess: () => {
      setNewOrderOpen(false);
      load();
    }
  }));
}

// ============================================================
//  NEW ORDER MODAL
// ============================================================
function NewBranchOrderModal({
  token,
  catalog,
  onClose,
  onSuccess
}) {
  const {
    lang
  } = useI18n();
  const items = catalog?.ITEMS || [];
  const sizes = catalog?.SIZES || [];
  const milks = catalog?.MILKS || [];
  const addons = catalog?.ADDONS || [];
  const defaultSize = sizes[0]?.id || '';
  const defaultMilk = milks[0]?.id || '';
  const [cart, setCart] = useState([]);
  const [payMethod, setPayMethod] = useState('Cash');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerItem, setPickerItem] = useState(null);
  const [pickerSize, setPickerSize] = useState(defaultSize);
  const [pickerMilk, setPickerMilk] = useState(defaultMilk);
  const [pickerAddons, setPickerAddons] = useState([]);
  const [pickerQty, setPickerQty] = useState(1);
  const openPicker = item => {
    setPickerItem(item);
    setPickerSize(defaultSize);
    setPickerMilk(defaultMilk);
    setPickerAddons([]);
    setPickerQty(1);
    setPickerOpen(true);
  };
  const addToCart = () => {
    if (!pickerItem) return;
    const size = sizes.find(s => s.id === pickerSize);
    const milk = milks.find(m => m.id === pickerMilk);
    const selectedAddons = addons.filter(a => pickerAddons.includes(a.id));
    const unitPrice = pickerItem.price + (size?.delta || 0) + (milk?.delta || 0) + selectedAddons.reduce((s, a) => s + a.price, 0);
    setCart(c => [...c, {
      key: Date.now(),
      itemId: pickerItem.id,
      name: lang === 'ar' ? pickerItem.ar : pickerItem.name,
      sizeId: pickerSize,
      milkId: pickerMilk,
      addonIds: pickerAddons,
      quantity: pickerQty,
      unitPrice
    }]);
    setPickerOpen(false);
  };
  const removeFromCart = key => setCart(c => c.filter(x => x.key !== key));
  const subtotal = cart.reduce((s, x) => s + x.unitPrice * x.quantity, 0);
  const submit = async () => {
    if (!cart.length) {
      setError('Add at least one item.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await apiFetch('/orders/branch', {
        method: 'POST',
        body: JSON.stringify({
          items: cart.map(x => ({
            itemId: x.itemId,
            sizeId: x.sizeId,
            milkId: x.milkId,
            addonIds: x.addonIds,
            quantity: x.quantity
          })),
          paymentMethod: payMethod
        })
      }, token);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create order.');
    } finally {
      setBusy(false);
    }
  };
  return /*#__PURE__*/React.createElement(Modal, {
    open: true,
    onClose: onClose,
    width: 640
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 36,
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, "Branch Staff"), /*#__PURE__*/React.createElement("h3", {
    className: "serif",
    style: {
      margin: '10px 0 0',
      fontSize: 32
    }
  }, "New Order")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 12
    }
  }, "Menu Items"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
      gap: 8
    }
  }, items.map(item => /*#__PURE__*/React.createElement("button", {
    key: item.id,
    onClick: () => openPicker(item),
    style: {
      padding: '12px 14px',
      borderRadius: 12,
      border: '1px solid var(--rule)',
      background: 'var(--paper)',
      cursor: 'pointer',
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      transition: 'border-color .15s'
    },
    onMouseEnter: e => e.currentTarget.style.borderColor = 'var(--ink)',
    onMouseLeave: e => e.currentTarget.style.borderColor = 'var(--rule)'
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 500
    }
  }, lang === 'ar' ? item.ar : item.name), /*#__PURE__*/React.createElement(Price, {
    value: item.price,
    size: 12
  }))))), /*#__PURE__*/React.createElement(Hair, null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 12
    }
  }, "Order Items"), cart.length === 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--ink-mute)',
      fontSize: 13
    }
  }, "No items added yet.") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, cart.map(x => /*#__PURE__*/React.createElement("div", {
    key: x.key,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("span", null, x.quantity, "\xD7 ", x.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Price, {
    value: x.unitPrice * x.quantity,
    size: 13
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => removeFromCart(x.key),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--ink-mute)',
      fontSize: 16,
      lineHeight: 1
    }
  }, "\xD7")))), /*#__PURE__*/React.createElement(Hair, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontWeight: 600,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", null, "Total"), /*#__PURE__*/React.createElement(Price, {
    value: subtotal,
    size: 14
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 12
    }
  }, "Payment Method"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, ['Cash', 'Card'].map(m => /*#__PURE__*/React.createElement("button", {
    key: m,
    onClick: () => setPayMethod(m),
    className: payMethod === m ? 'btn btn--ink btn--sm' : 'btn btn--ghost btn--sm'
  }, m)))), error && /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--burgundy)',
      fontSize: 13,
      padding: '10px 14px',
      background: 'rgba(139,30,30,.07)',
      borderRadius: 8
    }
  }, error), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost",
    style: {
      flex: 1
    },
    onClick: onClose,
    disabled: busy
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--gold",
    style: {
      flex: 1,
      opacity: busy || !cart.length ? 0.6 : 1
    },
    onClick: submit,
    disabled: busy || !cart.length
  }, busy ? '…' : `Place Order · ${subtotal > 0 ? subtotal + ' EGP' : ''}`))), pickerOpen && pickerItem && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--paper)',
      borderRadius: 'inherit',
      padding: 36,
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Customize"), /*#__PURE__*/React.createElement("h3", {
    className: "serif",
    style: {
      margin: '8px 0 0',
      fontSize: 28
    }
  }, lang === 'ar' ? pickerItem.ar : pickerItem.name)), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPickerOpen(false),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: 22,
      color: 'var(--ink-mute)'
    }
  }, "\xD7")), sizes.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 10
    }
  }, "Size"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, sizes.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    onClick: () => setPickerSize(s.id),
    className: pickerSize === s.id ? 'btn btn--ink btn--sm' : 'btn btn--ghost btn--sm'
  }, s.label, s.delta !== 0 ? ` +${s.delta}` : '')))), milks.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 10
    }
  }, "Milk"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, milks.map(m => /*#__PURE__*/React.createElement("button", {
    key: m.id,
    onClick: () => setPickerMilk(m.id),
    className: pickerMilk === m.id ? 'btn btn--ink btn--sm' : 'btn btn--ghost btn--sm'
  }, m.label, m.delta !== 0 ? ` +${m.delta}` : '')))), addons.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 10
    }
  }, "Add-ons"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, addons.map(a => {
    const selected = pickerAddons.includes(a.id);
    return /*#__PURE__*/React.createElement("button", {
      key: a.id,
      onClick: () => setPickerAddons(prev => selected ? prev.filter(x => x !== a.id) : [...prev, a.id]),
      className: selected ? 'btn btn--ink btn--sm' : 'btn btn--ghost btn--sm'
    }, a.label, " +", a.price);
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 10
    }
  }, "Quantity"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm",
    onClick: () => setPickerQty(q => Math.max(1, q - 1))
  }, "\u2212"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--f-mono)',
      fontSize: 16,
      minWidth: 24,
      textAlign: 'center'
    }
  }, pickerQty), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm",
    onClick: () => setPickerQty(q => q + 1)
  }, "+"))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--gold",
    onClick: addToCart,
    style: {
      marginTop: 8
    }
  }, "Add to Order")));
}
Object.assign(window, {
  BranchOrdersScreen
});
