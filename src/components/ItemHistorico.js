// src/components/ItemHistorico.js
// Linha da lista de consultas recentes.
// Ao ser tocada, reexibe a resposta salva sem consultar a API novamente.

import { Pressable, View, Text, StyleSheet } from 'react-native';
import { cores, raio } from '../theme/cores';

export default function ItemHistorico({ pergunta, nivel, aoTocar }) {
  return (
    <Pressable style={estilos.item} onPress={aoTocar}>
      <View style={estilos.conteudo}>
        <Text style={estilos.pergunta} numberOfLines={1}>
          {pergunta}
        </Text>
        <Text style={estilos.nivel}>{nivel}</Text>
      </View>
      <Text style={estilos.seta}>›</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raio,
    padding: 12,
    marginBottom: 8,
    backgroundColor: cores.superficie,
  },
  conteudo: { flex: 1 },
  // numberOfLines={1} acima corta perguntas longas com reticencias
  pergunta: { fontSize: 13, color: cores.textoPrimario },
  nivel: { fontSize: 11, color: cores.textoSecundario, marginTop: 2 },
  seta: { fontSize: 20, color: cores.textoSecundario, marginLeft: 8 },
});