
import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { UserStats, UserArchetype } from '../types';

interface DeepAIContextType {
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
  archetype: UserArchetype;
  simulationStability: number;
}

const DeepAIContext = createContext<DeepAIContextType | undefined>(undefined);

export const DeepAIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userStats, setUserStats] = useState<UserStats>({
    reputation: 1250,
    tokenBalance: 450.5,
    archetype: null,
    metrics: { logic: 60, empathy: 55, intuition: 40, action: 70, awakeningRate: 56 },
    tokenomics: { balance: 450.5, staked: 1000, reputation: 1250, inflationRate: 1.2, totalSupply: 1000000, slashedTotal: 500 }
  });

  // Fix: Explicitly typing the return value of useMemo to UserArchetype to prevent it from being inferred as string.
  const archetype = useMemo<UserArchetype>(() => {
    const rate = userStats.metrics.awakeningRate;
    if (rate >= 80) return 'Architect';
    if (rate >= 60) return 'Seeker';
    if (rate >= 40) return 'Skeptic';
    return 'Sleeper';
  }, [userStats.metrics.awakeningRate]);

  const simulationStability = useMemo(() => {
    // Uyanış oranı arttıkça simülasyonun kararlılığı azalır (gerçeklik sızar)
    return Math.max(0, 100 - userStats.metrics.awakeningRate);
  }, [userStats.metrics.awakeningRate]);

  const value = useMemo(() => ({
    userStats: { ...userStats, archetype },
    setUserStats,
    archetype,
    simulationStability
  }), [userStats, archetype, simulationStability]);

  return (
    <DeepAIContext.Provider value={value}>
      {children}
    </DeepAIContext.Provider>
  );
};

export const useDeepAI = () => {
  const context = useContext(DeepAIContext);
  if (!context) throw new Error("useDeepAI must be used within DeepAIProvider");
  return context;
};
