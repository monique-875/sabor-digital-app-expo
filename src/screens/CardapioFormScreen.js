import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, ErrorView, Input, Loading, ProdutoImage, styles } from '../components/ui';
import { criarCardapio, listarProdutos } from '../api';
import { useCarregarDados } from '../hooks';
import { colors, money } from '../theme';

export default function CardapioFormScreen({ navigation }) {
  const { dados, carregando, erro, carregarNovamente } = useCarregarDados(listarProdutos);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [disponivel, setDisponivel] = useState(true);
  const [selecionados, setSelecionados] = useState([]);
  const [salvando, setSalvando] = useState(false);

  const toggle = (id) =>
    setSelecionados((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const salvar = async () => {
    if (!nome) return Alert.alert('Atenção', 'Dê um nome ao cardápio.');
    if (selecionados.length === 0) return Alert.alert('Atenção', 'Selecione ao menos um produto.');
    setSalvando(true);
    try {
      await criarCardapio({ nome, descricao, disponivel, produtos: selecionados });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro ao salvar', e.message);
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) return <Loading />;
  if (erro) return <ErrorView message={erro} onRetry={carregarNovamente} />;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
      <Input label="Nome" value={nome} onChangeText={setNome} placeholder="Ex.: Almoço executivo" />
      <Input label="Descrição" value={descricao} onChangeText={setDescricao} multiline />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={styles.label}>Disponível</Text>
        <Switch value={disponivel} onValueChange={setDisponivel} trackColor={{ true: colors.secondary }} />
      </View>

      <Text style={styles.section}>Produtos ({selecionados.length})</Text>
      {(Array.isArray(dados) ? dados : []).map((p) => {
        const on = selecionados.includes(p.id);
        return (
          <Pressable
            key={p.id}
            onPress={() => toggle(p.id)}
            style={[styles.card, { alignItems: 'center', borderWidth: 2, borderColor: on ? colors.primary : 'transparent' }]}
          >
            <ProdutoImage path={p.imagem} size={52} style={{ borderRadius: 12 }} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.title}>{p.nome}</Text>
              <Text style={styles.muted}>{money(p.preco)}</Text>
            </View>
            <Ionicons name={on ? 'checkmark-circle' : 'ellipse-outline'} size={26} color={on ? colors.primary : colors.border} />
          </Pressable>
        );
      })}

      <Button title="Criar cardápio" onPress={salvar} loading={salvando} style={{ marginTop: 8 }} />
    </ScrollView>
  );
}
