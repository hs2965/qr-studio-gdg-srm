/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { QRType, QRFormData, QRSettings, Preset, StoredQRItem } from './types';
import { generateQRPayload, getQRSummary } from './utils/qrPayload';
import { validateQRData } from './utils/validation';
import { evaluateScanReliability } from './utils/contrast';
import { getRecentQRCodes, saveRecentQRCode, deleteRecentQRCode, clearRecentQRCodes } from './utils/storage';
import { QR_PRESETS } from './utils/presets';

import { Header } from './components/Header';
import { QRTypeSelector } from './components/QRTypeSelector';
import { DynamicInputForm } from './components/DynamicInputForm';
import { CustomizationPanel } from './components/CustomizationPanel';
import { PresetSelector } from './components/PresetSelector';
import { ReliabilityWarning } from './components/ReliabilityWarning';
import { QRPreview } from './components/QRPreview';
import { RecentQRCodes } from './components/RecentQRCodes';
import { DownloadButton } from './components/DownloadButton';

import { BookmarkCheck, Shield, Sparkles, Zap, CheckCircle, CheckCircle2 } from 'lucide-react';

const DEFAULT_SETTINGS: QRSettings = {
  size: 280,
  fgColor: '#0f172a',
  bgColor: '#ffffff',
  errorCorrection: 'M',
  margin: 3,
};

const INITIAL_FORM_DATA: QRFormData = {
  url: {
    url: 'https://gdgsrm.org',
  },
  text: {
    text: 'Welcome to GDG on Campus SRM! Technical Domain Recruitment 2026-27.',
  },
  email: {
    email: 'team@gdgsrm.org',
    subject: 'GDG SRM Technical Recruitment 2026-27',
    body: 'Hello Team,\n\nSubmitting QR Studio web application for technical domain recruitment review.',
  },
  phone: {
    phone: '+91 98765 43210',
  },
  wifi: {
    ssid: 'SRM_Campus_HighSpeed',
    password: 'CampusConnect@2026',
    security: 'WPA',
    hidden: false,
  },
};

export default function App() {
  const [selectedType, setSelectedType] = useState<QRType>('url');
  const [formData, setFormData] = useState<QRFormData>(INITIAL_FORM_DATA);
  const [settings, setSettings] = useState<QRSettings>(DEFAULT_SETTINGS);
  const [activePresetId, setActivePresetId] = useState<string | undefined>('high-contrast');
  const [recentItems, setRecentItems] = useState<StoredQRItem[]>([]);
  const [currentDataUrl, setCurrentDataUrl] = useState<string>('');
  const [saveToast, setSaveToast] = useState(false);

  // Load recent QR items from localStorage on initial render
  useEffect(() => {
    const loaded = getRecentQRCodes();
    setRecentItems(loaded);
  }, []);

  // Compute live payload string
  const payload = useMemo(() => {
    return generateQRPayload(selectedType, formData);
  }, [selectedType, formData]);

  // Compute validation state
  const validation = useMemo(() => {
    return validateQRData(selectedType, formData);
  }, [selectedType, formData]);

  // Compute scan reliability
  const reliability = useMemo(() => {
    return evaluateScanReliability(settings, payload.length);
  }, [settings, payload.length]);

  // Handle changing form data dynamically
  const handleFormDataChange = <K extends keyof QRFormData>(
    category: K,
    values: Partial<QRFormData[K]>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        ...values,
      },
    }));
  };

  // Handle sample data insertion
  const handleApplySample = (type: QRType) => {
    switch (type) {
      case 'url':
        handleFormDataChange('url', { url: 'https://gdgsrm.org' });
        break;
      case 'text':
        handleFormDataChange('text', {
          text: 'Welcome to GDG on Campus SRM! Technical Domain Recruitment 2026-27.',
        });
        break;
      case 'email':
        handleFormDataChange('email', {
          email: 'lead@gdgsrm.org',
          subject: 'Technical Domain Application',
          body: 'Hello Team, excited to apply for the Technical Domain at GDG on Campus SRM.',
        });
        break;
      case 'phone':
        handleFormDataChange('phone', { phone: '+91 98765 43210' });
        break;
      case 'wifi':
        handleFormDataChange('wifi', {
          ssid: 'SRM_Campus_HighSpeed',
          password: 'CampusConnect@2026',
          security: 'WPA',
          hidden: false,
        });
        break;
    }
  };

  // Handle selecting a preset (updates visual settings without locking the user)
  const handleSelectPreset = (preset: Preset) => {
    setActivePresetId(preset.id);
    setSettings((prev) => ({
      ...prev,
      fgColor: preset.fgColor,
      bgColor: preset.bgColor,
      errorCorrection: preset.errorCorrection,
      margin: preset.margin,
    }));
  };

  // Handle manual customization change
  const handleChangeSettings = (partial: Partial<QRSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...partial,
    }));
    // Note: User can modify anytime; active preset ID remains informative
  };

  // Reset customization to defaults
  const handleResetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    setActivePresetId('high-contrast');
  };

  // Auto-fix contrast button handler
  const handleAutoFixContrast = () => {
    setSettings((prev) => ({
      ...prev,
      fgColor: '#090d16',
      bgColor: '#ffffff',
      margin: Math.max(prev.margin, 3),
    }));
  };

  // Save current QR code to Recent storage
  const handleSaveToRecent = useCallback(() => {
    if (!validation.isValid || !payload) return;
    const summary = getQRSummary(selectedType, formData);
    const updated = saveRecentQRCode({
      type: selectedType,
      title: summary.title,
      subtitle: summary.subtitle,
      payload,
      formData: { ...formData[selectedType] },
      settings: { ...settings },
      presetId: activePresetId,
      dataUrl: currentDataUrl,
    });
    setRecentItems(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2200);
  }, [validation.isValid, payload, selectedType, formData, settings, activePresetId, currentDataUrl]);

  // Load / reuse a recent QR code
  const handleLoadRecentItem = (item: StoredQRItem) => {
    setSelectedType(item.type);
    setFormData((prev) => ({
      ...prev,
      [item.type]: {
        ...prev[item.type],
        ...item.formData,
      },
    }));
    setSettings({ ...item.settings });
    setActivePresetId(item.presetId);

    // Scroll smoothly to top generator section
    const elem = document.getElementById('generator');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Delete single recent item
  const handleDeleteRecentItem = (id: string) => {
    const updated = deleteRecentQRCode(id);
    setRecentItems(updated);
  };

  // Clear all recent items
  const handleClearAllRecent = () => {
    clearRecentQRCodes();
    setRecentItems([]);
  };

  const scrollToRecent = () => {
    const elem = document.getElementById('recent-codes');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Header */}
      <Header onScrollToRecent={scrollToRecent} recentCount={recentItems.length} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <section id="generator" className="text-left space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>GDG on Campus SRM · Technical Domain Recruitment 2026–27</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            QR Studio <span className="font-normal text-slate-500 dark:text-slate-400">–</span>{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Create. Customize. Scan.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            Generate reliable QR codes with real-time feedback, deep visual customization, scan reliability diagnostics, and persistent browser history. No server or account required.
          </p>
        </section>

        {/* Dashboard 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Generator, Inputs, Presets & Customization (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1 & 2: QR Type & Inputs Container */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-6">
              <QRTypeSelector
                selectedType={selectedType}
                onChangeType={(type) => setSelectedType(type)}
              />

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <DynamicInputForm
                  type={selectedType}
                  formData={formData}
                  validation={validation}
                  onChangeData={handleFormDataChange}
                  onApplySample={handleApplySample}
                />
              </div>
            </div>

            {/* Step 3: Presets */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
              <PresetSelector
                currentSettings={settings}
                activePresetId={activePresetId}
                onSelectPreset={handleSelectPreset}
              />
            </div>

            {/* Step 4: Full Customization Controls */}
            <div id="customization" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
              <CustomizationPanel
                settings={settings}
                onChangeSettings={handleChangeSettings}
                onReset={handleResetSettings}
              />
            </div>
          </div>

          {/* Right Column: Sticky Live Preview, Reliability Check & Actions (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-5">
            {/* Live QR Preview Card */}
            <QRPreview
              payload={payload}
              type={selectedType}
              settings={settings}
              isValid={validation.isValid}
              onDataUrlGenerated={(url) => setCurrentDataUrl(url)}
            />

            {/* Scan Reliability Diagnostics Area */}
            <ReliabilityWarning
              reliability={reliability}
              onAutoFixContrast={handleAutoFixContrast}
            />

            {/* Download & Actions Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Export & Save
                </span>
                <button
                  type="button"
                  onClick={handleSaveToRecent}
                  disabled={!validation.isValid}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  <span>Save to Recents</span>
                </button>
              </div>

              {saveToast && (
                <div className="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 p-2 rounded-lg flex items-center gap-1.5 animate-fade-in">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Saved to browser history!</span>
                </div>
              )}

              <DownloadButton
                payload={payload}
                type={selectedType}
                settings={settings}
                disabled={!validation.isValid}
                onDownloaded={handleSaveToRecent}
              />
            </div>

            {/* Features Info Matrix */}
            <div className="space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-2.5 bg-white/70 dark:bg-slate-900/60 rounded-xl border border-slate-200/70 dark:border-slate-800 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Live Instant Preview</span>
                </div>
                <div className="p-2.5 bg-white/70 dark:bg-slate-900/60 rounded-xl border border-slate-200/70 dark:border-slate-800 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">100% Client-Side · No Data Uploaded</span>
                </div>
              </div>
              <p className="px-1 text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                QR data stays in your browser. Recent QR configurations are stored locally.
              </p>
            </div>
          </div>
        </div>

        {/* How QR Studio Works Section */}
        <section className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>How QR Studio Works</span>
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Simple 5-step workflow in your browser
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* Step 1 */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/80 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                1
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-semibold text-slate-900 dark:text-white">Choose a QR type</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Select URL, Plain Text, Email, Phone, or Wi-Fi.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/80 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                2
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-semibold text-slate-900 dark:text-white">Enter your information</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Input your details with instant inline validation.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/80 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                3
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-semibold text-slate-900 dark:text-white">Customize your QR code</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Adjust colors, size, margins, and visual presets.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/80 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                4
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-semibold text-slate-900 dark:text-white">Check scan reliability</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Review optical contrast & quiet zone warnings.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/80 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                5
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-semibold text-slate-900 dark:text-white">Download or save your QR</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Download PNG / SVG or reuse from recent history.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 13: Recent QR Codes (LocalStorage Persistent) */}
        <RecentQRCodes
          items={recentItems}
          onLoadItem={handleLoadRecentItem}
          onDeleteItem={handleDeleteRecentItem}
          onClearAll={handleClearAllRecent}
        />

        {/* Technical Domain Recruitment Info Card */}
        <section className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                SRM Institute of Science and Technology
              </span>
              <h3 className="text-lg font-bold">
                GDG on Campus SRM · Technical Domain Recruitment 2026–27
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg">
                GDG Recruitment Project
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
            <div>
              <span className="font-semibold text-white block mb-1">Supported Standards:</span>
              <p>RFC 3986 URLs, Raw Text, RFC 5322 Mailto, RFC 3966 Tel, and ZXing Wi-Fi (WPA/WEP/Open).</p>
            </div>
            <div>
              <span className="font-semibold text-white block mb-1">Reliability Diagnostics:</span>
              <p>WCAG 2.1 relative luminance optical contrast analysis, quiet zone padding, and error correction tracking.</p>
            </div>
            <div>
              <span className="font-semibold text-white block mb-1">Zero Backend Footprint:</span>
              <p>Works offline in-browser using modern HTML5 Canvas, SVG vectors, and resilient browser localStorage.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-200">QR Studio</span>
            <span>·</span>
            <span>GDG on Campus SRM Recruitment Submission</span>
          </div>
          <div>
            Built with React, TypeScript, and Tailwind CSS.
          </div>
        </div>
      </footer>
    </div>
  );
}
