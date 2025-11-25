import React from 'react';
import { Sparkles, Video, Cpu } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 shadow-lg shadow-black/20">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-lg"></div>
            <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg relative z-10 group-hover:border-cyan-500/50 transition-colors">
              <Video className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 font-display">
              Pixel<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">Perfect</span>
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-medium pl-0.5">Neural Upscaling Engine</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 shadow-inner">
             <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-slate-400 text-xs font-mono">SYSTEM READY</span>
             </div>
          </div>
          
          <span className="flex items-center gap-1.5 text-cyan-400 bg-cyan-950/30 border border-cyan-900/50 px-3 py-1 rounded-full text-xs uppercase tracking-wider shadow-[0_0_10px_rgba(8,145,178,0.1)]">
            <Sparkles className="w-3 h-3" />
            AI V2.4 Core
          </span>
        </div>
      </div>
    </header>
  );
};