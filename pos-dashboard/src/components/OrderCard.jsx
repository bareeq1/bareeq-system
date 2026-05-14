const KDS_STATUSES = ['Pending', 'Preparing', 'Ready', 'Collected'];

const STATUS_COLORS = {
  Pending: { bg: '#fef9c3', text: '#854d0e' },
  Preparing: { bg: '#fef3c7', text: '#92400e' },
  Ready: { bg: '#dcfce7', text: '#166534' },
  Collected: { bg: '#f1f5f9', text: '#475569' },
};

export default function OrderCard({ order, onStatusChange, onPrint }) {
  const time = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const overallStatus = deriveOverallStatus(order.items);

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <span style={styles.orderNum}>#{order.id.slice(-6).toUpperCase()}</span>
          <span style={styles.time}>{time}</span>
        </div>
        <div style={styles.badges}>
          <span style={sourceBadge(order.source)}>{order.source}</span>
          {order.paymentMethod && (
            <span style={styles.payBadge}>{order.paymentMethod}</span>
          )}
        </div>
      </div>

      <div style={styles.items}>
        {order.items.map((item) => (
          <div key={item.id} style={styles.item}>
            <div style={styles.itemTop}>
              <span style={styles.itemName}>{item.nameEn} × {item.quantity}</span>
              <span style={statusChip(item.kdsStatus)}>{item.kdsStatus}</span>
            </div>
            {item.notes && <div style={styles.notes}>{item.notes}</div>}
            <div style={styles.itemActions}>
              {KDS_STATUSES.filter((s) => s !== item.kdsStatus).map((s) => (
                <button
                  key={s}
                  style={actionBtn(s)}
                  onClick={() => onStatusChange(order.id, item.id, s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={styles.cardFooter}>
        <span style={{ fontSize: 12, color: '#a8a29e' }}>All: {overallStatus}</span>
        <button style={styles.printBtn} onClick={() => onPrint(order)}>Print</button>
      </div>
    </div>
  );
}

function deriveOverallStatus(items) {
  if (items.every((i) => i.kdsStatus === 'Collected')) return 'Collected';
  if (items.every((i) => i.kdsStatus === 'Ready' || i.kdsStatus === 'Collected')) return 'Ready';
  if (items.some((i) => i.kdsStatus !== 'Pending')) return 'Preparing';
  return 'Pending';
}

const statusChip = (status) => ({
  padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600,
  background: STATUS_COLORS[status]?.bg ?? '#f1f5f9',
  color: STATUS_COLORS[status]?.text ?? '#475569',
});

const sourceBadge = (source) => ({
  padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600,
  background: source === 'Branch' ? '#e0f2fe' : '#f3e8ff',
  color: source === 'Branch' ? '#0369a1' : '#7e22ce',
});

const actionBtn = (status) => ({
  padding: '3px 10px', borderRadius: 6, border: '1px solid #e7e5e4',
  background: '#fff', cursor: 'pointer', fontSize: 12,
  color: STATUS_COLORS[status]?.text ?? '#1c1917',
});

const styles = {
  card: {
    background: '#fff', borderRadius: 12, border: '1px solid #e7e5e4',
    overflow: 'hidden', display: 'flex', flexDirection: 'column',
  },
  cardHeader: {
    padding: '12px 16px', borderBottom: '1px solid #f5f5f4',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  orderNum: { fontWeight: 700, fontSize: 15, letterSpacing: '0.04em' },
  time: { marginLeft: 8, fontSize: 12, color: '#a8a29e' },
  badges: { display: 'flex', gap: 6 },
  payBadge: {
    padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600,
    background: '#f0fdf4', color: '#166534',
  },
  items: { padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 },
  item: { padding: '8px 0', borderBottom: '1px solid #f5f5f4' },
  itemTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  itemName: { fontWeight: 500, fontSize: 14 },
  notes: { fontSize: 12, color: '#78716c', marginBottom: 6 },
  itemActions: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 },
  cardFooter: {
    padding: '10px 16px', borderTop: '1px solid #f5f5f4',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  printBtn: {
    padding: '4px 12px', borderRadius: 6, border: '1px solid #e7e5e4',
    background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 500,
  },
};
