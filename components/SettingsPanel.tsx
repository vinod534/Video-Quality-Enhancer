import React from 'react';
import { Settings, Play, Film, Monitor, ArrowLeft, Cpu, Activity } from 'lucide-react';
import { VideoSettings, Resolution, FPS, FileFormat, QualityPreset } from '../types';
import { RESOLUTIONS, FRAME_RATES, FORMATS, QUALITIES } from '../constants';

interface SettingsPanelProps {
  settings: VideoSettings;
  onChange: (settings: VideoSettings) => void;
  onBack: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onChange, onBack }) => {
  const updateSetting = <K extends keyof VideoSettings>(key: K, value: VideoSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="bg-slate-900 rounded-xl shadow-2xl border border-slate-800 p-8 relative overflow-hidden">
      {/* Decorative top border gradient */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

      <div className="flex items-center gap-3 mb-8 text-slate-100 border-b border-slate-800 pb-6">
        <button 
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-transparent hover:border-slate-700"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
            <div className="bg-cyan-950/50 p-1.5 rounded border border-cyan-900">
                <Settings className="w-5 h-5 text-cyan-400" />
            </div>
            <h2 className="font-bold text-xl tracking-wide">Processing Parameters</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Output Resolution */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Monitor className="w-3.5 h-3.5" />
            Target Resolution
          </label>
          <div className="flex gap-4">
            {RESOLUTIONS.map((res) => (
              <label 
                key={res}
                className={`
                  flex-1 relative flex flex-col items-center p-5 cursor-pointer rounded-lg border transition-all duration-300 group
                  ${settings.resolution === res 
                    ? 'border-cyan-500 bg-cyan-950/20 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-600 text-slate-500'
                  }
                `}
              >
                <input
                  type="radio"
                  name="resolution"
                  className="sr-only"
                  checked={settings.resolution === res}
                  onChange={() => updateSetting('resolution', res)}
                />
                <span className={`font-black text-2xl mb-1 ${settings.resolution === res ? 'text-transparent bg-clip-text bg-gradient-to-br from-white to-cyan-200' : ''}`}>{res}</span>
                <span className="text-[10px] font-mono opacity-60 uppercase tracking-widest">{res === '4K' ? '3840 x 2160' : '1920 x 1080'}</span>
                
                {settings.resolution === res && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Frame Rate */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-3.5 h-3.5" />
            Target Frame Rate
          </label>
          <div className="grid grid-cols-3 gap-3">
            {FRAME_RATES.map((fps) => (
              <button
                key={fps}
                onClick={() => updateSetting('fps', fps)}
                className={`
                  py-3 px-3 rounded-lg text-sm font-bold border transition-all font-mono
                  ${settings.fps === fps
                    ? 'bg-violet-600/20 text-violet-300 border-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.2)]'
                    : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-600 hover:text-slate-300'
                  }
                `}
              >
                {fps} <span className="text-[10px] font-normal opacity-70">FPS</span>
              </button>
            ))}
          </div>
        </div>

        {/* Output Format */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Film className="w-3.5 h-3.5" />
            Container Format
          </label>
          <div className="relative">
            <select
                value={settings.format}
                onChange={(e) => updateSetting('format', e.target.value as FileFormat)}
                className="w-full h-12 pl-4 pr-10 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-shadow appearance-none cursor-pointer hover:bg-slate-800"
            >
                {FORMATS.map((fmt) => (
                <option key={fmt} value={fmt} className="bg-slate-900">{fmt}</option>
                ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
          </div>
        </div>

        {/* Quality Preset */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5" />
            Processing Model
          </label>
          <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            {QUALITIES.map((q) => (
              <button
                key={q}
                onClick={() => updateSetting('quality', q)}
                className={`
                  flex-1 py-2.5 text-xs font-bold uppercase tracking-wide rounded-lg transition-all
                  ${settings.quality === q
                    ? 'bg-slate-800 text-cyan-400 shadow-md border border-slate-700'
                    : 'text-slate-600 hover:text-slate-400'
                  }
                `}
              >
                {q}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 font-mono pl-1">
            <span className="text-cyan-600 mr-1">{'>'}</span>
            {settings.quality === 'Fast' && "OPTIMIZED FOR SPEED. LOW LATENCY."}
            {settings.quality === 'Balanced' && "BALANCED NEURAL NETWORK."}
            {settings.quality === 'High Quality' && "DEEP LEARNING MODEL. MAX QUALITY."}
          </p>
        </div>
      </div>
    </div>
  );
};