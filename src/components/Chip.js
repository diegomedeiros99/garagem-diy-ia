// src/components/Chip.js
// Botão pequeno usado tanto na seleção de nível quanto nos exemplos.

import { Pressable, Text, StyleSheet } from 'react-native';
import { cores, raio } from '../theme/cores';

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
    borderRadius: raio,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  largo: { width: '100%', marginBottom: 8 },
  ativo: { backgroundColor: cores.primaria, borderColor: cores.primaria },
  texto: { fontSize: 13, color: cores.textoChip },
  textoAtivo: { color: cores.superficie },
});