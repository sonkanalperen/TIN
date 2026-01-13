
import React from 'react';
import { AwakeningMetrics } from '../types';

interface Props {
  metrics: AwakeningMetrics;
}

const AwarenessRadar: React.FC<Props> = ({ metrics }) => {
  const points = [
    { label: 'LOGIC', val: metrics.logic },
    { label: 'CONSCIENCE', val: metrics.empathy },
    { label: 'INTUITION', val: metrics.intuition },
    { label: 'ACTION', val: metrics.action },
  ];

  const size = 300;
  const center = size / 2;
  const radius = center - 40;

  const getCoordinates = (val: number, index: number) => {
    const angle = (index * Math.PI * 2) / points.length - Math.PI / 2;
    const r = (val / 100) * radius;
    return {
      x: center + Math.cos(angle) * r,
      y: center + Math.sin(angle) * r
    };
  };

  const polygonPath = points.map((p, i) => {
    const coords = getCoordinates(p.val, i);
    return `${coords.x},${coords.y}`;
  }).join(' ');

  return (
    <div className="relative flex items-center justify-center bg-zinc-950/50 p-8 rounded-[2rem] border border-white/5">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grids */}
        {[0.25, 0.5, 0.75, 1].map((scale) => (
          <circle
            key={scale}
            cx={center}
            cy={center}
            r={radius * scale}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}
        
        {/* Axis Lines */}
        {points.map((_, i) => {
          const coords = getCoordinates(100, i);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={coords.x}
              y2={coords.y}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          );
        })}

        {/* The Awareness Polygon */}
        <polygon
          points={polygonPath}
          fill="rgba(0, 255, 65, 0.15)"
          stroke="#00ff41"
          strokeWidth="2"
          className="transition-all duration-1000 ease-in-out"
          style={{ filter: 'drop-shadow(0 0 8px rgba(0, 255, 65, 0.4))' }}
        />

        {/* Labels */}
        {points.map((p, i) => {
          const coords = getCoordinates(125, i);
          return (
            <text
              key={p.label}
              x={coords.x}
              y={coords.y}
              fill={p.val > 70 ? "#00ff41" : "rgba(255,255,255,0.4)"}
              fontSize="9"
              fontWeight="900"
              textAnchor="middle"
              className="tracking-[0.2em] font-mono-grid uppercase"
            >
              {p.label}
            </text>
          );
        })}
      </svg>
      
      <div className="absolute flex flex-col items-center">
        <span className="text-[7px] font-black text-zinc-500 uppercase tracking-[0.5em] mb-1">AWARENESS_INDEX</span>
        <span className="text-4xl font-black text-white font-serif-display italic">%{metrics.awakeningRate}</span>
      </div>
    </div>
  );
};

export default AwarenessRadar;
