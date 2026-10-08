import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { AuthProvider, useAutenticacao } from './src/context/AuthContext';
import { CartProvider, useCarrinho } from './src/context/CartContext';
import { colors } from './src/theme';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ProdutosScreen from './src/screens/ProdutosScreen';
import ProdutoDetalheScreen from './src/screens/ProdutoDetalheScreen';
import ProdutoFormScreen from './src/screens/ProdutoFormScreen';
import CardapiosScreen from './src/screens/CardapiosScreen';
import CardapioDetalheScreen from './src/screens/CardapioDetalheScreen';
import CardapioFormScreen from './src/screens/CardapioFormScreen';
import CarrinhoScreen from './src/screens/CarrinhoScreen';
import PedidosScreen from './src/screens/PedidosScreen';
import PedidoDetalheScreen from './src/screens/PedidoDetalheScreen';
import PerfilScreen from './src/screens/PerfilScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const navTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.bg, primary: colors.primary } };
const headerOpts = {
  headerStyle: { backgroundColor: colors.bg },
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: '800' },
  headerShadowVisible: false,
};

function NavegacaoAbas() {
  const { quantidadeItens } = useCarrinho();
  const icons = {
    Produtos: 'fast-food',
    Cardápios: 'book',
    Carrinho: 'cart',
    Pedidos: 'receipt',
    Perfil: 'person',
  };
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...headerOpts,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarIcon: ({ color, size }) => <Ionicons name={icons[route.name]} size={size} color={color} />,
      })}
    >
      <Tab.Screen name="Produtos" component={ProdutosScreen} options={{ title: 'Sabor Digital' , tabBarLabel: 'Produtos' }} />
      <Tab.Screen name="Cardápios" component={CardapiosScreen} />
      <Tab.Screen name="Carrinho" component={CarrinhoScreen} options={{ tabBarBadge: quantidadeItens > 0 ? quantidadeItens : undefined, tabBarBadgeStyle: { backgroundColor: colors.primary } }} />
      <Tab.Screen name="Pedidos" component={PedidosScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}

function Rotas() {
  const { carregando, usuario, visitante } = useAutenticacao();

  if (carregando) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!usuario && !visitante) {
    return (
      <Stack.Navigator screenOptions={headerOpts}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Criar conta' }} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={headerOpts}>
      <Stack.Screen name="Tabs" component={NavegacaoAbas} options={{ headerShown: false }} />
      <Stack.Screen name="ProdutoDetalhe" component={ProdutoDetalheScreen} options={{ title: 'Produto' }} />
      <Stack.Screen name="ProdutoForm" component={ProdutoFormScreen} options={({ route }) => ({ title: route.params?.produto ? 'Editar produto' : 'Novo produto' })} />
      <Stack.Screen name="CardapioDetalhe" component={CardapioDetalheScreen} options={{ title: 'Cardápio' }} />
      <Stack.Screen name="CardapioForm" component={CardapioFormScreen} options={{ title: 'Novo cardápio' }} />
      <Stack.Screen name="PedidoDetalhe" component={PedidoDetalheScreen} options={{ title: 'Pedido' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="dark" />
          <Rotas />
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
}
