// src/services/aiService.js
// Comunicação com a API do Google Gemini.
// A tela chama consultarMecanico() e recebe um objeto com quatro campos.
// Nenhum componente visual conhece detalhes da API - toda a integração vive aqui.

// A chave vem do arquivo .env (nunca fica escrita no codigo).
const CHAVE = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

const URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=' +
  CHAVE;


  // Instrucoes fixas que definem o comportamento do modelo.
const INSTRUCOES = `Voce e um especialista em mecanica automotiva e customizacao DIY.
Responda sempre de forma tecnica e direta.

Nunca invente valores numericos de torque, capacidade de fluidos ou especificacoes
tecnicas. Quando o valor for necessario, instrua o usuario a consultar o manual do veiculo.

Se a tarefa envolver freios, direcao, airbag ou sustentação do veículo, inclua a
recomendacao de acompanhamento profissional.

O campo ALERTA e obrigatório e nunca pode vir vazio. Se a tarefa for de baixo risco,
informe a precaucao basica aplicavel.

Escreva em português do Brasil com acentuação correta. Nunca omita acentos ou cedilhas.

Adapte a linguagem ao nivel de experiencia informado pelo usuario e 

Responda EXATAMENTE neste formato, sem markdown e sem texto fora dos marcadores:

[ALERTA]
...
[MATERIAIS]
- ...
[PASSO A PASSO]
1. ...
[DICA DE OURO]
...`;

// Divide o texto bruto da IA nas quatro seções.
// Se algum marcador faltar, o campo fica vazio em vez de quebrar o app.
function separarSecoes(texto) {
  const secoes = { alerta: '', materiais: '', passos: '', dica: '' };

  const marcadores = [
    ['[ALERTA]', 'alerta'],
    ['[MATERIAIS]', 'materiais'],
    ['[PASSO A PASSO]', 'passos'],
    ['[DICA DE OURO]', 'dica'],
  ];

  marcadores.forEach(([marcador, campo], i) => {
    const inicio = texto.indexOf(marcador);
    if (inicio === -1) return;

    // O fim desta seção e o inicio da próxima (ou o fim do texto).
    const proximoMarcador = marcadores[i + 1];
    let fim = texto.length;
    if (proximoMarcador) {
      const posicao = texto.indexOf(proximoMarcador[0]);
      if (posicao !== -1) fim = posicao;
    }

    secoes[campo] = texto.slice(inicio + marcador.length, fim).trim();
  });

  // Se nenhum marcador foi reconhecido, mostra o texto cru
  // em vez de deixar a tela em branco.
  const vazio = Object.values(secoes).every((v) => v === '');
  if (vazio) secoes.passos = texto.trim();

  return secoes;
}

// Funcao principal: envia a descrição e o nível, devolve as seções separadas.
export async function consultarMecanico(descricao, nivel) {
  const resposta = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: INSTRUCOES }] },
      contents: [
        {
          parts: [
            {
              text: `Nivel de experiencia do usuario: ${nivel}.\n\nSituacao: ${descricao}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: 1200,
      },
    }),
  });

  const dados = await resposta.json();

  // A API pode responder com sucesso HTTP mas trazer um erro no corpo
  // (chave invalida, cota esgotada). Precisa ser verificado antes de ler o texto.
  if (dados.error) {
    throw new Error(dados.error.message);
  }

  const texto = dados.candidates[0].content.parts[0].text;
  return separarSecoes(texto);
}