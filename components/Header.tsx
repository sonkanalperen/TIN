
import React, { useState } from 'react';
import { ThemeType, ThemeMode } from '../types';

interface HeaderProps {
  setView: (view: 'home' | 'admin' | 'article' | 'user-space' | 'newspaper' | 'koc' | 'core', category?: string) => void;
  activeView: string;
  theme: ThemeType;
  mode: ThemeMode;
  setTheme: (t: ThemeType) => void;
  setMode: (m: ThemeMode) => void;
  isAuthenticated: boolean;
}

const Header: React.FC<HeaderProps> = ({ setView, activeView, theme, mode, setTheme, setMode, isAuthenticated }) => {
  const [clickCount, setClickCount] = useState(0);
  
  const handleLogoClick = () => {
    const next = clickCount + 1;
    if (next >= 5) {
      setView('admin' as any);
      setClickCount(0);
    } else {
      setClickCount(next);
      setTimeout(() => setClickCount(0), 2000);
    }
  };

  const navItems = [
    { id: 'home', label: 'SOHBET' },
    { id: 'newspaper', label: 'GAZETE' },
    { id: 'core', label: 'CORE', locked: !isAuthenticated },
    { id: 'koc', label: 'KOÇ', locked: !isAuthenticated },
    { id: 'user-space', label: 'PROFİL', locked: !isAuthenticated }
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
        <div className="flex items-center gap-8">
          <div 
            onClick={handleLogoClick} 
            className="text-4xl font-black tracking-tighter cursor-pointer text-[var(--primary)] hover:scale-105 transition-transform select-none"
          >
            TIN
          </div>
          
          <div className="hidden xl:flex items-center gap-2">
             {categoryShortcuts.map(item => (
               <button 
                 key={item.cat}
                 onClick={() => setView('newspaper', item.cat)}
                 className="px-3 py-1.5 text-[7px] font-black text-zinc-500 hover:text-[var(--primary)] border border-transparent hover:border-[var(--primary)]/20 rounded-full transition-all uppercase tracking-tighter"
               >
                 {item.label}
               </button>
             ))}
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2 mr-4 bg-black/20 p-1 rounded-full border border-white/5">
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
              onClick={() => !item.locked && setView(item.id as any)}
              className={`px-5 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all rounded-xl relative ${
                activeView === (item.id === 'home' ? 'sohbet' : item.id === 'newspaper' ? 'gazete' : item.id === 'user-space' ? 'profil' : item.id === 'core' ? 'core' : 'koc')
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
    </header>
  );
};

export default Header;
