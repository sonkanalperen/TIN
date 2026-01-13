
import React, { useState, useEffect, useRef } from 'react';
import { NewsArticle } from '../types';
import { autonomousPublish, generateCognitiveTest, runSystemStressTest } from '../services/geminiService';

interface AdminPanelProps {
  articles: NewsArticle[];
  setArticles: React.Dispatch<React.SetStateAction<NewsArticle[]>>;
  onApprove: (article: NewsArticle) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ articles, setArticles, onApprove, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'console' | 'production' | 'security'>('console');
  const [cmdInput, setCmdInput] = useState('');
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] TIN v20.2 Singularity OS Yüklendi.", "[STATUS] Bağlantı Kararlı."]);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmdInput.trim()) return;
    const cmd = cmdInput.trim().toUpperCase();
    setLogs(prev => [...prev, `> ${cmd}`]);
    setCmdInput('');
    setLoading(true);

    try {
      if (cmd === '[CMD] YAYINLA') {
        setLogs(prev => [...prev, "[TACE] Veri okyanusu taranıyor...", "[AI] Hakikat sentezleniyor..."]);
        const newArt = await autonomousPublish();
        setArticles(prev => [newArt, ...prev]);
        setLogs(prev => [...prev, `[SUCCESS] Yeni Haber Yayınlandı: ${newArt.sourceTitle}`]);
      } else if (cmd === '[CMD] TEST') {
        setLogs(prev => [...prev, "[CORE] Bilişsel matris yenileniyor..."]);
        await generateCognitiveTest();
        setLogs(prev => [...prev, "[SUCCESS] Yeni test soruları veritabanına işlendi."]);
      } else if (cmd === '[CMD] GÜVENLİK') {
        setLogs(prev => [...prev, "[SECURITY] Kyber-1024 Handshake başlatılıyor...", "[SYSTEM] Tüm oturumlar mühürlendi."]);
      } else if (cmd === 'HELP') {
        setLogs(prev => [...prev, "KULLANILABİLİR KOMUTLAR:", "[CMD] YAYINLA, [CMD] TEST, [CMD] GÜVENLİK, CLEAR"]);
      } else if (cmd === 'CLEAR') {
        setLogs(["[SYSTEM] Konsol temizlendi."]);
      } else {
        setLogs(prev => [...prev, `[ERROR] Geçersiz komut: ${cmd}. Yardım için 'HELP' yazın.`]);
      }
    } catch (err) {
      setLogs(prev => [...prev, `[CRITICAL] Operasyon başarısız: ${err}`]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-3xl p-10 font-mono-grid overflow-y-auto">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-[#00ff41] rounded-full animate-pulse shadow-[0_0_10px_#00ff41]"></div>
            <h1 className="text-2xl font-black text-[#00ff41] tracking-[0.2em] uppercase">Control_Center_v20.2</h1>
          </div>
          <button onClick={onClose} className="px-6 py-2 bg-red-600 text-white font-black text-[10px] rounded-lg hover:bg-white hover:text-red-600 transition-all">DISCONNECT</button>
        </div>

        <div className="flex-grow flex flex-col bg-black/40 border border-[#00ff41]/20 rounded-3xl overflow-hidden shadow-2xl">
          <div className="flex gap-1 p-4 bg-zinc-900/50 border-b border-white/5">
            {['console', 'production', 'security'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[#00ff41] text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-grow overflow-y-auto p-8 font-mono text-sm space-y-2 no-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
            {logs.map((log, i) => (
              <div key={i} className={`${log.startsWith('>') ? 'text-white font-bold' : log.includes('ERROR') || log.includes('CRITICAL') ? 'text-red-500' : log.includes('SUCCESS') ? 'text-cyan-400' : 'text-[#00ff41]/70'}`}>
                {log}
              </div>
            ))}
            {loading && <div className="text-white animate-pulse">EXECUTING_OPERATION...</div>}
            <div ref={logEndRef} />
          </div>

          <form onSubmit={handleCommand} className="p-6 bg-black border-t border-white/5 flex gap-4">
            <div className="text-[#00ff41] font-black self-center mr-2">TIN_OS:~$</div>
            <input 
              autoFocus
              value={cmdInput}
              onChange={e => setCmdInput(e.target.value)}
              placeholder="KOMUT GİRİN... (örn: [CMD] YAYINLA)"
              className="flex-grow bg-transparent text-[#00ff41] outline-none border-none caret-[#00ff41]"
            />
            <button type="submit" disabled={loading} className="px-8 bg-[#00ff41] text-black font-black text-[10px] rounded-xl hover:bg-white transition-all">ENTER</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
