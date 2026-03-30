import React from 'react';
import { Home, PlaySquare, Film, BarChart2, Settings, HelpCircle, Menu, Play, Info, TrendingUp, Compass, Clock, ThumbsUp } from 'lucide-react';
import { cn } from '../utils/cn';

const SidebarItem = ({ icon: Icon, label, active, collapsed }) => (
  <div className={cn(
    "flex items-center gap-4 px-4 py-3 cursor-pointer rounded-xl transition-all duration-300",
    "hover:bg-primary-50 dark:hover:bg-dark-800 hover:text-primary-600 dark:hover:text-primary-400 group",
    active ? "bg-primary-50 dark:bg-dark-800 text-primary-600 font-medium" : "text-slate-600 dark:text-slate-400"
  )}>
    <Icon size={20} className={cn("transition-transform group-hover:scale-110", active && "scale-110")} />
    {!collapsed && <span className="text-sm tracking-wide">{label}</span>}
  </div>
);

const Sidebar = ({ collapsed, setCollapsed }) => {
  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen glass border-r z-50 transition-all duration-300 ease-in-out",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="flex items-center gap-4 px-6 py-6 overflow-hidden">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-dark-800 rounded-lg transition-colors shrink-0"
        >
          <Menu size={20} />
        </button>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="bg-primary-500 p-1.5 rounded-lg">
              <Play size={20} className="text-white fill-current" />
            </div>
            <span className="font-bold text-xl tracking-tight whitespace-nowrap">Studio</span>
          </div>
        )}
      </div>

      <nav className="mt-4 px-3 space-y-1">
        <SidebarItem icon={Home} label="Dashboard" active collapsed={collapsed} />
        <SidebarItem icon={PlaySquare} label="Content" collapsed={collapsed} />
        <SidebarItem icon={BarChart2} label="Analytics" collapsed={collapsed} />
        <SidebarItem icon={Compass} label="Trending" collapsed={collapsed} />
        <SidebarItem icon={Film} label="Shorts" collapsed={collapsed} />
        
        <div className="my-6 border-t border-slate-200 dark:border-dark-700 mx-3" />
        
        <SidebarItem icon={Clock} label="History" collapsed={collapsed} />
        <SidebarItem icon={ThumbsUp} label="Liked" collapsed={collapsed} />
        <SidebarItem icon={PlaySquare} label="Playlists" collapsed={collapsed} />
        
        <div className="my-6 border-t border-slate-200 dark:border-dark-700 mx-3" />
        
        <SidebarItem icon={Settings} label="Settings" collapsed={collapsed} />
        <SidebarItem icon={HelpCircle} label="Help" collapsed={collapsed} />
      </nav>
    </aside>
  );
};

export default Sidebar;
