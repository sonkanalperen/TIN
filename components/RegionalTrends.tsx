
import React from 'react';

const TRENDS = [
  { region: 'ZİHİN OYUNLARI', topic: 'Modern Yalnızlık Neden Artıyor?', impact: 92, desc: 'Simülasyondaki bağlar zayıflıyor mu?' },
  { region: 'GELECEK ŞOKU', topic: 'Rüyalarımızı Kaydetmek Mümkün mü?', impact: 78, desc: 'Nöral link teknolojisi rüya odalarına sızıyor.' },
  { region: 'İNSANLIK HALLERİ', topic: 'Neden Karar Vermekte Zorlanıyoruz?', impact: 85, desc: 'Veri gürültüsü zihnimizi kilitliyor.' },
  { region: 'VİRAL HAKİKATLER', topic: 'Günün En Çok Tartışılan Sentezi', impact: 98, desc: 'Gündemdeki karmaşanın ardındaki tek gerçek.' }
];

const RegionalTrends: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
      {TRENDS.map((trend, i) => (
        <div key={i} className="bg-[var(--bg)] border-b-2 border-[var(--text)]/5 p-6 group hover:border-[var(--primary)] transition-all cursor-pointer relative overflow-hidden rounded-xl">
          <div className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--primary)] mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-pulse"></span>
            {trend.region}
          </div>
          <h4 className="font-serif-display text-lg font-bold mb-4 leading-tight group-hover:text-[var(--primary)] transition-colors">{trend.topic}</h4>
          <p className="text-[10px] font-serif-body text-[var(--text)]/50 italic mb-4 line-clamp-2">
            {trend.desc}
          </p>
          <div className="flex justify-between items-center opacity-30 group-hover:opacity-100 transition-opacity border-t border-[var(--text)]/5 pt-3">
            <div className="text-[8px] font-black uppercase tracking-widest">SİNYAL GÜCÜ</div>
            <div className="text-[10px] font-serif-display font-bold">%{trend.impact}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RegionalTrends;
