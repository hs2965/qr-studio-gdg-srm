import React from 'react';
import { QR_PRESETS } from '../utils/presets';
import { Preset, QRSettings } from '../types';
import { Palette, Check } from 'lucide-react';

interface PresetSelectorProps {
  currentSettings: QRSettings;
  activePresetId?: string;
  onSelectPreset: (preset: Preset) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  currentSettings,
  activePresetId,
  onSelectPreset,
}) => {
  return (
    <div id="presets" className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Design Presets
          </h3>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Presets don't lock you in — modify any slider anytime
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {QR_PRESETS.map((preset) => {
          // Check if current settings match this preset
          const isMatching =
            currentSettings.fgColor.toLowerCase() === preset.fgColor.toLowerCase() &&
            currentSettings.bgColor.toLowerCase() === preset.bgColor.toLowerCase() &&
            currentSettings.errorCorrection === preset.errorCorrection &&
            currentSettings.margin === preset.margin;

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={`group relative p-2.5 rounded-xl border text-left transition-all hover:shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isMatching
                  ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Swatch preview container */}
              <div
                className="w-full h-10 rounded-lg mb-2 flex items-center justify-center border border-slate-200/60 dark:border-slate-700 shadow-inner"
                style={{ backgroundColor: preset.bgColor }}
              >
                <div
                  className="w-5 h-5 rounded flex items-center justify-center font-mono text-[9px] font-bold"
                  style={{ backgroundColor: preset.fgColor, color: preset.bgColor }}
                >
                  QR
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {preset.name}
                </span>
                {isMatching && (
                  <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                )}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                {preset.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
