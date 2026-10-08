import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Empty, ErrorView, Loading, StatusBadge, styles } from '../components/ui';
import { listarPedidos } from '../services/api';
import { useCarregarDados } from '../hooks';
import { colors, money } from '../theme';

export default function PedidosScreen({ navigation }) {
  const { dados, carregando, erro, atualizando, carregarNovamente } = useCarregarDados(listarPedidos);

  if (carregando) return <Loading />;
  if (erro) return <ErrorView message={erro} onRetry={carregarNovamente} />;

  const lista = Array.isArray(dados) ? dados : dados?.dados || [];
  // mais recentes primeiro
  const ordenada = [...lista].sort((a, b) => b.id - a.id);

  return (
    <FlatList
      style={styles.screen}
      data={ordenada}
      keyExtractor={(p) => String(p.id)}
      contentContainerStyle={{ padding: 16 }}
      refreshing={atualizando}
      onRefresh={carregarNovamente}
      ListEmptyComponent={<Empty icon="receipt-outline" text="Nenhum pedido ainda" />}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => navigation.navigate('PedidoDetalhe', { id: item.id })}
          style={[styles.card, { flexDirection: 'column', padding: 16 }]}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.title}>Pedido #{item.id}</Text>
            <StatusBadge status={item.status} />
          </View>
          <Text style={[styles.muted, { marginTop: 4 }]}>{item.cliente}</Text>
          {item.forma_pagamento ? (
            <Text style={[styles.muted, { marginTop: 4 }]}>
              Paga na entrega/retirada: {{
                pix: 'Pix',
                dinheiro: 'Dinheiro',
                cartao: 'Cartão',
              }[item.forma_pagamento] || item.forma_pagamento}
            </Text>
          ) : null}
          {item.total !== undefined ? (
            <Text style={[styles.price, { marginTop: 6, color: colors.text }]}>{money(item.total)}</Text>
          ) : null}
        </Pressable>
      )}
    />
  );
}
