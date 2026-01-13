
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NewsArticle } from '../types';
import { generateInstantNewsPackage, decodeBase64, decodeAudioData } from '../services/geminiService';
import { useDeepAI } from './DeepAIProvider';

interface ArticleViewProps {
  article: NewsArticle;
  onBack: () => void;
}

const ArticleView: React.FC<ArticleViewProps> = ({ article, onBack }) => {
  const { userStats } = useDeepAI();
  const [newsPkg, setNewsPkg] = useState(article.package || null);
  const [loadingPkg, setLoadingPkg] = useState(!article.package);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!article.package) {
      const fetchPackage = async () => {
        const pkg = await generateInstantNewsPackage(article, userStats.metrics.awakeningRate);
        setNewsPkg(pkg);
        setLoadingPkg(false);
      };
      fetchPackage();
    }
  }, [article, userStats.metrics.awakeningRate]);

  const handlePlayVoice = useCallback(async () => {
    if (!newsPkg?.audioData || isPlaying) return;
    setIsPlaying(true);
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const bytes = decodeBase64(newsPkg.audioData);
      const buffer = await decodeAudioData(bytes, audioContextRef.current, 24000, 1);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsPlaying(false);
      source.start();
    } catch {
      setIsPlaying(false);
    }
  }, [newsPkg, isPlaying]);

  return (
    <article className="max-w-4xl mx-auto pb-40 px-4 animate-in fade-in duration-700">
      <div className="flex justify-between items-center py-8">
        <button onClick={onBack} className="text-[10px] font-black uppercase text-[#39FF14] hover:opacity-70">← GERİ DÖN</button>
        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">TACE-P HATTINDAN ÇEKİLDİ</span>
      </div>

      <section className="mb-12 bg-[#39FF14]/5 border border-[#39FF14]/20 p-10 rounded-[3rem] text-center backdrop-blur-xl">
        <h2 className="text-[10px] font-black text-[#39FF14] uppercase mb-6">HAKİKATİN SESİ</h2>
        <button 
          onClick={handlePlayVoice}
          disabled={loadingPkg || !newsPkg?.audioData}
          className={`group w-24 h-24 bg-[#39FF14] text-black rounded-full mx-auto flex items-center justify-center transition-all ${isPlaying ? 'animate-pulse' : ''}`}
        >
          <span className="text-3xl">{isPlaying ? '🔊' : '▶'}</span>
        </button>
      </section>

      {/* v20.2: DEEPER TRUTHS FOR ARCHITECTS ONLY */}
      {userStats.metrics.awakeningRate > 80 && newsPkg?.deeperTruth && (
        <section className="mb-12 bg-red-600/10 border border-red-600/30 p-10 rounded-[3rem] relative overflow-hidden animate-bounce-short">
          <div className="absolute top-4 right-8 text-[8px] font-black text-red-500 uppercase tracking-[0.4em]">ENCRYPTED_DEEP_TRUTH_v20.2</div>
          <h3 className="text-[10px] font-black text-red-500 uppercase mb-4 tracking-widest">GÖZLEMCİYE ÖZEL DEŞİFRE:</h3>
          <p className="font-mono text-sm leading-relaxed text-red-200/80 italic">
            "{newsPkg.deeperTruth}"
          </p>
        </section>
      )}

      <section className="mb-16">
        <div className="relative aspect-video rounded-[3rem] overflow-hidden border-4 border-white/5 bg-zinc-900">
          {!loadingPkg && newsPkg?.imageUrl ? (
            <img src={newsPkg.imageUrl} alt="Visual" className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-1000" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase text-zinc-700 animate-pulse">İŞLENİYOR...</div>
          )}
        </div>
      </section>

      <section className="space-y-12">
        <h1 className="text-center font-serif-display text-5xl md:text-7xl font-black italic mb-8">{article.sourceTitle}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-zinc-900/50 p-10 rounded-3xl border border-white/5">
            <h3 className="text-[10px] font-black text-cyan-400 uppercase mb-4">STRATEJİK ANALİZ</h3>
            <p className="font-serif-body text-xl italic text-zinc-300">"{article.mAnalysis?.content}"</p>
          </div>
          <div className="bg-zinc-900/50 p-10 rounded-3xl border border-white/5">
            <h3 className="text-[10px] font-black text-red-500 uppercase mb-4">ETİK SORGULAMA</h3>
            <p className="font-serif-body text-xl italic text-zinc-300">"{article.wAnalysis?.content}"</p>
          </div>
        </div>
        <div className="bg-white p-16 rounded-[4rem] text-black shadow-2xl">
          <h3 className="text-[10px] font-black uppercase mb-8">KRİTİK SENTEZ (TIN)</h3>
          <p className="font-serif-body text-3xl md:text-4xl font-bold italic">"{article.tinSynthesis}"</p>
        </div>
      </section>
    </article>
  );
};

export default ArticleView;
