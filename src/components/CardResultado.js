// src/components/CardResultado.js
// Card reutilizável usado nos quatro blocos da resposta.
// A propriedade "variante" define o estilo: padrão, alerta (vermelho)
// ou destaque (âmbar, usado na dica de ouro).

import { View, Text, StyleSheet } from 'react-native';
import { cores, raioCard } from '../theme/cores';

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
    backgroundColor: cores.superficie,
    borderRadius: raioCard,
    borderWidth: 1,
    borderColor: cores.bordaCard,
    padding: 16,
    marginBottom: 12,
  },
  cardAlerta: { backgroundColor: cores.alertaFundo, borderColor: cores.alertaBorda },
  cardDestaque: {
    backgroundColor: cores.destaqueFundo,
    borderColor: cores.destaqueBorda,
    borderLeftWidth: 4, // faixa lateral que reforça o destaque
    borderLeftColor: cores.destaqueFaixa,
  },

  cabecalho: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  icone: { fontSize: 16, marginRight: 8, color: cores.textoPrimario },
  iconeAlerta: { color: cores.alertaTitulo },
  iconeDestaque: { color: cores.destaqueTitulo },

  titulo: { fontSize: 15, fontWeight: '600', color: cores.textoPrimario },
  tituloAlerta: { color: cores.alertaTitulo },
  tituloDestaque: { color: cores.destaqueTitulo },

  texto: { fontSize: 14, color: cores.textoCorpo, lineHeight: 22 },
  textoAlerta: { color: cores.alertaTexto },
  textoDestaque: { color: cores.destaqueTexto },
});