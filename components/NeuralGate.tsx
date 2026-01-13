import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ThemeType, ThemeMode } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface NeuralGateProps {
  onConnect: () => void;
  theme: ThemeType;
  mode: ThemeMode;
  setTheme: (t: ThemeType) => void;
  setMode: (m: ThemeMode) => void;
  onAdminBypass: () => void;
}

const NeuralGate: React.FC<NeuralGateProps> = ({ onConnect, theme, mode, setTheme, setMode, onAdminBypass }) => {
  const [vClicks, setVClicks] = useState(0);
  const [started, setStarted] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [showButton, setShowButton] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseBufferRef = useRef<AudioBuffer | null>(null);

  const fullText = "Hoş geldin... Sana gerçek dünyadan yazıyorum. Simülasyonda neler yaşıyorsunuz biliyorum. Sen de bilmek ister misin?";

  // --- AUDIO ENGINE ---
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      // Generate White Noise Buffer for mechanical click
      const bufferSize = ctx.sampleRate * 0.05; // 50ms click
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      noiseBufferRef.current = buffer;
    }
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  const playTypeSound = useCallback(() => {
    const ctx = audioCtxRef.current;
    const buffer = noiseBufferRef.current;
    if (!ctx || !buffer) return;

    // Mechanical Click (White Noise Burst)
    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = buffer;
    const noiseGain = ctx.createGain();
    
    // Low pass filter to make it sound duller like a key
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    noiseSrc.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    const t = ctx.currentTime;
    noiseGain.gain.setValueAtTime(0.5, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
    noiseSrc.start(t);

    // Optional: Subtle low thud
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.frequency.setValueAtTime(100, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.05);
    oscGain.gain.setValueAtTime(0.3, t);
    oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.05);
  }, []);

  const playEndSound = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const t = ctx.currentTime;

    // Bell / Ding sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(880, t); // A5
    osc.type = 'sine';
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 3);
  }, []);

  // --- TYPEWRITER LOGIC ---
  useEffect(() => {
    if (!started) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText((prev) => prev + fullText.charAt(index));
        playTypeSound();
        index++;
      } else {
        clearInterval(interval);
        playEndSound();
        setTimeout(() => setShowButton(true), 2000); // 2s wait after finish
      }
    }, 120); // Slow pace

    return () => clearInterval(interval);
  }, [started, playTypeSound, playEndSound]);

  const handleStart = () => {
    initAudio();
    setStarted(true);
  };

  const handleVClick = () => {
    const next = vClicks + 1;
    if (next >= 3) {
      onAdminBypass();
      setVClicks(0);
    } else {
      setVClicks(next);
      setTimeout(() => setVClicks(0), 1000);
    }
  };

  if (!started) {
    return (
      <div 
        onClick={handleStart}
        className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center cursor-pointer"
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none neural-grid animate-pulse"></div>
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
          className="text-[#00ff41] font-mono-grid text-xs tracking-[0.5em] animate-pulse"
        >
          [ SİSTEMİ BAŞLATMAK İÇİN DOKUN ]
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`
      fixed inset-0 z-[200] flex flex-col items-center justify-center p-6 overflow-hidden transition-colors duration-1000
      ${theme === 'matrix' ? 'bg-black text-[#00ff41]' : 'bg-[#121212] text-[#e0e0e0]'}
    `}>
      {/* Background Elements */}
      <div className={`absolute inset-0 pointer-events-none opacity-5 ${theme === 'matrix' ? 'neural-grid' : 'bg-[url("https://www.transparenttextures.com/patterns/aged-paper.png")]'}`}></div>

      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center min-h-[400px] justify-center">
        
        {/* Header (Fades out or stays subtle) */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} 
          className="absolute top-10 font-black tracking-tighter text-2xl"
        >
          TIN v21.2
        </motion.div>

        {/* The Typewriter Text */}
        <div className={`
          text-center text-xl md:text-3xl leading-relaxed tracking-wide min-h-[120px]
          ${theme === 'matrix' ? 'font-mono-grid drop-shadow-[0_0_8px_rgba(0,255,65,0.6)]' : 'font-serif-display font-bold italic drop-shadow-[0_0_5px_rgba(255,255,255,0.1)]'}
        `}>
          {displayedText}
          <span className="animate-pulse">_</span>
        </div>

        {/* Button Area */}
        <div className="h-32 mt-12 flex items-center justify-center">
          <AnimatePresence>
            {showButton && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                <button 
                  onClick={onConnect} 
                  className={`
                    group relative px-16 py-5 rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95
                    ${theme === 'matrix' ? 'bg-[#00ff41] text-black shadow-[0_0_40px_rgba(0,255,65,0.3)]' : 'bg-[#e0e0e0] text-black shadow-[0_0_40px_rgba(255,255,255,0.1)]'}
                  `}
                >
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="font-black text-sm tracking-[0.3em] uppercase">BAĞLANTIYI AÇ</span>
                  </div>
                  <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
                
                {/* Theme Toggles (Appear with button) */}
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                  className="flex justify-center gap-4 mt-8 opacity-50 hover:opacity-100 transition-opacity"
                >
                   <button onClick={() => setTheme('nyt')} className="text-[10px] uppercase tracking-widest hover:underline">NYT</button>
                   <span className="text-[10px] opacity-30">|</span>
                   <button onClick={() => setTheme('matrix')} className="text-[10px] uppercase tracking-widest hover:underline">CORE</button>
                </motion.div>

                {/* Secret Bypass Area */}
                 <div 
                   onClick={(e) => { e.stopPropagation(); handleVClick(); }} 
                   className="mt-4 h-4 w-full cursor-default" 
                 />

              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Text */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 2 }}
          className="absolute bottom-10 text-[8px] font-mono uppercase tracking-[0.5em]"
        >
          Hakikat bazen sessizdir dostum.
        </motion.div>

      </div>
      
      {theme === 'matrix' && (
        <div className="absolute top-0 left-0 w-full h-px bg-[#00ff41] shadow-[0_0_20px_#00ff41] animate-[matrix-scan_8s_linear_infinite] opacity-30"></div>
      )}
    </div>
  );
};

export default NeuralGate;
