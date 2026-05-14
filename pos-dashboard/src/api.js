export const API_BASE = 'http://localhost:5089';
export const GOOGLE_CLIENT_ID = '96562673434-lqr790jcs92b5usfdhlsnif2flirap86.apps.googleusercontent.com';
export const REDIRECT_URI = 'http://localhost:5174/auth/callback';

export function getToken() {
  return localStorage.getItem('pos_token');
}

export function saveAuth(token, user) {
  localStorage.setItem('pos_token', token);
  localStorage.setItem('pos_user', JSON.stringify(user));
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('pos_user') || 'null');
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem('pos_token');
  localStorage.removeItem('pos_user');
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (res.status === 401) {
    clearAuth();
    window.location.reload();
  }
  return res;
}

export async function loginWithCode(code) {
  const res = await fetch(`${API_BASE}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, redirectUri: REDIRECT_URI }),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function getPendingOrders() {
  const res = await request('orders/pending');
  if (!res.ok) throw new Error('Failed to fetch pending orders');
  return res.json();
}

export async function updateKdsStatus(orderId, itemId, kdsStatus) {
  const res = await request(`orders/${orderId}/items/${itemId}/kds-status`, {
    method: 'PUT',
    body: JSON.stringify({ orderId, itemId, kdsStatus }),
  });
  if (!res.ok) throw new Error('Failed to update KDS status');
  return res.json();
}

export async function getCatalog() {
  const res = await fetch(`${API_BASE}/catalog`);
  if (!res.ok) throw new Error('Failed to fetch catalog');
  return res.json();
}

export async function createBranchOrder(items, paymentMethod, notes) {
  const res = await request('orders/branch', {
    method: 'POST',
    body: JSON.stringify({ items, paymentMethod, notes }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to create order');
  }
  return res.json();
}

export function buildGoogleOAuthUrl() {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}
