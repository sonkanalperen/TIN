
import React, { useState, useEffect } from 'react';
import { generateCognitiveTest } from '../services/geminiService';

const CognitiveTest: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({ m: 0, w: 0 });
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await generateCognitiveTest();
        setQuestions(data);
      } catch (e) {
        console.error("Test generation failed", e);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleSelect = (m: number, w: number) => {
    setScores({ m: scores.m + m, w: scores.w + w });
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-10 animate-pulse">
        <div className="w-20 h-20 border-8 border-red-600 border-t-transparent rounded-full animate-spin mb-8"></div>
        <h2 className="font-serif-display text-3xl font-black italic">Bilişsel Haritan Çıkarılıyor...</h2>
        <p className="text-zinc-400 mt-4 font-mono text-xs uppercase tracking-widest">Zihin Katmanları v11.0 taranıyor</p>
      </div>
    );
  }

  if (finished) {
    const total = scores.m + scores.w || 1;
    const mPerc = Math.round((scores.m / total) * 100);
    const wPerc = 100 - mPerc;

    return (
      <div className="max-w-3xl mx-auto py-20 text-center animate-in zoom-in duration-700 bg-white p-12 border-4 border-black shadow-[40px_40px_0px_0px_rgba(0,0,0,0.05)] rounded-[3rem]">
        <div className="mb-4 text-red-600 font-black text-[10px] uppercase tracking-[0.5em]">ANALİZ TAMAMLANDI</div>
        <h2 className="font-serif-display text-6xl font-black mb-12 italic tracking-tighter">Kim Olduğunu Söyleyelim mi?</h2>
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-10">
          <div className="text-center w-full md:w-1/3">
            <div className="text-[12px] font-black uppercase tracking-widest text-zinc-400 mb-2">STRATEJİST (M)</div>
            <div className="text-6xl font-serif-display font-black">%{mPerc}</div>
          </div>
          <div className="w-full h-4 bg-zinc-100 rounded-full flex overflow-hidden border border-zinc-200">
            <div style={{ width: `${mPerc}%` }} className="h-full bg-zinc-900 transition-all duration-1000"></div>
            <div style={{ width: `${wPerc}%` }} className="h-full bg-red-600 transition-all duration-1000"></div>
          </div>
          <div className="text-center w-full md:w-1/3">
            <div className="text-[12px] font-black uppercase tracking-widest text-zinc-400 mb-2">DUYARLI (W)</div>
            <div className="text-6xl font-serif-display font-black text-red-600">%{wPerc}</div>
          </div>
        </div>

        <div className="bg-zinc-50 p-10 rounded-[2rem] border-2 border-zinc-100 mb-12 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 font-serif-display text-8xl text-black/5 italic select-none">TIN</div>
           <p className="font-serif-body text-2xl text-zinc-800 leading-relaxed italic relative z-10">
            {mPerc > 65 ? "Bir veri mimarısınız. Duyguların gürültüsünü kapatıp, sistemin çarklarını görüyorsunuz. Ama bazen durup nefes almayı unutuyorsun dostum." : 
             wPerc > 65 ? "Bir ruh kaşifisiniz. Hakikat sizin için istatistik değil, bir hissiyat. Dünyanın bu kadar sert olması canını yakıyor, biliyorum." : 
             "Siz gerçek bir sentez dehasısınız. TIN'ın dünyasındaki o nadir denge noktası. Hem sistemin nasıl çalıştığını biliyorsun hem de neden var olduğumuzu."}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <button 
            onClick={onComplete}
            className="bg-black text-white px-12 py-6 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-red-600 transition-all shadow-xl rounded-2xl"
          >
            GAZETEYE DÖN
          </button>
          <button 
            onClick={onComplete}
            className="border-2 border-zinc-900 text-black px-12 py-6 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-zinc-900 hover:text-white transition-all rounded-2xl"
          >
            REFLECTION SEANSI BAŞLAT
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[step];

  return (
    <div className="max-w-4xl mx-auto py-20 animate-in slide-in-from-bottom duration-700">
      <div className="mb-12 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">
        <span className="bg-white border-2 border-zinc-100 px-4 py-1 rounded-full">SORU {step + 1} / {questions.length}</span>
        <span className="text-red-600 animate-pulse">BİLİŞSEL DEŞİFRE AKTİF</span>
      </div>
      
      <div className="bg-white p-12 md:p-20 border-2 border-zinc-900 shadow-[20px_20px_0px_0px_rgba(0,0,0,0.03)] rounded-[3rem] relative">
        <h3 className="font-serif-display text-4xl md:text-5xl font-black mb-16 leading-[1.1] tracking-tight text-center">
          {currentQ?.q}
        </h3>
        
        <div className="grid grid-cols-1 gap-6">
          {currentQ?.options.map((opt: any, i: number) => (
            <button 
              key={i}
              onClick={() => handleSelect(opt.m, opt.w)}
              className="w-full text-left p-8 border-2 border-zinc-100 rounded-3xl hover:border-black hover:bg-zinc-50 transition-all font-serif-body text-xl italic group flex justify-between items-center shadow-sm"
            >
              <span className="pr-10">{opt.text}</span>
              <span className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 text-red-600 font-black text-xs tracking-widest shrink-0">SEÇ →</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-12 text-center text-zinc-300 font-serif-body italic text-sm">
        "Gerçek cevaplar zihninin en karanlık köşesinde saklıdır dostum."
      </div>
    </div>
  );
};

export default CognitiveTest;
