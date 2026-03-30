import React from 'react';
import { cn } from '../utils/cn';

const categories = ['All Content', 'Technology', 'Coding', 'A.I.', 'Tutorials', 'Startups', 'Design', 'Case Studies', 'Recent Uploads', 'Popular'];

const CategoryFilter = ({ activeCategory, onSelect }) => {
  return (
    <div className="flex px-6 md:px-16 overflow-x-auto no-scrollbar gap-2.5 py-4 font-inter">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={cn(
            "px-4 py-2 rounded-lg text-[10px] md:text-xs font-bold tracking-tight transition-all whitespace-nowrap border cursor-pointer",
            activeCategory === category 
              ? "bg-white text-black border-white shadow-xl" 
              : "bg-netflix-gray hover:bg-white/10 text-white/40 border-white/5 hover:text-white"
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
