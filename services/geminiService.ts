import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. GÜVENLİ ANAHTAR ÇAĞRISI (Vite Standardı)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("KRİTİK HATA: .env dosyasında VITE_GEMINI_API_KEY bulunamadı!");
}

// 2. GEMINI MOTORUNU BAŞLATMA
const genAI = new GoogleGenerativeAI(API_KEY || "dummy_key_for_build");

// Model Yapılandırması (Simülasyonun Tonuna Uygun)
const model = genAI.getGenerativeModel({
  model: "gemini-pro",
  generationConfig: {
    temperature: 0.9, // Yüksek yaratıcılık
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 1024,
  },
});

// 3. TACE: HAKİKAT ANALİZ FONKSİYONU
export const analyzeTruth = async (prompt: string): Promise<string> => {
  if (!API_KEY) return "Simülasyon Hatası: API Anahtarı Eksik.";

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("TACE Motor Hatası:", error);
    return "Bağlantı koptu. Yerel protokol devreye giriyor...";
  }
};

// 4. OTOMATİK İÇERİK ÜRETİCİ (Batch Generator)
export const fetchTaceFeed = async (category: string) => {
  // Eğer anahtar yoksa veya hata verirse boş dizi dön (Sistem çökmez)
  if (!API_KEY) {
      console.warn("API Key yok, mock veri kullanılıyor.");
      return []; 
  }

  const prompt = `
    Sen TIN WORLD simülasyonunun 'Kahin'isin. 
    Bana '${category}' kategorisi hakkında, derin felsefi anlamlar taşıyan, 
    okuyucuyu sarsacak ve merak uyandıracak 3 adet kısa haber başlığı ve özeti üret.
    Format: JSON Array. Örnek: [{"title": "...", "summary": "..."}]
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // JSON temizliği (Markdown taglerini kaldır)
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("İçerik Üretim Hatası:", error);
    return [];
  }
};