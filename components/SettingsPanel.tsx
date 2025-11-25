import React from 'react';
import { Settings, Play, Film, Monitor, ArrowLeft } from 'lucide-react';
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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6 text-slate-800 border-b border-slate-100 pb-4">
        <button 
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            <h2 className="font-semibold text-lg">Upscaling Configuration</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Output Resolution */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Monitor className="w-4 h-4 text-slate-400" />
            Output Resolution
          </label>
          <div className="flex gap-3">
            {RESOLUTIONS.map((res) => (
              <label 
                key={res}
                className={`
                  flex-1 relative flex flex-col items-center p-4 cursor-pointer rounded-lg border-2 transition-all
                  ${settings.resolution === res 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
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
                <span className="font-bold text-lg">{res}</span>
                <span className="text-xs opacity-75">{res === '4K' ? '3840 x 2160' : '1920 x 1080'}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Frame Rate */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Play className="w-4 h-4 text-slate-400" />
            Target Frame Rate
          </label>
          <div className="grid grid-cols-3 gap-3">
            {FRAME_RATES.map((fps) => (
              <button
                key={fps}
                onClick={() => updateSetting('fps', fps)}
                className={`
                  py-2.5 px-3 rounded-lg text-sm font-medium border transition-all
                  ${settings.fps === fps
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }
                `}
              >
                {fps} FPS
              </button>
            ))}
          </div>
        </div>

        {/* Output Format */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Film className="w-4 h-4 text-slate-400" />
            Format Container
          </label>
          <select
            value={settings.format}
            onChange={(e) => updateSetting('format', e.target.value as FileFormat)}
            className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
          >
            {FORMATS.map((fmt) => (
              <option key={fmt} value={fmt}>{fmt}</option>
            ))}
          </select>
        </div>

        {/* Quality Preset */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">Quality Mode</label>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {QUALITIES.map((q) => (
              <button
                key={q}
                onClick={() => updateSetting('quality', q)}
                className={`
                  flex-1 py-2 text-sm font-medium rounded-md transition-all
                  ${settings.quality === q
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                  }
                `}
              >
                {q}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {settings.quality === 'Fast' && "Optimized for speed. Good for drafts."}
            {settings.quality === 'Balanced' && "Best tradeoff between speed and quality."}
            {settings.quality === 'High Quality' && "Maximum AI enhancement. Slower processing."}
          </p>
        </div>
      </div>
    </div>
  );
};