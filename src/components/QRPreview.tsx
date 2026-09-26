import React, { useEffect, useRef, useState } from 'react';
import { QRType, QRSettings } from '../types';
import QRCode from 'qrcode';
import { QrCode, Scan, ExternalLink, Code2 } from 'lucide-react';

interface QRPreviewProps {
  payload: string;
  type: QRType;
  settings: QRSettings;
  isValid: boolean;
  onDataUrlGenerated?: (dataUrl: string) => void;
}

export const QRPreview: React.FC<QRPreviewProps> = ({
  payload,
  type,
  settings,
  isValid,
  onDataUrlGenerated,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showRawPayload, setShowRawPayload] = useState(false);

  // Live real-time canvas generation whenever payload or settings change
  useEffect(() => {
    if (!isValid || !payload || !canvasRef.current) {
      setErrorMsg(null);
      return;
    }

    let active = true;

    // Render directly to canvas with current settings
    QRCode.toCanvas(
      canvasRef.current,
      payload,
      {
        width: Math.min(340, settings.size), // Responsive preview cap for layout integrity
        margin: settings.margin,
        color: {
          dark: settings.fgColor,
          light: settings.bgColor,
        },
        errorCorrectionLevel: settings.errorCorrection,
      },
      (err) => {
        if (!active) return;
        if (err) {
          console.error('QR Canvas Error:', err);
          setErrorMsg(err.message || 'Failed to render QR Code');
        } else {
          setErrorMsg(null);
          if (canvasRef.current && onDataUrlGenerated) {
            try {
              const url = canvasRef.current.toDataURL('image/png');
              onDataUrlGenerated(url);
            } catch {
              // Ignore any canvas dataURL read exceptions
            }
          }
        }
      }
    );

    return () => {
      active = false;
    };
  }, [payload, settings, isValid, onDataUrlGenerated]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Scan className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Live Preview
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            EC: {settings.errorCorrection} · M: {settings.margin}
          </span>
        </div>
      </div>

      {/* Preview Card Viewport */}
      <div className="w-full min-h-[320px] rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {isValid && payload && !errorMsg ? (
          <div className="flex flex-col items-center">
            {/* The QR Canvas */}
            <div
              className="p-3 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-800 transition-all duration-200"
              style={{ backgroundColor: settings.bgColor }}
            >
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto block rounded-lg mx-auto"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3 flex items-center gap-1 font-medium">
              <span>Point your smartphone camera to scan</span>
            </p>
          </div>
        ) : (
          /* Empty / Invalid State */
          <div className="flex flex-col items-center text-center max-w-xs py-8 px-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-200/60 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3 border border-slate-300/40 dark:border-slate-700/50">
              <QrCode className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              QR Code Ready
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Enter valid {type.toUpperCase()} details in the form to generate and preview your live QR code.
            </p>
          </div>
        )}
      </div>

      {/* Payload Inspector Drawer / Toggle */}
      {isValid && payload && (
        <div className="w-full mt-3">
          <button
            type="button"
            onClick={() => setShowRawPayload(!showRawPayload)}
            className="w-full py-1 text-[11px] font-mono text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center justify-center gap-1 transition-colors"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{showRawPayload ? 'Hide Raw Payload' : 'Inspect Encoded Payload'}</span>
          </button>
          {showRawPayload && (
            <div className="mt-1.5 p-2 bg-slate-100 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 break-all select-all">
              {payload}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
