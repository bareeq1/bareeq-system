// ============================================================
//  KDS BOARD — kitchen display for branch staff
//  Globals used: apiFetch, useOrderHub, useState, useEffect, useRef
// ============================================================

const KDS_STATUSES = ['Pending', 'Preparing', 'Ready', 'Collected'];

const KDS_COLORS = {
  Pending:   { bg: '#fef9c3', color: '#854d0e' },
  Preparing: { bg: '#fef3c7', color: '#92400e' },
  Ready:     { bg: '#dcfce7', color: '#166534' },
  Collected: { bg: '#f1f5f9', color: '#475569' },
};

function KdsBoardScreen({ go, token, user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [printOrder, setPrintOrder] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'kds-print-styles';
    style.textContent = [
      '@media print {',
      '  .shell > *:not(.kds-print-area) { display: none !important; }',
      '  .kds-print-area { display: block !important; position: fixed; inset: 0; background: #fff; padding: 32px; z-index: 9999; }',
      '}',
    ].join('\n');
    document.head.appendChild(style);
    return () => { document.getElementById('kds-print-styles')?.remove(); };
  }, []);

  const fetchOrders = () => {
    apiFetch('/orders/pending', {}, token)
      .then(data => { setOrders(data || []); setError(null); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  };

  useEffect(() => {
    fetchOrders();
    const id = setInterval(fetchOrders, 10000);
    return () => clearInterval(id);
  }, [token]);

  const handleKdsUpdated = (data) => {
    setOrders(prev =>
      prev
        .map(order => {
          if (order.id !== data.orderId) return order;
          return {
            ...order,
            items: order.items.map(item =>
              item.id === data.itemId ? { ...item, kdsStatus: data.kdsStatus } : item
            ),
            _live: data.orderStatus
          };
        })
        .filter(order => order._live !== 'Completed')
    );
  };

  const connected = useOrderHub(user?.branchId, fetchOrders, handleKdsUpdated);

  const handleStatusChange = (orderId, itemId, newStatus) => {
    apiFetch(`/orders/${orderId}/items/${itemId}/kds-status`, {
      method: 'PUT',
      body: JSON.stringify({ kdsStatus: newStatus })
    }, token).catch(() => fetchOrders());
  };

  const handlePrint = (order) => {
    setPrintOrder(order);
    setTimeout(() => { window.print(); setPrintOrder(null); }, 80);
  };

  return (
    <div style={{ padding: '24px 32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', margin: 0 }}>Kitchen Display</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--ink-mute)' }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: connected ? '#16a34a' : '#f59e0b',
            display: 'inline-block'
          }} />
          {connected ? 'Live' : 'Polling'}
        </div>
        <button
          style={{ marginLeft: 'auto', padding: '6px 16px', borderRadius: 8, border: '1px solid var(--rule)', background: 'var(--paper)', cursor: 'pointer', fontSize: 13, color: 'var(--ink)' }}
          onClick={() => go('new-order')}
        >
          + New Order
        </button>
      </div>

      {loading && (
        <p style={{ color: 'var(--ink-mute)', textAlign: 'center', padding: 48 }}>Loading orders…</p>
      )}
      {!loading && error && (
        <p style={{ color: '#dc2626', textAlign: 'center', padding: 48 }}>Error: {error}</p>
      )}
      {!loading && !error && orders.length === 0 && (
        <div style={{ textAlign: 'center', padding: 80, color: '#a8a29e', border: '1px dashed var(--rule)', borderRadius: 12, background: 'var(--paper)' }}>
          No pending orders
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {orders.map(order => (
          <KdsOrderCard
            key={order.id}
            order={order}
            onStatusChange={handleStatusChange}
            onPrint={handlePrint}
          />
        ))}
      </div>

      {/* Hidden print ticket — revealed only via @media print */}
      {printOrder && (
        <div className="kds-print-area" style={{ display: 'none' }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, marginBottom: 8 }}>Bareeq Coffee</div>
          <div style={{ fontSize: 13, color: '#555', marginBottom: 16 }}>
            {new Date(printOrder.createdAt).toLocaleTimeString()} — {printOrder.paymentMethod ?? printOrder.source}
          </div>
          <div style={{ borderTop: '1px solid #ccc', paddingTop: 12 }}>
            {printOrder.items.map(item => (
              <div key={item.id} style={{ marginBottom: 12, paddingBottom: 10, borderBottom: '1px dashed #ddd' }}>
                <div style={{ fontWeight: 600 }}>{item.nameEn} × {item.quantity}</div>
                {item.notes && <div style={{ fontSize: 12, color: '#777', marginTop: 2 }}>Note: {item.notes}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function KdsOrderCard({ order, onStatusChange, onPrint }) {
  const time = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const overallStatus = (() => {
    const its = order.items;
    if (its.every(i => i.kdsStatus === 'Collected')) return 'Collected';
    if (its.every(i => i.kdsStatus === 'Ready' || i.kdsStatus === 'Collected')) return 'Ready';
    if (its.some(i => i.kdsStatus !== 'Pending')) return 'Preparing';
    return 'Pending';
  })();

  return (
    <div style={{ background: 'var(--paper)', borderRadius: 12, border: '1px solid var(--rule)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '0.04em', fontFamily: 'var(--f-mono)' }}>
            #{order.id.slice(-6).toUpperCase()}
          </span>
          <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--ink-mute)' }}>{time}</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{
            padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600,
            background: order.source === 'Branch' ? '#e0f2fe' : '#f3e8ff',
            color: order.source === 'Branch' ? '#0369a1' : '#7e22ce'
          }}>
            {order.source}
          </span>
          {order.paymentMethod && (
            <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: '#f0fdf4', color: '#166534' }}>
              {order.paymentMethod}
            </span>
          )}
        </div>
      </div>

      {/* Items */}
      <div style={{ padding: '8px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {order.items.map(item => {
          const sc = KDS_COLORS[item.kdsStatus] || {};
          return (
            <div key={item.id} style={{ paddingBottom: 10, borderBottom: '1px solid #f5f5f4' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontWeight: 500, fontSize: 14 }}>{item.nameEn} × {item.quantity}</span>
                <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: sc.bg, color: sc.color }}>
                  {item.kdsStatus}
                </span>
              </div>
              {item.notes && (
                <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginBottom: 4 }}>{item.notes}</div>
              )}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                {KDS_STATUSES.filter(s => s !== item.kdsStatus).map(s => {
                  const sc2 = KDS_COLORS[s] || {};
                  return (
                    <button key={s}
                      style={{ padding: '3px 10px', borderRadius: 6, border: '1px solid var(--rule)', background: 'var(--paper)', cursor: 'pointer', fontSize: 12, color: sc2.color || 'var(--ink)' }}
                      onClick={() => onStatusChange(order.id, item.id, s)}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ padding: '10px 16px', borderTop: '1px solid #f5f5f4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--ink-mute)' }}>All: {overallStatus}</span>
        <button
          style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid var(--rule)', background: 'var(--paper)', cursor: 'pointer', fontSize: 12 }}
          onClick={() => onPrint(order)}
        >
          Print
        </button>
      </div>
    </div>
  );
}
