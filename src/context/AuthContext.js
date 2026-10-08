import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as api from '../services/api';

const ContextoAutenticacao = createContext(null);
export const useAutenticacao = () => useContext(ContextoAutenticacao);

export function AuthProvider({ children }) {
  const [carregando, setCarregando] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [visitante, setVisitante] = useState(false);

  useEffect(() => {
    (async () => {
      await api.loadBaseUrl();
      const dadosSalvos = await AsyncStorage.getItem('@auth');
      if (dadosSalvos) {
        const { token, usuario } = JSON.parse(dadosSalvos);
        api.setToken(token);
        setUsuario(usuario);
      }
      setCarregando(false);
    })();
  }, []);

  const entrar = async (email, senha) => {
    const { token, usuario } = await api.login({ email, senha });
    api.setToken(token);
    setUsuario(usuario);
    setVisitante(false);
    await AsyncStorage.setItem('@auth', JSON.stringify({ token, usuario }));
  };

  const sair = async () => {
    api.setToken(null);
    setUsuario(null);
    setVisitante(false);
    await AsyncStorage.removeItem('@auth');
  };

  const value = {
    carregando,
    usuario,
    visitante,
    ehAdministrador: usuario?.papel === 'admin',
    entrarComoVisitante: () => setVisitante(true),
    entrar,
    sair,
  };
  return <ContextoAutenticacao.Provider value={value}>{children}</ContextoAutenticacao.Provider>;
}
