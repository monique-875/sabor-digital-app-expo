import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input, styles } from '../components/ui';
import ServerConfig from '../components/ServerConfig';
import { useAutenticacao } from '../context/AuthContext';
import { colors } from '../theme';

export default function LoginScreen({ navigation }) {
  const { entrar, entrarComoVisitante } = useAutenticacao();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [entrando, setEntrando] = useState(false);

  const fazerLogin = async () => {
    if (!email || !senha) return Alert.alert('Atenção', 'Informe e-mail e senha.');
    setEntrando(true);
    try {
      await entrar(email.trim(), senha);
    } catch (e) {
      Alert.alert('Não foi possível entrar', e.message);
    } finally {
      setEntrando(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 72 }} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', marginBottom: 28 }}>
          <View style={{ backgroundColor: colors.primary, width: 84, height: 84, borderRadius: 42, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="restaurant" size={42} color="#fff" />
          </View>
          <Text style={{ fontSize: 30, fontWeight: '900', color: colors.text, marginTop: 14 }}>Sabor Digital</Text>
          <Text style={styles.muted}>Do cardápio à mesa, num toque.</Text>
        </View>

        <Input label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="voce@email.com" />
        <Input label="Senha" value={senha} onChangeText={setSenha} secureTextEntry placeholder="••••••" />
        <Button title="Entrar" onPress={fazerLogin} loading={entrando} />
        <Button title="Criar conta" variant="outline" style={{ marginTop: 10 }} onPress={() => navigation.navigate('Register')} />
        <Button title="Continuar sem login" variant="outline" style={{ marginTop: 10, borderWidth: 0 }} onPress={entrarComoVisitante} />

        <ServerConfig />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
