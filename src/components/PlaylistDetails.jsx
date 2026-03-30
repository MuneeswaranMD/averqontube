import React from 'react';
import { Play, ArrowLeft, Clock, Eye, Calendar, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

const PlaylistDetails = ({ playlist, videos, onBack, onPlayVideo }) => {
  return (
    <div className="min-h-screen bg-netflix-black text-white font-inter">
      {/* Cinematic Header Overlay */}
      <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/60 to-transparent z-10" />
        <img 
          src={videos[0]?.thumbnail || playlist.thumbnail} 
          alt={playlist.title} 
          className="w-full h-full object-cover opacity-40 scale-105 blur-sm"
        />
        
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="absolute top-24 left-4 md:left-12 z-20 flex items-center gap-2 text-white/50 hover:text-white transition-all group bg-black/40 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/5"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold tracking-widest uppercase">Go Back</span>
        </button>

        <div className="absolute bottom-12 left-4 md:left-12 z-20 max-w-2xl space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-netflix-red/20 text-netflix-red px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase border border-netflix-red/30">
              Series Hub
            </span>
            <span className="text-white/40 text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 ml-2">
              <Layers size={10} /> {playlist.videoCount} Episodes
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none uppercase">
            {playlist.title}
          </h1>
          <p className="text-white/40 text-xs md:text-sm font-medium leading-relaxed line-clamp-3 md:line-clamp-none max-w-xl">
             Explore every episode in this professional transmission series. Experience cinematic storytelling through high-density productions.
          </p>
        </div>
      </div>

      {/* Episode Navigation Grid */}
      <div className="px-4 md:px-12 py-12">
        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
           <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-netflix-red rounded-full shadow-[0_0_15px_#e50914]" />
              <h2 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic">Episodes</h2>
           </div>
           <span className="text-white/20 text-[10px] font-bold tracking-widest uppercase">
              Total Stream Duration: ~{videos.length * 15} mins
           </span>
        </div>

        {/* Cinematic Episode List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video, idx) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="group cursor-pointer bg-white/5 rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all shadow-xl hover:shadow-2xl"
              onClick={() => onPlayVideo(video)}
            >
              <div className="relative aspect-video">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white text-black p-3 rounded-full shadow-2xl scale-75 group-hover:scale-100 transition-all duration-300">
                    <Play size={20} className="fill-current" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded-md text-[10px] font-black text-white/90 border border-white/10">
                  {video.duration || "14:20"}
                </div>
                <div className="absolute top-2 left-2 bg-netflix-red/90 px-2 py-0.5 rounded-md text-[8px] font-black text-white tracking-widest uppercase shadow-lg">
                  Episode {idx + 1}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-bold text-white text-xs md:text-sm line-clamp-2 tracking-tight group-hover:text-netflix-red transition-colors">
                  {video.title}
                </h3>
                <div className="flex items-center gap-4 text-white/30 text-[9px] font-bold tracking-widest uppercase pt-2">
                  <span className="flex items-center gap-1"><Eye size={10} /> {video.views}</span>
                  <span className="flex items-center gap-1"><Calendar size={10} /> {video.publishedAt}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Access Floating Controls */}
      <div className="fixed bottom-8 right-8 z-50 flex gap-3">
         <button 
           onClick={() => onPlayVideo(videos[0])}
           className="bg-netflix-red text-white px-6 py-3 rounded-2xl font-black text-sm tracking-tighter uppercase shadow-[0_5px_15px_#e5091444] hover:shadow-[0_10px_25px_#e5091466] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
         >
           <Play size={14} className="fill-current" />
           Start Series
         </button>
      </div>
    </div>
  );
};

export default PlaylistDetails;
