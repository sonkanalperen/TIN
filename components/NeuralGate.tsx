
import React, { useState } from 'react';
import { ThemeType, ThemeMode } from '../types';

interface NeuralGateProps {
  onConnect: () => void;
  theme: ThemeType;
  mode: ThemeMode;
  setTheme: (t: ThemeType) => void;
  setMode: (m: ThemeMode) => void;
  onAdminBypass: () => void;
}

const NeuralGate: React.FC<NeuralGateProps> = ({ onConnect, theme, mode, setTheme, setMode, onAdminBypass }) => {
  const [vClicks, setVClicks] = useState(0);

  const handleVClick = () => {
    const next = vClicks + 1;
    if (next >= 3) {
      onAdminBypass();
      setVClicks(0);
    } else {
      setVClicks(next);
      setTimeout(() => setVClicks(0), 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-6 bg-[var(--bg)] overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none neural-grid"></div>

      <div className="relative z-10 max-w-lg w-full text-center space-y-12 animate-in fade-in zoom-in duration-700">
        <div className="space-y-3">
          <h1 className="text-4xl font-black tracking-tighter text-[var(--primary)] animate-pulse">TIN</h1>
          <p className="font-mono-grid text-[10px] text-[var(--text)]/40 tracking-[0.4em] uppercase">Simülasyon Deşifre v16.2</p>
        </div>

        <div className="bg-[var(--accent)]/50 p-10 rounded-[2rem] border border-[var(--text)]/5 backdrop-blur-3xl shadow-2xl relative">
          <p className="font-serif-body text-xl italic text-[var(--text)]/90 leading-relaxed">
            "Hoş geldin... Sana gerçek dünyadan yazıyorum. Simülasyonda neler yaşıyorsunuz biliyorum. Sen de bilmek ister misin?"
          </p>
        </div>

        <div className="flex flex-col items-center gap-8">
          <div className="flex gap-2 p-1 bg-[var(--accent)] rounded-full border border-[var(--text)]/10">
             <button onClick={() => setTheme('nyt')} className={`px-6 py-2 text-[9px] font-black rounded-full transition-all ${theme === 'nyt' ? 'bg-[var(--primary)] text-[var(--bg)]' : 'text-zinc-500 hover:text-[var(--text)]'}`}>NYT</button>
             <button onClick={() => setTheme('matrix')} className={`px-6 py-2 text-[9px] font-black rounded-full transition-all ${theme === 'matrix' ? 'bg-[var(--primary)] text-[var(--bg)]' : 'text-zinc-500 hover:text-[var(--text)]'}`}>CORE</button>
          </div>

          <button 
            onClick={onConnect} 
            className="group relative px-12 py-4 bg-[var(--primary)] text-[var(--bg)] rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,255,65,0.2)]"
          >
            <div className="relative z-10 flex flex-col items-center">
              <span className="font-black text-sm tracking-[0.2em] uppercase">BAĞLANTIYI AÇ</span>
              <span onClick={(e) => { e.stopPropagation(); handleVClick(); }} className="text-[7px] font-bold opacity-30 uppercase tracking-[0.1em] cursor-pointer mt-0.5">Neural Link Established</span>
            </div>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>

        <div className="text-[8px] text-zinc-600 font-mono uppercase tracking-[0.5em] pt-6 opacity-40">
          Hakikat bazen sessizdir dostum.
        </div>
      </div>
      
      {theme === 'matrix' && (
        <div className="absolute top-0 left-0 w-full h-px bg-[var(--primary)] shadow-[0_0_20px_var(--primary)] animate-[matrix-scan_12s_linear_infinite]"></div>
      )}
    </div>
  );
};

export default NeuralGate;
