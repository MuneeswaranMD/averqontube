import React from 'react';
import { Play, Layers, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

const PlaylistCard = ({ playlist, index, onOpen }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4 }}
      onClick={() => onOpen?.(playlist)}
      className="bg-netflix-gray rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all cursor-pointer group border border-white/5 relative aspect-video"
    >
      <div className="relative w-full h-full">
        <img 
          src={playlist.thumbnail} 
          alt={playlist.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60"
        />
        
        {/* Simple Stack indicator */}
        <div className="absolute inset-y-0 right-0 w-1/4 bg-black/60 backdrop-blur-xl flex flex-col items-center justify-center text-white gap-0.5 border-l border-white/5 z-10 font-inter">
            <Layers size={14} className="text-netflix-red mb-1 opacity-70" />
            <span className="text-sm font-bold tracking-tight leading-none">{playlist.videoCount}</span>
            <span className="text-[8px] font-bold tracking-tight uppercase opacity-40">EPISODES</span>
        </div>

        {/* Simple Content Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent p-4 flex flex-col justify-end gap-2">
          <div className="flex justify-between items-start gap-4">
            <h3 className="font-bold text-white leading-tight line-clamp-1 group-hover:text-white transition-all duration-300 tracking-tight text-xs md:text-sm font-inter">
              {playlist.title}
            </h3>
            <button className="text-white/20 hover:text-white transition-colors">
              <MoreVertical size={14} />
            </button>
          </div>
          
          <button 
             onClick={(e) => { e.stopPropagation(); onOpen?.(playlist); }}
             className="mt-1 w-fit bg-white hover:bg-white/90 text-black px-3 py-1.5 rounded-lg text-[9px] font-bold tracking-tight uppercase flex items-center gap-1.5 transition-all active:scale-95 group-hover:scale-105"
          >
            <Play size={8} className="fill-current" />
            <span>Open Series</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PlaylistCard;
