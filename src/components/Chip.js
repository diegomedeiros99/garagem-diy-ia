// src/components/Chip.js
// Botao pequeno usado tanto na selecao de nivel quanto nos exemplos.

import { Pressable, Text, StyleSheet } from 'react-native';

export default function Chip({ texto, ativo = false, largura, aoTocar }) {
  return (
    <Pressable
      onPress={aoTocar}
      style={[estilos.chip, ativo && estilos.ativo, largura && estilos.largo]}
    >
      <Text style={[estilos.texto, ativo && estilos.textoAtivo]}>{texto}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  largo: { width: '100%', marginBottom: 8 },
  ativo: { backgroundColor: '#1a4d7a', borderColor: '#1a4d7a' },
  texto: { fontSize: 13, color: '#555' },
  textoAtivo: { color: '#fff' },
});