import React from 'react';
import { Loader2, XCircle, CheckCircle2 } from 'lucide-react';
import { ProcessingState, VideoSettings } from '../types';

interface ProcessingViewProps {
  state: ProcessingState;
  settings: VideoSettings;
  onCancel: () => void;
}

export const ProcessingView: React.FC<ProcessingViewProps> = ({ state, settings, onCancel }) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 text-center relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>
        
        <div className="mb-8 relative">
           {/* Progress Circle or Icon */}
           <div className="w-24 h-24 mx-auto mb-6 relative flex items-center justify-center">
             <svg className="w-full h-full transform -rotate-90">
               <circle
                 cx="48"
                 cy="48"
                 r="45"
                 stroke="currentColor"
                 strokeWidth="6"
                 fill="transparent"
                 className="text-slate-100"
               />
               <circle
                 cx="48"
                 cy="48"
                 r="45"
                 stroke="currentColor"
                 strokeWidth="6"
                 fill="transparent"
                 strokeDasharray={2 * Math.PI * 45}
                 strokeDashoffset={2 * Math.PI * 45 * (1 - state.progress / 100)}
                 className="text-indigo-600 transition-all duration-500 ease-out"
               />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-slate-700">
               {Math.round(state.progress)}%
             </div>
           </div>

           <h2 className="text-2xl font-bold text-slate-900 mb-2">
             {state.progress >= 100 ? "Finalizing..." : "Processing Video"}
           </h2>
           <p className="text-slate-500 flex items-center justify-center gap-2">
             {state.statusMessage}
           </p>
        </div>

        {/* Detailed Status Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8 text-left bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Resolution</span>
            <p className="font-medium text-slate-700">{settings.resolution}</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target FPS</span>
            <p className="font-medium text-slate-700">{settings.fps} FPS</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Est. Remaining</span>
            <p className="font-medium text-indigo-600 tabular-nums">{state.estimatedTimeRemaining}</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Engine</span>
            <p className="font-medium text-slate-700">AI Upscale v2.0</p>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-8">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300 ease-out relative"
            style={{ width: `${state.progress}%` }}
          >
            <div className="absolute top-0 left-0 bottom-0 right-0 w-full h-full bg-white opacity-20 animate-pulse"></div>
          </div>
        </div>

        <button 
          onClick={onCancel}
          className="text-slate-400 hover:text-red-500 text-sm font-medium flex items-center justify-center gap-2 mx-auto transition-colors"
        >
          <XCircle className="w-4 h-4" />
          Cancel Processing
        </button>
      </div>
    </div>
  );
};