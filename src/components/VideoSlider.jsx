import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Heart, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const VideoSlider = ({ title, videos, onPlay, isShorts = false, noTitle = false }) => {
  const sliderRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      sliderRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleScroll = (e) => {
    setShowLeftArrow(e.target.scrollLeft > 0);
    setShowRightArrow(e.target.scrollLeft < e.target.scrollWidth - e.target.clientWidth - 10);
  };

  return (
    <div className="relative py-4 md:py-6 group/slider font-inter">
      {/* Simple & Small Title */}
      {title && !noTitle && (
        <div className="px-4 md:px-12 mb-4 lg:mb-6">
           <h2 className="text-sm md:text-base font-bold text-white/80 tracking-tight uppercase">
             {title}
           </h2>
        </div>
      )}

      <div className="relative group/arrows h-full">
        {showLeftArrow && (
           <button 
             onClick={() => scroll('left')}
             className="absolute left-0 top-0 bottom-0 z-40 bg-black/30 hover:bg-black/60 w-10 lg:w-14 flex items-center justify-center text-white transition-all backdrop-blur-sm group-hover/arrows:opacity-100 opacity-0 rounded-r-xl border-r border-white/5"
           >
             <ChevronLeft size={20} />
           </button>
        )}
        
        {showRightArrow && (
           <button 
             onClick={() => scroll('right')}
             className="absolute right-0 top-0 bottom-0 z-40 bg-black/30 hover:bg-black/60 w-10 lg:w-14 flex items-center justify-center text-white transition-all backdrop-blur-sm group-hover/arrows:opacity-100 opacity-0 rounded-l-xl border-l border-white/5"
           >
             <ChevronRight size={20} />
           </button>
        )}

        <div 
          ref={sliderRef}
          onScroll={handleScroll}
          className={cn(
            "flex overflow-x-auto gap-3 no-scrollbar px-4 md:px-12 pb-4 h-full",
            isShorts ? "snap-x" : ""
          )}
        >
          {videos.map((video, idx) => (
            <motion.div 
               key={video.id + idx}
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               transition={{ delay: idx * 0.05, duration: 0.3 }}
               className={cn(
                 "relative flex-shrink-0 cursor-pointer transition-all duration-300",
                 isShorts ? "w-36 md:w-40 aspect-shorts snap-start" : "w-48 md:w-60 lg:w-64 aspect-video snap-start"
               )}
               onClick={() => onPlay(video)}
            >
               <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#111] border border-white/5 hover:border-white/20 transition-all duration-500 shadow-md">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                  
                  {/* Hover Overlay - Minimal & Simple */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end p-4 gap-2">
                     <div className="flex gap-2">
                        <button className="p-2 bg-white rounded-full text-black hover:scale-110 active:scale-95 transition-all">
                           <Play size={10} className="fill-current" />
                        </button>
                        <button className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all">
                           <Plus size={10} />
                        </button>
                     </div>
                     <h3 className="text-[10px] md:text-[11px] font-bold text-white tracking-tight line-clamp-1 uppercase">
                        {video.title}
                     </h3>
                     <div className="flex items-center gap-2 text-[8px] font-medium text-white/30 tracking-tight">
                        <span>{video.views} Views</span>
                        <span className="w-0.5 h-0.5 bg-white/10 rounded-full" />
                        <span>HD Stream</span>
                     </div>
                  </div>

                  {/* Duration tag */}
                  <div className="absolute bottom-2 right-2 bg-black/60 rounded-md py-0.5 px-1.5 text-[8px] font-bold text-white group-hover:opacity-0 transition-opacity">
                     {video.duration || '07:34'}
                  </div>
               </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoSlider;
