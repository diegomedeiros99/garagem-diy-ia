// src/components/CardResultado.js
// Card reutilizavel usado nos quatro blocos da resposta.
// A propriedade "alerta" muda as cores para o padrao de aviso.

import { View, Text, StyleSheet } from 'react-native';

export default function CardResultado({ titulo, texto, alerta = false }) {
  return (
    <View style={[estilos.card, alerta && estilos.cardAlerta]}>
      <Text style={[estilos.titulo, alerta && estilos.tituloAlerta]}>
        {titulo}
      </Text>
      <Text style={[estilos.texto, alerta && estilos.textoAlerta]}>
        {texto}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    padding: 16,
    marginBottom: 12,
  },
  cardAlerta: { backgroundColor: '#fdeaea', borderColor: '#e8b4b4' },
  titulo: { fontSize: 15, fontWeight: '600', color: '#1a1a1a', marginBottom: 8 },
  tituloAlerta: { color: '#a32d2d' },
  texto: { fontSize: 14, color: '#444', lineHeight: 22 },
  textoAlerta: { color: '#8b2626' },
});