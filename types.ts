export interface Analysis {
  content: string;
  keyPoints: string[];
}

export type UserArchetype = 'Architect' | 'Seeker' | 'Skeptic' | 'Sleeper';

export type PoliticalAlignment = 'iktidar' | 'muhalefet' | 'bagimsiz' | 'kozmik' | 'trend';
export type ThemeType = 'nyt' | 'matrix';
export type ThemeMode = 'light' | 'dark';

export interface AwakeningMetrics {
  logic: number;
  empathy: number;
  intuition: number;
  action: number;
  awakeningRate: number;
}

export interface NewsPackage {
  social: { twitterFlood: string[]; instagramHook: string; tiktokScript: string };
  imageUrl: string | null;
  audioData: string | null;
  deeperTruth?: string; 
}

export interface NewsArticle {
  id: string;
  sourceTitle: string;
  sourceUrl: string;
  sourceName: string;
  publishedAt: string;
  imageUrl?: string;
  mAnalysis?: Analysis;
  wAnalysis?: Analysis;
  politicalAnalysis?: string;
  tinSynthesis?: string;
  status: 'pending' | 'analyzing' | 'approved' | 'archived';
  category: string;
  alignment: PoliticalAlignment;
  package?: NewsPackage;
}

export interface UserStats {
  archetype: UserArchetype | string | null;
  metrics: AwakeningMetrics;
}

export type ImageSize = '1K' | '2K' | '4K';
export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export type ViewType = 'sohbet' | 'gazete' | 'hakkinda' | 'yonetim' | 'haber';
