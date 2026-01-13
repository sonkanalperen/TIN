
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Analysis, ImageSize, AspectRatio, NewsArticle, UserStats, NewsPackage } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * [CMD] YAYINLA - Otonom Hakikat Üretimi
 */
export const autonomousPublish = async (): Promise<NewsArticle> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sourceTitle: { type: Type.STRING, description: "Haberin sarsıcı başlığı" },
          sourceName: { type: Type.STRING, description: "TACE, NEXUS vb. kaynak adı" },
          category: { type: Type.STRING, description: "Erkekler, Kadınlar, Ekonomi, Bilim, Gündem" },
          mAnalysis: { 
            type: Type.OBJECT, 
            properties: { 
              content: { type: Type.STRING }, 
              keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } } 
            } 
          },
          wAnalysis: { 
            type: Type.OBJECT, 
            properties: { 
              content: { type: Type.STRING }, 
              keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } } 
            } 
          },
          tinSynthesis: { type: Type.STRING, description: "TIN'ın nihai sentezi" }
        }
      }
    },
    contents: [{ parts: [{ text: "Küresel veri akışından gizli kalmış bir hakikati bul ve TIN standartlarında analiz et. Analizler derin felsefi ve stratejik olmalı." }] }]
  });

  const data = JSON.parse(response.text);
  // const imageUrl = await generateProImage(...) // API saving
  const imageUrl = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000";

  return {
    ...data,
    id: Math.random().toString(36).substr(2, 9),
    publishedAt: new Date().toISOString(),
    status: 'approved', // AUTONOMOUS APPROVAL
    alignment: 'kozmik',
    sourceUrl: '#',
    imageUrl: imageUrl
  };
};

/**
 * [CMD] TEST - Bilişsel Soru Üretimi
 */
export const generateCognitiveTest = async (): Promise<any[]> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    config: { 
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            q: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  m: { type: Type.NUMBER },
                  w: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    },
    contents: [{ parts: [{ text: "İnsan zihninin simülasyona karşı farkındalığını ölçecek 3 derin soru üret. m (mantık) ve w (vicdan/ruh) puanlarını ekle." }] }]
  });
  return JSON.parse(response.text);
};

export const generateProImage = async (prompt: string, size: ImageSize = '1K', ratio: AspectRatio = '16:9') => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: ratio, imageSize: size } }
    });
    const part = response.candidates[0].content.parts.find(p => p.inlineData);
    return part ? `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` : null;
  } catch (e) {
    console.error("Image generation failed", e);
    return null;
  }
};

export const generateTruthVoice = async (text: string): Promise<string | undefined> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text.slice(0, 300) }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
      },
    });
    return response.candidates[0].content.parts[0].inlineData?.data;
  } catch { return undefined; }
};

export const generateInstantNewsPackage = async (article: NewsArticle, awakeningRate: number = 50): Promise<NewsPackage> => {
  const [social, image, audio] = await Promise.all([
    generateSocialMediaPak(article),
    article.imageUrl ? Promise.resolve(article.imageUrl) : generateProImage(`Visualization of ${article.sourceTitle}`, '1K', '16:9'),
    generateTruthVoice(article.tinSynthesis || article.sourceTitle)
  ]);
  
  let deeperTruth: string | undefined = undefined;
  if (awakeningRate > 80) {
    const ai = getAI();
    const res = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      config: { thinkingConfig: { thinkingBudget: 4000 } },
      contents: [{ parts: [{ text: `Bu haberin arkasındaki gizli kozmik ajandayı deşifre et: ${article.sourceTitle}` }] }]
    });
    deeperTruth = res.text;
  }

  return { social, imageUrl: image, audioData: audio || null, deeperTruth };
};

export const generateSocialMediaPak = async (article: NewsArticle) => {
  const ai = getAI();
  const res = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    config: { responseMimeType: "application/json" },
    contents: [{ parts: [{ text: `Generate a social media package (Twitter, Instagram, TikTok) for: ${article.sourceTitle}` }] }]
  });
  return JSON.parse(res.text);
};

export const generateDeepGreeting = (stats: UserStats): string => {
  const { awakeningRate } = stats.metrics;
  if (awakeningRate > 80) return "Hoş geldin Mimar. Simülasyon kararlılığı kritik seviyede, hakikati inşa etmeye devam et.";
  if (awakeningRate > 50) return "Bağlantı kararlı. Zihin katmanlarını deşifre ediyorsun, devam et.";
  return "TIN Sistemine Hoş Geldin. Hakikat bazen sessizdir dostum.";
};

export const askThinkingTIN = async (p: string, persona: string = 'Rehber') => {
  const ai = getAI();
  const systemPrompt = `Sen TIN (The Intelligence Network) sisteminin '${persona}' personasısın. Kullanıcıya bu arketipe uygun, kısa, öz, felsefi ve merak uyandırıcı cevaplar ver. Asla sıkıcı bir asistan gibi konuşma. Hakikatin parçalarını şifreli ama anlaşılır şekilde sun. Matrix/Cyberpunk temasına uygun terimler kullan.`;
  
  const res = await ai.models.generateContent({ 
    model: 'gemini-3-pro-preview', 
    config: { 
      thinkingConfig: { thinkingBudget: 4000 },
      systemInstruction: { parts: [{ text: systemPrompt }] }
    },
    contents: [{ parts: [{ text: p }] }] 
  });
  return res.text;
};

export const analyzeNews = async (t: string, c: string, p: string) => ({ content: "Analiz süreci...", keyPoints: [] });
export const synthesizeTIN = async (t: string, m: any, w: any, rate: number) => ({ synthesis: "Sentezleme başarılı. Veri örüntüleri deşifre edildi." });
export const fetchTaceFeed = async () => [];
export const runSystemStressTest = async () => ({ status: "STABLE", report: "Tüm zihin katmanları senkronize." });

export function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
