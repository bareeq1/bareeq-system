import { useState, useEffect, useCallback } from 'react';
import { getPendingOrders, updateKdsStatus } from '../api.js';
import { useSignalR } from '../useSignalR.js';
import OrderCard from '../components/OrderCard.jsx';

const POLL_INTERVAL = 10_000;

export default function KdsBoardPage({ user, onPrint }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await getPendingOrders();
      setOrders(data);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const id = setInterval(fetchOrders, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchOrders]);

  const handleOrderCreated = useCallback(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleKdsUpdated = useCallback((data) => {
    setOrders((prev) =>
      prev
        .map((order) => {
          if (order.id !== data.orderId) return order;
          const updatedItems = order.items.map((item) =>
            item.id === data.itemId ? { ...item, kdsStatus: data.kdsStatus } : item
          );
          return { ...order, items: updatedItems, _orderStatus: data.orderStatus };
        })
        .filter((order) => order._orderStatus !== 'Completed')
    );
  }, []);

  const signalRConnected = useSignalR(user.branchId, handleOrderCreated, handleKdsUpdated);

  const handleStatusChange = async (orderId, itemId, newStatus) => {
    try {
      await updateKdsStatus(orderId, itemId, newStatus);
    } catch (e) {
      console.error(e);
      fetchOrders();
    }
  };

  if (loading) return <p style={styles.msg}>Loading orders…</p>;
  if (error) return <p style={{ ...styles.msg, color: '#dc2626' }}>Error: {error}</p>;

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.heading}>Kitchen Display</h2>
        <div style={styles.status}>
          <span style={{ ...styles.dot, background: signalRConnected ? '#16a34a' : '#f59e0b' }} />
          {signalRConnected ? 'Live' : 'Polling'}
        </div>
      </div>

      {orders.length === 0 ? (
        <div style={styles.empty}>No pending orders</div>
      ) : (
        <div style={styles.grid}>
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={handleStatusChange}
              onPrint={onPrint}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  header: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 },
  heading: { fontSize: 22, fontWeight: 700 },
  status: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#78716c' },
  dot: { width: 8, height: 8, borderRadius: '50%', display: 'inline-block' },
  msg: { textAlign: 'center', padding: 40, color: '#78716c' },
  empty: {
    textAlign: 'center', padding: 80, color: '#a8a29e',
    background: '#fff', borderRadius: 12, border: '1px dashed #e7e5e4',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 16,
  },
};
