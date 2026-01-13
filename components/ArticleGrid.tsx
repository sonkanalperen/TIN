
import React from 'react';
import { NewsArticle } from '../types';

interface ArticleGridProps {
  articles: NewsArticle[];
  onOpen: (article: NewsArticle) => void;
  isLoading?: boolean;
}

const SkeletonCard: React.FC<{ isLarge?: boolean }> = ({ isLarge }) => (
  <div className={`border border-[var(--text)]/5 bg-[var(--bg)] rounded-[1.5rem] overflow-hidden animate-pulse ${isLarge ? 'md:col-span-2' : ''}`}>
    <div className={`bg-[var(--accent)] relative overflow-hidden ${isLarge ? 'aspect-[3/1]' : 'aspect-video'}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--primary)]/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
    </div>
    <div className="p-6 space-y-4">
      <div className="h-6 bg-[var(--accent)] rounded-lg w-3/4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-[var(--accent)] rounded-lg w-full"></div>
        <div className="h-3 bg-[var(--accent)] rounded-lg w-5/6"></div>
      </div>
      <div className="pt-4 border-t border-[var(--text)]/5 flex justify-between">
        <div className="h-2 bg-[var(--accent)] rounded-lg w-20"></div>
        <div className="h-2 bg-[var(--accent)] rounded-lg w-10"></div>
      </div>
    </div>
  </div>
);

const ArticleGrid: React.FC<ArticleGridProps> = ({ articles, onOpen, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} isLarge={i === 0} />
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-zinc-500">
        <p className="font-serif-body italic text-lg opacity-30 uppercase tracking-widest text-sm">Hakikat bekleniyor...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article, index) => {
        const isLarge = index % 7 === 0;
        return (
          <div 
            key={article.id}
            onClick={() => onOpen(article)}
            className={`cursor-pointer group relative flex flex-col border border-[var(--text)]/5 bg-[var(--bg)] hover:border-[var(--primary)]/30 transition-all duration-500 rounded-[1.5rem] overflow-hidden ${isLarge ? 'md:col-span-2' : ''}`}
          >
            <div className={`overflow-hidden bg-[var(--accent)] relative ${isLarge ? 'aspect-[3/1]' : 'aspect-video'}`}>
              {article.imageUrl ? (
                <img 
                  src={article.imageUrl} 
                  alt={article.sourceTitle} 
                  className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-800 text-[8px] font-black uppercase tracking-widest">Görüntü İşleniyor</div>
              )}
              
              <div className="absolute bottom-3 left-4">
                <span className="bg-[var(--primary)] text-[var(--bg)] text-[7px] px-3 py-1 font-black uppercase tracking-widest rounded-md">
                  {article.category}
                </span>
              </div>
            </div>
            
            <div className="p-6 flex-grow flex flex-col justify-between">
              <div>
                <h3 className={`font-serif-display leading-tight mb-3 group-hover:text-[var(--primary)] transition-colors ${isLarge ? 'text-2xl font-black' : 'text-lg font-bold'}`}>
                  {article.sourceTitle}
                </h3>
                <p className="font-serif-body text-[var(--text)]/50 line-clamp-2 mb-4 italic text-xs leading-relaxed">
                  {article.tinSynthesis?.split('\n')[0]}
                </p>
              </div>
              
              <div className="flex justify-between items-center text-[8px] text-zinc-600 font-black uppercase tracking-widest pt-4 border-t border-[var(--text)]/5">
                <span>{article.sourceName}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--primary)]">OKU →</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ArticleGrid;
