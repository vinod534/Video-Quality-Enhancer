import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

interface ComparisonSliderProps {
  videoUrl: string;
  className?: string;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ videoUrl, className = '' }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setSliderPosition(percentage);
    }
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  // Sync videos
  const togglePlay = () => {
    if (videoRef1.current && videoRef2.current) {
      if (videoRef1.current.paused) {
        videoRef1.current.play();
        videoRef2.current.play();
      } else {
        videoRef1.current.pause();
        videoRef2.current.pause();
      }
    }
  };

  useEffect(() => {
    const v1 = videoRef1.current;
    const v2 = videoRef2.current;

    const sync = () => {
        if(v1 && v2 && Math.abs(v1.currentTime - v2.currentTime) > 0.1) {
            v2.currentTime = v1.currentTime;
        }
    };
    
    // Low-fi sync mechanism
    const interval = setInterval(sync, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full aspect-video bg-black rounded-lg overflow-hidden select-none cursor-ew-resize group ${className}`}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onClick={togglePlay}
    >
      {/* After Image (Full Quality & Enhanced) */}
      <video
        ref={videoRef2}
        src={videoUrl}
        className="absolute top-0 left-0 w-full h-full object-cover"
        // Apply enhancement filters to simulate AI upscaling visual improvements
        style={{ filter: 'contrast(1.15) saturate(1.2) brightness(1.05)' }} 
        loop
        muted
        playsInline
      />
      <div className="absolute top-4 right-4 bg-indigo-600/90 text-white px-2 py-1 rounded text-xs font-bold pointer-events-none backdrop-blur-sm border border-indigo-400/30">
        Upscaled (Enhanced)
      </div>

      {/* Before Image (Clipped & Blurred) */}
      <div 
        className="absolute top-0 left-0 h-full overflow-hidden bg-black"
        style={{ width: `${sliderPosition}%` }}
      >
        <video
          ref={videoRef1}
          src={videoUrl}
          className="absolute top-0 left-0 max-w-none h-full object-cover"
          // Simulate lower quality via CSS filter for comparison
          style={{ 
             width: containerRef.current ? containerRef.current.offsetWidth : '100vw',
             filter: 'blur(1px) opacity(0.9)'
          }}
          loop
          muted
          playsInline
        />
        <div className="absolute top-4 left-4 bg-black/60 text-white px-2 py-1 rounded text-xs font-bold pointer-events-none backdrop-blur-sm">
            Original
        </div>
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg text-indigo-600 border border-slate-200">
          <ChevronsLeftRight className="w-5 h-5" />
        </div>
      </div>
      
      {!videoRef1.current?.paused && (
         <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-black/50 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md">Click to Pause/Play</span>
         </div>
      )}
    </div>
  );
};