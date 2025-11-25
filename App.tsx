import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { SettingsPanel } from './components/SettingsPanel';
import { ProcessingView } from './components/ProcessingView';
import { ResultView } from './components/ResultView';
import { Button } from './components/Button';
import { AppStep, VideoFile, VideoSettings, ProcessingState } from './types';
import { PROCESSING_MESSAGES } from './constants';
import { ArrowRight, Film } from 'lucide-react';

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
    let messageIndex = 0;
    
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
            statusMessage: 'Complete!',
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
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Step Indicator (Optional visual aid) */}
        {step !== 'upload' && step !== 'result' && (
           <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
              <span className={step === 'settings' ? 'text-indigo-600 font-medium' : ''}>Configuration</span>
              <ArrowRight className="w-4 h-4" />
              <span className={step === 'processing' ? 'text-indigo-600 font-medium' : ''}>Processing</span>
              <ArrowRight className="w-4 h-4" />
              <span>Result</span>
           </div>
        )}

        {step === 'upload' && (
          <div className="space-y-12 animate-fade-in-up">
            <div className="text-center space-y-4 mt-8">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                Transform Low-Res Video <br />
                <span className="text-indigo-600">Into 4K Masterpieces</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Drag and drop your footage to instantly enhance resolution, frame rate, and clarity using our advanced cloud-based AI engine.
              </p>
            </div>
            <FileUpload onFileSelect={handleFileSelect} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
               {[
                 { title: 'AI Upscaling', desc: 'Upscale 360p/720p content to crisp 4K resolution.' },
                 { title: 'Frame Interpolation', desc: 'Boost fluidity by converting 30fps to 60fps or 120fps.' },
                 { title: 'Artifact Removal', desc: 'Automatically clean noise, blockiness, and compression artifacts.' }
               ].map((feature, i) => (
                 <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="font-semibold text-slate-800 mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-500">{feature.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        )}

        {step === 'settings' && videoFile && (
          <div className="space-y-6 animate-fade-in">
            {/* File Preview Card */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
              <div className="w-24 h-16 bg-black rounded-lg overflow-hidden flex-shrink-0 relative">
                <video src={videoFile.previewUrl} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                   <Film className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-900 truncate">{videoFile.file.name}</h3>
                <p className="text-sm text-slate-500">{(videoFile.file.size / (1024*1024)).toFixed(1)} MB • Original Format</p>
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
                className="w-full md:w-auto px-12"
                onClick={startProcessing}
              >
                Start Upscaling
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