import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { SettingsPanel } from './components/SettingsPanel';
import { ProcessingView } from './components/ProcessingView';
import { ResultView } from './components/ResultView';
import { Button } from './components/Button';
import { AppStep, VideoFile, VideoSettings, ProcessingState } from './types';
import { PROCESSING_MESSAGES } from './constants';
import { ArrowRight, Film, ChevronRight, Zap, Layers, Wand2 } from 'lucide-react';

const DEFAULT_SETTINGS: VideoSettings = {
  resolution: '4K',
  fps: '60',
  format: 'MP4 (H.264)',
  quality: 'Balanced'
};

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('upload');
  const [videoFile, setVideoFile] = useState<VideoFile | null>(null);
  const [settings, setSettings] = useState<VideoSettings>(DEFAULT_SETTINGS);
  
  const [processingState, setProcessingState] = useState<ProcessingState>({
    progress: 0,
    statusMessage: '',
    estimatedTimeRemaining: '--:--',
    isComplete: false
  });

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (videoFile?.previewUrl) {
        URL.revokeObjectURL(videoFile.previewUrl);
      }
    };
  }, [videoFile]);

  const handleFileSelect = (file: File) => {
    const url = URL.createObjectURL(file);
    // In a real app, we'd load the video metadata here
    setVideoFile({
      file,
      previewUrl: url,
      originalResolution: 'Unknown', // This would require loading the video into a hidden element to read
      duration: 0
    });
    setStep('settings');
  };

  const startProcessing = () => {
    setStep('processing');
    setProcessingState({
      progress: 0,
      statusMessage: PROCESSING_MESSAGES[0],
      estimatedTimeRemaining: '01:30',
      isComplete: false
    });

    // Simulate Processing
    let progress = 0;
    
    const interval = setInterval(() => {
      progress += Math.random() * 2; // Random increment
      
      // Update message based on progress thresholds
      const msgIdx = Math.floor((progress / 100) * PROCESSING_MESSAGES.length);
      const currentMsg = PROCESSING_MESSAGES[Math.min(msgIdx, PROCESSING_MESSAGES.length - 1)];

      // Mock remaining time
      const remainingSeconds = Math.max(0, 90 - (progress * 0.9));
      const mins = Math.floor(remainingSeconds / 60);
      const secs = Math.floor(remainingSeconds % 60);
      const timeStr = `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;

      if (progress >= 100) {
        clearInterval(interval);
        setProcessingState({
            progress: 100,
            statusMessage: 'SEQUENCE COMPLETE',
            estimatedTimeRemaining: '00:00',
            isComplete: true
        });
        setTimeout(() => setStep('result'), 800);
      } else {
        setProcessingState({
          progress,
          statusMessage: currentMsg,
          estimatedTimeRemaining: timeStr,
          isComplete: false
        });
      }
    }, 200);
  };

  const resetApp = () => {
    setStep('upload');
    setVideoFile(null);
    setSettings(DEFAULT_SETTINGS);
    setProcessingState({
        progress: 0,
        statusMessage: '',
        estimatedTimeRemaining: '',
        isComplete: false
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-grid-pattern pb-20 selection:bg-cyan-500/30">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10">
        
        {/* Step Indicator */}
        {step !== 'upload' && step !== 'result' && (
           <div className="flex items-center gap-3 text-sm text-slate-500 mb-8 font-mono">
              <span className={`flex items-center gap-2 ${step === 'settings' ? 'text-cyan-400 font-bold' : ''}`}>
                <span className="text-[10px]">01</span> CONFIG
              </span>
              <ChevronRight className="w-3 h-3 opacity-50" />
              <span className={`flex items-center gap-2 ${step === 'processing' ? 'text-cyan-400 font-bold' : ''}`}>
                <span className="text-[10px]">02</span> PROCESS
              </span>
              <ChevronRight className="w-3 h-3 opacity-50" />
              <span>
                <span className="text-[10px]">03</span> RESULT
              </span>
           </div>
        )}

        {step === 'upload' && (
          <div className="space-y-16 animate-fade-in-up">
            <div className="text-center space-y-5 mt-8 relative">
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none"></div>
              
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight font-display drop-shadow-xl">
                Redefine Video<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">Clarification</span>
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                Next-gen AI upscaling pipeline. Enhance footage to <span className="text-white font-medium">4K resolution</span>, interpolate framerates, and restore details with neural precision.
              </p>
            </div>
            
            <FileUpload onFileSelect={handleFileSelect} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
               {[
                 { 
                   title: 'Neural Upscale', 
                   desc: 'Convert 360p/720p to 4K using GANs.', 
                   icon: <Wand2 className="w-6 h-6 text-cyan-400" />
                 },
                 { 
                   title: 'Frame Gen', 
                   desc: 'Fluid motion via 60fps interpolation.', 
                   icon: <Layers className="w-6 h-6 text-violet-400" />
                 },
                 { 
                   title: 'Denoise Core', 
                   desc: 'Advanced artifact & compression cleaning.', 
                   icon: <Zap className="w-6 h-6 text-emerald-400" />
                 }
               ].map((feature, i) => (
                 <div key={i} className="group bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                        {feature.icon}
                    </div>
                    <div className="mb-4 p-3 bg-slate-950 w-fit rounded-lg border border-slate-800 group-hover:border-slate-700">
                        {feature.icon}
                    </div>
                    <h3 className="font-bold text-white mb-2 tracking-wide">{feature.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        )}

        {step === 'settings' && videoFile && (
          <div className="space-y-6 animate-fade-in">
            {/* File Preview Card */}
            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex items-center gap-5 shadow-lg">
              <div className="w-32 h-20 bg-black rounded-lg overflow-hidden flex-shrink-0 relative border border-slate-700 group">
                <video src={videoFile.previewUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Film className="w-8 h-8 text-white/50 drop-shadow-md" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-lg truncate mb-1">{videoFile.file.name}</h3>
                <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-cyan-400 border border-slate-700">SOURCE INPUT</span>
                    <span>{(videoFile.file.size / (1024*1024)).toFixed(1)} MB</span>
                </div>
              </div>
            </div>

            <SettingsPanel 
              settings={settings} 
              onChange={setSettings} 
              onBack={() => setStep('upload')}
            />

            <div className="flex justify-end pt-4">
              <Button 
                size="lg" 
                className="w-full md:w-auto px-12 font-bold"
                onClick={startProcessing}
              >
                INITIATE PROCESSING
              </Button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <ProcessingView 
            state={processingState} 
            settings={settings} 
            onCancel={resetApp} 
          />
        )}

        {step === 'result' && videoFile && (
          <ResultView 
            originalFile={videoFile} 
            settings={settings} 
            onReset={resetApp}
            onBack={() => setStep('settings')}
          />
        )}

      </main>
    </div>
  );
};

export default App;