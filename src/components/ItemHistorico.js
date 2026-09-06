// src/components/ItemHistorico.js
// Linha da lista de consultas recentes.
// Tocar na linha reexibe a resposta salva; o botao lateral remove o item.

import { Pressable, View, Text, StyleSheet } from 'react-native';
import { cores, raio } from '../theme/cores';

export default function ItemHistorico({ pergunta, nivel, aoTocar, aoExcluir }) {
  return (
    <View style={estilos.item}>
      <Pressable style={estilos.conteudo} onPress={aoTocar}>
        <Text style={estilos.pergunta} numberOfLines={1}>
          {pergunta}
        </Text>
        <Text style={estilos.nivel}>{nivel}</Text>
      </Pressable>

      <Pressable style={estilos.botaoExcluir} onPress={aoExcluir}>
        <Text style={estilos.textoExcluir}>✕</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raio,
    marginBottom: 8,
    backgroundColor: cores.superficie,
  },
  conteudo: { flex: 1, padding: 12 },
  pergunta: { fontSize: 13, color: cores.textoPrimario },
  nivel: { fontSize: 11, color: cores.textoSecundario, marginTop: 2 },
  // área de toque generosa para o dedo não errar o alvo
  botaoExcluir: { paddingHorizontal: 14, paddingVertical: 14 },
  textoExcluir: { fontSize: 16, color: cores.textoSecundario },
});
