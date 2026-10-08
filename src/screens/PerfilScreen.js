import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, styles } from '../components/ui';
import ServerConfig from '../components/ServerConfig';
import { useAutenticacao } from '../context/AuthContext';
import { colors } from '../theme';

export default function PerfilScreen() {
  const { usuario, sair } = useAutenticacao();
  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 20 }}>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="person" size={42} color="#fff" />
        </View>
        <Text style={{ fontSize: 22, fontWeight: '800', marginTop: 10, color: colors.text }}>{usuario ? usuario.nome : 'Visitante'}</Text>
        <Text style={styles.muted}>{usuario ? `${usuario.email} · ${usuario.papel}` : 'Entre para ter acesso às funções de admin'}</Text>
      </View>

      <Button
        title={usuario ? 'Sair' : 'Fazer login'}
        variant={usuario ? 'danger' : 'primary'}
        icon={usuario ? 'log-out-outline' : 'log-in-outline'}
        onPress={sair}
      />
      <ServerConfig />
    </ScrollView>
  );
}
