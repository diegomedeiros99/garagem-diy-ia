// src/screens/HomeScreen.js
// Tela principal. Alterna entre o formulário de entrada e o resultado,
// conforme o estado "resposta" esteja vazio ou preenchido.

import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BackHandler,
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
import ItemHistorico from '../components/ItemHistorico';
import { consultarMecanico } from '../services/aiService';
import { lerHistorico, salvarConsulta, excluirConsulta } from '../services/historico';
import { cores, raio } from '../theme/cores';

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
  const [historico, setHistorico] = useState([]);

  // Carrega o histórico salvo quando a tela abre pela primeira vez.
  // O array vazio como segundo argumento faz isso rodar uma unica vez.
  useEffect(() => {
    lerHistorico().then(setHistorico);
  }, []);

  // Intercepta o botão físico de voltar do Android.
  // Estando na tela de resultado, retorna a entrada em vez de fechar o app.
  // No iOS não há botão equivalente, entao este efeito não surte efeito la.
  useEffect(() => {
    const inscricao = BackHandler.addEventListener('hardwareBackPress', () => {
      if (resposta !== null) {
        novaConsulta();
        return true; // informa ao Android que o evento foi tratado
      }
      return false; // na tela inicial, mantem o comportamento padrao
    });

    // Remove o ouvinte quando a tela e desmontada, evitando vazamento
    return () => inscricao.remove();
  }, [resposta]);

  // Envia a consulta à IA e trata os três desfechos possíveis:
  // sucesso, falha, e o encerramento do carregamento em qualquer caso.
  async function consultar() {
    if (entrada.trim() === '') return; // ignora consulta vazia

    setCarregando(true);
    setErro('');

    try {
      const resultado = await consultarMecanico(entrada, nivel);
      setResposta(resultado);

      // Guarda a consulta e atualiza a lista exibida na tela
      const lista = await salvarConsulta(entrada, nivel, resultado);
      setHistorico(lista);
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

  // Reexibe uma consulta anterior sem chamar a API.
  function abrirDoHistorico(item) {
    setResposta(item.resposta);
    setErro('');
  }

  // Remove uma consulta salva e atualiza a lista na tela.
  async function removerDoHistorico(id) {
    const lista = await excluirConsulta(id);
    setHistorico(lista);
  }

  return (
    <SafeAreaView style={estilos.tela}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <Text style={estilos.titulo}>Garagem DIY IA</Text>
        <Text style={estilos.subtitulo}>Guia, materiais e dicas para o seu projeto</Text>

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

            {historico.length > 0 && (
              <View>
                <Text style={estilos.rotulo}>Consultas recentes</Text>
                {historico.map((item) => (
                  <ItemHistorico
                    key={item.id}
                    pergunta={item.pergunta}
                    nivel={item.nivel}
                    aoTocar={() => abrirDoHistorico(item)}
                    aoExcluir={() => removerDoHistorico(item.id)}
                  />
                ))}
              </View>
            )}

            {erro !== '' && <Text style={estilos.erro}>{erro}</Text>}

            <Pressable
              style={[estilos.botao, carregando && estilos.botaoInativo]}
              onPress={consultar}
              disabled={carregando} // impede toque duplo durante a consulta
            >
              {carregando ? (
                <View style={estilos.linhaCarregando}>
                  <ActivityIndicator color={cores.superficie} />
                  <Text style={estilos.botaoTexto}>Consultando...</Text>
                </View>
              ) : (
                <Text style={estilos.botaoTexto}>Gerar guia</Text>
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
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 20, paddingBottom: 24 },

  titulo: { fontSize: 24, fontWeight: '600', color: cores.textoPrimario, marginTop: 20 },
  subtitulo: { fontSize: 14, color: cores.textoSecundario, marginBottom: 24 },

  campo: {
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raio,
    padding: 12,
    minHeight: 90,
    fontSize: 15,
    backgroundColor: cores.superficie,
    textAlignVertical: 'top', // Android: texto começa no topo do campo
  },

  rotulo: { fontSize: 13, color: cores.textoSecundario, marginTop: 20, marginBottom: 8 },
  linhaChips: { flexDirection: 'row', gap: 8 },

  botao: {
    backgroundColor: cores.primaria,
    borderRadius: raio,
    padding: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  botaoInativo: { opacity: 0.6 },
  botaoTexto: { color: cores.superficie, fontSize: 16, fontWeight: '600' },
  linhaCarregando: { flexDirection: 'row', alignItems: 'center', gap: 10 },

  erro: {
    color: cores.alertaTitulo,
    fontSize: 13,
    marginTop: 16,
    textAlign: 'center',
  },
});