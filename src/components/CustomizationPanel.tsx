import React from 'react';
import { QRSettings, ErrorCorrectionLevel } from '../types';
import { Sliders, RotateCcw, ShieldCheck } from 'lucide-react';

interface CustomizationPanelProps {
  settings: QRSettings;
  onChangeSettings: (newSettings: Partial<QRSettings>) => void;
  onReset: () => void;
}

const COMMON_FG_COLORS = ['#000000', '#0f172a', '#1e3a8a', '#064e3b', '#4c1d95', '#831843'];
const COMMON_BG_COLORS = ['#ffffff', '#f8fafc', '#f1f5f9', '#ecfdf5', '#eff6ff', '#0f172a'];

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  settings,
  onChangeSettings,
  onReset,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            QR Code Customization
          </h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* 1. Size Slider & Numeric Input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="qr-size-slider" className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Export Dimensions (Total Size)
          </label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min={160}
              max={640}
              step={10}
              value={settings.size}
              onChange={(e) => onChangeSettings({ size: Math.max(120, Math.min(800, Number(e.target.value) || 280)) })}
              className="w-16 px-2 py-0.5 text-xs text-right font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <span className="text-xs text-slate-400 font-mono">px</span>
          </div>
        </div>
        <input
          id="qr-size-slider"
          type="range"
          min={160}
          max={600}
          step={10}
          value={settings.size}
          onChange={(e) => onChangeSettings({ size: Number(e.target.value) })}
          className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
          <span>160px (Compact)</span>
          <span>300px (Standard)</span>
          <span>600px (High-Res Print)</span>
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
          Final exported image is {settings.size}×{settings.size} px (includes {settings.margin} {settings.margin === 1 ? 'module' : 'modules'} margin).
        </p>
      </div>

      {/* 2. Colors: Foreground & Background */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Foreground Color */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/70 dark:border-slate-800">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
            Foreground Color (Modules)
          </label>
          <div className="flex items-center gap-2 mb-2">
            <div className="relative">
              <input
                type="color"
                value={settings.fgColor}
                onChange={(e) => onChangeSettings({ fgColor: e.target.value })}
                className="w-9 h-9 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-white dark:bg-slate-800"
              />
            </div>
            <input
              type="text"
              value={settings.fgColor}
              onChange={(e) => onChangeSettings({ fgColor: e.target.value })}
              className="flex-1 px-2.5 py-1.5 text-xs font-mono rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 uppercase"
              placeholder="#000000"
            />
          </div>
          {/* Swatches */}
          <div className="flex items-center gap-1.5">
            {COMMON_FG_COLORS.map((hex) => (
              <button
                key={hex}
                type="button"
                aria-label={`Select foreground color ${hex}`}
                onClick={() => onChangeSettings({ fgColor: hex })}
                className={`w-5 h-5 rounded-md border transition-transform hover:scale-110 ${
                  settings.fgColor.toLowerCase() === hex.toLowerCase()
                    ? 'ring-2 ring-indigo-500 scale-105 border-transparent'
                    : 'border-slate-300 dark:border-slate-600'
                }`}
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        </div>

        {/* Background Color */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/70 dark:border-slate-800">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
            Background Color
          </label>
          <div className="flex items-center gap-2 mb-2">
            <div className="relative">
              <input
                type="color"
                value={settings.bgColor}
                onChange={(e) => onChangeSettings({ bgColor: e.target.value })}
                className="w-9 h-9 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-white dark:bg-slate-800"
              />
            </div>
            <input
              type="text"
              value={settings.bgColor}
              onChange={(e) => onChangeSettings({ bgColor: e.target.value })}
              className="flex-1 px-2.5 py-1.5 text-xs font-mono rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 uppercase"
              placeholder="#FFFFFF"
            />
          </div>
          {/* Swatches */}
          <div className="flex items-center gap-1.5">
            {COMMON_BG_COLORS.map((hex) => (
              <button
                key={hex}
                type="button"
                aria-label={`Select background color ${hex}`}
                onClick={() => onChangeSettings({ bgColor: hex })}
                className={`w-5 h-5 rounded-md border transition-transform hover:scale-110 ${
                  settings.bgColor.toLowerCase() === hex.toLowerCase()
                    ? 'ring-2 ring-indigo-500 scale-105 border-transparent'
                    : 'border-slate-300 dark:border-slate-600'
                }`}
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 3. Margin / Padding Slider */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="margin-slider" className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Quiet Zone (Margin / Padding)
          </label>
          <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
            {settings.margin} {settings.margin === 1 ? 'module' : 'modules'}
          </span>
        </div>
        <input
          id="margin-slider"
          type="range"
          min={0}
          max={6}
          step={1}
          value={settings.margin}
          onChange={(e) => onChangeSettings({ margin: Number(e.target.value) })}
          className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500 mt-1">
          <span>0 (Flush)</span>
          <span>2 (Compact)</span>
          <span>4 (Standard)</span>
          <span>6 (Wide)</span>
        </div>
      </div>

      {/* 4. Error Correction Level */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Error Correction Level</span>
          </label>
          <span className="text-[11px] text-slate-400">Recovery capacity</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(
            [
              { level: 'L', label: 'Low', pct: '~7%', desc: 'Lightest density' },
              { level: 'M', label: 'Medium', pct: '~15%', desc: 'Standard balance' },
              { level: 'Q', label: 'Quartile', pct: '~25%', desc: 'High recovery' },
              { level: 'H', label: 'High', pct: '~30%', desc: 'Maximum durability' },
            ] as { level: ErrorCorrectionLevel; label: string; pct: string; desc: string }[]
          ).map((item) => {
            const isActive = settings.errorCorrection === item.level;
            return (
              <button
                key={item.level}
                type="button"
                onClick={() => onChangeSettings({ errorCorrection: item.level })}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-200 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold font-mono">{item.level}</span>
                  <span className={`text-[10px] font-semibold ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                    {item.pct}
                  </span>
                </div>
                <div className="text-xs font-medium">{item.label}</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500">{item.desc}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
