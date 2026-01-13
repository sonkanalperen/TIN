
import React from 'react';

interface TopicBarProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}

const TopicBar: React.FC<TopicBarProps> = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <nav className="py-8 mb-8 sticky top-[80px] bg-[var(--bg)]/90 backdrop-blur-xl z-[45] overflow-x-auto no-scrollbar border-b border-white/5">
      <div className="flex space-x-4 items-center whitespace-nowrap px-4 max-w-7xl mx-auto">
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 mr-6">HAKİKAT_ODAKLARI:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-full border ${
              activeCategory === cat 
                ? 'bg-[var(--primary)] text-black border-[var(--primary)] shadow-[0_0_25px_var(--primary)]' 
                : 'bg-zinc-900/50 text-zinc-500 border-white/5 hover:border-[var(--primary)]/50 hover:text-[var(--primary)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default TopicBar;
