
import React, { useMemo } from 'react';
import { useDeepAI } from './DeepAIProvider';

interface Props {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const DashboardLayout: React.FC<Props> = ({ children, title, subtitle }) => {
  const { simulationStability, userStats } = useDeepAI();

  // v20.2: Simülasyon istikrarına göre CSS değişkenlerini ayarla
  const dynamicStyles = useMemo(() => ({
    '--blur-intensity': `${(100 - simulationStability) / 5}px`,
    '--neon-glow': simulationStability < 30 ? '0 0 30px #39FF14' : '0 0 10px #39FF14',
    '--bg-opacity': `${Math.max(0.05, (100 - simulationStability) / 100)}`
  } as React.CSSProperties), [simulationStability]);

  return (
    <div 
      className="min-h-screen bg-[#050505] text-[#e5e7eb] font-main"
      style={dynamicStyles}
    >
      <div className="fixed inset-0 pointer-events-none" style={{ opacity: 'var(--bg-opacity)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#39FF14_1px,_transparent_1px)] bg-[length:40px_40px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <header className="mb-16 border-b border-[#39FF14]/10 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 
              className="font-serif-display text-6xl md:text-7xl font-black italic tracking-tighter text-white mb-3 uppercase"
              style={{ textShadow: 'var(--neon-glow)' }}
            >
              {title}
            </h1>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse shadow-[0_0_10px_#39FF14]"></span>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.6em]">{subtitle}</p>
            </div>
          </div>
          
          <div className="flex gap-4">
             <div className="px-8 py-4 bg-zinc-900/50 rounded-2xl border border-white/5 backdrop-blur-md">
                <span className="block text-[8px] text-zinc-500 font-black uppercase mb-1">STABILITY</span>
                <span className="text-xl font-black text-white">%{simulationStability.toFixed(1)}</span>
             </div>
             {userStats.metrics.awakeningRate > 80 && (
               <div className="px-8 py-4 bg-[#39FF14]/20 rounded-2xl border border-[#39FF14]/40 animate-pulse">
                  <span className="block text-[8px] text-[#39FF14] font-black uppercase mb-1">ARCHITECT_ACCESS</span>
                  <span className="text-[10px] font-black text-white">ADVANCED_LAYERS_UNLOCKED</span>
               </div>
             )}
          </div>
        </header>

        <main style={{ filter: 'blur(var(--blur-intensity))' }} className="transition-all duration-1000">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
