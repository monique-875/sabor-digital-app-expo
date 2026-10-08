import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_API_URL } from '../config';

let baseUrl = DEFAULT_API_URL;
let token = null;

export const getBaseUrl = () => baseUrl;
export const setToken = (t) => { token = t; };

export async function loadBaseUrl() {
  const saved = await AsyncStorage.getItem('@api_url');
  if (saved) baseUrl = saved;
  return baseUrl;
}

export async function saveBaseUrl(url) {
  baseUrl = url.trim().replace(/\/+$/, '');
  await AsyncStorage.setItem('@api_url', baseUrl);
}

// Imagem vem como /public/uploads/... -> junta com o endereço da API
export const imageUrl = (path) => {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};

async function request(path, { method = 'GET', body, form } = {}) {
  const headers = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload;
  if (form) {
    payload = form; // NÃO definir Content-Type: o fetch coloca o boundary
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`${baseUrl}${path}`, { method, headers, body: payload });
  } catch (e) {
    throw new Error('Não foi possível conectar à API. Confira o IP, a porta e se o servidor está rodando.');
  }

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const msg = data && typeof data === 'object'
      ? data.mensagem || data.erro || data.message || data.error
      : null;
    throw new Error(msg || `Erro ${res.status}`);
  }
  return data;
}

// Produtos e cardápios vêm como { sucesso, dados }; pedidos vêm direto.
const unwrap = (r) => (r && typeof r === 'object' && !Array.isArray(r) && 'dados' in r ? r.dados : r);

/* ---------- Autenticação ---------- */
export const registrar = ({ nome, email, senha, papel }) =>
  request('/auth/registrar', { method: 'POST', body: { nome, email, senha, papel } }).then(unwrap);

export const login = ({ email, senha }) =>
  request('/auth/login', { method: 'POST', body: { email, senha } }).then((r) => {
    const d = unwrap(r);
    return { token: d.token || r.token, usuario: d.usuario || r.usuario };
  });

/* ---------- Produtos ---------- */
function produtoForm({ nome, descricao, preco, categoria, disponivel, imagem }) {
  const f = new FormData();
  if (nome !== undefined) f.append('nome', nome);
  if (descricao !== undefined) f.append('descricao', descricao);
  if (preco !== undefined) f.append('preco', String(preco).replace(',', '.'));
  if (categoria !== undefined) f.append('categoria', categoria);
  if (disponivel !== undefined) f.append('disponivel', disponivel ? '1' : '0');
  if (imagem && imagem.uri) {
    const ext = (imagem.uri.split('.').pop() || 'jpg').toLowerCase();
    f.append('imagem', {
      uri: imagem.uri,
      name: imagem.fileName || `produto.${ext}`,
      type: imagem.mimeType || (ext === 'png' ? 'image/png' : 'image/jpeg'),
    });
  }
  return f;
}

export const listarProdutos = () => request('/produtos').then(unwrap);
export const buscarProduto = (id) => request(`/produtos/${id}`).then(unwrap);
export const criarProduto = (v) => request('/produtos', { method: 'POST', form: produtoForm(v) }).then(unwrap);
export const atualizarProduto = (id, v) => request(`/produtos/${id}`, { method: 'PUT', form: produtoForm(v) }).then(unwrap);
export const excluirProduto = (id) => request(`/produtos/${id}`, { method: 'DELETE' });

/* ---------- Cardápios ---------- */
export const listarCardapios = () => request('/cardapios').then(unwrap);
export const buscarCardapio = (id) => request(`/cardapios/${id}`).then(unwrap);
export const criarCardapio = ({ nome, descricao, disponivel, produtos }) =>
  request('/cardapios', {
    method: 'POST',
    body: { nome, descricao, disponivel: disponivel ? 1 : 0, produtos },
  }).then(unwrap);
export const excluirCardapio = (id) => request(`/cardapios/${id}`, { method: 'DELETE' });

/* ---------- Pedidos ---------- */
export const criarPedido = ({ cliente, itens }) =>
  request('/pedidos', { method: 'POST', body: { cliente, itens } });
export const listarPedidos = () => request('/pedidos');
export const buscarPedido = (id) => request(`/pedidos/${id}`);
export const atualizarStatusPedido = (id, status) =>
  request(`/pedidos/${id}/status`, { method: 'PATCH', body: { status } });
export const excluirPedido = (id) => request(`/pedidos/${id}`, { method: 'DELETE' });
