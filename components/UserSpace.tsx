
import React, { useState, useEffect } from 'react';
import { synthesizeTIN } from '../services/geminiService';
import AwakeningRadar from './AwakeningRadar';
import { UserStats } from '../types';

const UserSpace: React.FC = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulated initial fetch of v20.0 stats
    setStats({
      reputation: 1250,
      tokenBalance: 450.5,
      archetype: 'Hakikat Yolcusu',
      metrics: {
        logic: 75,
        empathy: 60,
        intuition: 45,
        action: 80,
        awakeningRate: 65
      },
      tokenomics: {
        balance: 450.5,
        staked: 1000,
        reputation: 1250,
        inflationRate: 1.2,
        // Adding missing properties required by Tokenomics interface
        totalSupply: 1000000,
        slashedTotal: 500
      }
    });
  }, []);

  if (!stats) return null;

  return (
    <div className="max-w-4xl mx-auto py-12 animate-in fade-in slide-in-from-bottom duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        {/* BILINC RADARI */}
        <div className="bg-black/40 border border-[var(--text)]/5 p-10 rounded-[3rem] backdrop-blur-3xl">
          <h3 className="text-center font-serif-display text-2xl font-black italic mb-10 tracking-widest text-[var(--primary)] uppercase">Zihin Matrisi</h3>
          <AwakeningRadar metrics={stats.metrics} />
          <div className="mt-10 grid grid-cols-2 gap-4">
             <div className="text-center p-4 bg-white/5 rounded-2xl">
               <span className="block text-[8px] font-black uppercase text-zinc-500 mb-1">Reputasyon</span>
               <span className="text-lg font-black text-white">{stats.reputation}</span>
             </div>
             <div className="text-center p-4 bg-white/5 rounded-2xl">
               <span className="block text-[8px] font-black uppercase text-zinc-500 mb-1">Arketip</span>
               <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-tighter">{stats.archetype}</span>
             </div>
          </div>
        </div>

        {/* TOKENOMICS */}
        <div className="bg-black/40 border border-cyan-500/20 p-10 rounded-[3rem] backdrop-blur-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 font-serif-display text-8xl text-cyan-400 italic">TIN</div>
          <h3 className="font-serif-display text-2xl font-black italic mb-8 tracking-widest text-cyan-400 uppercase">Finansal Çekirdek</h3>
          
          <div className="space-y-6 relative z-10">
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
               <span className="text-[9px] font-black text-zinc-400 uppercase">Cüzdan Bakiyesi</span>
               <span className="text-3xl font-black text-white">{stats.tokenomics.balance} <span className="text-xs text-cyan-400">TIN</span></span>
            </div>
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
               <span className="text-[9px] font-black text-zinc-400 uppercase">Stake Edilen</span>
               <span className="text-xl font-black text-white">{stats.tokenomics.staked} TIN</span>
            </div>
            <div className="flex justify-between items-end">
               <span className="text-[9px] font-black text-zinc-400 uppercase">Enflasyon Sabiti (v20.0)</span>
               <span className="text-sm font-black text-cyan-400">%{stats.tokenomics.inflationRate}</span>
            </div>
            
            <button className="w-full bg-cyan-500 text-black py-4 rounded-2xl font-black uppercase tracking-widest text-[9px] mt-8 hover:bg-white transition-all shadow-lg">
              HAKİKATİ STAKE ET ⚡
            </button>
          </div>
        </div>
      </div>

      <div className="bg-zinc-950 border border-purple-500/20 p-12 rounded-[3rem] relative overflow-hidden shadow-2xl">
         <div className="absolute -top-10 -right-10 text-[12rem] text-purple-500/5 italic font-serif-display pointer-events-none select-none">EYLEM</div>
         
         <div className="max-w-xl">
           <h4 className="font-serif-display text-3xl font-black italic mb-6 text-purple-400">Uyanış Yol Haritası</h4>
           <p className="font-serif-body text-lg text-zinc-400 italic mb-10 leading-relaxed">
             Mevcut bilişsel puanın, sezgisel boyutta bir daralma gösteriyor. v20.0 protokolüne göre "Kozmik Sentez" okumalarına ağırlık vermelisin.
           </p>
           
           <div className="flex gap-4">
              <button className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:scale-105 transition-transform shadow-lg">MİSYONU BAŞLAT</button>
              <button className="border border-purple-500/20 text-purple-400 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:text-white transition-all">ANALİZİ İNDİR</button>
           </div>
         </div>
      </div>
    </div>
  );
};

export default UserSpace;
