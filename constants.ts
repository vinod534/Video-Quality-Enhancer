import { Resolution, FPS, FileFormat, QualityPreset } from "./types";

export const RESOLUTIONS: Resolution[] = ['1080p', '4K'];
export const FRAME_RATES: FPS[] = ['30', '50', '60'];
export const FORMATS: FileFormat[] = ['MP4 (H.264)', 'MP4 (H.265/HEVC)', 'WebM', 'AVI', 'MOV'];
export const QUALITIES: QualityPreset[] = ['Fast', 'Balanced', 'High Quality'];

export const PROCESSING_MESSAGES = [
  "Initializing upload...",
  "Analyzing video frames...",
  "Enhancing texture details...",
  "Reducing noise artifacts...",
  "Upscaling resolution...",
  "Interpolating frames...",
  "Color correcting...",
  "Encoding final output...",
  "Finalizing file..."
];

export const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024 * 1024; // 2GB
export const MAX_FILE_SIZE_DISPLAY = "2GB";
export const ALLOWED_TYPES = ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-matroska', 'video/webm'];