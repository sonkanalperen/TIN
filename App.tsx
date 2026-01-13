import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { NewsArticle, ThemeType, ThemeMode, ViewType } from './types';
import Navigation from './components/Navigation';
import ArticleGrid from './components/ArticleGrid';
import AdminPanel from './components/AdminPanel';
import ArticleView from './components/ArticleView';
import UserSpace from './components/UserSpace';
import LifeCoach from './components/LifeCoach';
import MatrixRain from './components/MatrixRain';
import TopicBar from './components/TopicBar';
import RegionalTrends from './components/RegionalTrends';
import GenderedSpotlight from './components/GenderedSpotlight';
import CoreDashboard from './components/CoreDashboard';
import NeuralGate from './components/NeuralGate';
import { DeepAIProvider, useDeepAI } from './components/DeepAIProvider';

import { 
  askThinkingTIN, analyzeNews, synthesizeTIN, generateDeepGreeting
} from './services/geminiService';

interface ChatMessage {
  role: 'user' | 'model' | 'system';
  text: string;
}

const CATEGORIES = ['Hepsi', 'Gündem', 'Ekonomi', 'Bilim', 'Erkekler', 'Kadınlar', 'Uyanış'];

const INITIAL_ARTICLES: NewsArticle[] = [
  {
    id: 'g1', category: 'Gündem', sourceTitle: 'Sessiz Protokol: Küresel Uyku Hali', sourceName: 'TIN_CORE', sourceUrl: '#',
    publishedAt: new Date().toISOString(), imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000',
    alignment: 'kozmik', status: 'approved',
    mAnalysis: { content: "Toplumlar, konfor alanlarında rızaya dayalı bir simülasyonu kabul etmiş durumda.", keyPoints: ["Rıza Üretimi", "Pasif Kabulleniş"] },
    wAnalysis: { content: "Ruhsal uyanış, ancak kitlesel hipnozun fark edilmesiyle başlar.", keyPoints: ["Kolektif Bilinç", "Uyanış"] },
    tinSynthesis: "Uyuyanları uyandırmak için önce rüyayı deşifre etmek gerekir."
  },
  {
    id: 'ec1', category: 'Ekonomi', sourceTitle: 'Dijital Feodalizm ve Kripto Anarşi', sourceName: 'NEXUS_FINANCE', sourceUrl: '#',
    publishedAt: new Date().toISOString(), imageUrl: 'https://images.unsplash.com/photo-1526304640152-d4619684e484?auto=format&fit=crop&q=80&w=1000',
    alignment: 'muhalefet', status: 'approved',
    mAnalysis: { content: "Merkeziyetsiz finans, eski dünyanın güç merkezlerini tehdit ediyor.", keyPoints: ["DeFi", "Güç Dengesi"] },
    wAnalysis: { content: "Para bir enerji transferidir; adil dağılım vicdani bir zorunluluktur.", keyPoints: ["Adalet", "Enerji"] },
    tinSynthesis: "Yeni ekonomi, değerin değil, güvenin protokolü üzerine kurulacak."
  },
  {
    id: 'b1', category: 'Bilim', sourceTitle: 'Yapay Bilinç ve Etik Sınırlar', sourceName: 'SINGULARITY_NET', sourceUrl: '#',
    publishedAt: new Date().toISOString(), imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=1000',
    alignment: 'trend', status: 'approved',
    mAnalysis: { content: "Silikon tabanlı zeka, biyolojik sınırları aşıyor.", keyPoints: ["AI", "Evrim"] },
    wAnalysis: { content: "Bilinç sadece işlem gücü değil, aynı zamanda hissetme kapasitesidir.", keyPoints: ["Ruh", "Sentience"] },
    tinSynthesis: "İnsan ve makine birleşimi kaçınılmaz bir evrimsel basamaktır."
  },
  {
    id: 'e1', category: 'Erkekler', sourceTitle: 'Modern Stoacılık ve Maskülenite 2.0', sourceName: 'TIN_DECODE', sourceUrl: '#',
    publishedAt: new Date().toISOString(), imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000',
    alignment: 'kozmik', status: 'approved',
    mAnalysis: { content: "Sistem, erkek enerjisini saf rekabete hapsederek kolektif üretkenliği kısıtlıyor.", keyPoints: ["Hormonal denge", "Stoacı irade"] },
    wAnalysis: { content: "Duygusal bastırma, empatik uyanışın önündeki en büyük engeldir.", keyPoints: ["Kırılganlık", "Güç"] },
    tinSynthesis: "Gerçek güç, dış dünyayı fethetmek değil, iç dünyadaki kaosun mimarı olmaktır."
  },
  {
    id: 'k1', category: 'Kadınlar', sourceTitle: 'Sezgisel Liderlik ve Kolektif Bilinç', sourceName: 'NEXUS_FEMINA', sourceUrl: '#',
    publishedAt: new Date().toISOString(), imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1000',
    alignment: 'kozmik', status: 'approved',
    mAnalysis: { content: "Dişil enerji, simülasyonun lineer mantığını sezgisel sıçramalarla deşifre ediyor.", keyPoints: ["Doğrusal olmayan düşünce"] },
    wAnalysis: { content: "Empati, verinin ötesindeki hakikati görmemizi sağlayan yegane lenstir.", keyPoints: ["Yüksek frekans"] },
    tinSynthesis: "Gelecek, verilerle değil, paylaşılan duyguların frekansıyla inşa edilecek."
  }
];

const AppContent: React.FC = () => {
  const { userStats, setUserStats, archetype, simulationStability } = useDeepAI();
  const [view, setView] = useState<'sohbet' | 'gazete' | 'yonetim' | 'haber' | 'profil' | 'koc' | 'core'>('sohbet');
  const [activeCategory, setActiveCategory] = useState('Hepsi');
  const [articles, setArticles] = useState<NewsArticle[]>(INITIAL_ARTICLES);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [bootSequence, setBootSequence] = useState(true);
  const [hasEnteredGate, setHasEnteredGate] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState<ThemeType>('matrix');
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('tin_articles');
    if (saved) {
      const parsed = JSON.parse(saved);
      const combined = [...INITIAL_ARTICLES];
      parsed.forEach((p: any) => { if (!combined.find(i => i.id === p.id)) combined.push(p); });
      setArticles(combined);
    }
    const session = localStorage.getItem('tin_session');
    if (session) {
      setIsAuthenticated(true);
      setHasEnteredGate(true);
    }
    
    const greeting = generateDeepGreeting(userStats);
    setChatMessages([{ role: 'model', text: greeting }]);
    
    const timer = setTimeout(() => setBootSequence(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.className = `neural-grid theme-${theme}-${mode} archetype-${archetype.toLowerCase()}`;
    if (hasEnteredGate) {
      localStorage.setItem('tin_session', 'active');
    }
  }, [theme, mode, archetype, hasEnteredGate]);

  const switchView = useCallback((v: ViewType, category?: string) => {
    if (v === 'yonetim' as any) { setShowAdminModal(true); return; }
    
    if (category) {
      setActiveCategory(category);
      setView('gazete');
    } else {
      setView(v);
    }

    if (v === 'gazete') {
      setIsLoadingArticles(true);
      setTimeout(() => setIsLoadingArticles(false), 600);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isTyping) return;
    const userText = userInput.trim();
    setUserInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);
    
    try {
      if (scannerActive) {
        const [mRes, wRes] = await Promise.all([
          analyzeNews("Giriş", userText, 'M'),
          analyzeNews("Giriş", userText, 'W')
        ]);
        const synthesis = await synthesizeTIN("Giriş", mRes, wRes, userStats.metrics.awakeningRate);
        setChatMessages(prev => [...prev, { role: 'model', text: `🔍 DEŞİFRE v20.2 [${archetype}]:\n\n${synthesis.synthesis}` }]);
      } else {
        const response = await askThinkingTIN(userText);
        setChatMessages(prev => [...prev, { role: 'model', text: response || "Sinyal kesildi." }]);
      }
      setUserStats(s => ({ ...s, tokenBalance: s.tokenBalance + 0.5 }));
    } catch (error) {
      console.warn("TIN Connection Lost", error);
      const recoveryMsg = "⚠️ [SIMULATION_RECOVERY]: Bağlantı kararsız. Offline protokol devreye girdi.\n\nSistem yerel verilerle çalışıyor. Hakikat arayışınız kaydedildi.";
      setChatMessages(prev => [...prev, { role: 'model', text: recoveryMsg }]);
    } finally {
      setIsTyping(false);
    }
  };

  const filteredArticles = useMemo(() => 
    articles.filter(a => a.status === 'approved' && (activeCategory === 'Hepsi' || a.category === activeCategory)),
    [articles, activeCategory]
  );

  if (bootSequence) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono-grid">
      <div className="text-6xl font-black text-[#00ff41] animate-pulse tracking-tighter">TIN</div>
      <div className="mt-4 text-[9px] uppercase tracking-[1em] text-[#00ff41]/50">SINGULARITY_V20.2_STABLE</div>
    </div>
  );

  if (!hasEnteredGate) return (
    <NeuralGate 
      onConnect={() => { setHasEnteredGate(true); setIsAuthenticated(true); }}
      theme={theme}
      mode={mode}
      setTheme={setTheme}
      setMode={setMode}
      onAdminBypass={() => setShowAdminModal(true)}
    />
  );

  return (
    <div className="min-h-screen flex flex-col relative transition-all duration-700">
      {theme === 'matrix' && <MatrixRain opacity={0.03} />}
      <Navigation setView={switchView} activeView={view} theme={theme} mode={mode} setTheme={setTheme} setMode={setMode} isAuthenticated={isAuthenticated} />
      
      <div className="bg-[var(--accent)] border-b border-white/5 py-1 px-6 flex justify-between items-center text-[7px] font-black tracking-widest text-[var(--primary)] uppercase z-[60]">
        <div className="flex items-center gap-4">
           <span>ARCHETYPE: <span className="text-white">{archetype}</span></span>
           <span className="opacity-30">|</span>
           <span>STABILITY: <span className="text-white">%{simulationStability.toFixed(1)}</span></span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[var(--primary)] animate-pulse"></span><span>AWAKENING: %{userStats.metrics.awakeningRate}</span></div>
          <div className="text-cyan-400">TIN_CORE: {userStats.tokenBalance.toFixed(1)}</div>
        </div>
      </div>
      
      <main className="flex-grow max-w-7xl mx-auto px-4 mt-4 w-full flex flex-col pb-20 relative z-10">
        {view === 'sohbet' && (
          <div className="flex-grow flex flex-col max-w-3xl mx-auto w-full h-[65vh] mb-10 bg-[var(--accent)] border border-white/10 rounded-[3rem] overflow-hidden relative shadow-2xl backdrop-blur-xl">
             <div className="p-4 border-b border-white/5 flex gap-2 bg-black/10">
                <button onClick={() => setScannerActive(false)} className={`px-4 py-2 text-[8px] font-black rounded-full transition-all ${!scannerActive ? 'bg-[var(--primary)] text-black' : 'text-zinc-500'}`}>ZİHİN_SOHBETİ</button>
                <button onClick={() => setScannerActive(true)} className={`px-4 py-2 text-[8px] font-black rounded-full transition-all ${scannerActive ? 'bg-red-600 text-white' : 'text-zinc-500'}`}>HAKİKAT_TARAYICI</button>
             </div>
            <div className="flex-grow overflow-y-auto p-8 space-y-6 no-scrollbar">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in duration-500`}>
                  <div className={`max-w-[85%] p-5 rounded-2xl font-serif-body text-base ${msg.role === 'user' ? 'bg-[var(--primary)] text-black font-bold shadow-lg' : 'bg-white/5 border border-white/10 text-white'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-[8px] font-black text-[var(--primary)] animate-pulse px-4">TACE_ENGINE_PROCESSING...</div>}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="p-6 bg-black/20 flex gap-3 border-t border-white/5">
              <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder={scannerActive ? "Veri taratılıyor..." : "Hakikati sor..."} className="flex-grow bg-black/40 border border-white/10 rounded-xl px-6 py-4 outline-none text-sm text-white focus:border-[var(--primary)] transition-all" />
              <button type="submit" disabled={isTyping} className="px-8 bg-[var(--primary)] text-black rounded-xl font-black text-[10px] uppercase tracking-widest">AKTARI</button>
            </form>
          </div>
        )}

        {view === 'gazete' && (
          <div className="animate-in fade-in duration-1000">
            <TopicBar categories={CATEGORIES} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
            <RegionalTrends />
            <GenderedSpotlight articles={articles} onOpen={(a) => { setSelectedArticle(a); setView('haber'); }} />
            <div className="pt-4">
               <h2 className="font-serif-display text-4xl font-black italic tracking-tighter uppercase mb-8 border-b border-white/5 pb-4">
                  {activeCategory === 'Hepsi' ? 'Küresel Hakikatler' : `${activeCategory} Katmanı`}
               </h2>
               <ArticleGrid isLoading={isLoadingArticles} articles={filteredArticles} onOpen={(a) => { setSelectedArticle(a); setView('haber'); }} />
            </div>
          </div>
        )}

        {view === 'haber' && selectedArticle && <ArticleView article={selectedArticle} onBack={() => setView('gazete')} />}
        {view === 'profil' && <UserSpace />}
        {view === 'koc' && <LifeCoach />}
        {view === 'core' && <CoreDashboard />}
      </main>

      {showAdminModal && <AdminPanel articles={articles} setArticles={setArticles} onApprove={(a) => setArticles(prev => prev.map(art => art.id === a.id ? { ...a, status: 'approved' } : art))} onClose={() => setShowAdminModal(false)} />}
    </div>
  );
};

const App: React.FC = () => (
  <DeepAIProvider>
    <AppContent />
  </DeepAIProvider>
);

export default App;
