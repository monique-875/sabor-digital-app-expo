import React, { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { Button, ErrorView, Loading, ProdutoImage, styles } from '../components/ui';
import { buscarProduto, excluirProduto } from '../services/api';
import { useCarregarDados } from '../hooks';
import { useAutenticacao } from '../context/AuthContext';
import { useCarrinho } from '../context/CartContext';
import { colors, money } from '../theme';

export default function ProdutoDetalheScreen({ route, navigation }) {
  const { id } = route.params;
  const { ehAdministrador } = useAutenticacao();
  const { adicionar } = useCarrinho();
  const [qtd, setQtd] = useState(1);
  const { dados: produto, carregando, erro, carregarNovamente } = useCarregarDados(() => buscarProduto(id), [id]);

  if (carregando) return <Loading />;
  if (erro || !produto) return <ErrorView message={erro || 'Produto não encontrado'} onRetry={carregarNovamente} />;

  const indisponivel = produto.disponivel === 0 || produto.disponivel === false;

  const excluir = () =>
    Alert.alert('Excluir produto', `Remover "${produto.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive',
        onPress: async () => {
          try { await excluirProduto(id); navigation.goBack(); }
          catch (e) { Alert.alert('Erro', e.message); }
        },
      },
    ]);

  return (
    <ScrollView style={styles.screen}>
      <ProdutoImage path={produto.imagem} size={400} style={{ width: '100%', height: 280 }} />
      <View style={{ padding: 20 }}>
        {produto.categoria ? <Text style={{ color: colors.secondary, fontWeight: '700', textTransform: 'uppercase' }}>{produto.categoria}</Text> : null}
        <Text style={{ fontSize: 26, fontWeight: '900', color: colors.text }}>{produto.nome}</Text>
        <Text style={{ fontSize: 24, fontWeight: '800', color: colors.primary, marginVertical: 6 }}>{money(produto.preco)}</Text>
        <Text style={{ color: colors.text, lineHeight: 22, marginBottom: 16 }}>{produto.descricao || 'Sem descrição.'}</Text>

        {indisponivel ? (
          <Text style={{ color: colors.danger, fontWeight: '700', marginBottom: 12 }}>Produto indisponível no momento</Text>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 14, borderWidth: 1, borderColor: colors.border }}>
              <Button title="−" variant="outline" style={{ borderWidth: 0, paddingHorizontal: 16 }} onPress={() => setQtd(Math.max(1, qtd - 1))} />
              <Text style={{ fontSize: 18, fontWeight: '800', minWidth: 28, textAlign: 'center' }}>{qtd}</Text>
              <Button title="+" variant="outline" style={{ borderWidth: 0, paddingHorizontal: 16 }} onPress={() => setQtd(qtd + 1)} />
            </View>
            <Button
              title="Adicionar ao carrinho"
              icon="cart-outline"
              style={{ flex: 1 }}
              onPress={() => { adicionar(produto, qtd); Alert.alert('Adicionado!', `${qtd}x ${produto.nome} no carrinho.`); }}
            />
          </View>
        )}

        {ehAdministrador ? (
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
            <Button title="Editar" icon="create-outline" variant="outline" style={{ flex: 1 }} onPress={() => navigation.navigate('ProdutoForm', { produto })} />
            <Button title="Excluir" icon="trash-outline" variant="danger" style={{ flex: 1 }} onPress={excluir} />
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}
