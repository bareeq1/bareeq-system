import { useState, useEffect } from 'react';
import { getToken, getUser, saveAuth, clearAuth, loginWithCode } from './api.js';
import LoginPage from './pages/LoginPage.jsx';
import KdsBoardPage from './pages/KdsBoardPage.jsx';
import NewOrderPage from './pages/NewOrderPage.jsx';

export default function App() {
  const [user, setUser] = useState(getUser);
  const [page, setPage] = useState('kds');
  const [printOrder, setPrintOrder] = useState(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.pathname === '/auth/callback') {
      const code = url.searchParams.get('code');
      if (code) {
        loginWithCode(code)
          .then((data) => {
            saveAuth(data.accessToken, data.user);
            setUser(data.user);
            window.history.replaceState({}, '', '/');
          })
          .catch(() => {
            clearAuth();
            window.history.replaceState({}, '', '/');
          });
      }
    }
  }, []);

  if (!getToken() || !user) {
    return <LoginPage />;
  }

  if (user.role !== 'BranchStaff') {
    return (
      <div style={styles.center}>
        <p>This dashboard is for branch staff only.</p>
        <button onClick={() => { clearAuth(); setUser(null); }} style={styles.btn}>Sign out</button>
      </div>
    );
  }

  return (
    <div style={styles.shell}>
      <nav style={styles.nav}>
        <span style={styles.logo}>Bareeq POS</span>
        <div style={styles.navLinks}>
          <button style={navBtn(page === 'kds')} onClick={() => setPage('kds')}>KDS Board</button>
          <button style={navBtn(page === 'new-order')} onClick={() => setPage('new-order')}>New Order</button>
        </div>
        <button
          style={{ ...styles.btn, background: 'transparent', color: '#a8a29e', fontSize: 13 }}
          onClick={() => { clearAuth(); setUser(null); }}
        >
          Sign out
        </button>
      </nav>

      <main style={styles.main}>
        {page === 'kds' && (
          <KdsBoardPage
            user={user}
            onPrint={(order) => setPrintOrder(order)}
          />
        )}
        {page === 'new-order' && (
          <NewOrderPage
            onCreated={() => setPage('kds')}
          />
        )}
      </main>

      {printOrder && (
        <PrintOverlay order={printOrder} onClose={() => setPrintOrder(null)} />
      )}
    </div>
  );
}

function PrintOverlay({ order, onClose }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.ticket} className="print-ticket">
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>Bareeq Coffee</h2>
        <p style={{ fontSize: 12, color: '#78716c', marginBottom: 16 }}>
          {new Date(order.createdAt).toLocaleTimeString()} — {order.paymentMethod ?? order.source}
        </p>
        {order.items.map((item) => (
          <div key={item.id} style={{ marginBottom: 12, borderBottom: '1px dashed #e7e5e4', paddingBottom: 10 }}>
            <div style={{ fontWeight: 600 }}>{item.nameEn} × {item.quantity}</div>
            {item.notes && <div style={{ fontSize: 12, color: '#78716c' }}>Note: {item.notes}</div>}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <button style={styles.btn} onClick={() => window.print()}>Print</button>
        <button style={{ ...styles.btn, background: '#e7e5e4', color: '#1c1917' }} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

const navBtn = (active) => ({
  padding: '6px 16px',
  borderRadius: 6,
  border: 'none',
  cursor: 'pointer',
  fontWeight: active ? 600 : 400,
  background: active ? '#292524' : 'transparent',
  color: active ? '#fff' : '#78716c',
  fontSize: 14,
});

const styles = {
  shell: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  nav: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '0 24px', height: 52,
    background: '#fff', borderBottom: '1px solid #e7e5e4',
  },
  logo: { fontWeight: 700, fontSize: 16, marginRight: 'auto' },
  navLinks: { display: 'flex', gap: 4 },
  main: { flex: 1, padding: 24 },
  center: {
    minHeight: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: 16,
  },
  btn: {
    padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
    background: '#292524', color: '#fff', fontWeight: 600, fontSize: 14,
  },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', zIndex: 100,
  },
  ticket: {
    background: '#fff', padding: 24, borderRadius: 12,
    minWidth: 280, maxWidth: 360,
  },
};
