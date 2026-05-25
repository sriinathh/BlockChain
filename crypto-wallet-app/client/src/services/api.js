import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const client = axios.create({ baseURL: API_URL + '/api' });

export function setAuthToken(token) {
  if (token) client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete client.defaults.headers.common['Authorization'];
}

export async function register(payload) {
  const res = await client.post('/auth/register', payload);
  return res.data;
}

export async function login(payload) {
  const res = await client.post('/auth/login', payload);
  return res.data;
}

export async function walletConnect(address) {
  const res = await client.post('/wallet/connect', { address });
  return res.data;
}

export async function getBalance(address) {
  const res = await client.get(`/wallet/balance/${address}`);
  return res.data;
}

export async function sendTx(payload) {
  const res = await client.post('/wallet/send', payload);
  return res.data;
}

export async function getTransactions(wallet, page = 1, limit = 20) {
  const res = await client.get(`/transactions/${wallet}`, { params: { page, limit } });
  return res.data;
}

export async function saveTransaction(payload) {
  const res = await client.post('/transactions/save', payload);
  return res.data;
}

export default client;
