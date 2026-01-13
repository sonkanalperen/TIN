
import React from 'react';
import { NewsArticle } from '../types';

interface GenderedSpotlightProps {
  articles: NewsArticle[];
  onOpen: (article: NewsArticle) => void;
}

const GenderedSpotlight: React.FC<GenderedSpotlightProps> = ({ articles, onOpen }) => {
  const latestWoman = articles.find(a => a.category === 'Kadınlar' && a.status === 'approved');
  const latestMan = articles.find(a => a.category === 'Erkekler' && a.status === 'approved');

  if (!latestWoman && !latestMan) return null;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border-y border-white/5 mb-16 overflow-hidden rounded-[2rem] shadow-2xl">
      {/* KADINLAR SPOTLIGHT */}
      <div 
        onClick={() => latestWoman && onOpen(latestWoman)}
        className="bg-zinc-950/40 p-12 group cursor-pointer hover:bg-zinc-900/80 transition-all relative overflow-hidden"
      >
        <div className="absolute -right-8 -bottom-8 font-serif-display text-[12rem] text-white/5 italic pointer-events-none select-none">W</div>
        <div className="absolute top-8 right-12 text-[10px] font-black uppercase tracking-widest text-zinc-700">İki Dünya: 01</div>
        <span className="inline-block bg-pink-500/10 text-pink-500 text-[8px] font-black uppercase tracking-[0.3em] px-4 py-1.5 mb-6 rounded-full border border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.1)]">
          KADINLAR DÜNYASI
        </span>
        {latestWoman ? (
          <>
            <h3 className="font-serif-display text-4xl font-bold leading-tight mb-6 group-hover:text-pink-400 transition-colors">
              {latestWoman.sourceTitle}
            </h3>
            <p className="font-serif-body text-zinc-500 italic text-lg line-clamp-2">
              {latestWoman.tinSynthesis?.split('\n')[0] || "Sezgisel derinlik deşifre ediliyor..."}
            </p>
          </>
        ) : (
          <p className="font-serif-body italic text-zinc-600">Kadınlar dünyasından yeni bir hakikat aranıyor...</p>
        )}
      </div>

      {/* ERKEKLER SPOTLIGHT */}
      <div 
        onClick={() => latestMan && onOpen(latestMan)}
        className="bg-zinc-950/40 p-12 group cursor-pointer hover:bg-zinc-900/80 transition-all relative overflow-hidden"
      >
        <div className="absolute -right-8 -bottom-8 font-serif-display text-[12rem] text-white/5 italic pointer-events-none select-none">M</div>
        <div className="absolute top-8 right-12 text-[10px] font-black uppercase tracking-widest text-zinc-700">İki Dünya: 02</div>
        <span className="inline-block bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase tracking-[0.3em] px-4 py-1.5 mb-6 rounded-full border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
          ERKEKLER DÜNYASI
        </span>
        {latestMan ? (
          <>
            <h3 className="font-serif-display text-4xl font-bold leading-tight mb-6 group-hover:text-blue-400 transition-colors">
              {latestMan.sourceTitle}
            </h3>
            <p className="font-serif-body text-zinc-500 italic text-lg line-clamp-2">
              {latestMan.tinSynthesis?.split('\n')[0] || "Stratejik irade sentezleniyor..."}
            </p>
          </>
        ) : (
          <p className="font-serif-body italic text-zinc-600">Erkekler dünyasından yeni bir hakikat aranıyor...</p>
        )}
      </div>
    </section>
  );
};

export default GenderedSpotlight;
