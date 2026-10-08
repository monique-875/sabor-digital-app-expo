import React, { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { Button, Input, styles } from '../components/ui';
import { registrar } from '../services/api';
import { useAutenticacao } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { entrar } = useAutenticacao();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cadastrando, setCadastrando] = useState(false);

  const criar = async () => {
    if (!nome || !email || !senha) return Alert.alert('Atenção', 'Preencha todos os campos.');
    setCadastrando(true);
    try {
      await registrar({ nome: nome.trim(), email: email.trim(), senha, papel: 'cliente' });
      await entrar(email.trim(), senha); // já entra logado
    } catch (e) {
      Alert.alert('Erro ao cadastrar', e.message);
      setCadastrando(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
      <Input label="Nome" value={nome} onChangeText={setNome} placeholder="Seu nome" />
      <Input label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <Input label="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
      <Button title="Cadastrar" onPress={criar} loading={cadastrando} />
    </ScrollView>
  );
}
