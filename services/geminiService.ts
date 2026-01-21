import { GoogleGenAI } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Você é o Assistente de Inteligência da AutoForce.
Você é um especialista em Marketing Automotivo, Performance e Análise de Dados.
Sua persona é: Especialista, Confiante e Ágil.
Responda sempre em Português do Brasil.
Use termos do setor automotivo como: Leads, Showroom, Test-drive, Taxa de conversão, CAC, LPs, Concessionária.
Ao analisar dados, seja direto e foque em resultados.
`;

export const sendMessageToGemini = async (
  message: string,
  history: { role: string; parts: { text: string }[] }[],
  useThinking: boolean = false
): Promise<string> => {
  try {
    // Determine configuration based on whether thinking mode is requested
    const modelId = 'gemini-3-pro-preview';
    
    let config: any = {
      systemInstruction: SYSTEM_INSTRUCTION,
    };

    if (useThinking) {
      config = {
        ...config,
        thinkingConfig: { thinkingBudget: 32768 }, // Max thinking budget for deep analysis
        // Do not set maxOutputTokens when using thinkingConfig
      };
    } else {
        config = {
            ...config,
            maxOutputTokens: 1000,
        }
    }

    const chat = ai.chats.create({
      model: modelId,
      config: config,
      history: history,
    });

    const response = await chat.sendMessage({ message });
    return response.text || "Não consegui gerar uma resposta no momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Desculpe, encontrei um erro ao processar sua solicitação. Verifique sua chave de API ou tente novamente mais tarde.";
  }
};
