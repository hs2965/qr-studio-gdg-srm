import React from 'react';
import { ScanReliabilityResult } from '../types';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

interface ReliabilityWarningProps {
  reliability: ScanReliabilityResult;
  onAutoFixContrast?: () => void;
}

export const ReliabilityWarning: React.FC<ReliabilityWarningProps> = ({
  reliability,
  onAutoFixContrast,
}) => {
  const { score, contrastRatio, warnings, tips } = reliability;

  // If score is excellent or good with no warnings, render a quiet reassuring status
  if (reliability.isReliable) {
    return (
      <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
              Optimal Scan Reliability
            </span>
          </div>
          <span className="text-[11px] font-mono font-medium text-emerald-700 dark:text-emerald-300">
            {contrastRatio}:1 Contrast
          </span>
        </div>
        <p className="text-[11px] text-emerald-700/90 dark:text-emerald-300/80 mt-1">
          High optical contrast and standard quiet zone. Designed for reliable smartphone scanning.
        </p>
      </div>
    );
  }

  // Warning or Critical State
  const isCritical = score === 'critical';

  return (
    <div
      role="region"
      aria-label="Scan Reliability Warning"
      className={`p-3.5 rounded-xl border transition-colors ${
        isCritical
          ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900 text-rose-900 dark:text-rose-100'
          : 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900 text-amber-900 dark:text-amber-100'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isCritical ? (
            <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          )}
          <span className="text-xs font-bold uppercase tracking-wide">
            {isCritical ? 'Critical Scanning Risk' : 'Scan Reliability Warning'}
          </span>
        </div>
        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-white/70 dark:bg-slate-900/60 border border-current/20">
          {contrastRatio}:1 Contrast
        </span>
      </div>

      {/* Warning Items */}
      <ul className="space-y-1.5 mb-2.5">
        {warnings.map((warn, i) => (
          <li key={i} className="text-xs flex items-start gap-1.5 leading-relaxed">
            <span className="font-bold">•</span>
            <span>{warn}</span>
          </li>
        ))}
      </ul>

      {/* Actionable Tips */}
      {tips.length > 0 && (
        <div className="pt-2 border-t border-current/15 text-[11px] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <Info className="w-3.5 h-3.5 shrink-0 text-slate-500" />
            <span>{tips[0]}</span>
          </div>
          {onAutoFixContrast && contrastRatio < 4.0 && (
            <button
              type="button"
              onClick={onAutoFixContrast}
              className="px-2.5 py-1 text-[11px] font-semibold rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
            >
              Auto-Fix Colors
            </button>
          )}
        </div>
      )}
    </div>
  );
};
