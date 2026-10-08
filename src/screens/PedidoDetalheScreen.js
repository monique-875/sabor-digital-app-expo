import React, { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { Button, ErrorView, Loading, StatusBadge, styles } from '../components/ui';
import { atualizarStatusPedido, buscarPedido, excluirPedido } from '../services/api';
import { useCarregarDados } from '../hooks';
import { useAutenticacao } from '../context/AuthContext';
import { colors, money, statusLabels } from '../theme';

const STATUS = ['pendente', 'preparo', 'pronto', 'entregue'];

export default function PedidoDetalheScreen({ route, navigation }) {
  const { id } = route.params;
  const { ehAdministrador } = useAutenticacao();
  const [atualizandoStatus, setAtualizandoStatus] = useState(false);
  const { dados, carregando, erro, carregarNovamente } = useCarregarDados(() => buscarPedido(id), [id]);

  if (carregando) return <Loading />;
  const pedido = dados?.dados && !dados.id ? dados.dados : dados;
  if (erro || !pedido) return <ErrorView message={erro || 'Pedido não encontrado'} onRetry={carregarNovamente} />;

  const itens = Array.isArray(pedido.itens) ? pedido.itens : [];

  const mudarStatus = async (status) => {
    setAtualizandoStatus(true);
    try { await atualizarStatusPedido(id, status); await carregarNovamente(); }
    catch (e) { Alert.alert('Erro', e.message); }
    finally { setAtualizandoStatus(false); }
  };

  const excluir = () =>
    Alert.alert('Excluir pedido', `Remover o pedido #${id}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive',
        onPress: async () => {
          try { await excluirPedido(id); navigation.goBack(); }
          catch (e) { Alert.alert('Erro', e.message); }
        },
      },
    ]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16 }}>
      <View style={[styles.card, { flexDirection: 'column', padding: 18 }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: '900', color: colors.text }}>Pedido #{pedido.id}</Text>
          <StatusBadge status={pedido.status} />
        </View>
        <Text style={[styles.muted, { marginTop: 4 }]}>Cliente: {pedido.cliente}</Text>
        {pedido.forma_pagamento ? (
          <Text style={[styles.muted, { marginTop: 4 }]}>
            Pagamento na entrega/retirada: {{
              pix: 'Pix',
              dinheiro: 'Dinheiro',
              cartao: 'Cartão',
            }[pedido.forma_pagamento] || pedido.forma_pagamento}
          </Text>
        ) : null}
      </View>

      <Text style={styles.section}>Itens</Text>
      {itens.map((it, idx) => {
        const nome = it.nome || it.produto_nome || it.produto?.nome || `Produto #${it.produto_id}`;
        const unit = it.preco_unitario ?? it.preco ?? it.produto?.preco;
        return (
          <View key={idx} style={[styles.card, { justifyContent: 'space-between', alignItems: 'center', padding: 14 }]}>
            <Text style={[styles.title, { flex: 1 }]}>{it.quantidade}x {nome}</Text>
            {unit !== undefined ? <Text style={styles.price}>{money(unit * it.quantidade)}</Text> : null}
          </View>
        );
      })}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>Total</Text>
        <Text style={{ fontSize: 22, fontWeight: '900', color: colors.primary }}>{money(pedido.total)}</Text>
      </View>

      {ehAdministrador ? (
        <>
          <Text style={styles.section}>Atualizar status</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {STATUS.map((s) => (
              <Button
                key={s}
                title={statusLabels[s]}
                variant={pedido.status === s ? 'primary' : 'outline'}
                disabled={atualizandoStatus || pedido.status === s}
                onPress={() => mudarStatus(s)}
                style={{ paddingHorizontal: 14, paddingVertical: 10 }}
              />
            ))}
          </View>
          <Button title="Excluir pedido" icon="trash-outline" variant="danger" onPress={excluir} style={{ marginTop: 20 }} />
        </>
      ) : null}
    </ScrollView>
  );
}
