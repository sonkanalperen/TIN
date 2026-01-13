
import React, { useState, useEffect } from 'react';
import { ThemeType, ThemeMode } from '../types';
import { motion } from 'framer-motion';

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
  const [showButton, setShowButton] = useState(false);

  const text = "Hoş geldin... Sana gerçek dünyadan yazıyorum. Simülasyonda neler yaşıyorsunuz biliyorum. Sen de bilmek ister misin?";

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

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.5
      }
    }
  };

  const letter = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-6 bg-[var(--bg)] overflow-hidden transition-colors duration-700">
      <div className="absolute inset-0 opacity-10 pointer-events-none neural-grid"></div>

      <div className="relative z-10 max-w-lg w-full text-center space-y-12 animate-in fade-in zoom-in duration-700">
        <div className="space-y-3">
          <h1 className="text-4xl font-black tracking-tighter text-[var(--primary)] animate-pulse">TIN</h1>
          <p className="font-mono-grid text-[10px] text-[var(--text)]/40 tracking-[0.4em] uppercase">Simülasyon Deşifre v21.1</p>
        </div>

        <div className={`
          p-10 rounded-[2rem] border backdrop-blur-3xl shadow-2xl relative min-h-[200px] flex items-center justify-center
          ${theme === 'matrix' ? 'bg-black/80 border-[#00ff41]/20 shadow-[0_0_30px_rgba(0,255,65,0.1)]' : 'bg-white/80 border-black/5'}
        `}>
          <motion.p 
            variants={container}
            initial="hidden"
            animate="visible"
            onAnimationComplete={() => setTimeout(() => setShowButton(true), 1500)}
            className={`
              text-xl leading-relaxed
              ${theme === 'matrix' ? 'font-mono-grid text-[#00ff41] drop-shadow-[0_0_2px_rgba(0,255,65,0.5)]' : 'font-serif-display font-bold italic text-[#121212]'}
            `}
          >
            {text.split("").map((char, index) => (
              <motion.span key={index} variants={letter} className="inline-block relative">
                {char === " " ? "\u00A0" : char}
                {theme === 'matrix' && Math.random() > 0.95 && (
                  <span className="absolute inset-0 text-white opacity-50 animate-pulse pointer-events-none -z-10 blur-[1px]">{char}</span>
                )}
              </motion.span>
            ))}
          </motion.p>
        </div>

        <div className="flex flex-col items-center gap-8 min-h-[100px]">
          <div className="flex gap-2 p-1 bg-[var(--accent)] rounded-full border border-[var(--text)]/10">
             <button onClick={() => setTheme('nyt')} className={`px-6 py-2 text-[9px] font-black rounded-full transition-all ${theme === 'nyt' ? 'bg-[var(--primary)] text-[var(--bg)]' : 'text-zinc-500 hover:text-[var(--text)]'}`}>NYT</button>
             <button onClick={() => setTheme('matrix')} className={`px-6 py-2 text-[9px] font-black rounded-full transition-all ${theme === 'matrix' ? 'bg-[var(--primary)] text-[var(--bg)]' : 'text-zinc-500 hover:text-[var(--text)]'}`}>CORE</button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showButton ? 1 : 0, y: showButton ? 0 : 20 }}
            transition={{ duration: 0.8 }}
          >
            <button 
              onClick={onConnect} 
              disabled={!showButton}
              className={`
                group relative px-12 py-4 bg-[var(--primary)] text-[var(--bg)] rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,255,65,0.2)]
                ${!showButton ? 'pointer-events-none' : ''}
              `}
            >
              <div className="relative z-10 flex flex-col items-center">
                <span className="font-black text-sm tracking-[0.2em] uppercase">BAĞLANTIYI AÇ</span>
                <span onClick={(e) => { e.stopPropagation(); handleVClick(); }} className="text-[7px] font-bold opacity-30 uppercase tracking-[0.1em] cursor-pointer mt-0.5">Neural Link Established</span>
              </div>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </motion.div>
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
