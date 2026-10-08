import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { Button, Input, styles } from './ui';
import { getBaseUrl, saveBaseUrl } from '../services/api';

export default function ServerConfig() {
  const [url, setUrl] = useState(getBaseUrl());
  return (
    <View style={{ marginTop: 8 }}>
      <Text style={styles.section}>Servidor</Text>
      <Input
        label="Endereço da API"
        value={url}
        onChangeText={setUrl}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        placeholder="http://192.168.0.10:3000"
      />
      <Button
        title="Salvar endereço"
        variant="outline"
        icon="save-outline"
        onPress={async () => {
          await saveBaseUrl(url);
          Alert.alert('Pronto', `API apontando para ${getBaseUrl()}`);
        }}
      />
    </View>
  );
}
