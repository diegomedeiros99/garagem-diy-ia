// src/services/historico.js
// Guarda as ultimas consultas no armazenamento local do aparelho.
// A tela não conhece o mecanismo de gravação - apenas chama estas funções.

import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE = '@garagem_historico';
const LIMITE = 3; // quantidade de consultas mantidas

// Lê a lista salva. Devolve array vazio se não houver nada
// ou se o conteudo estiver corrompido.
export async function lerHistorico() {
  try {
    const bruto = await AsyncStorage.getItem(CHAVE);
    if (bruto === null) return [];
    return JSON.parse(bruto);
  } catch (e) {
    return [];
  }
}

// Adiciona uma consulta ao inicio da lista e descarta as mais antigas.
// Devolve a lista atualizada para a tela exibir sem precisar reler.
export async function salvarConsulta(pergunta, nivel, resposta) {
  try {
    const atual = await lerHistorico();

    const nova = {
      id: String(Date.now()), // identificador único para a lista
      pergunta,
      nivel,
      resposta,
    };

    // slice mantem apenas os primeiros itens, descartando o excedente
    const atualizada = [nova, ...atual].slice(0, LIMITE);

    await AsyncStorage.setItem(CHAVE, JSON.stringify(atualizada));
    return atualizada;
  } catch (e) {
    // Falha ao gravar nao pode interromper o uso do aplicativo
    return await lerHistorico();
  }

}

// Remove uma consulta especifica pelo identificador.
// Devolve a lista atualizada para a tela exibir.
export async function excluirConsulta(id) {
  try {
    const atual = await lerHistorico();
    const atualizada = atual.filter((item) => item.id !== id);
    await AsyncStorage.setItem(CHAVE, JSON.stringify(atualizada));
    return atualizada;
  } catch (e) {
    return await lerHistorico();
  }
}