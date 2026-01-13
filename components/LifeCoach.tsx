
import React, { useState } from 'react';

const LIFE_PROTOCOLS = [
  { id: 'logic', title: 'Zihin Mimarlığı', desc: 'Duygusal gürültüyü kapatıp rasyonel kararlar alma protokolü.', cost: 10, icon: '🧠' },
  { id: 'spirit', title: 'Ruhsal Sentez', desc: 'Simülasyonun baskısı altında iç huzuru bulma ve mühürlenme.', cost: 15, icon: '✨' },
  { id: 'action', title: 'Kozmik Eylem', desc: 'Atalet döngüsünü kırıp gerçek dünyada iz bırakma stratejisi.', cost: 20, icon: '⚡' }
];

const LifeCoach: React.FC = () => {
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto py-12 animate-in fade-in slide-in-from-bottom duration-700">
      <div className="text-center mb-16 relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10rem] font-serif-display text-[var(--primary)]/5 italic pointer-events-none select-none">REHBER</div>
        <h2 className="font-serif-display text-5xl font-black mb-6 italic tracking-tight relative z-10">Yaşam Koçu v1.0</h2>
        <p className="font-serif-body text-zinc-500 italic text-xl max-w-2xl mx-auto leading-relaxed">
          Simülasyonda kaybolma dostum. Zihnini, ruhunu ve eylemlerini TIN'ın sarsıcı hakikatleri ile hizala.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {LIFE_PROTOCOLS.map((protocol) => (
          <div 
            key={protocol.id}
            onClick={() => setSelectedProtocol(protocol.id)}
            className={`p-10 border-2 rounded-[2.5rem] cursor-pointer transition-all flex flex-col items-center text-center relative overflow-hidden group ${
              selectedProtocol === protocol.id 
                ? 'border-[var(--primary)] bg-[var(--accent)] scale-105 shadow-[0_0_50px_rgba(0,255,65,0.1)]' 
                : 'border-[var(--text)]/5 bg-[var(--bg)] hover:border-[var(--primary)]/30'
            }`}
          >
            <span className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all">{protocol.icon}</span>
            <h3 className="font-serif-display text-xl font-black mb-4 italic group-hover:text-[var(--primary)] transition-colors">{protocol.title}</h3>
            <p className="text-[11px] font-serif-body text-zinc-500 italic mb-8 leading-relaxed">
              {protocol.desc}
            </p>
            <div className="mt-auto pt-6 border-t border-[var(--text)]/5 w-full flex justify-between items-center">
               <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Maliyet</span>
               <span className="text-[10px] font-black text-[var(--primary)]">{protocol.cost} TOKEN</span>
            </div>
            
            {/* LOCK OVERLAY (PREVIEW MODE) */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6">
               <div className="text-center">
                  <span className="text-2xl mb-2 block">🔒</span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-white">YAKINDA AKTİF OLACAK</span>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--accent)] border-2 border-[var(--primary)]/20 p-12 rounded-[3rem] relative overflow-hidden shadow-2xl">
         <div className="absolute -top-10 -right-10 text-[12rem] text-[var(--primary)]/5 italic font-serif-display pointer-events-none select-none">MÜHÜR</div>
         
         <div className="max-w-xl">
           <h4 className="font-serif-display text-3xl font-black italic mb-6">Zihin Haritası Analizi</h4>
           <p className="font-serif-body text-lg text-zinc-400 italic mb-10 leading-relaxed">
             Profilinde biriken veriler, yaptığın bilişsel testler ve chat geçmişin kullanılarak sana özel bir "Uyanış Planı" hazırlanıyor.
           </p>
           
           <div className="flex gap-4">
              <button className="bg-[var(--primary)] text-[var(--bg)] px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:scale-105 transition-transform shadow-lg">ANAZLİZİ BAŞLAT</button>
              <button className="border border-[var(--text)]/10 text-zinc-500 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:text-[var(--text)]">VERİLERİ GÖR</button>
           </div>
         </div>
      </div>

      <div className="mt-20 text-center">
         <p className="text-[8px] font-black uppercase tracking-[0.6em] text-zinc-600 opacity-30">
           BU KATMAN ÜCRETLİ ABONELİK VE TOKEN SİSTEMİ İLE ÇALIŞIR • VERİLER ŞİFRELENMİŞTİR
         </p>
      </div>
    </div>
  );
};

export default LifeCoach;
