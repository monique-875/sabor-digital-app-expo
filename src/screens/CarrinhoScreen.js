import React, { useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Empty, Input, ProdutoImage, styles } from '../components/ui';
import { criarPedido } from '../services/api';
import { useCarrinho } from '../context/CartContext';
import { useAutenticacao } from '../context/AuthContext';
import { colors, money } from '../theme';

export default function CarrinhoScreen({ navigation }) {
  const { itens, alterarQuantidade, limpar, totalEstimado } = useCarrinho();
  const { usuario } = useAutenticacao();
  const [cliente, setCliente] = useState(usuario?.nome || '');
  const [enviando, setEnviando] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState('');
  const formasPagamento = [
    { valor: 'pix', nome: 'Pix', detalhe: 'Pagamento na entrega ou retirada' },
    { valor: 'dinheiro', nome: 'Dinheiro', detalhe: 'Pagamento na entrega ou retirada' },
    { valor: 'cartao', nome: 'Cartão', detalhe: 'Pagamento na entrega ou retirada' },
  ];

  const finalizar = async () => {
    if (!cliente.trim()) return Alert.alert('Atenção', 'Informe o nome do cliente.');
    if (!formaPagamento) return Alert.alert('Atenção', 'Escolha como vai pagar.');
    setEnviando(true);
    try {
      const pedido = await criarPedido({
        cliente: cliente.trim(),
        forma_pagamento: formaPagamento,
        itens: itens.map((i) => ({ produto_id: i.produto.id, quantidade: i.quantidade })),
      });
      limpar();
      const id = pedido?.id ?? pedido?.dados?.id ?? pedido?.pedido?.id;
      Alert.alert('Pedido enviado!', 'Seu pedido foi recebido. O pagamento será feito na entrega ou retirada; nenhuma cobrança foi realizada pelo aplicativo.');
      if (id) navigation.navigate('PedidoDetalhe', { id });
      else navigation.navigate('Pedidos');
    } catch (e) {
      Alert.alert('Erro ao enviar pedido', e.message);
    } finally {
      setEnviando(false);
    }
  };

  if (itens.length === 0) return <Empty icon="cart-outline" text="Seu carrinho está vazio" />;

  return (
    <View style={styles.screen}>
      <FlatList
        data={itens}
        keyExtractor={(i) => String(i.produto.id)}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={[styles.card, { alignItems: 'center' }]}>
            <ProdutoImage path={item.produto.imagem} size={60} style={{ borderRadius: 12 }} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.title} numberOfLines={1}>{item.produto.nome}</Text>
              <Text style={styles.price}>{money(item.produto.preco * item.quantidade)}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Pressable onPress={() => alterarQuantidade(item.produto.id, item.quantidade - 1)} hitSlop={8}>
                <Ionicons name={item.quantidade === 1 ? 'trash-outline' : 'remove-circle-outline'} size={26} color={colors.primary} />
              </Pressable>
              <Text style={{ fontWeight: '800', fontSize: 16 }}>{item.quantidade}</Text>
              <Pressable onPress={() => alterarQuantidade(item.produto.id, item.quantidade + 1)} hitSlop={8}>
                <Ionicons name="add-circle" size={26} color={colors.primary} />
              </Pressable>
            </View>
          </View>
        )}
        ListFooterComponent={
          <View style={{ marginTop: 8 }}>
            <Input label="Seu nome" value={cliente} onChangeText={setCliente} placeholder="Nome para o pedido" />
            <Text style={[styles.section, { marginTop: 8 }]}>Como vai pagar?</Text>
            <Text style={[styles.muted, { marginBottom: 12 }]}>O pagamento será feito na entrega ou retirada.</Text>
            {formasPagamento.map((forma) => {
              const selecionada = formaPagamento === forma.valor;
              return (
                <Pressable
                  key={forma.valor}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selecionada }}
                  onPress={() => setFormaPagamento(forma.valor)}
                  style={[
                    styles.card,
                    {
                      alignItems: 'center',
                      borderWidth: 1.5,
                      borderColor: selecionada ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name={selecionada ? 'radio-button-on' : 'radio-button-off'}
                    size={22}
                    color={selecionada ? colors.primary : colors.muted}
                  />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.title}>{forma.nome}</Text>
                    <Text style={styles.muted}>{forma.detalhe}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        }
      />
      <View style={{ padding: 16, backgroundColor: colors.card, borderTopWidth: 1, borderColor: colors.border }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          <Text style={styles.muted}>Total aproximado</Text>
          <Text style={styles.price}>{money(totalEstimado)}</Text>
        </View>
        <Button title="Confirmar pedido" icon="checkmark-circle-outline" onPress={finalizar} loading={enviando} />
      </View>
    </View>
  );
}
