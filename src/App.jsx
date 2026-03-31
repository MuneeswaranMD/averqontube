import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import VideoSlider from './components/VideoSlider';
import CategoryFilter from './components/CategoryFilter';
import VideoModal from './components/VideoModal';
import Footer from './components/Footer';
import SkeletonLoading from './components/SkeletonLoading';
import * as youtubeService from './services/youtubeService';
import { BarChart3, Users, PlaySquare, Eye, TrendingUp, Zap, Play, Settings, Shield, Award, LineChart, GraduationCap, ChevronRight, Save, LayoutGrid, CheckCircle, Trash2, Plus, LogIn, LogOut, Loader2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './utils/cn';
import { auth, db } from './firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

import PlaylistCard from './components/PlaylistCard';
import PlaylistDetails from './components/PlaylistDetails';

const DEFAULT_STUDENT_CHANNELS = [
  "@StudentCareerHub", "@CareerBoostStudents", "@FutureTechStudents", "@StudentGrowthLab", "@BuildYourCareer"
];

const App = () => {
  const [user, setUser] = useState(null);
  const [adminChannels, setAdminChannels] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);
  
  const [config, setConfig] = useState({
    mainId: localStorage.getItem('MAIN_CHANNEL_ID') || import.meta.env.VITE_YOUTUBE_CHANNEL_ID,
    studentId: localStorage.getItem('STUDENT_CHANNEL_ID') || import.meta.env.VITE_YOUTUBE_STUDENT_CHANNEL_ID || "@StudentCareerHub"
  });

  const [loading, setLoading] = useState(true);
  const [studentLoading, setStudentLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistVideos, setPlaylistVideos] = useState([]);
  const [activeTab, setActiveTab] = useState('Explore');
  const [activeStudentHandle, setActiveStudentHandle] = useState(config.studentId);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [data, setData] = useState({
    channel: null,
    videos: [],
    trending: [],
    shorts: [],
    playlists: [],
    studentChannel: null,
    studentVideos: [],
    searchResults: [],
    searchQuery: ''
  });

  // Auth & Firestore logic
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
         try {
            const userDoc = await getDoc(doc(db, "admins", user.uid));
            if (userDoc.exists()) {
               setAdminChannels(userDoc.data().channels || []);
            } else {
               await setDoc(doc(db, "admins", user.uid), { channels: [] });
            }
         } catch (err) { console.error("Firestore Error:", err); }
      }
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  const loadAllContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
      if (!API_KEY || !config.mainId) {
         setError("Configuration Missing: Sign in to Admin to manage IDs.");
         setLoading(false);
         return;
      }

      // Fetch all channels and trending
      const [mainChannel, studentChannel, trendingResults] = await Promise.all([
        youtubeService.fetchChannelDetails(config.mainId),
        youtubeService.fetchChannelDetails(activeStudentHandle),
        youtubeService.fetchTrendingVideos(14)
      ]);

      if (!mainChannel) {
         setError("Sync Failed: Invalid Main Channel ID.");
         setLoading(false);
         return;
      }

      // Fetch uploads and playlists for ALL configured channels
      const allChannelIds = [config.mainId, activeStudentHandle, ...adminChannels].filter(id => id && id.length > 5);
      
      const [mainVideos, studentVideos, ...channelsPlaylists] = await Promise.all([
        youtubeService.fetchVideosFromPlaylist(mainChannel.uploadsPlaylistId, 32),
        studentChannel ? youtubeService.fetchVideosFromPlaylist(studentChannel.uploadsPlaylistId, 12) : Promise.resolve([]),
        ...allChannelIds.map(id => youtubeService.fetchChannelPlaylists(id, 10))
      ]);

      // Flatten and uniquify playlists
      const combinedPlaylists = channelsPlaylists.flat().filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);

      setData({
        channel: mainChannel, 
        videos: mainVideos, 
        trending: trendingResults,
        shorts: mainVideos.filter(v => v.title.toLowerCase().includes('short')),
        playlists: combinedPlaylists, 
        studentChannel: studentChannel, 
        studentVideos: studentVideos
      });
    } catch (error) {
      console.error("Load Error:", error);
      setError(error.message === "QUOTA_EXCEEDED" ? "QUOTA_EXCEEDED" : "Network Issue: Sync failure.");
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
    // Added adminChannels to dependency to reload when new channels are added
  }, [config.mainId, activeStudentHandle, adminChannels]);

  useEffect(() => {
    loadAllContent();
  }, [loadAllContent]);

  const handlePlayVideo = (video) => {
    setSelectedVideo(video);
  };

  const handleSaveConfig = async (mainId, studentId) => {
    localStorage.setItem('MAIN_CHANNEL_ID', mainId);
    localStorage.setItem('STUDENT_CHANNEL_ID', studentId);
    setConfig({ mainId, studentId });
    setActiveStudentHandle(studentId);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleAddAdminChannel = async (id) => {
    if (!user || !id || !id.trim()) return;
    
    // Auto-detect handles (add @ if it's not a generic UC... ID and missing @)
    let formattedId = id.trim();
    if (!formattedId.startsWith('@') && !formattedId.startsWith('UC')) {
      formattedId = '@' + formattedId;
    }

    try {
      await updateDoc(doc(db, "admins", user.uid), {
        channels: arrayUnion(formattedId)
      });
      setAdminChannels(prev => [...new Set([...prev, formattedId])]);
    } catch (err) { console.error("Add Err:", err); }
  };

  const handleRemoveAdminChannel = async (id) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "admins", user.uid), {
        channels: arrayRemove(id)
      });
      setAdminChannels(prev => prev.filter(c => c !== id));
    } catch (err) { console.error("Remove Err:", err); }
  };

  const handleViewPlaylist = async (playlist) => {
    try {
      setLoading(true);
      const videos = await youtubeService.fetchVideosFromPlaylist(playlist.id, 50);
      setPlaylistVideos(videos);
      setSelectedPlaylist(playlist);
      setLoading(false);
    } catch (err) {
      console.error("View Playlist Error:", err);
      setLoading(false);
    }
  };

  const handleNavigate = (tab) => {
    setSelectedPlaylist(null);
    setActiveTab(tab);
  };

  const handleSearch = async (query) => {
    setActiveTab('Search');
    setLoading(true);
    try {
      const results = await youtubeService.searchVideos(query, 24);
      setData(prev => ({ ...prev, searchResults: results, searchQuery: query }));
    } catch (err) {
      console.error("Search Error:", err);
      // We don't set a global error here to preserve the rest of the UI
    } finally {
      setLoading(false);
    }
  };

  // Views
  const LoginView = () => {
    const [email, setEmail] = useState('muneeswaran@averqon.in');
    const [pass, setPass] = useState('Munees@2004');
    const [err, setErr] = useState('');
    const [logLoading, setLogLoading] = useState(false);

    const handleLogin = async (e) => {
      e.preventDefault();
      setLogLoading(true);
      try { await signInWithEmailAndPassword(auth, email, pass); }
      catch (e) { setErr("Auth denied: Check records."); }
      finally { setLogLoading(false); }
    };

    return (
      <div className="pt-32 flex flex-col items-center justify-center min-h-[60vh] px-6">
        <motion.form initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} onSubmit={handleLogin} className="w-full max-w-sm bg-white/[0.03] border border-white/5 p-10 rounded-2xl space-y-6">
           <div className="text-center space-y-1">
              <h2 className="text-xl font-black uppercase text-white tracking-widest">Admin Portal</h2>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Secure Master Login</p>
           </div>
           <div className="space-y-4 pt-4">
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-xs font-bold focus:border-netflix-red outline-none transition-all" />
              <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Access Key" required className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-xs font-bold focus:border-netflix-red outline-none transition-all" />
           </div>
           {err && <p className="text-netflix-red text-[9px] font-bold uppercase text-center">{err}</p>}
           <button type="submit" disabled={logLoading} className="w-full py-4 bg-white text-black font-black text-[10px] uppercase tracking-[.2em] rounded-xl flex items-center justify-center gap-2">
              {logLoading ? <Loader2 className="animate-spin" size={14} /> : <LogIn size={14} />}
              Log In
           </button>
        </motion.form>
      </div>
    );
  };

  const AdminView = () => {
    const [newId, setNewId] = useState('');
    return (
      <div className="pt-24 pb-48 px-4 md:px-12 space-y-16 max-w-[1200px] mx-auto">
         <div className="flex justify-between items-end border-b border-white/5 pb-8">
            <div className="space-y-2">
               <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight">System Deployment</h2>
               <div className="flex items-center gap-2 text-emerald-500/60 text-[9px] font-bold uppercase"><User size={10} /> {user.email}</div>
            </div>
            <button onClick={() => signOut(auth)} className="flex items-center gap-2 text-[9px] font-black text-white/20 uppercase hover:text-white transition-colors duration-300"><LogOut size={14} /> Sign Out</button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
               <div className="space-y-4">
                  <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Active Core Selection</h3>
                  <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl space-y-6">
                     <div className="space-y-2">
                        <span className="text-[9px] font-black text-white/20 uppercase">Main Core</span>
                        <div className="text-sm font-bold text-white tracking-tight">{config.mainId}</div>
                     </div>
                     <div className="space-y-2">
                        <span className="text-[9px] font-black text-white/20 uppercase">Student Hub</span>
                        <div className="text-sm font-bold text-white tracking-tight">{config.studentId}</div>
                     </div>
                  </div>
               </div>
                <div className="space-y-4">
                   <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Register New Channel</h3>
                   <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={newId} 
                        onChange={e => setNewId(e.target.value)} 
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            handleAddAdminChannel(newId);
                            setNewId('');
                          }
                        }}
                        placeholder="@handle or UC..." 
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold focus:border-netflix-red outline-none shadow-inner" 
                      />
                      <button onClick={() => {handleAddAdminChannel(newId); setNewId('');}} className="p-4 bg-white text-black rounded-xl hover:scale-105 active:scale-95 transition-all"><Plus size={16} /></button>
                   </div>
                </div>

                <div className="space-y-4 pt-4">
                   <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-netflix-red uppercase tracking-widest">Emergency API Bypass</h3>
                      {localStorage.getItem('YT_API_OVERRIDE') && <button onClick={() => {youtubeService.setApiOverride(''); window.location.reload();}} className="text-[8px] font-bold text-white/20 hover:text-white uppercase underline">Reset Default</button>}
                   </div>
                   <div className="flex gap-2">
                      <input 
                        type="password" 
                        placeholder="Paste Fresh API Key here..." 
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold focus:border-netflix-red outline-none" 
                        onBlur={(e) => {
                          if (e.target.value) {
                            youtubeService.setApiOverride(e.target.value);
                            loadAllContent();
                          }
                        }}
                      />
                   </div>
                   <p className="text-[8px] text-white/20 font-medium uppercase leading-tight italic">If the dashboard is paused due to quota, paste a new key here to instantly restore service.</p>
                </div>
            </div>

            <div className="space-y-6">
               <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Authorized Transmissions</h3>
               <div className="space-y-3 overflow-y-auto max-h-[400px] no-scrollbar">
                  {adminChannels.map(id => (
                     <div key={id} className="group p-5 bg-white/[0.03] border border-white/5 rounded-xl flex items-center justify-between hover:border-white/10 transition-all">
                        <div className="space-y-1">
                           <div className="text-[11px] font-black text-white group-hover:text-netflix-red transition-colors">{id}</div>
                           <div className="flex gap-4">
                              <button onClick={() => handleSaveConfig(id, config.studentId)} className="text-[8px] font-bold text-white/20 hover:text-white uppercase tracking-widest">Set Main</button>
                              <button onClick={() => handleSaveConfig(config.mainId, id)} className="text-[8px] font-bold text-white/20 hover:text-white uppercase tracking-widest">Set Student</button>
                           </div>
                        </div>
                        <button onClick={() => handleRemoveAdminChannel(id)} className="p-2 opacity-0 group-hover:opacity-100 text-white/20 hover:text-netflix-red transition-all"><Trash2 size={14} /></button>
                     </div>
                  ))}
                  {adminChannels.length === 0 && <p className="text-[10px] font-bold text-white/10 uppercase italic text-center py-10">No authorized channels registered.</p>}
               </div>
            </div>
         </div>
      </div>
    );
  };

  const StudioView = () => (
    <div className="pt-24 pb-48 px-4 md:px-12 space-y-12 max-w-[1400px] mx-auto">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div className="space-y-1">
             <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight uppercase">Studio Analytics</h2>
             <p className="text-white/20 text-[10px] font-bold tracking-widest uppercase">Monitoring performance for <span className="text-white/40">{data.channel?.name}</span></p>
          </div>
       </div>
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[ { label: 'Followers', value: data.channel?.subscribers, icon: Users }, { label: 'Views', value: data.channel?.totalViews, icon: Play }, { label: 'Videos', value: data.channel?.totalVideos, icon: PlaySquare }, { label: 'Growth', value: '+14.2%', icon: TrendingUp } ].map((stat, idx) => (
            <div key={idx} className="p-6 bg-white/[0.02] border border-white/5 rounded-xl space-y-2 hover:bg-white/[0.04] transition-all group">
               <stat.icon size={14} className="text-netflix-red opacity-40 group-hover:opacity-100" />
               <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{stat.label}</p>
               <h4 className="text-xl font-bold text-white tracking-tight">{stat.value}</h4>
            </div>
          ))}
       </div>
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          <div className="lg:col-span-2 p-8 bg-white/[0.015] border border-white/5 rounded-2xl space-y-8">
             <div className="flex justify-between items-center"><h3 className="text-sm font-bold text-white/80 uppercase tracking-widest">Velocity Metrics</h3><LineChart className="text-white/10" size={16} /></div>
             <div className="h-[180px] flex items-end gap-2">{[45, 60, 35, 80, 50, 95, 75, 40, 65, 85, 30, 70, 90, 55, 60, 45, 80].map((h, i) => (<div key={i} style={{ height: `${h}%` }} className={cn("flex-1 bg-white/5 rounded-sm transition-all hover:bg-netflix-red", i === 5 ? "bg-netflix-red" : "")} />))}</div>
          </div>
          <div className="p-8 bg-netflix-red rounded-2xl space-y-4 shadow-xl"><h3 className="text-lg font-bold text-white tracking-tight leading-tight">Initialize Transmission Sync</h3><button onClick={() => loadAllContent()} className="w-full py-3 bg-white text-black font-black text-[9px] uppercase tracking-widest rounded-lg">Resync System</button></div>
       </div>
    </div>
  );

  if (error) {
    const isQuotaError = error.includes("Sync failure") || error.includes("QUOTA_EXCEEDED");
    return (
      <div className="bg-netflix-black min-h-screen pt-20 flex flex-col items-center">
         <Navbar channelInfo={data.channel} onNavigate={handleNavigate} activeTab={activeTab} onSearch={handleSearch} />
         {activeTab === 'Admin' ? (user ? <AdminView /> : <LoginView />) : (
            <div className="flex-1 flex flex-col justify-center items-center p-6 text-center space-y-8 max-w-lg">
               <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 animate-pulse">
                  <Zap className="text-netflix-red" size={32} />
               </div>
               <div className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase">Transmission Paused</h2>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed">
                     {isQuotaError 
                        ? "The YouTube Data API quota has been reached for today. The system will auto-resync once the limit resets, or you can update the API key in the Admin Module." 
                        : error}
                  </p>
               </div>
               <div className="flex gap-4 w-full pt-4">
                  <button onClick={() => handleNavigate('Admin')} className="flex-1 py-4 bg-white text-black font-black rounded-xl text-[10px] uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all">Open Admin Core</button>
                  <button onClick={() => window.location.reload()} className="px-10 py-4 bg-white/5 text-white font-bold border border-white/10 rounded-xl text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Retry Link</button>
               </div>
            </div>
         )}
      </div>
    );
  }

  if (loading || !data.channel) {
    return (
      <div className="bg-netflix-black min-h-screen pt-20 flex flex-col items-center justify-center">
        <Navbar onNavigate={handleNavigate} activeTab={activeTab} onSearch={handleSearch} />
        <SkeletonLoading type="hero" />
      </div>
    );
  }

  if (selectedPlaylist) {
    return (
      <>
        <div className="bg-netflix-black min-h-screen">
          <Navbar channelInfo={data.channel} onNavigate={handleNavigate} activeTab={activeTab} onSearch={handleSearch} />
          <PlaylistDetails 
            playlist={selectedPlaylist} 
            videos={playlistVideos} 
            onBack={() => setSelectedPlaylist(null)} 
            onPlayVideo={handlePlayVideo} 
          />
        </div>
        <AnimatePresence mode="wait">
          {selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
        </AnimatePresence>
      </>
    );
  }

  return (
    <div className="bg-netflix-black min-h-screen text-white font-inter antialiased text-sm scroll-smooth">
      <Navbar channelInfo={data.channel} onNavigate={handleNavigate} activeTab={activeTab} onSearch={handleSearch} />
      <main className="relative w-full max-w-[1920px] mx-auto overflow-hidden">
        {activeTab === 'Explore' && (
          <>
            <HeroBanner videos={data.videos} channelInfo={data.channel} onPlay={handlePlayVideo} />
            <div className="relative z-30 -mt-20 md:-mt-36 space-y-20 pb-40">
               <VideoSlider title="Latest Sessions" videos={data.videos.slice(0, 6)} onPlay={handlePlayVideo} />
                <div className="space-y-10 group">
                   <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-12">
                      <div className="space-y-4">
                         <div className="flex items-center gap-3"><GraduationCap className="text-netflix-red" size={18} /><span className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">Career Guidance Network</span></div>
                         <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tighter uppercase sm:flex sm:items-center sm:gap-4">Academic Hub: <span className="text-netflix-red truncate sm:max-w-md">{data.studentChannel?.name || activeStudentHandle}</span></h2>
                      </div>
                      <div className="hidden md:flex items-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-widest border-l border-white/10 pl-6 h-10"><span>Available Sources</span><ChevronRight size={14} /></div>
                   </div>
                   <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar px-4 md:px-12 mask-fade-right">
                     {(adminChannels.length > 0 ? adminChannels : DEFAULT_STUDENT_CHANNELS).map(handle => (
                        <button key={handle} onClick={() => setActiveStudentHandle(handle)} disabled={studentLoading} className={cn("whitespace-nowrap px-6 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all border", activeStudentHandle === handle ? "bg-white text-black border-white shadow-xl" : "bg-white/5 text-white/40 border-white/5 hover:bg-white/10")}>{handle.replace('@', '')}</button>
                     ))}
                  </div>
                  <AnimatePresence mode="wait">
                     {studentLoading ? (
                        <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full py-20 flex flex-col items-center justify-center space-y-4"><div className="w-8 h-8 border-2 border-white/5 border-t-netflix-red rounded-full animate-spin" /><p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Switching Transmissions...</p></motion.div>
                     ) : (
                        <motion.div key={activeStudentHandle} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}><VideoSlider videos={data.studentVideos} onPlay={handlePlayVideo} noTitle /></motion.div>
                     )}
                  </AnimatePresence>
               </div>
               <VideoSlider title="Tamil Streaming Trends" videos={data.trending} onPlay={handlePlayVideo} />
               <VideoSlider title="Elite Masterpieces" videos={data.videos.slice(6, 12)} onPlay={handlePlayVideo} />
            </div>
          </>
        )}
        {activeTab === 'Originals' && <div className="pt-24 px-4 md:px-12 min-h-screen"><h2 className="text-xl md:text-2xl font-bold uppercase mb-12 tracking-tight">Pure Originals</h2><div className="grid grid-cols-1 md:grid-cols-4 gap-8">{data.videos.map(v => (<div key={v.id} onClick={() => handlePlayVideo(v)} className="cursor-pointer group"><img src={v.thumbnail} className="rounded-xl mb-4 grayscale group-hover:grayscale-0 transition-all border border-white/5" /><h3 className="font-bold text-sm line-clamp-1">{v.title}</h3></div>))}</div></div>}
        {activeTab === 'Trending' && <div className="pt-24 px-4 md:px-12 min-h-screen"><h2 className="text-xl md:text-2xl font-bold uppercase mb-12 tracking-tight">Tamil Trending Hub</h2><div className="grid grid-cols-1 md:grid-cols-4 gap-8">{data.trending.map(v => (<div key={v.id} onClick={() => handlePlayVideo(v)} className="cursor-pointer group"><img src={v.thumbnail} className="rounded-xl mb-4 grayscale group-hover:grayscale-0 transition-all border border-white/5" /><h3 className="font-bold text-sm line-clamp-1">{v.title}</h3></div>))}</div></div>}
        {activeTab === 'Playlists' && <div className="pt-24 px-4 md:px-12 min-h-screen"><h2 className="text-xl md:text-2xl font-bold uppercase mb-12 tracking-tight">Curated Series</h2><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{data.playlists.map((p, i) => (<PlaylistCard key={p.id} playlist={p} index={i} onOpen={() => handleViewPlaylist(p)} />))}</div></div>}
        {activeTab === 'Search' && (
          <div className="pt-24 px-4 md:px-12 min-h-screen">
            <h2 className="text-xl md:text-2xl font-bold uppercase mb-4 tracking-tight">Search Results</h2>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-12">Results for: <span className="text-white">{data.searchQuery}</span></p>
            {data.searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {data.searchResults.map(v => (
                  <div key={v.id} onClick={() => handlePlayVideo(v)} className="cursor-pointer group">
                    <img src={v.thumbnail} className="rounded-xl mb-4 grayscale group-hover:grayscale-0 transition-all border border-white/5" />
                    <h3 className="font-bold text-sm line-clamp-2">{v.title}</h3>
                    <p className="text-xs text-white/50 mt-1">{v.views} • {v.publishedAt}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/40 text-sm">No results found.</p>
            )}
          </div>
        )}
        {activeTab === 'Studio' && <StudioView />}
        {activeTab === 'Admin' && (user ? <AdminView /> : <LoginView />)}
      </main>
      <Footer />
      <AnimatePresence mode="wait">{selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}</AnimatePresence>
    </div>
  );
};
export default App;
