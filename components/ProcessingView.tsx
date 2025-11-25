import React from 'react';
import { Loader2, XCircle, CheckCircle2, Cpu, Zap } from 'lucide-react';
import { ProcessingState, VideoSettings } from '../types';

interface ProcessingViewProps {
  state: ProcessingState;
  settings: VideoSettings;
  onCancel: () => void;
}

export const ProcessingView: React.FC<ProcessingViewProps> = ({ state, settings, onCancel }) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-8 text-center relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_15px_rgba(6,182,212,0.8)]"></div>
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-cyan-900/10 to-transparent pointer-events-none"></div>
        
        <div className="mb-10 relative z-10">
           {/* Progress Circle */}
           <div className="w-32 h-32 mx-auto mb-8 relative flex items-center justify-center">
             {/* Outer spinning ring */}
             <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
             <div className="absolute inset-0 border-t-4 border-cyan-500/30 rounded-full animate-spin"></div>
             
             <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
               <circle
                 cx="64"
                 cy="64"
                 r="58"
                 stroke="currentColor"
                 strokeWidth="4"
                 fill="transparent"
                 className="text-slate-800"
               />
               <circle
                 cx="64"
                 cy="64"
                 r="58"
                 stroke="currentColor"
                 strokeWidth="4"
                 fill="transparent"
                 strokeDasharray={2 * Math.PI * 58}
                 strokeDashoffset={2 * Math.PI * 58 * (1 - state.progress / 100)}
                 strokeLinecap="round"
                 className="text-cyan-500 transition-all duration-300 ease-out"
               />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-3xl font-bold text-white font-mono">{Math.round(state.progress)}%</span>
             </div>
           </div>

           <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
             {state.progress >= 100 ? "Finalizing Output..." : "Processing Neural Data"}
           </h2>
           <p className="text-slate-400 font-mono text-sm flex items-center justify-center gap-2 animate-pulse">
             <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
             {state.statusMessage}
           </p>
        </div>

        {/* Detailed Status Grid */}
        <div className="grid grid-cols-2 gap-4 mb-10 text-left bg-slate-950/50 p-6 rounded-xl border border-slate-800/50 backdrop-blur-sm relative">
           {/* Corner accents */}
           <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-slate-600"></div>
           <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-slate-600"></div>
           <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-slate-600"></div>
           <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-slate-600"></div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Resolution</span>
            <p className="font-mono text-cyan-300">{settings.resolution}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Frame Rate</span>
            <p className="font-mono text-cyan-300">{settings.fps} FPS</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Est. Time</span>
            <p className="font-mono text-white tabular-nums">{state.estimatedTimeRemaining}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Engine</span>
            <p className="font-mono text-violet-400 flex items-center gap-1">
              <Zap className="w-3 h-3" /> NEURAL V2
            </p>
          </div>
        </div>

        <button 
          onClick={onCancel}
          className="group text-slate-500 hover:text-red-400 text-sm font-medium flex items-center justify-center gap-2 mx-auto transition-colors px-4 py-2 rounded hover:bg-red-950/30 border border-transparent hover:border-red-900/50"
        >
          <XCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
          ABORT SEQUENCE
        </button>
      </div>
    </div>
  );
};