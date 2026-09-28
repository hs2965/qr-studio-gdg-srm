import React, { useState } from 'react';
import { QRType, QRSettings } from '../types';
import { Download, Check, Copy, FileCode2 } from 'lucide-react';
import QRCode from 'qrcode';

interface DownloadButtonProps {
  payload: string;
  type: QRType;
  settings: QRSettings;
  disabled: boolean;
  onDownloaded?: () => void;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  payload,
  type,
  settings,
  disabled,
  onDownloaded,
}) => {
  const [downloadingPng, setDownloadingPng] = useState(false);
  const [downloadingSvg, setDownloadingSvg] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate clean filename
  const getFilename = (ext: string) => {
    const timestamp = new Date().toISOString().slice(0, 10);
    return `qr-studio-${type}-${timestamp}.${ext}`;
  };

  // Download PNG matching current settings
  const handleDownloadPNG = async () => {
    if (disabled || !payload) return;
    setDownloadingPng(true);
    try {
      // Generate high-resolution canvas matching the exact current settings
      const dataUrl = await QRCode.toDataURL(payload, {
        width: settings.size,
        margin: settings.margin,
        color: {
          dark: settings.fgColor,
          light: settings.bgColor,
        },
        errorCorrectionLevel: settings.errorCorrection,
      });

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = getFilename('png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (onDownloaded) {
        onDownloaded();
      }
    } catch (err) {
      console.error('Failed to export PNG:', err);
    } finally {
      setDownloadingPng(false);
    }
  };

  // Download SVG
  const handleDownloadSVG = async () => {
    if (disabled || !payload) return;
    setDownloadingSvg(true);
    try {
      const svgString = await QRCode.toString(payload, {
        type: 'svg',
        width: settings.size,
        margin: settings.margin,
        color: {
          dark: settings.fgColor,
          light: settings.bgColor,
        },
        errorCorrectionLevel: settings.errorCorrection,
      });

      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = getFilename('svg');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export SVG:', err);
    } finally {
      setDownloadingSvg(false);
    }
  };

  // Copy PNG image to clipboard
  const handleCopyImage = async () => {
    if (disabled || !payload) return;
    try {
      const dataUrl = await QRCode.toDataURL(payload, {
        width: settings.size,
        margin: settings.margin,
        color: {
          dark: settings.fgColor,
          light: settings.bgColor,
        },
        errorCorrectionLevel: settings.errorCorrection,
      });

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Clipboard write image not supported or failed:', err);
    }
  };

  return (
    <div className="space-y-2">
      {/* Primary PNG Download Button (Requirement 10) */}
      <button
        type="button"
        onClick={handleDownloadPNG}
        disabled={disabled || downloadingPng}
        className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer ${
          disabled
            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
            : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-indigo-500/25 hover:shadow-md'
        }`}
      >
        <Download className="w-4 h-4 stroke-[2.2]" />
        <span>{downloadingPng ? 'Generating PNG...' : 'Download PNG'}</span>
        <span className="text-xs font-mono opacity-80 font-normal">
          ({settings.size}×{settings.size} px)
        </span>
      </button>

      <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 font-mono">
        Export size includes margin ({settings.size}×{settings.size} px)
      </p>

      {/* Secondary Actions: SVG Download & Copy */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleDownloadSVG}
          disabled={disabled || downloadingSvg}
          className="py-2 px-3 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-colors"
        >
          <FileCode2 className="w-3.5 h-3.5 text-slate-500" />
          <span>Vector SVG</span>
        </button>

        <button
          type="button"
          onClick={handleCopyImage}
          disabled={disabled}
          className="py-2 px-3 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy Image</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
