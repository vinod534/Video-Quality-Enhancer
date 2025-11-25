export type Resolution = '1080p' | '4K';
export type FPS = '30' | '50' | '60';
export type FileFormat = 'MP4 (H.264)' | 'MP4 (H.265/HEVC)' | 'WebM' | 'AVI' | 'MOV';
export type QualityPreset = 'Fast' | 'Balanced' | 'High Quality';

export interface VideoSettings {
  resolution: Resolution;
  fps: FPS;
  format: FileFormat;
  quality: QualityPreset;
}

export interface VideoFile {
  file: File;
  previewUrl: string;
  originalResolution: string;
  duration: number; // in seconds
}

export type AppStep = 'upload' | 'settings' | 'processing' | 'result';

export interface ProcessingState {
  progress: number;
  statusMessage: string;
  estimatedTimeRemaining: string; // formatted string e.g. "00:45"
  isComplete: boolean;
}