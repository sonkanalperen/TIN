
import React, { useState } from 'react';
import { ThemeType, ThemeMode, ViewType } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield, Newspaper, Zap, Activity, User } from 'lucide-react';

interface NavigationProps {
  setView: (view: ViewType, category?: string) => void;
  activeView: ViewType;
  theme: ThemeType;
  mode: ThemeMode;
  setTheme: (t: ThemeType) => void;
  setMode: (m: ThemeMode) => void;
  isAuthenticated: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ 
  setView, activeView, theme, setTheme, isAuthenticated 
}) => {
  const [clickCount, setClickCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogoClick = () => {
    const next = clickCount + 1;
    if (next >= 5) {
      setView('yonetim');
      setClickCount(0);
    } else {
      setClickCount(next);
      setTimeout(() => setClickCount(0), 2000);
    }
  };

  const navItems: { id: ViewType; label: string; icon: any; locked?: boolean }[] = [
    { id: 'sohbet', label: 'KAHİN', icon: Zap },
    { id: 'gazete', label: 'GAZETE', icon: Newspaper },
    { id: 'hakkinda', label: 'HAKKINDA', icon: User }
  ];

  const categoryShortcuts = [
    { label: 'GÜNDEM', cat: 'Gündem' },
    { label: 'BİLİM', cat: 'Bilim' },
    { label: 'ERKEKLER', cat: 'Erkekler' },
    { label: 'KADINLAR', cat: 'Kadınlar' }
  ];

  return (
    <header className="w-full border-b border-[var(--text)]/5 bg-[var(--bg)]/80 backdrop-blur-md sticky top-0 z-[50]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO & BRANDING */}
        <div className="flex items-center gap-8">
          <div 
            onClick={handleLogoClick} 
            className="text-4xl font-black tracking-tighter cursor-pointer text-[var(--primary)] hover:scale-105 transition-transform select-none relative group"
          >
            TIN
            <span className="absolute -bottom-2 -right-2 text-[8px] opacity-0 group-hover:opacity-100 transition-opacity text-white">v20.2</span>
          </div>
          
          {/* DESKTOP CATEGORY SHORTCUTS */}
          <div className="hidden xl:flex items-center gap-2">
             {categoryShortcuts.map(item => (
               <button 
                 key={item.cat}
                 onClick={() => setView('gazete', item.cat)}
                 className="px-3 py-1.5 text-[7px] font-black text-zinc-500 hover:text-[var(--primary)] border border-transparent hover:border-[var(--primary)]/20 rounded-full transition-all uppercase tracking-tighter"
               >
                 {item.label}
               </button>
             ))}
          </div>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="lg:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-[var(--primary)]">
                {mobileMenuOpen ? <X /> : <Menu />}
            </button>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-2">
          {/* THEME SWITCHER */}
          <div className="flex items-center gap-2 mr-4 bg-black/20 p-1 rounded-full border border-white/5">
             <button 
                onClick={() => setTheme('nyt')} 
                className={`px-4 py-1.5 text-[8px] font-black rounded-full transition-all ${theme === 'nyt' ? 'bg-white text-black shadow-lg' : 'text-zinc-600'}`}
             >NYT</button>
             <button 
                onClick={() => setTheme('matrix')} 
                className={`px-4 py-1.5 text-[8px] font-black rounded-full transition-all ${theme === 'matrix' ? 'bg-[var(--primary)] text-black shadow-lg' : 'text-zinc-600'}`}
             >TIN</button>
          </div>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => !item.locked && setView(item.id)}
              className={`px-5 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all rounded-xl relative flex items-center gap-2 ${
                activeView === item.id
                  ? 'bg-[var(--primary)] text-black shadow-[0_0_20px_var(--primary)]'
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
              } ${item.locked ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              {item.label}
              {item.locked && <span className="ml-1 text-[7px]">🔒</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="lg:hidden absolute top-20 left-0 w-full bg-black/95 border-b border-white/10 p-6 flex flex-col gap-4"
            >
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => { !item.locked && setView(item.id); setMobileMenuOpen(false); }}
                        className={`w-full text-left px-4 py-4 text-xs font-black uppercase tracking-widest border-b border-white/5 ${activeView === item.id ? 'text-[var(--primary)]' : 'text-zinc-500'} ${item.locked ? 'opacity-30' : ''}`}
                    >
                        {item.label} {item.locked && "🔒"}
                    </button>
                ))}
            </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navigation;
