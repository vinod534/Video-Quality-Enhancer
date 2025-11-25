import React, { useCallback, useState } from 'react';
import { UploadCloud, FileVideo, AlertCircle, Cpu } from 'lucide-react';
import { MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_DISPLAY, ALLOWED_TYPES } from '../constants';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(mp4|avi|mov|mkv|webm)$/i)) {
      setError("Invalid file format. Please upload MP4, AVI, MOV, MKV, or WebM.");
      return false;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File too large. Maximum size is ${MAX_FILE_SIZE_DISPLAY}.`);
      return false;
    }
    return true;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  return (
    <div className="w-full max-w-2xl mx-auto relative group">
      {/* Background glow animation */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500 ${isDragging ? 'opacity-70 animate-pulse' : ''}`}></div>
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative rounded-2xl p-12 text-center transition-all duration-300 ease-in-out bg-slate-900 border-2
          ${isDragging 
            ? 'border-cyan-500 bg-slate-800/80 scale-[1.01] shadow-[0_0_30px_rgba(6,182,212,0.2)]' 
            : 'border-slate-800 hover:border-slate-700'
          }
        `}
      >
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className={`p-5 rounded-full transition-colors duration-300 ${isDragging ? 'bg-cyan-950/50' : 'bg-slate-800'}`}>
            <UploadCloud className={`w-12 h-12 ${isDragging ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'text-slate-500'}`} />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Initiate <span className="text-cyan-400">Upload Sequence</span>
            </h3>
            <p className="text-slate-400 font-light">
              Drag & drop media source or <label className="text-cyan-400 hover:text-cyan-300 cursor-pointer font-medium hover:underline decoration-cyan-500/30 underline-offset-4">
                browse filesystem
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".mp4,.avi,.mov,.mkv,.webm"
                  onChange={handleFileInput}
                />
              </label>
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-500 pt-6 border-t border-slate-800 w-full justify-center">
            <span className="flex items-center gap-1.5">
              <FileVideo className="w-3.5 h-3.5" /> SUPPORTED: MP4, AVI, MOV, WEBM
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            <span>LIMIT: {MAX_FILE_SIZE_DISPLAY}</span>
          </div>
        </div>

        {error && (
          <div className="absolute -bottom-6 left-0 right-0 mx-auto w-max max-w-[90%] flex items-center gap-2 bg-red-950/90 text-red-200 px-4 py-2 rounded-lg text-sm border border-red-500/30 shadow-lg animate-fade-in backdrop-blur-md">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
};