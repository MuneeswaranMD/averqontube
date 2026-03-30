import React, { useState, useEffect } from 'react';
import { Play, CheckCircle2, Plus, Info, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

const HeroBanner = ({ videos = [], channelInfo, onPlay }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const featuredVideos = videos.slice(0, 5);

  useEffect(() => {
    if (featuredVideos.length === 0 || isExpanded) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredVideos.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [featuredVideos.length, isExpanded]);

  if (featuredVideos.length === 0) return null;
  const currentVideo = featuredVideos[currentIndex];

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className="relative w-full h-[65vh] md:h-[75vh] lg:h-[85vh] bg-netflix-black overflow-hidden group">
      {/* Dynamic Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentVideo.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={currentVideo.thumbnail} 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-netflix-black/60 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content Layer */}
      <div className={cn(
        "absolute inset-0 z-10 flex flex-col px-4 md:px-12 transition-all duration-500",
        isExpanded ? "justify-center bg-black/60 backdrop-blur-sm" : "justify-end pb-32 md:pb-48"
      )}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentVideo.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 md:space-y-6 max-w-4xl"
          >
            {/* Identity Badge */}
            <div className="flex items-center gap-2.5">
               <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-white/20 overflow-hidden ring-2 ring-netflix-red/30">
                  <img src={channelInfo.profileImageUrl} alt="Channel" className="w-full h-full object-cover" />
               </div>
               <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 md:px-3 py-1 rounded-full border border-white/10">
                  <h3 className="text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest">{channelInfo.name}</h3>
                  <CheckCircle2 size={10} className="text-blue-400 fill-current" />
               </div>
            </div>

            <h1 className={cn(
              "font-black text-white tracking-tighter leading-[1.1] uppercase drop-shadow-xl transition-all duration-500",
              isExpanded ? "text-lg md:text-xl" : "text-xl md:text-2xl lg:text-3xl max-w-xl"
            )}>
               {currentVideo.title}
            </h1>
            
            <div className="max-w-md space-y-2">
               <p className={cn(
                 "text-white/40 font-medium leading-relaxed transition-all duration-300",
                 isExpanded ? "text-[10px] md:text-xs opacity-100" : "text-[8px] md:text-[9px] line-clamp-2"
               )}>
                  {currentVideo.description || channelInfo.description}
               </p>
               <button 
                  onClick={toggleExpand}
                  className="flex items-center gap-1 text-netflix-red text-[7px] md:text-[8px] font-black uppercase tracking-widest hover:text-white transition-colors"
               >
                  {isExpanded ? (
                    <><ChevronUp size={10} /> Show Less</>
                  ) : (
                    <><ChevronDown size={10} /> Show More</>
                  )}
               </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1 md:pt-2">
              <button 
                onClick={() => onPlay(currentVideo)}
                className="px-4 md:px-5 py-1.5 md:py-2 bg-white hover:bg-netflix-red hover:text-white text-black rounded-md flex items-center justify-center gap-1.5 md:gap-2 transition-all active:scale-95 shadow-xl group/play"
              >
                <Play size={10} className="fill-current group-hover/play:scale-110 transition-transform" />
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.1em]">Watch Now</span>
              </button>
              
              <button className="px-4 md:px-5 py-1.5 md:py-2 bg-white/10 hover:bg-white/20 text-white rounded-md flex items-center justify-center gap-1.5 md:gap-2 transition-all active:scale-95 border border-white/10 backdrop-blur-md">
                <Plus size={10} />
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.1em]">My List</span>
              </button>

              <button className="p-1.5 md:p-2 bg-white/10 hover:bg-white/20 rounded-md text-white transition-all border border-white/10 backdrop-blur-md">
                <Info size={12} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Indicators - Carousel Controls */}
      {!isExpanded && (
        <div className="absolute bottom-16 right-4 md:right-12 z-30 flex items-center gap-4">
          <div className="flex gap-2">
            {featuredVideos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  "h-0.5 md:h-1 transition-all duration-500 rounded-full",
                  currentIndex === i ? "w-6 md:w-8 bg-netflix-red" : "w-3 md:w-4 bg-white/20"
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* Manual Navigation */}
      {!isExpanded && (
        <div className="hidden group-hover:flex absolute top-1/2 -translate-y-1/2 w-full justify-between px-4 z-20 pointer-events-none">
          <button 
            onClick={() => setCurrentIndex((prev) => (prev - 1 + featuredVideos.length) % featuredVideos.length)}
            className="p-2 md:p-3 rounded-full bg-black/40 hover:bg-netflix-red text-white transition-all pointer-events-auto backdrop-blur-sm border border-white/5"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={() => setCurrentIndex((prev) => (prev + 1) % featuredVideos.length)}
            className="p-2 md:p-3 rounded-full bg-black/40 hover:bg-netflix-red text-white transition-all pointer-events-auto backdrop-blur-sm border border-white/5"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-netflix-black to-transparent z-20 pointer-events-none" />
    </div>
  );
};

export default HeroBanner;
