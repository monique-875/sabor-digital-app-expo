import React from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { Button, Empty, ErrorView, Loading, ProdutoCard, styles } from '../components/ui';
import { buscarCardapio, excluirCardapio } from '../services/api';
import { useCarregarDados } from '../hooks';
import { useAutenticacao } from '../context/AuthContext';
import { useCarrinho } from '../context/CartContext';
import { colors } from '../theme';

export default function CardapioDetalheScreen({ route, navigation }) {
  const { id } = route.params;
  const { ehAdministrador } = useAutenticacao();
  const { adicionar } = useCarrinho();
  const { dados: cardapio, carregando, erro, carregarNovamente } = useCarregarDados(() => buscarCardapio(id), [id]);

  if (carregando) return <Loading />;
  if (erro || !cardapio) return <ErrorView message={erro || 'Cardápio não encontrado'} onRetry={carregarNovamente} />;

  const produtos = Array.isArray(cardapio.produtos) ? cardapio.produtos : [];

  const excluir = () =>
    Alert.alert('Excluir cardápio', `Remover "${cardapio.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive',
        onPress: async () => {
          try { await excluirCardapio(id); navigation.goBack(); }
          catch (e) { Alert.alert('Erro', e.message); }
        },
      },
    ]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 26, fontWeight: '900', color: colors.text }}>{cardapio.nome}</Text>
      <Text style={{ color: colors.muted, marginVertical: 6 }}>{cardapio.descricao}</Text>

      <Text style={styles.section}>Itens do cardápio</Text>
      {produtos.length === 0 ? (
        <Empty text="Este cardápio não tem produtos" />
      ) : (
        produtos.map((p) => (
          <ProdutoCard
            key={p.id}
            produto={p}
            onPress={() => navigation.navigate('ProdutoDetalhe', { id: p.id })}
            onAdd={() => adicionar(p)}
          />
        ))
      )}

      {ehAdministrador ? (
        <View style={{ marginTop: 12 }}>
          <Button title="Excluir cardápio" icon="trash-outline" variant="danger" onPress={excluir} />
        </View>
      ) : null}
    </ScrollView>
  );
}
