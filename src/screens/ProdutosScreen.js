import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Empty, ErrorView, Fab, Loading, ProdutoCard, styles } from '../components/ui';
import { listarProdutos } from '../api';
import { useCarregarDados } from '../hooks';
import { useAutenticacao } from '../context/AuthContext';
import { useCarrinho } from '../context/CartContext';
import { colors } from '../theme';

export default function ProdutosScreen({ navigation }) {
  const { ehAdministrador } = useAutenticacao();
  const { adicionar, quantidadeItens } = useCarrinho();
  const { dados, carregando, erro, atualizando, carregarNovamente } = useCarregarDados(listarProdutos);
  const [busca, setBusca] = useState('');
  const [cat, setCat] = useState('Todos');

  const lista = Array.isArray(dados) ? dados : [];
  const categorias = useMemo(() => ['Todos', ...new Set(lista.map((p) => p.categoria).filter(Boolean))], [lista]);
  const filtrados = lista.filter(
    (p) =>
      (cat === 'Todos' || p.categoria === cat) &&
      (p.nome || '').toLowerCase().includes(busca.toLowerCase())
  );

  if (carregando) return <Loading />;
  if (erro) return <ErrorView message={erro} onRetry={carregarNovamente} />;

  return (
    <View style={styles.screen}>
      <View style={{ padding: 16, paddingBottom: 4 }}>
      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate('Carrinho')}
        style={{ alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8 }}
      >
        <Ionicons name="cart-outline" size={20} color={colors.primary} />
        <Text style={{ color: colors.primary, fontWeight: '700' }}>
          Sacola ({quantidadeItens})
        </Text>
      </Pressable>
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 14, paddingHorizontal: 12, borderWidth: 1, borderColor: colors.border }}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Buscar comida ou bebida"
            placeholderTextColor={colors.muted}
            style={{ flex: 1, padding: 11, color: colors.text }}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
          {categorias.map((c) => (
            <Pressable
              key={c}
              onPress={() => setCat(c)}
              style={{
                paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8,
                backgroundColor: cat === c ? colors.primary : '#fff',
                borderWidth: 1, borderColor: cat === c ? colors.primary : colors.border,
              }}
            >
              <Text style={{ color: cat === c ? '#fff' : colors.text, fontWeight: '600' }}>{c}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtrados}
        keyExtractor={(p) => String(p.id)}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshing={atualizando}
        onRefresh={carregarNovamente}
        ListEmptyComponent={<Empty text="Nenhum produto encontrado" />}
        renderItem={({ item }) => (
          <ProdutoCard
            produto={item}
            onPress={() => navigation.navigate('ProdutoDetalhe', { id: item.id })}
            onAdd={() => adicionar(item)}
          />
        )}
      />
      {ehAdministrador ? <Fab onPress={() => navigation.navigate('ProdutoForm')} /> : null}
    </View>
  );
}
