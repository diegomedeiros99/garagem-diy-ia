// src/components/CardResultado.js
// Card reutilizável usado nos quatro blocos da resposta.
// A propriedade "variante" define o estilo: padrão, alerta (vermelho)
// ou destaque (âmbar, usado na dica de ouro).

import { View, Text, StyleSheet } from 'react-native';

export default function CardResultado({ titulo, texto, variante = 'padrao', icone }) {
  const ehAlerta = variante === 'alerta';
  const ehDestaque = variante === 'destaque';

  return (
    <View
      style={[
        estilos.card,
        ehAlerta && estilos.cardAlerta,
        ehDestaque && estilos.cardDestaque,
      ]}
    >
      <View style={estilos.cabecalho}>
        {icone && (
          <Text
            style={[
              estilos.icone,
              ehAlerta && estilos.iconeAlerta,
              ehDestaque && estilos.iconeDestaque,
            ]}
          >
            {icone}
          </Text>
        )}
        <Text
          style={[
            estilos.titulo,
            ehAlerta && estilos.tituloAlerta,
            ehDestaque && estilos.tituloDestaque,
          ]}
        >
          {titulo}
        </Text>
      </View>

      <Text
        style={[
          estilos.texto,
          ehAlerta && estilos.textoAlerta,
          ehDestaque && estilos.textoDestaque,
        ]}
      >
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
  cardDestaque: {
    backgroundColor: '#fdf6e8',
    borderColor: '#e8cf9a',
    borderLeftWidth: 4, // faixa lateral que reforça o destaque
    borderLeftColor: '#c98a15',
  },

  cabecalho: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  icone: { fontSize: 16, marginRight: 8, color: '#1a1a1a' },
  iconeAlerta: { color: '#a32d2d' },
  iconeDestaque: { color: '#8a5c06' },

  titulo: { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  tituloAlerta: { color: '#a32d2d' },
  tituloDestaque: { color: '#8a5c06' },

  texto: { fontSize: 14, color: '#444', lineHeight: 22 },
  textoAlerta: { color: '#8b2626' },
  textoDestaque: { color: '#6b4a08' },
});