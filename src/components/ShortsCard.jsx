import React from 'react';
import { Play, Eye, Share2, MoreVertical, Film } from 'lucide-react';
import { motion } from 'framer-motion';

const ShortsCard = ({ short, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -10, scale: 1.05 }}
      className="relative shorts-aspect rounded-3xl overflow-hidden shadow-xl group border-2 border-transparent hover:border-primary-500 transition-all duration-300 cursor-pointer w-full max-w-[240px]"
    >
      <img 
        src={short.thumbnail} 
        alt={short.title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-4 px-6">
        <div className="flex justify-between items-start translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
           <div className="bg-primary-500/80 backdrop-blur-md p-2 rounded-full border border-white/20">
               <Film size={18} className="text-white" />
           </div>
           <button className="bg-black/30 backdrop-blur-md p-2 rounded-full border border-white/10 hover:bg-white/20 transition-colors">
              <MoreVertical size={18} className="text-white" />
           </button>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-bold text-white leading-tight line-clamp-2 text-sm md:text-base drop-shadow-md">
            {short.title}
          </h3>
          <div className="flex items-center justify-between text-xs font-semibold text-white/90">
            <div className="flex items-center gap-1.5 flex-shrink-0">
               <Eye size={14} className="text-primary-400" />
               <span>{short.views} views</span>
            </div>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/10 transition-colors group-hover:scale-110">
               <Share2 size={14} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ShortsCard;
