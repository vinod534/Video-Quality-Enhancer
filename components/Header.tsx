import React from 'react';
import { Sparkles, Video } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Video className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              PixelPerfect <span className="text-indigo-600">Upscaler</span>
            </h1>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
          <span className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            <Sparkles className="w-4 h-4" />
            AI Enhanced
          </span>
          <span>v2.4.0</span>
        </div>
      </div>
    </header>
  );
};