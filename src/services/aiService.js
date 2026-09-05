// src/services/aiService.js
// Responsavel por obter a resposta do mecanico.
// A tela nao sabe de onde vem o dado - so chama esta funcao.
// No passo 2 o interior dela sera trocado pela chamada real a API.

// Resposta simulada, usada enquanto a integracao nao existe.
const RESPOSTA_FIXA = {
  alerta:
    'Nunca solte parafusos gripados com o carro suspenso no macaco. Faca o desaperto inicial com as rodas no chão e o freio de mão puxado.',
  materiais:
    'Cabo de forca de 1/2 polegada\nSoquete de impacto sextavado na medida exata\nDesengripante\nMartelo de borracha',
  passos:
    '1. Aplique o desengripante na base do parafuso e aguarde 15 minutos.\n2. Assente o soquete com batidas firmes do martelo de borracha.\n3. Posicione a alavanca quase horizontal em relacao ao solo.\n4. Aplique peso constante em vez de trancos.',
  dica:
    'Mantenha o soquete pressionado contra a roda com uma das maos. Isso evita que ele escape e arredonde a cabeca do parafuso.',
};

// Funcao assincrona desde ja, para que a tela nao precise mudar no passo 2.
export async function consultarMecanico(descricao, nivel) {
  return RESPOSTA_FIXA;
}