import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

const Navbar = ({ channelInfo, activeTab, onNavigate, onSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMobileMenuOpen]);

  const navItems = ['Explore', 'Originals', 'Trending', 'Playlists', 'Studio', 'Admin'];

  const handleNavClick = (item) => {
    onNavigate(item);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1920px] z-[60] h-[52px] md:h-[60px] flex items-center transition-all duration-300",
        isScrolled || isMobileMenuOpen ? "bg-netflix-black shadow-xl border-b border-white/5" : "bg-gradient-to-b from-black/85 to-transparent"
      )}>
        <div className="flex items-center justify-between w-full px-4 md:px-12">
          <div className="flex items-center gap-6 md:gap-10">
            {/* AverqonTube Logo */}
            <div 
               onClick={() => handleNavClick('Explore')}
               className="flex items-center gap-1 group cursor-pointer"
            >
              <span className="font-black text-white text-xl md:text-2xl tracking-tighter select-none">AVERQON</span>
              <div className="bg-netflix-red px-2 py-0.5 rounded-lg transition-transform group-hover:scale-105 shadow-[0_5px_15px_rgba(229,9,20,0.4)]">
                <div className="flex items-center justify-center text-white font-black text-xs md:text-sm tracking-tighter">
                  TUBE
                </div>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8 font-bold text-[10px] tracking-[0.1em] uppercase select-none">
               {navItems.map(item => (
                  <span 
                     key={item}
                     onClick={() => handleNavClick(item)}
                     className={cn(
                        "transition-all duration-200 cursor-pointer relative py-1",
                        activeTab === item ? "text-white" : "text-white/30 hover:text-white"
                     )}
                  >
                     {item}
                     {activeTab === item && (
                       <motion.span 
                         layoutId="navUnderline"
                         className="absolute bottom-0 left-0 w-full h-0.5 bg-netflix-red rounded-full shadow-[0_0_10px_#e50914]" 
                       />
                     )}
                  </span>
               ))}
            </div>
          </div>

          <div className="flex items-center gap-5 md:gap-7">
            {/* Search toggler */}
            <div className="flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "180px", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="overflow-hidden mr-2 hidden md:block" // Hidden on small screens to prevent layout breakage, or you can adjust it
                  >
                    <form onSubmit={(e) => { 
                      e.preventDefault(); 
                      if (searchQuery.trim() && onSearch) { 
                        onSearch(searchQuery); 
                        setIsMobileMenuOpen(false); // Close mobile menu just in case
                      }
                    }}>
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search videos..."
                        className="w-full bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs text-white outline-none focus:border-netflix-red transition-all"
                        autoFocus
                      />
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
              <Search 
                size={18} 
                className="text-white cursor-pointer opacity-40 hover:opacity-100 transition-opacity" 
                onClick={() => {
                  if (isSearchOpen && searchQuery.trim() && onSearch) {
                    onSearch(searchQuery);
                  }
                  setIsSearchOpen(!isSearchOpen);
                }}
              />
            </div>
            
            <Bell size={18} className="text-white cursor-pointer opacity-40 hover:opacity-100 transition-opacity" />
            
            {/* Profile Avatar */}
            <div className="flex items-center gap-3 group cursor-pointer bg-white/5 hover:bg-white/10 p-1 md:pr-4 rounded-xl border border-white/5 transition-all">
               <div className="w-6 md:w-7 h-6 md:h-7 rounded-full bg-netflix-red overflow-hidden border border-white/10 ring-2 ring-white/5">
                  <img 
                    src={channelInfo?.profileImageUrl || "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e"} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                    alt="Profile" 
                  />
               </div>
               <div className="hidden md:flex flex-col">
                  <span className="text-[8px] font-bold tracking-widest text-white/20 uppercase leading-none mb-0.5">Partner</span>
                  <span className="text-[10px] font-bold tracking-tight select-none text-white/80 group-hover:text-white transition-colors uppercase leading-none truncate max-w-[80px]">
                    {channelInfo?.name?.split(' ')[0] || "STUDIO"}
                  </span>
               </div>
            </div>
            
            {/* Mobile Menu Trigger */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg transition-all text-white opacity-40 hover:opacity-100"
            >
               {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[55] lg:hidden"
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[280px] bg-netflix-black z-[56] border-l border-white/10 shadow-2xl lg:hidden pt-20 px-6"
            >
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black tracking-widest text-white/20 uppercase mb-4">Navigation</span>
                {navItems.map((item, idx) => (
                  <motion.button
                    key={item}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleNavClick(item)}
                    className={cn(
                      "flex items-center justify-between py-4 px-4 rounded-xl transition-all font-black text-sm tracking-tighter uppercase",
                      activeTab === item ? "bg-white/5 text-white shadow-[inset_0_0_10px_rgba(255,255,255,0.02)]" : "text-white/40 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {item}
                    {activeTab === item && (
                      <div className="w-1.5 h-1.5 rounded-full bg-netflix-red shadow-[0_0_10px_#e50914]" />
                    )}
                  </motion.button>
                ))}
              </div>
              
              <div className="absolute bottom-10 left-0 w-full px-10 text-center">
                <p className="text-[8px] font-black tracking-widest text-white/10 uppercase italic">
                  &copy; 2026 AverqonTube Infrastructure
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
