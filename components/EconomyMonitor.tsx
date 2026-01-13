
import React from 'react';
import { Tokenomics } from '../types';

interface Props {
  data: Tokenomics;
}

const EconomyMonitor: React.FC<Props> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* TOTAL SUPPLY CARD */}
      <div className="bg-gradient-to-br from-zinc-900 to-black p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 text-7xl font-serif-display text-white/5 italic select-none">TIN</div>
        <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.4em] block mb-2">Total_Truth_Supply</span>
        <div className="text-4xl font-black text-white tracking-tighter mb-4">
          {data.totalSupply.toLocaleString()} <span className="text-xs text-cyan-400 uppercase font-mono-grid">Tokens</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" style={{ width: '65%' }}></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* INFLATION */}
        <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
          <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest mb-4">Inflation_Fixed</span>
          <div className="text-2xl font-black text-white">%{data.inflationRate}</div>
          <div className="mt-2 text-[8px] text-[#00ff41] font-black">STABLE_SIGNAL</div>
        </div>
        
        {/* SLASHED */}
        <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
          <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest mb-4">Total_Slashed_PoT</span>
          <div className="text-2xl font-black text-red-600">-{data.slashedTotal}</div>
          <div className="mt-2 text-[8px] text-red-500 font-black animate-pulse">PROTOCOL_ENFORCED</div>
        </div>
      </div>

      {/* STAKING STATUS */}
      <div className="bg-[#00ff41]/5 border border-[#00ff41]/20 p-8 rounded-[2rem] backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#00ff41]">Staking_Validator_Pool</h4>
          <span className="text-[10px] font-black text-white">{data.staked} TIN</span>
        </div>
        <button className="w-full bg-[#00ff41] text-black py-4 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,65,0.2)]">
          DELEGATE_TRUTH_POWER
        </button>
      </div>
    </div>
  );
};

export default EconomyMonitor;
