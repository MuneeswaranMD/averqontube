import React from 'react';
import { Search, Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative group w-full max-w-2xl mx-auto mb-10 translate-y-[-10px] opacity-0 animate-fade-in fill-mode-forwards">
      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:text-primary-500 transition-colors">
        <Search size={22} className="text-slate-400 dark:text-slate-600 group-focus-within:text-primary-500" />
      </div>
      <input
        type="text"
        placeholder="Search videos, shorts, or playlists..."
        className="block w-full pl-14 pr-32 py-5.5 glass rounded-[2.5rem] text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-all border border-white/40 dark:border-white/10 shadow-2xl hover:shadow-primary-500/5 group-hover:bg-white/80 dark:group-hover:bg-dark-800/80"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="absolute inset-y-2 right-2 flex gap-2">
         <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-primary-500/20 transition-all hover:scale-105 active:scale-95 group/search">
            Search
         </button>
      </div>
    </div>
  );
};

const Filters = ({ activeTab, setActiveTab }) => {
  const tabs = ["All Videos", "Shorts", "Playlists", "Popular", "Recent"];
  
  return (
    <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
      <div className="flex flex-wrap items-center gap-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 rounded-2xl font-bold transition-all text-sm tracking-wide ${
              activeTab === tab
                ? "bg-primary-500 text-white shadow-xl shadow-primary-500/30 scale-105"
                : "glass text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-800 border border-white/20"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      <div className="flex items-center gap-3">
        <button className="glass p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-dark-800 transition-all border border-white/20 group">
          <SlidersHorizontal size={20} className="text-slate-500 dark:text-slate-400 group-hover:text-primary-500" />
        </button>
        <button className="glass p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-dark-800 transition-all border border-white/20 group">
          <ArrowUpDown size={20} className="text-slate-500 dark:text-slate-400 group-hover:text-primary-500" />
        </button>
      </div>
    </div>
  );
};

export { SearchBar, Filters };
