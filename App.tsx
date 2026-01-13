import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { NewsArticle, ThemeType, ThemeMode, ViewType } from './types';
import Navigation from './components/Navigation';
import ArticleGrid from './components/ArticleGrid';
import AdminPanel from './components/AdminPanel';
import ArticleView from './components/ArticleView';
import Chat from './components/Chat';
import MatrixRain from './components/MatrixRain';
import NeuralGate from './components/NeuralGate';
import { DeepAIProvider, useDeepAI } from './components/DeepAIProvider';
import { generateMassContent } from './services/contentGenerator';

const CATEGORIES = ['Hepsi', 'Gündem', 'Ekonomi', 'Bilim', 'Erkekler', 'Kadınlar'];

const INITIAL_ARTICLES: NewsArticle[] = generateMassContent();

const AppContent: React.FC = () => {
  const { userStats, archetype, simulationStability } = useDeepAI();
  const [view, setView] = useState<ViewType>('sohbet');
  const [activeCategory, setActiveCategory] = useState('Hepsi');
  const [articles, setArticles] = useState<NewsArticle[]>(INITIAL_ARTICLES);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [bootSequence, setBootSequence] = useState(true);
  const [hasEnteredGate, setHasEnteredGate] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState<ThemeType>('matrix');
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);

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

  const filteredArticles = useMemo(() => 
    articles.filter(a => a.status === 'approved' && (activeCategory === 'Hepsi' || a.category === activeCategory)),
    [articles, activeCategory]
  );

  if (bootSequence) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono-grid">
      <div className="text-6xl font-black text-[#00ff41] animate-pulse tracking-tighter">TIN</div>
      <div className="mt-4 text-[9px] uppercase tracking-[1em] text-[#00ff41]/50">SINGULARITY_V21.0_PURGE</div>
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
    <div className="min-h-screen flex flex-col relative transition-all duration-700 overflow-hidden">
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
        </div>
      </div>
      
      <main className="flex-grow max-w-7xl mx-auto px-4 mt-4 w-full flex flex-col pb-20 relative z-10">
        {view === 'sohbet' && (
          <div className="animate-in fade-in duration-700 slide-in-from-bottom-4">
            <Chat />
          </div>
        )}

        {view === 'gazete' && (
          <div className="animate-in fade-in duration-1000">
             <div className="flex flex-wrap gap-2 mb-8 justify-center">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-[10px] uppercase font-black tracking-widest transition-all ${activeCategory === cat ? 'bg-[var(--primary)] text-[var(--bg)]' : 'bg-[var(--accent)] border border-[var(--text)]/10 text-[var(--text)]/50 hover:text-[var(--text)]'}`}
                  >
                    {cat}
                  </button>
                ))}
             </div>
             <div className="pt-4">
               <h2 className="font-serif-display text-4xl font-black italic tracking-tighter uppercase mb-8 border-b border-white/5 pb-4 text-center md:text-left">
                  {activeCategory === 'Hepsi' ? 'Küresel Hakikatler' : `${activeCategory} Katmanı`}
               </h2>
               <ArticleGrid isLoading={isLoadingArticles} articles={filteredArticles} onOpen={(a) => { setSelectedArticle(a); setView('haber'); }} />
            </div>
          </div>
        )}

        {view === 'haber' && selectedArticle && <ArticleView article={selectedArticle} onBack={() => setView('gazete')} />}
        
        {view === 'hakkinda' && (
           <div className="max-w-2xl mx-auto text-center py-20 animate-in fade-in duration-700">
              <h1 className="text-6xl font-black mb-6 text-[var(--primary)]">TIN v21.0</h1>
              <p className="text-xl font-serif-body italic mb-8 text-[var(--text)]/70">
                "Hakikat, gürültünün bittiği yerde başlar."
              </p>
              <div className="space-y-4 text-sm font-mono opacity-50">
                <p>THE INTELLIGENCE NETWORK</p>
                <p>System Status: STABLE</p>
                <p>Purge Complete.</p>
              </div>
           </div>
        )}
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
