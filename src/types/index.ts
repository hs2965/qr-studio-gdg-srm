export type QRType = 'url' | 'text' | 'email' | 'phone' | 'wifi';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface QRSettings {
  size: number; // in pixels (e.g. 240, range 140 to 600)
  fgColor: string; // foreground hex color (e.g. #0f172a)
  bgColor: string; // background hex color (e.g. #ffffff)
  errorCorrection: ErrorCorrectionLevel;
  margin: number; // padding modules (e.g. 1 to 6)
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  fgColor: string;
  bgColor: string;
  errorCorrection: ErrorCorrectionLevel;
  margin: number;
}

export interface URLFormData {
  url: string;
}

export interface TextFormData {
  text: string;
}

export interface EmailFormData {
  email: string;
  subject: string;
  body: string;
}

export interface PhoneFormData {
  phone: string;
}

export type WifiSecurity = 'WPA' | 'WEP' | 'nopass';

export interface WifiFormData {
  ssid: string;
  password: string;
  security: WifiSecurity;
  hidden: boolean;
}

export type QRFormData = {
  url: URLFormData;
  text: TextFormData;
  email: EmailFormData;
  phone: PhoneFormData;
  wifi: WifiFormData;
};

export interface StoredQRItem {
  id: string;
  type: QRType;
  title: string;
  subtitle: string;
  payload: string;
  formData: any;
  settings: QRSettings;
  presetId?: string;
  timestamp: number;
  dataUrl?: string; // cached thumbnail
}

export interface ScanReliabilityResult {
  isReliable: boolean;
  score: 'excellent' | 'good' | 'warning' | 'critical';
  contrastRatio: number;
  warnings: string[];
  tips: string[];
}
