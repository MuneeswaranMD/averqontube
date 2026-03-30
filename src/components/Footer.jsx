import React from 'react';
import { Mail, Globe, Server, Layers, User } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-netflix-black pt-16 md:pt-24 pb-12 px-4 md:px-12 overflow-hidden border-t border-white/5 font-inter">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16 relative z-10 opacity-60 hover:opacity-100 transition-opacity duration-700">
        <div className="col-span-2 lg:col-span-1 space-y-6 md:space-y-8 group/footer-info">
          {/* AverqonTube Brand Logo */}
          <div className="flex items-center gap-1 cursor-pointer w-fit opacity-100 group">
            <span className="font-black text-white text-xl md:text-2xl tracking-tighter select-none">AVERQON</span>
            <div className="bg-netflix-red px-2 py-0.5 rounded-lg transition-transform group-hover:scale-105 shadow-[0_5px_15px_rgba(229,9,20,0.4)]">
              <div className="flex items-center justify-center text-white font-black text-xs md:text-sm tracking-tighter">
                TUBE
              </div>
            </div>
          </div>
          
          <p className="text-white/30 text-[10px] md:text-xs font-medium leading-relaxed max-w-sm">
            Professional creator infrastructure by Averqon. Experience seamless transmission and high-density content management.
          </p>
          
          <div className="flex gap-2.5">
             {[User, Mail, Globe, Server, Layers].map((Icon, i) => (
                <button key={i} className="bg-white/5 hover:bg-white hover:text-black p-3 rounded-lg border border-white/5 transition-all group/icon">
                   <Icon size={14} className="text-white group-hover/icon:text-black transition-colors" />
                </button>
             ))}
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          <h3 className="text-white text-[9px] md:text-[11px] font-black tracking-widest opacity-40 uppercase">Platform</h3>
          <ul className="space-y-2 md:space-y-3 text-white/20 text-[10px] md:text-xs font-bold tracking-tight">
            <li className="hover:text-white transition-all cursor-pointer w-fit duration-300">Live Streaming</li>
            <li className="hover:text-white transition-all cursor-pointer w-fit duration-300">Analytics Hub</li>
            <li className="hover:text-white transition-all cursor-pointer w-fit duration-300">Collaborations</li>
            <li className="hover:text-white transition-all cursor-pointer w-fit duration-300">Studio Tools</li>
          </ul>
        </div>

        <div className="space-y-4 md:space-y-6">
          <h3 className="text-white text-[9px] md:text-[11px] font-black tracking-widest opacity-40 uppercase">Resources</h3>
          <ul className="space-y-2 md:space-y-3 text-white/20 text-[10px] md:text-xs font-bold tracking-tight">
            <li className="hover:text-white transition-all cursor-pointer w-fit duration-300">Help Center</li>
            <li className="hover:text-white transition-all cursor-pointer w-fit duration-300">AI Metadata</li>
            <li className="hover:text-white transition-all cursor-pointer w-fit duration-300">Thumbnail Lab</li>
            <li className="hover:text-white transition-all cursor-pointer w-fit duration-300">Scripting</li>
          </ul>
        </div>

        <div className="space-y-4 md:space-y-6">
          <h3 className="text-white text-[9px] md:text-[11px] font-black tracking-widest opacity-40 uppercase">Security</h3>
          <ul className="space-y-2 md:space-y-3 text-white/20 text-[10px] md:text-xs font-bold tracking-tight">
            <li className="hover:text-white transition-all cursor-pointer w-fit duration-300">Admin Portal</li>
            <li className="hover:text-white transition-all cursor-pointer w-fit duration-300">Privacy Shield</li>
            <li className="hover:text-white transition-all cursor-pointer w-fit duration-300">Agreement</li>
            <li className="hover:text-white transition-all cursor-pointer w-fit duration-300">Transmissions</li>
          </ul>
        </div>
      </div>

      {/* Simplified Copyright Area */}
      <div className="mt-16 md:mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-white/10 text-[8px] font-black tracking-widest select-none uppercase">
          &copy; 2026 AVERQONTUBE &bull; POWERED BY AVERQON INFRASTRUCTURE
        </div>
        <div className="flex gap-6 text-white/10 text-[9px] font-black tracking-widest select-none uppercase">
           <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
           <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
           <span className="hover:text-white transition-colors cursor-pointer">Contact</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
