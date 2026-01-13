
import React, { useMemo } from 'react';
import { TaceFeedItem } from '../types';

interface Props {
  feed: TaceFeedItem[];
}

const LiveTaceFeed: React.FC<Props> = React.memo(({ feed }) => {
  // Logic Bloat Prevention: Memoize the filtering and sorting of the feed
  const topFeed = useMemo(() => 
    feed
      .filter(item => item.status === 'verified')
      .sort((a, b) => b.credibilityScore - a.credibilityScore)
      .slice(0, 3),
    [feed]
  );

  return (
    <div className="bg-[#0a0a0a]/80 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col h-full backdrop-blur-2xl shadow-2xl">
      <div className="p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-1.5 bg-[#39FF14] rounded-full animate-ping"></div>
          <h3 className="text-[11px] font-black tracking-[0.5em] uppercase text-[#39FF14]">HAKİKAT_AKISI_V20.1</h3>
        </div>
        <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">TOP_3_FOCUS_MODE</span>
      </div>
      
      <div className="flex-grow p-6 space-y-6 overflow-y-auto no-scrollbar">
        {topFeed.length > 0 ? topFeed.map((item) => (
          <div key={item.id} className="p-6 bg-zinc-900/60 border border-white/5 rounded-3xl hover:border-[#39FF14]/40 transition-all group">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[7px] text-zinc-500 font-black uppercase tracking-widest">GÜVENİLİRLİK SKORU</span>
              <span className="text-xl font-black text-[#39FF14]">%{item.credibilityScore}</span>
            </div>
            
            <h4 className="text-lg font-black text-white mb-3 group-hover:text-[#39FF14] transition-colors leading-tight">
              {item.topic}
            </h4>
            
            <p className="text-sm text-zinc-400 font-serif-body italic mb-6 leading-relaxed">
              "{item.oneSentenceSummary}"
            </p>

            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 bg-black/40 rounded-xl">
                <span className="block text-[6px] text-zinc-600 font-black uppercase">STRATEJİK ANALİZ</span>
                <span className="text-[10px] font-black text-cyan-400">%{item.mScore}</span>
              </div>
              <div className="text-center p-2 bg-black/40 rounded-xl">
                <span className="block text-[6px] text-zinc-600 font-black uppercase">ETİK SORGULAMA</span>
                <span className="text-[10px] font-black text-red-500">%{item.wScore}</span>
              </div>
              <div className="text-center p-2 bg-black/40 rounded-xl border border-[#39FF14]/10">
                <span className="block text-[6px] text-[#39FF14] font-black uppercase">KRİTİK SENTEZ</span>
                <span className="text-[10px] font-black text-white">AKTİF</span>
              </div>
            </div>
          </div>
        )) : (
          <div className="h-full flex items-center justify-center text-zinc-700 text-[10px] font-black uppercase tracking-widest animate-pulse">
            Sinyal Bekleniyor...
          </div>
        )}
      </div>
    </div>
  );
});

export default LiveTaceFeed;
