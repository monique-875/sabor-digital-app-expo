import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input, styles } from '../components/ui';
import { atualizarProduto, criarProduto, imageUrl } from '../api';
import { colors } from '../theme';

export default function ProdutoFormScreen({ route, navigation }) {
  const editando = route.params?.produto;
  const [nome, setNome] = useState(editando?.nome || '');
  const [descricao, setDescricao] = useState(editando?.descricao || '');
  const [preco, setPreco] = useState(editando ? String(editando.preco) : '');
  const [categoria, setCategoria] = useState(editando?.categoria || '');
  const [disponivel, setDisponivel] = useState(editando ? !(editando.disponivel === 0 || editando.disponivel === false) : true);
  const [imagem, setImagem] = useState(null); // nova imagem escolhida
  const [salvando, setSalvando] = useState(false);

  const escolherImagem = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return Alert.alert('Permissão', 'Precisamos de acesso à galeria.');
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (!r.canceled) setImagem(r.assets[0]);
  };

  const salvar = async () => {
    if (!nome || !preco) return Alert.alert('Atenção', 'Nome e preço são obrigatórios.');
    setSalvando(true);
    try {
      const valores = { nome, descricao, preco, categoria, disponivel, imagem };
      if (editando) await atualizarProduto(editando.id, valores);
      else await criarProduto(valores);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro ao salvar', e.message);
    } finally {
      setSalvando(false);
    }
  };

  const preview = imagem?.uri || imageUrl(editando?.imagem);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
      <Pressable
        onPress={escolherImagem}
        style={{ height: 180, borderRadius: 18, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.border, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 16, backgroundColor: colors.card }}
      >
        {preview ? (
          <Image source={{ uri: preview }} style={{ width: '100%', height: '100%' }} />
        ) : (
          <>
            <Ionicons name="camera-outline" size={36} color={colors.muted} />
            <Text style={styles.muted}>Toque para escolher a imagem (JPG/PNG, até 5MB)</Text>
          </>
        )}
      </Pressable>

      <Input label="Nome" value={nome} onChangeText={setNome} />
      <Input label="Descrição" value={descricao} onChangeText={setDescricao} multiline />
      <Input label="Preço (R$)" value={preco} onChangeText={setPreco} keyboardType="decimal-pad" placeholder="0,00" />
      <Input label="Categoria" value={categoria} onChangeText={setCategoria} placeholder="Ex.: Pratos, Bebidas, Sobremesas" />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Text style={styles.label}>Disponível</Text>
        <Switch value={disponivel} onValueChange={setDisponivel} trackColor={{ true: colors.secondary }} />
      </View>

      <Button title={editando ? 'Salvar alterações' : 'Cadastrar produto'} onPress={salvar} loading={salvando} />
    </ScrollView>
  );
}
