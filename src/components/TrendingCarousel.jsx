import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const TrendingCarousel = ({ trendingVideos }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group/carousel mb-20 animate-fade-in delay-500 fill-mode-forwards opacity-0">
      <div className="flex items-center justify-between mb-8">
         <div className="flex items-center gap-4">
            <div className="bg-primary-500 p-3 rounded-2xl shadow-xl shadow-primary-500/20">
               <TrendingUp size={24} className="text-white" />
            </div>
            <div>
               <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 italic tracking-tighter uppercase">Trending Clips</h2>
               <p className="text-slate-500 dark:text-slate-400 font-bold text-xs tracking-widest uppercase">Popular right now</p>
            </div>
         </div>
         <div className="flex gap-3">
            <button 
              onClick={() => scroll('left')}
              className="glass p-3 rounded-2xl hover:bg-white dark:hover:bg-dark-800 transition-all border border-white/20 shadow-lg group active:scale-95"
            >
              <ChevronLeft size={20} className="text-slate-600 dark:text-slate-300 group-hover:text-primary-500" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="glass p-3 rounded-2xl hover:bg-white dark:hover:bg-dark-800 transition-all border border-white/20 shadow-lg group active:scale-95"
            >
              <ChevronRight size={20} className="text-slate-600 dark:text-slate-300 group-hover:text-primary-500" />
            </button>
         </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto pb-10 px-4 -mx-4 no-scrollbar scroll-smooth"
      >
        {trendingVideos.map((video, index) => (
          <motion.div
            key={video.id}
            whileHover={{ scale: 1.05, translateY: -10 }}
            className="flex-shrink-0 w-80 md:w-[450px] relative rounded-[2.5rem] overflow-hidden shadow-2xl group border-[3px] border-transparent hover:border-primary-500 transition-all duration-500 cursor-pointer"
          >
            <div className="aspect-[21/9] overflow-hidden">
               <img 
                 src={video.thumbnail} 
                 alt={video.title} 
                 className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-10 flex flex-col justify-end backdrop-blur-[1px] group-hover:backdrop-blur-none transition-all">
                  <span className="bg-primary-500 text-white text-[10px] px-4 py-1.5 rounded-full font-black tracking-widest uppercase mb-4 w-fit shadow-lg">Trending #0{index + 1}</span>
                  <h3 className="text-2xl md:text-3xl font-black text-white italic tracking-tighter uppercase drop-shadow-2xl">{video.title}</h3>
               </div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-3xl p-6 rounded-full border border-white/30 scale-0 group-hover:scale-100 transition-transform duration-500">
                   <Play size={40} className="text-white fill-current" />
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TrendingCarousel;
