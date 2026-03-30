import React from 'react';
import { X, Play, Heart, Share2, MessageCircle, Eye, Calendar, Bookmark, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const VideoModal = ({ video, onClose }) => {
  if (!video) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex justify-center bg-black/95 backdrop-blur-[50px] overflow-y-auto no-scrollbar font-inter py-10 md:py-16 px-4 md:px-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="relative bg-[#0F0F0F] w-full max-w-5xl rounded-[2rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/[0.08] h-fit self-start mb-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Simple Close UI - Absolute to modal to ensure it's always visible with modal */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-[110] p-3 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white rounded-xl transition-all border border-white/5 active:scale-95 group shadow-xl"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Video Player */}
        <div className="w-full aspect-video bg-black relative">
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=0&modestbranding=1&rel=0`}
            title={video.title}
            className="w-full h-full border-0 absolute inset-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <div className="absolute inset-x-0 -bottom-1 h-24 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/40 to-transparent pointer-events-none" />
        </div>

        {/* Modal Content */}
        <div className="p-8 md:p-12 xl:p-14 space-y-10 font-inter">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/[0.05] pb-10">
            <div className="space-y-4 max-w-2xl">
               <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-white/[0.05] rounded-md text-[9px] font-bold text-white/30 tracking-widest uppercase border border-white/[0.05]">
                    LATEST PRODUCTION
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-semibold text-white/20 tracking-tight">
                    <Eye size={14} className="opacity-40" />
                    <span>{video.views} Views</span>
                    <span className="w-1 h-1 bg-white/10 rounded-full" />
                    <Calendar size={14} className="opacity-40" />
                    <span>{video.publishedAt}</span>
                  </div>
               </div>
               <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                  {video.title}
               </h2>
               <div className="flex items-center gap-3 pt-1">
                 <div className="w-8 h-8 rounded-full bg-white/5 overflow-hidden border border-white/10">
                    <img src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e" className="w-full h-full object-cover" />
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white opacity-60">MUNEES STUDIO</span>
                    <CheckCircle2 size={10} className="text-blue-500 fill-current" />
                 </div>
               </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-6 py-3 bg-white hover:bg-neutral-200 text-black rounded-xl flex items-center justify-center gap-2.5 font-bold transition-all active:scale-95 shadow-lg group">
                <Play size={16} className="fill-current text-black" />
                <span className="text-xs font-bold tracking-tight">RESUME VIDEO</span>
              </button>
              <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 text-white">
                <Bookmark size={18} />
              </button>
              <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 text-white">
                <Share2 size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-12 md:gap-16">
            <div className="space-y-8">
              <p className="text-sm md:text-base text-white/40 font-medium leading-relaxed max-w-3xl">
                {video.description || "In this premium spotlight release, we dive deep into the next generation of creative tools and strategies shaping the creator economy. Explore the evolution of modern media consumption."}
              </p>
              
              <div className="flex flex-wrap gap-2 pt-2">
                 {[ "NextGen", "Spotlight", "Masterclass", "Economy" ].map(tag => (
                   <span key={tag} className="px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-lg text-[10px] font-bold text-white/[0.15] hover:text-white/40 transition-colors uppercase cursor-default">
                      #{tag}
                   </span>
                 ))}
              </div>
            </div>

            <div className="space-y-10">
               <div className="space-y-5">
                  <h4 className="text-[9px] font-black text-white/10 tracking-[0.2em] uppercase">Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl group hover:border-white/10 hover:bg-white/[0.05] transition-all">
                       <span className="text-xs font-bold text-white/30 group-hover:text-white/50 transition-colors">Total Loves</span>
                       <span className="text-xs font-bold text-white">7.2K</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl group hover:border-white/10 hover:bg-white/[0.05] transition-all">
                       <span className="text-xs font-bold text-white/30 group-hover:text-white/50 transition-colors">Comments</span>
                       <span className="text-xs font-bold text-white">1.4K</span>
                    </div>
                  </div>
               </div>

               <div className="pt-6 border-t border-white/[0.05] flex items-center justify-between group cursor-pointer">
                  <span className="text-[10px] font-bold text-white/20 group-hover:text-white/50 transition-colors uppercase tracking-widest">In-depth Analysis</span>
                  <ChevronRight size={14} className="text-white/10 group-hover:translate-x-1 transition-all" />
               </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VideoModal;
