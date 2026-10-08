import React from 'react';
import { FlatList, Text } from 'react-native';
import { Empty, ErrorView, Loading, ProdutoCard, styles } from '../components/ui';
import { listarProdutos } from '../services/api';
import { useCarregarDados } from '../hooks';
import { useCarrinho } from '../context/CartContext';
import { colors } from '../theme';

export default function CardapiosScreen({ navigation }) {
  const { adicionar } = useCarrinho();
  const { dados, carregando, erro, atualizando, carregarNovamente } = useCarregarDados(listarProdutos);

  if (carregando) return <Loading />;
  if (erro) return <ErrorView message={erro} onRetry={carregarNovamente} />;

  return (
    <FlatList
      style={styles.screen}
      data={Array.isArray(dados) ? dados : []}
      keyExtractor={(produto) => String(produto.id)}
      contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      refreshing={atualizando}
      onRefresh={carregarNovamente}
      ListHeaderComponent={
        <Text style={[styles.muted, { color: colors.text, marginBottom: 14 }]}>
          Pratos cadastrados na API. Toque em um prato para ver os detalhes ou no + para adicioná-lo à sacola.
        </Text>
      }
      ListEmptyComponent={<Empty icon="book-outline" text="Ainda não há pratos cadastrados na API." />}
      renderItem={({ item }) => (
        <ProdutoCard
          produto={item}
          onPress={() => navigation.navigate('ProdutoDetalhe', { id: item.id })}
          onAdd={() => adicionar(item)}
        />
      )}
    />
  );
}
