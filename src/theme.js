export const colors = {
  primary: '#2F6B4F',
  primaryDark: '#24543D',
  secondary: '#4F795D',
  bg: '#F7F5EB',
  card: '#FFFEF8',
  text: '#26352B',
  muted: '#737B70',
  border: '#E2E3D7',
  danger: '#B5473C',
  warning: '#B7832F',
  info: '#557C8B',
};

export const statusColors = {
  pendente: '#F2A541',
  preparo: '#557C8B',
  pronto: '#2F6B4F',
  entregue: '#8A7B6E',
};

export const statusLabels = {
  pendente: 'Pendente',
  preparo: 'Em preparo',
  pronto: 'Pronto',
  entregue: 'Entregue',
};

export const money = (v) => `R$ ${Number(v || 0).toFixed(2).replace('.', ',')}`;
