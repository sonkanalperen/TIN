
import React, { useState, useEffect, useRef, useCallback } from 'react';
import AwarenessRadar from './AwarenessRadar';
import LiveTaceFeed from './LiveTaceFeed';
import EconomyMonitor from './EconomyMonitor';
import DashboardLayout from './DashboardLayout';
import { UserStats, TaceFeedItem } from '../types';
import { fetchTaceFeed, runSystemStressTest } from '../services/geminiService';
import { performQuantumHandshake } from '../services/kyberAuthService';

const CoreDashboard: React.FC = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [feed, setFeed] = useState<TaceFeedItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(true);
  const [handshakeActive, setHandshakeActive] = useState(true);
  const [systemReport, setSystemReport] = useState<{ status: string; report: string } | null>(null);
  const intervalRef = useRef<number | null>(null);
  
  const updateFeed = useCallback(async () => {
    try {
      const data = await fetchTaceFeed();
      if (data && data.length > 0) {
        setFeed(prev => {
          const combined = [...data, ...prev];
          // sourceHash tabanlı tekilleştirme - Bellek sızıntısını önler
          const uniqueMap = new Map();
          combined.forEach(item => uniqueMap.set(item.sourceHash, item));
          return Array.from(uniqueMap.values()).slice(0, 15);
        });
      }
    } catch (e) {
      console.error("TACE Feed Sync Error:", e);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      // Kyber-1024 Handshake
      await performQuantumHandshake();
      
      // Stress Test
      const report = await runSystemStressTest();
      setSystemReport(report);
      
      setHandshakeActive(false);

      setStats({
        reputation: 2450,
        tokenBalance: 840,
        archetype: 'System Architect',
        metrics: { logic: 85, empathy: 45, intuition: 60, action: 90, awakeningRate: 72 },
        tokenomics: { 
          balance: 840, staked: 1500, reputation: 2450, inflationRate: 1.2,
          totalSupply: 1000000, slashedTotal: 12450 
        }
      });

      updateFeed();
      intervalRef.current = window.setInterval(updateFeed, 20000);
    };

    init();

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [updateFeed]);

  if (handshakeActive) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center font-mono-grid">
      <div className="relative mb-8">
        <div className="w-20 h-20 border-2 border-[#39FF14]/10 rounded-full animate-ping"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[#39FF14] text-2xl font-black">🔐</span>
        </div>
      </div>
      <div className="text-[10px] font-black text-[#39FF14] uppercase tracking-[1em] animate-pulse">
        STRESS_TEST_V20.1_INITIALIZING
      </div>
    </div>
  );

  if (!stats) return null;

  return (
    <DashboardLayout 
      title="The Core" 
      subtitle="Centralized_Intelligence_Dashboard_v20.1"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Awareness & Economy */}
        <div className="lg:col-span-4 space-y-8">
          {systemReport && (
            <div className="bg-[#39FF14]/5 border border-[#39FF14]/20 p-6 rounded-2xl animate-in zoom-in duration-500">
               <div className="flex items-center gap-2 mb-2">
                 <span className="w-2 h-2 bg-[#39FF14] rounded-full"></span>
                 <span className="text-[9px] font-black text-[#39FF14] uppercase tracking-widest">Sistem Hazır: {systemReport.status}</span>
               </div>
               <p className="text-[10px] text-zinc-400 font-serif-body italic leading-tight">
                 {systemReport.report}
               </p>
            </div>
          )}

          <div className="animate-in fade-in slide-in-from-left duration-700">
            <AwarenessRadar metrics={stats.metrics} />
          </div>
          
          <div className="animate-in fade-in slide-in-from-left duration-700 delay-200">
            <EconomyMonitor data={stats.tokenomics} />
          </div>
        </div>

        {/* Right: Live Feed & Alerts */}
        <div className="lg:col-span-8 space-y-8">
          <div className="h-[600px] animate-in fade-in slide-in-from-right duration-700">
            <LiveTaceFeed feed={feed} />
          </div>
          
          <div className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-red-500/20 relative overflow-hidden group hover:border-red-500/50 transition-all">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <span className="text-red-500 text-8xl">⚠️</span>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
                <h4 className="font-serif-display text-3xl font-black italic text-red-500">Quantum Sızıntısı Tespit Edildi</h4>
              </div>
              
              <p className="text-zinc-400 font-serif-body text-xl italic leading-relaxed max-w-2xl">
                Alt-katman 4'te gerçekleşen mikroskobik veri sızıntısı uyanış oranında kritik bir sapma yarattı. Kyber-1024 protokolü aktif savunma moduna geçmiştir.
              </p>
              
              <button className="mt-10 px-10 py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-red-600 transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)]">
                PROTOKOL_HIZALAMA_BAŞLAT
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoreDashboard;
