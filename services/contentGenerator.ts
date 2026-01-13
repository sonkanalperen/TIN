
import { NewsArticle } from '../types';

const CATEGORIES = ['Ekonomi', 'Bilim', 'Erkekler', 'Kadınlar'];
const SOURCES = ['NEXUS_CORE', 'TACE_FEED', 'VOID_SIGNAL', 'DEEP_MIND', 'KRONOS_LOG', 'ECHO_CHAMBER'];

const TOPICS = {
  Ekonomi: [
    'Dijital Feodalizm', 'Kripto Anarşi', 'Enerji Para Birimi', 'Veri Sömürgeciliği', 
    'Merkeziyetsiz Güven', 'Algoritmik Ticaret', 'Yapay Kıtlık', 'Kuantum Finans',
    'Biyometrik Ödeme', 'Metaverse Emlak', 'Karbon Kredisi', 'Nöro-Ekonomi',
    'Sosyal Kredi Skorları', 'Otomasyon Vergisi', 'Evrensel Temel Gelir', 'DAO Yönetimi',
    'Sentetik Varlıklar', 'Likidite Havuzları', 'Akıllı Sözleşmeler', 'Blokzincir Adaleti',
    'Gölge Bankacılık', 'Enflasyon Simülasyonu', 'Deflasyonist Spiral', 'Altın Standardı 2.0',
    'Enerji Takası'
  ],
  Bilim: [
    'Yapay Bilinç', 'Kuantum Dolanıklık', 'Sentetik Biyoloji', 'Nöral Arayüzler',
    'CRISPR Devrimi', 'Dyson Küresi', 'Fermi Paradoksu', 'Simülasyon Teorisi',
    'Karanlık Madde', 'Zaman Kristalleri', 'Telepati Protokolleri', 'Sibernetik Ölümsüzlük',
    'Nanobot Sürüleri', 'Genetik Mühendislik', 'Uzay Madenciliği', 'Terraforming',
    'Biyohacker Kültürü', 'Yapay Rahim', 'Hafıza Manipülasyonu', 'Rüya Kaydı',
    'Bilinç Aktarımı', 'Egzegenet', 'Sicim Teorisi', 'Çoklu Evrenler', 'Entropi Tersi'
  ],
  Erkekler: [
    'Modern Stoacılık', 'Maskülenite 2.0', 'Testosteron Krizi', 'Baba Arketipi',
    'Savaşçı Ruhu', 'Kral Enerjisi', 'Rekabet ve İşbirliği', 'Duygusal Dayanıklılık',
    'Fiziksel Mükemmellik', 'Zihinsel Disiplin', 'Koruyucu İçgüdü', 'İnşa Edici Güç',
    'Yalnız Kurt Sendromu', 'Beta Tuzağı', 'Alfa Yanılgısı', 'Sigma Yolu',
    'Kabile Bağları', 'Ustalık Arayışı', 'Risk Yönetimi', 'Stratejik Düşünme',
    'Onur Kültürü', 'Sözlü Gelenek', 'Mentorluk', 'Miras Bırakma', 'Güç Dengesi'
  ],
  Kadınlar: [
    'Sezgisel Liderlik', 'Kolektif Bilinç', 'Dişil Enerji', 'Şifacı Arketipi',
    'Kraliçe Enerjisi', 'Empati Devrimi', 'Duygusal Zeka', 'Yaratıcı Kaos',
    'Doğurganlık ve Yaratım', 'Ay Döngüleri', 'Rahim Bilgeliği', 'Topluluk İnşası',
    'Barışçıl Savaşçı', 'Amazon Ruhu', 'Cadı Avı 2.0', 'Görünmez Emek',
    'Şefkat Gücü', 'İletişim Ağları', 'Kız Kardeşlik', 'Spiritüel Uyanış',
    'Gaia Bağlantısı', 'Sezgi ve Mantık', 'Dönüşümcü Liderlik', 'Estetik ve Uyum',
    'Hayat Veren Güç'
  ]
};

const TEMPLATES = {
  m: [
    "Sistem verimliliği optimize edilmeli.", "Veriler kaotik bir desen gösteriyor.", 
    "Mantıksal çıkarım kaçınılmaz sonu işaret ediyor.", "Algoritmalar duygudan arındırılmış kararlar almalı.",
    "Yapısal bütünlük risk altında.", "Kaynak dağılımı asimetrik.",
    "Doğrusal projeksiyonlar yetersiz kalıyor.", "Neden-sonuç ilişkisi kırıldı."
  ],
  w: [
    "İnsan ruhu istatistiklere sığmaz.", "Vicdan, en yüksek algoritmadır.",
    "Kolektif acı görmezden gelinemez.", "Umut, verinin bittiği yerde başlar.",
    "Empati olmadan zeka sadece bir silahtır.", "Bağlantı kurmak hayatta kalmaktır.",
    "Sezgi, bilinmeyene açılan kapıdır.", "Ahlaki pusula kuzeyi göstermeli."
  ],
  tin: [
    "Hakikat, iki ucun birleştiği yerdedir.", "Sentez, çatışmadan doğar.",
    "Kaos ve düzen, aynı madalyonun iki yüzüdür.", "Uyanış, dengeyi bulmaktır.",
    "Gelecek, hibrit zihinlerin eseri olacak.", "Simülasyonu aşmak için onu anlamalısın.",
    "Gerçeklik, gözlemcinin bilincinde şekillenir.", "Mühür kırıldı, hakikat serbest."
  ]
};

const IMAGES = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1526304640152-d4619684e484?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1531297461136-82lw9b5b0c46?auto=format&fit=crop&q=80&w=1000', // Tech
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000', // Space
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000', // Cyberpunk
  'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?auto=format&fit=crop&q=80&w=1000', // AI
  'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=1000'  // City
];

const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateMassContent = (): NewsArticle[] => {
  const articles: NewsArticle[] = [];
  let idCounter = 100;

  CATEGORIES.forEach(category => {
    const topics = TOPICS[category as keyof typeof TOPICS];
    if (!topics) return;

    topics.forEach((topic) => {
      const source = getRandom(SOURCES);
      const mText = getRandom(TEMPLATES.m);
      const wText = getRandom(TEMPLATES.w);
      const tinText = getRandom(TEMPLATES.tin);
      const image = getRandom(IMAGES);
      
      articles.push({
        id: `auto-${category.toLowerCase()}-${idCounter++}`,
        category,
        sourceTitle: topic,
        sourceName: source,
        sourceUrl: '#',
        publishedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
        imageUrl: image,
        alignment: 'kozmik',
        status: 'approved',
        mAnalysis: {
          content: `${topic} bağlamında: ${mText}`,
          keyPoints: ['Veri', 'Mantık', 'Analiz']
        },
        wAnalysis: {
          content: `${topic} perspektifinde: ${wText}`,
          keyPoints: ['İnsan', 'Duygu', 'Etik']
        },
        tinSynthesis: `TIN Sentezi: ${topic}, ${tinText.toLowerCase()}`
      });
    });
  });

  return articles;
};
