// src/screens/HomeScreen.js
// Tela principal. Alterna entre o formulario de entrada e o resultado,
// conforme o estado "resposta" esteja vazio ou preenchido.

import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  StatusBar,
} from 'react-native';

import Chip from '../components/Chip';
import CardResultado from '../components/CardResultado';
import { consultarMecanico } from '../services/aiService';

const NIVEIS = ['Iniciante', 'Intermediario', 'Avancado'];

const EXEMPLOS = [
  'Parafuso da roda travado',
  'Retoque de pintura no para-choque',
];

export default function HomeScreen() {
  const [entrada, setEntrada] = useState('');
  const [nivel, setNivel] = useState(NIVEIS[0]);
  const [resposta, setResposta] = useState(null);

  async function consultar() {
    if (entrada.trim() === '') return; // ignora consulta vazia
    const resultado = await consultarMecanico(entrada, nivel);
    setResposta(resultado);
  }

  function novaConsulta() {
    setResposta(null);
    setEntrada('');
  }

  return (
    <SafeAreaView style={estilos.tela}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <Text style={estilos.titulo}>Garagem DIY IA</Text>
        <Text style={estilos.subtitulo}>Seu mecânico de bolso</Text>

        {resposta === null ? (
          <View>
            <TextInput
              style={estilos.campo}
              placeholder="Descreva o problema ou o que você quer fazer no carro..."
              placeholderTextColor="#9a9a9a"
              multiline
              value={entrada}
              onChangeText={setEntrada}
            />

            <Text style={estilos.rotulo}>Seu nivel</Text>
            <View style={estilos.linhaChips}>
              {NIVEIS.map((item) => (
                <Chip
                  key={item}
                  texto={item}
                  ativo={nivel === item}
                  aoTocar={() => setNivel(item)}
                />
              ))}
            </View>

            <Text style={estilos.rotulo}>Exemplos</Text>
            {EXEMPLOS.map((item) => (
              <Chip
                key={item}
                texto={item}
                largura
                aoTocar={() => setEntrada(item)}
              />
            ))}

            <Pressable style={estilos.botao} onPress={consultar}>
              <Text style={estilos.botaoTexto}>Consultar mecânico</Text>
            </Pressable>
          </View>
        ) : (
          <View>
            <CardResultado
              titulo="Alerta de segurança"
              texto={resposta.alerta}
              alerta
            />
            <CardResultado titulo="Materiais" texto={resposta.materiais} />
            <CardResultado titulo="Passo a passo" texto={resposta.passos} />
            <CardResultado titulo="Dica de ouro" texto={resposta.dica} />

            <Pressable style={estilos.botao} onPress={novaConsulta}>
              <Text style={estilos.botaoTexto}>Nova consulta</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#f5f5f0' },
  conteudo: { padding: 20, paddingBottom: 40 },
  titulo: { fontSize: 24, fontWeight: '600', color: '#1a1a1a', marginTop: 20 },
  subtitulo: { fontSize: 14, color: '#666', marginBottom: 24 },
  campo: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 90,
    fontSize: 15,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  rotulo: { fontSize: 13, color: '#666', marginTop: 20, marginBottom: 8 },
  linhaChips: { flexDirection: 'row', gap: 8 },
  botao: {
    backgroundColor: '#1a4d7a',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },
});