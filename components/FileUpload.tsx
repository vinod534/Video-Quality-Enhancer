import React, { useCallback, useState } from 'react';
import { UploadCloud, FileVideo, AlertCircle } from 'lucide-react';
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
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ease-in-out
          ${isDragging 
            ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' 
            : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50'
          }
        `}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`p-4 rounded-full ${isDragging ? 'bg-indigo-100' : 'bg-slate-100'}`}>
            <UploadCloud className={`w-10 h-10 ${isDragging ? 'text-indigo-600' : 'text-slate-500'}`} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-800">
              Drag & Drop video here
            </h3>
            <p className="text-slate-500">
              or <label className="text-indigo-600 hover:text-indigo-700 cursor-pointer font-medium hover:underline">
                browse files
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".mp4,.avi,.mov,.mkv,.webm"
                  onChange={handleFileInput}
                />
              </label> to upload
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 pt-4">
            <span className="flex items-center gap-1">
              <FileVideo className="w-3 h-3" /> MP4, AVI, MOV, WEBM
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span>Max size: {MAX_FILE_SIZE_DISPLAY}</span>
          </div>
        </div>

        {error && (
          <div className="absolute bottom-4 left-0 right-0 mx-auto w-max max-w-[90%] flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm border border-red-100 animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
};