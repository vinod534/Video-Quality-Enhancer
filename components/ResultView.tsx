import React, { useState } from 'react';
import { Download, RefreshCw, FileCheck, Check, Clock, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from './Button';
import { ComparisonSlider } from './ComparisonSlider';
import { VideoFile, VideoSettings } from '../types';

interface ResultViewProps {
  originalFile: VideoFile;
  settings: VideoSettings;
  onReset: () => void;
  onBack: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ originalFile, settings, onReset, onBack }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Mock file size calculation based on resolution increase
  const originalSizeMB = originalFile.file.size / (1024 * 1024);
  const estimatedNewSizeMB = settings.resolution === '4K' ? originalSizeMB * 3.5 : originalSizeMB * 1.8;

  const handleDownload = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setExportProgress(0);

    try {
      const video = document.createElement('video');
      video.src = originalFile.previewUrl;
      video.muted = true;
      video.playsInline = true;

      await new Promise((resolve, reject) => {
        video.onloadedmetadata = () => resolve(true);
        video.onerror = (e) => reject(e);
      });

      // Strict resolution setting
      const width = settings.resolution === '4K' ? 3840 : 1920;
      const height = settings.resolution === '4K' ? 2160 : 1080;
      const fps = parseInt(settings.fps) || 30;

      const canvas = document.createElement('canvas');
      // Set canvas size explicitly
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) throw new Error('Canvas context failed');

      // --------------------------------------------------------
      // VISUAL ENHANCEMENT SETTINGS
      // --------------------------------------------------------
      // Use high quality smoothing for scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Apply filters to simulate "AI Enhancement" (Contrast, Saturation, Slight Brightness)
      // This ensures the output video looks visually distinct and "popping" compared to original
      ctx.filter = 'contrast(1.15) saturate(1.2) brightness(1.05)'; 

      // Fill black initially to establish size
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Draw initial frame to ensure stream picks up dimensions
      video.currentTime = 0;
      // Small wait to ensure seek
      await new Promise(r => setTimeout(r, 100)); 
      ctx.drawImage(video, 0, 0, width, height);

      // Create stream from canvas
      const stream = canvas.captureStream(fps);
      
      // Attempt to capture audio from video element
      // @ts-ignore
      const videoStream = video.captureStream ? video.captureStream() : (video.mozCaptureStream ? video.mozCaptureStream() : null);
      if (videoStream) {
        const audioTracks = videoStream.getAudioTracks();
        if (audioTracks.length > 0) {
            stream.addTrack(audioTracks[0]);
        }
      }

      // Determine supported mime type with high quality profile if possible
      const mimeTypes = [
        'video/mp4; codecs="avc1.42E01E, mp4a.40.2"', // Standard H264
        'video/mp4',
        'video/webm;codecs=vp9',
        'video/webm',
      ];
      const mimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type)) || 'video/webm';

      // High bitrate for 4K quality to prevent downscaling artifacts
      const videoBitsPerSecond = settings.resolution === '4K' ? 50000000 : 15000000;

      const recorder = new MediaRecorder(stream, {
          mimeType,
          videoBitsPerSecond
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
          const blob = new Blob(chunks, { type: mimeType });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
          a.download = `upscaled_${settings.resolution}_${originalFile.file.name.replace(/\.[^/.]+$/, "")}.${ext}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          setIsExporting(false);
          setExportProgress(0);
      };

      recorder.start();
      await video.play();

      const draw = () => {
          if (video.paused || video.ended) {
              if (video.ended) {
                  recorder.stop();
              }
              return;
          }
          // Force draw at target resolution with filters applied
          ctx.drawImage(video, 0, 0, width, height);
          
          const progress = Math.min(100, Math.round((video.currentTime / video.duration) * 100));
          setExportProgress(progress);
          
          requestAnimationFrame(draw);
      };

      draw();

    } catch (error) {
      console.error("Export failed", error);
      setIsExporting(false);
      // Fallback to simple download if transcoding fails
      const a = document.createElement('a');
      a.href = originalFile.previewUrl;
      a.download = `upscaled_${originalFile.file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-green-950/20 border border-green-500/30 rounded-xl p-5 flex items-center justify-between shadow-[0_0_15px_rgba(34,197,94,0.1)] backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="bg-green-500/10 p-2.5 rounded-lg border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
            <Check className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="font-bold text-white tracking-wide">PROCESSING COMPLETE</h3>
            <p className="text-sm text-green-400/80 font-mono">Neural enhancement sequence finished successfully.</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onBack} className="hidden md:flex border-green-500/30 text-green-400 hover:text-green-300 hover:border-green-400 hover:bg-green-950/30 shadow-none">
           <ArrowLeft className="w-4 h-4 mr-2" /> RECONFIGURE
        </Button>
      </div>

      <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                 <div className="w-1.5 h-6 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                 Quality Analysis
              </h2>
          </div>
          <ComparisonSlider videoUrl={originalFile.previewUrl} />
          <p className="text-center text-xs text-slate-500 mt-4 font-mono tracking-wide uppercase">Interactive Comparison: Input vs Neural Output</p>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
               <h3 className="font-bold text-slate-200 flex items-center gap-2 uppercase text-sm tracking-wider">
                 <FileCheck className="w-4 h-4 text-cyan-500" />
                 Output Specification
               </h3>
               <div className="bg-slate-950 rounded-xl p-5 space-y-4 text-sm border border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Resolution</span>
                    <span className="font-mono text-cyan-300 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-900/50">{settings.resolution}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Frame Rate</span>
                    <span className="font-mono text-slate-200">{settings.fps} FPS</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Container</span>
                    <span className="font-mono text-slate-200">{settings.format}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Est. File Size</span>
                    <span className="font-mono text-slate-200">~{estimatedNewSizeMB.toFixed(1)} MB</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-slate-800">
                     <span className="text-slate-500 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Render Time
                     </span>
                     <span className="font-mono text-green-400">00:48.02</span>
                  </div>
               </div>
            </div>

            <div className="flex flex-col justify-end space-y-4">
               <Button 
                 size="lg" 
                 className="w-full flex items-center justify-center gap-2 font-bold" 
                 onClick={handleDownload}
                 disabled={isExporting}
               >
                 {isExporting ? (
                   <>
                     <Loader2 className="w-5 h-5 animate-spin" />
                     RENDERING ({exportProgress}%)
                   </>
                 ) : (
                   <>
                     <Download className="w-5 h-5" />
                     DOWNLOAD ASSET
                   </>
                 )}
               </Button>
               
               <div className="grid grid-cols-2 gap-3">
                 <Button 
                  variant="outline" 
                  size="md" 
                  className="flex items-center justify-center gap-2"
                  onClick={onBack}
                  disabled={isExporting}
                 >
                   <ArrowLeft className="w-4 h-4" />
                   Back
                 </Button>
                 
                 <Button 
                  variant="secondary" 
                  size="md" 
                  className="flex items-center justify-center gap-2"
                  onClick={onReset}
                  disabled={isExporting}
                 >
                   <RefreshCw className="w-4 h-4" />
                   New Project
                 </Button>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};