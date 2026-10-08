import React from 'react';
import {
  ActivityIndicator, Image, Pressable, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, money, statusColors, statusLabels } from '../theme';
import { imageUrl } from '../api';

export function Button({ title, onPress, variant = 'primary', loading, disabled, icon, style }) {
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';
  const bg = isPrimary ? colors.primary : isDanger ? colors.danger : 'transparent';
  const fg = isPrimary || isDanger ? '#fff' : colors.primary;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, borderColor: isDanger ? colors.danger : colors.primary, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        variant === 'outline' && { borderWidth: 1.5 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {icon ? <Ionicons name={icon} size={18} color={fg} /> : null}
          <Text style={[styles.btnText, { color: fg }]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

export function Input({ label, style, ...props }) {
  return (
    <View style={{ marginBottom: 12 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.muted}
        style={[styles.input, props.multiline && { height: 90, textAlignVertical: 'top' }, style]}
        {...props}
      />
    </View>
  );
}

export function Loading() {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

export function ErrorView({ message, onRetry }) {
  return (
    <View style={styles.center}>
      <Ionicons name="cloud-offline-outline" size={48} color={colors.muted} />
      <Text style={[styles.muted, { textAlign: 'center', marginVertical: 12 }]}>{message}</Text>
      {onRetry ? <Button title="Tentar de novo" variant="outline" onPress={onRetry} /> : null}
    </View>
  );
}

export function Empty({ icon = 'restaurant-outline', text }) {
  return (
    <View style={styles.center}>
      <Ionicons name={icon} size={48} color={colors.border} />
      <Text style={[styles.muted, { marginTop: 8 }]}>{text}</Text>
    </View>
  );
}

export function Fab({ onPress, icon = 'add' }) {
  return (
    <Pressable onPress={onPress} style={styles.fab}>
      <Ionicons name={icon} size={28} color="#fff" />
    </Pressable>
  );
}

export function ProdutoImage({ path, size = 80, style }) {
  const uri = imageUrl(path);
  if (!uri) {
    return (
      <View style={[{ width: size, height: size, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' }, style]}>
        <Ionicons name="fast-food-outline" size={size * 0.4} color={colors.muted} />
      </View>
    );
  }
  return <Image source={{ uri }} style={[{ width: size, height: size }, style]} resizeMode="cover" />;
}

export function ProdutoCard({ produto, onPress, onAdd }) {
  const indisponivel = produto.disponivel === 0 || produto.disponivel === false;
  return (
    <View style={[styles.card, indisponivel && { opacity: 0.55 }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Ver ${produto.nome}`}
        onPress={onPress}
      >
        <ProdutoImage path={produto.imagem} size={92} style={{ borderRadius: 14 }} />
      </Pressable>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Ver ${produto.nome}`}>
          {produto.categoria ? <Text style={styles.chipText}>{produto.categoria}</Text> : null}
          <Text style={styles.title} numberOfLines={1}>{produto.nome}</Text>
          <Text style={styles.muted} numberOfLines={2}>{produto.descricao}</Text>
        </Pressable>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
          <Text style={styles.price}>{money(produto.preco)}</Text>
          {indisponivel ? (
            <Text style={[styles.muted, { fontStyle: 'italic' }]}>Indisponível</Text>
          ) : onAdd ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Adicionar ${produto.nome} ao carrinho`}
              onPress={onAdd}
              style={styles.addBtn}
              hitSlop={12}
            >
              <Ionicons name="add" size={20} color="#fff" />
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export function StatusBadge({ status }) {
  const c = statusColors[status] || colors.muted;
  return (
    <View style={{ backgroundColor: c + '22', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
      <Text style={{ color: c, fontWeight: '700', fontSize: 12 }}>{statusLabels[status] || status}</Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  muted: { color: colors.muted, fontSize: 13 },
  title: { color: colors.text, fontSize: 16, fontWeight: '700' },
  price: { color: colors.primary, fontSize: 16, fontWeight: '800' },
  label: { color: colors.text, fontWeight: '600', marginBottom: 4 },
  input: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 11, fontSize: 15, color: colors.text,
  },
  btn: { paddingVertical: 13, paddingHorizontal: 18, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontWeight: '700', fontSize: 15 },
  card: {
    flexDirection: 'row', backgroundColor: colors.card, borderRadius: 18, padding: 10, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  chipText: { color: colors.secondary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  addBtn: { backgroundColor: colors.primary, width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  fab: {
    position: 'absolute', right: 20, bottom: 24, width: 58, height: 58, borderRadius: 29,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', elevation: 6,
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
  },
  screen: { flex: 1, backgroundColor: colors.bg },
  section: { fontSize: 18, fontWeight: '800', color: colors.text, marginTop: 8, marginBottom: 8 },
});
