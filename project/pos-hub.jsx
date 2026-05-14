// ============================================================
//  POS — SignalR hub hook (global, loaded after components.js)
//  Depends on: signalR (CDN global), useState/useEffect/useRef (from components.js)
// ============================================================

function useOrderHub(branchId, onOrderCreated, onKdsStatusUpdated) {
  const [connected, setConnected] = useState(false);
  const connRef = useRef(null);
  const cbCreated = useRef(onOrderCreated);
  const cbUpdated = useRef(onKdsStatusUpdated);

  useEffect(() => { cbCreated.current = onOrderCreated; });
  useEffect(() => { cbUpdated.current = onKdsStatusUpdated; });

  useEffect(() => {
    if (!branchId || typeof signalR === 'undefined') return;
    const base = (localStorage.getItem('bareeq.api') || 'https://bareeq.runasp.net').replace(/\/$/, '');
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`${base}/hubs/orders`, {
        accessTokenFactory: () => localStorage.getItem('bareeq.token') || ''
      })
      .withAutomaticReconnect()
      .build();

    conn.on('OrderCreated', d => cbCreated.current?.(d));
    conn.on('KdsStatusUpdated', d => cbUpdated.current?.(d));

    conn.start()
      .then(() => {
        setConnected(true);
        conn.invoke('JoinBranch', branchId).catch(() => {});
      })
      .catch(() => setConnected(false));

    conn.onreconnected(() => {
      setConnected(true);
      conn.invoke('JoinBranch', branchId).catch(() => {});
    });
    conn.onclose(() => setConnected(false));
    connRef.current = conn;

    return () => {
      conn.stop();
      connRef.current = null;
    };
  }, [branchId]);

  return connected;
}
