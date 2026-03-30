import React from 'react';
import { Play, MoreVertical, Eye, Calendar, Share2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const VideoCard = ({ video, onClick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group border border-white/20 dark:border-white/5"
      onClick={() => onClick(video)}
    >
      <div className="relative group overflow-hidden">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
          <div className="bg-white/20 p-4 rounded-full backdrop-blur-xl border border-white/40 scale-0 group-hover:scale-100 transition-transform duration-500">
            <Play size={24} className="text-white fill-current" />
          </div>
        </div>
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
           <div className="bg-black/50 p-2 rounded-full backdrop-blur-md border border-white/10 hover:bg-primary-500 transition-colors">
              <Heart size={16} className="text-white" />
           </div>
           <div className="bg-black/50 p-2 rounded-full backdrop-blur-md border border-white/10 hover:bg-primary-500 transition-colors">
              <Share2 size={16} className="text-white" />
           </div>
        </div>
        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-bold backdrop-blur-sm border border-white/10 tracking-widest uppercase">
          {video.duration}
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start gap-4 mb-2">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 leading-tight line-clamp-2 text-sm md:text-base group-hover:text-primary-500 transition-colors">
            {video.title}
          </h3>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>
        
        <div className="flex items-center flex-wrap gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Eye size={14} className="text-primary-400" />
            <span>{video.views}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-primary-400" />
            <span>{video.publishedAt}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoCard;
