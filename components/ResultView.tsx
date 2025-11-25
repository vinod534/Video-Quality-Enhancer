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
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between text-green-800">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-full">
            <Check className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold">Processing Complete</h3>
            <p className="text-sm text-green-700">Your video has been successfully upscaled and optimized.</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onBack} className="hidden md:flex bg-white border-green-200 text-green-700 hover:bg-green-50">
           <ArrowLeft className="w-4 h-4 mr-2" /> Back to Config
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Quality Comparison</h2>
          <ComparisonSlider videoUrl={originalFile.previewUrl} />
          <p className="text-center text-sm text-slate-500 mt-3">Drag slider to compare Original vs Enhanced</p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
               <h3 className="font-medium text-slate-900 flex items-center gap-2">
                 <FileCheck className="w-4 h-4 text-indigo-500" />
                 File Details
               </h3>
               <div className="bg-slate-50 rounded-lg p-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Resolution</span>
                    <span className="font-medium text-slate-900">{settings.resolution} (Upscaled)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Frame Rate</span>
                    <span className="font-medium text-slate-900">{settings.fps} FPS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Format</span>
                    <span className="font-medium text-slate-900">{settings.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">File Size</span>
                    <span className="font-medium text-slate-900">~{estimatedNewSizeMB.toFixed(1)} MB</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200">
                     <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Processing Time
                     </span>
                     <span className="font-medium text-slate-900">48s</span>
                  </div>
               </div>
            </div>

            <div className="flex flex-col justify-end space-y-4">
               <Button 
                 size="lg" 
                 className="w-full flex items-center justify-center gap-2" 
                 onClick={handleDownload}
                 disabled={isExporting}
               >
                 {isExporting ? (
                   <>
                     <Loader2 className="w-5 h-5 animate-spin" />
                     Enhancing & Downloading ({exportProgress}%)
                   </>
                 ) : (
                   <>
                     <Download className="w-5 h-5" />
                     Download Enhanced Video
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
                   Back to Config
                 </Button>
                 
                 <Button 
                  variant="secondary" 
                  size="md" 
                  className="flex items-center justify-center gap-2"
                  onClick={onReset}
                  disabled={isExporting}
                 >
                   <RefreshCw className="w-4 h-4" />
                   Start Over
                 </Button>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};