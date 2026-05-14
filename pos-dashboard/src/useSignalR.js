import { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { API_BASE, getToken } from './api.js';

export function useSignalR(branchId, onOrderCreated, onKdsStatusUpdated) {
  const connectionRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!branchId) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE}/hubs/orders`, {
        accessTokenFactory: getToken,
      })
      .withAutomaticReconnect()
      .build();

    connection.on('OrderCreated', (data) => onOrderCreated?.(data));
    connection.on('KdsStatusUpdated', (data) => onKdsStatusUpdated?.(data));

    connection
      .start()
      .then(() => {
        setConnected(true);
        return connection.invoke('JoinBranch', branchId);
      })
      .catch(() => setConnected(false));

    connection.onreconnected(() => {
      setConnected(true);
      connection.invoke('JoinBranch', branchId).catch(() => {});
    });
    connection.onclose(() => setConnected(false));

    connectionRef.current = connection;

    return () => {
      connection.stop();
      connectionRef.current = null;
      setConnected(false);
    };
  }, [branchId]);

  return connected;
}
