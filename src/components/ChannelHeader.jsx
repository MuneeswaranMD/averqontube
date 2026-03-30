import React from 'react';
import { Share2, Bell, CheckCircle2, MoreVertical, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';

const ChannelHeader = ({ channelInfo }) => {
  return (
    <div className="relative w-full">
      {/* Banner */}
      <div className="h-48 md:h-72 w-full relative overflow-hidden rounded-3xl shadow-xl group">
        <img 
          src={channelInfo.bannerUrl} 
          alt="Channel Banner" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-between px-10 pb-8 backdrop-blur-[2px]">
          <div className="flex items-center gap-8 translate-y-12">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-dark-900 shadow-2xl overflow-hidden glass">
                <img src={channelInfo.profileImageUrl} alt={channelInfo.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-2 right-2 bg-primary-500 p-2 rounded-full border-2 border-white dark:border-dark-900 shadow-lg">
                <Edit3 size={16} className="text-white" />
              </div>
            </div>
            
            <div className="pb-4">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-md">
                  {channelInfo.name}
                </h1>
                <CheckCircle2 size={24} className="text-blue-400 fill-current" />
              </div>
              <div className="flex items-center gap-4 text-white/90 text-sm md:text-base mb-2">
                <span className="font-semibold text-white">{channelInfo.handle}</span>
                <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                <span>{channelInfo.subscribers} subscribers</span>
                <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                <span>{channelInfo.totalVideos} videos</span>
              </div>
              <p className="text-white/80 max-w-lg line-clamp-1 text-sm md:text-base italic">
                "{channelInfo.description}"
              </p>
            </div>
          </div>

          <div className="mb-4 flex gap-3">
            <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-6 py-2.5 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg border border-white/30 group">
              <Share2 size={18} className="group-hover:rotate-12 transition-transform" />
              Share
            </button>
            <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-2.5 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg flex-shrink-0 group">
              <Bell size={18} className="group-hover:animate-bounce" />
              Dashboard Admin
            </button>
          </div>
        </div>
      </div>
      
      {/* Spacer to handle the overlapping profile picture */}
      <div className="h-20" />
    </div>
  );
};

export default ChannelHeader;
