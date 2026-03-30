import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../utils/cn';

const AnalyticsCard = ({ label, value, trend, color, index }) => {
  const isUp = trend.startsWith('+');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.05, translateY: -5 }}
      className="glass p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group cursor-pointer border border-white/40 dark:border-white/5"
    >
      <div className={cn("absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity", color.split(' ')[0].replace('text-', 'bg-'))} />
      
      <div className="flex flex-col gap-4">
        <h4 className="text-slate-500 dark:text-slate-400 font-medium text-sm tracking-widest uppercase">
          {label}
        </h4>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            {value}
          </span>
          <div className={cn(
            "flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full",
            isUp ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
          )}>
            {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {trend}
          </div>
        </div>
        
        <div className="mt-2 w-full h-1 bg-slate-100 dark:bg-dark-700 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '70%' }}
            transition={{ duration: 1, delay: 0.5 }}
            className={cn("h-full rounded-full transition-all duration-500", color.split(' ')[0].replace('text-', 'bg-'))}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsCard;
