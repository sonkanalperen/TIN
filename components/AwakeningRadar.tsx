
import React from 'react';
import { AwakeningMetrics } from '../types';

interface Props {
  metrics: AwakeningMetrics;
}

const AwakeningRadar: React.FC<Props> = ({ metrics }) => {
  const points = [
    { label: 'MANTIK', val: metrics.logic },
    { label: 'EMPATİ', val: metrics.empathy },
    { label: 'SEZGİ', val: metrics.intuition },
    { label: 'EYLEM', val: metrics.action },
  ];

  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
      {/* Background Rings */}
      <div className="absolute inset-0 border border-[var(--primary)]/10 rounded-full scale-100"></div>
      <div className="absolute inset-0 border border-[var(--primary)]/10 rounded-full scale-75"></div>
      <div className="absolute inset-0 border border-[var(--primary)]/10 rounded-full scale-50"></div>
      
      {/* Radar Shape */}
      <svg className="w-full h-full overflow-visible drop-shadow-[0_0_10px_var(--primary)]">
        <polygon
          points={points.map((p, i) => {
            const angle = (i * Math.PI * 2) / points.length - Math.PI / 2;
            const r = (p.val / 100) * 128;
            return `${128 + Math.cos(angle) * r},${128 + Math.sin(angle) * r}`;
          }).join(' ')}
          fill="var(--primary)"
          fillOpacity="0.2"
          stroke="var(--primary)"
          strokeWidth="2"
          className="transition-all duration-1000 ease-out"
        />
        {points.map((p, i) => {
          const angle = (i * Math.PI * 2) / points.length - Math.PI / 2;
          const labelPos = 145;
          return (
            <text
              key={p.label}
              x={128 + Math.cos(angle) * labelPos}
              y={128 + Math.sin(angle) * labelPos}
              fill="var(--primary)"
              fontSize="8"
              fontWeight="900"
              textAnchor="middle"
              className="uppercase tracking-widest font-mono-grid opacity-50"
            >
              {p.label}
            </text>
          );
        })}
      </svg>
      
      <div className="absolute flex flex-col items-center">
        <span className="text-[10px] font-black text-[var(--primary)]/40 uppercase tracking-widest">Uyanış Oranı</span>
        <span className="text-3xl font-black text-[var(--primary)] font-serif-display">%{metrics.awakeningRate}</span>
      </div>
    </div>
  );
};

export default AwakeningRadar;
