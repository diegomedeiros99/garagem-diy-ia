// src/screens/HomeScreen.js
// Tela principal. Alterna entre o formulário de entrada e o resultado,
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
  ActivityIndicator,
} from 'react-native';

import Chip from '../components/Chip';
import CardResultado from '../components/CardResultado';
import { consultarMecanico } from '../services/aiService';

// Níveis de experiência. O valor escolhido é enviado à IA,
// que adapta a linguagem e a profundidade da resposta.
const NIVEIS = ['Iniciante', 'Intermediário', 'Avançado'];

// Exemplos clicáveis que preenchem o campo de texto.
const EXEMPLOS = [
  'Parafuso da roda travado',
  'Retoque de pintura no para-choque',
];

export default function HomeScreen() {
  const [entrada, setEntrada] = useState('');
  const [nivel, setNivel] = useState(NIVEIS[0]);
  const [resposta, setResposta] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  // Envia a consulta à IA e trata os três desfechos possíveis:
  // sucesso, falha, e o encerramento do carregamento em qualquer caso.
  async function consultar() {
    if (entrada.trim() === '') return; // ignora consulta vazia

    setCarregando(true);
    setErro('');

    try {
      const resultado = await consultarMecanico(entrada, nivel);
      setResposta(resultado);
    }  catch (e) {
      console.log('Erro na consulta:', e.message);

      // A API sinaliza sobrecarga temporária com "high demand".
      // Nesse caso o problema não é a conexão do usuário.
      if (e.message && e.message.includes('high demand')) {
        setErro('O serviço está sobrecarregado no momento. Tente novamente em alguns instantes.');
      } else {
        setErro('Não foi possível consultar agora. Verifique sua conexão e tente novamente.');
      }
    } finally {
      // Executa em qualquer caso, garantindo que o botão volte ao normal.
      setCarregando(false);
    }
  }

  // Volta para a tela de entrada
  function novaConsulta() {
    setResposta(null);
    setEntrada('');
    setErro('');
  }

  return (
    <SafeAreaView style={estilos.tela}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <Text style={estilos.titulo}>Garagem DIY IA</Text>
        <Text style={estilos.subtitulo}>Seu mecânico de bolso</Text>

        {resposta === null ? (
          // ----- TELA DE ENTRADA -----
          <View>
            <TextInput
              style={estilos.campo}
              placeholder="Descreva o problema ou o que você quer fazer no carro..."
              placeholderTextColor="#9a9a9a"
              multiline
              value={entrada}
              onChangeText={setEntrada}
            />

            <Text style={estilos.rotulo}>Seu nível</Text>
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

            {erro !== '' && <Text style={estilos.erro}>{erro}</Text>}

            <Pressable
              style={[estilos.botao, carregando && estilos.botaoInativo]}
              onPress={consultar}
              disabled={carregando} // impede toque duplo durante a consulta
            >
              {carregando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={estilos.botaoTexto}>Consultar mecânico</Text>
              )}
            </Pressable>
          </View>
        ) : (
          // ----- TELA DE RESULTADO -----
          <View>
                       <CardResultado
              titulo="Alerta de segurança"
              texto={resposta.alerta}
              variante="alerta"
              icone="⚠"
            />
            <CardResultado titulo="Materiais" texto={resposta.materiais} />
            <CardResultado titulo="Passo a passo" texto={resposta.passos} />
            <CardResultado
              titulo="Dica de ouro"
              texto={resposta.dica}
              variante="destaque"
              icone="💡"
            />

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
  conteudo: { padding: 20, paddingBottom: 80 },

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
    textAlignVertical: 'top', // Android: texto começa no topo do campo
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
  botaoInativo: { opacity: 0.6 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },

  erro: {
    color: '#a32d2d',
    fontSize: 13,
    marginTop: 16,
    textAlign: 'center',
  },
});