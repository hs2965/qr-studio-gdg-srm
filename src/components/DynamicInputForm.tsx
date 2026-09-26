import React, { useState } from 'react';
import { QRType, QRFormData, WifiSecurity } from '../types';
import { ValidationResult } from '../utils/validation';
import { AlertCircle, Eye, EyeOff, Sparkles, Check } from 'lucide-react';

interface DynamicInputFormProps {
  type: QRType;
  formData: QRFormData;
  validation: ValidationResult;
  onChangeData: <K extends keyof QRFormData>(category: K, values: Partial<QRFormData[K]>) => void;
  onApplySample: (type: QRType) => void;
}

export const DynamicInputForm: React.FC<DynamicInputFormProps> = ({
  type,
  formData,
  validation,
  onChangeData,
  onApplySample,
}) => {
  const [showWifiPassword, setShowWifiPassword] = useState(false);
  const fieldErrors = validation.fieldErrors || {};

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {type === 'url' && 'Website URL Details'}
          {type === 'text' && 'Plain Text Content'}
          {type === 'email' && 'Direct Email Composition'}
          {type === 'phone' && 'Phone Number Details'}
          {type === 'wifi' && 'Wi-Fi Network Configuration'}
        </h3>
        <button
          type="button"
          onClick={() => onApplySample(type)}
          className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium py-1 px-2 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
        >
          <Sparkles className="w-3 h-3" />
          <span>Insert Sample Data</span>
        </button>
      </div>

      {/* Global Validation Error Banner if invalid */}
      {!validation.isValid && validation.error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 p-3 text-xs bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-rose-800 dark:text-rose-200"
        >
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Missing or Invalid Input: </span>
            <span>{validation.error}</span>
          </div>
        </div>
      )}

      {/* 1. URL FORM */}
      {type === 'url' && (
        <div className="space-y-3">
          <div>
            <label htmlFor="url-input" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Website or Web Page URL <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="url-input"
                type="text"
                value={formData.url.url}
                onChange={(e) => onChangeData('url', { url: e.target.value })}
                placeholder="https://example.com"
                className={`w-full px-3.5 py-2.5 text-sm rounded-lg bg-white dark:bg-slate-900 border transition-colors focus:outline-none focus:ring-2 ${
                  fieldErrors.url
                    ? 'border-rose-300 dark:border-rose-800 focus:ring-rose-500/20 text-rose-900 dark:text-rose-200'
                    : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 dark:text-slate-100'
                }`}
              />
            </div>
            {fieldErrors.url ? (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{fieldErrors.url}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Include https:// for quick smartphone camera browsing.
              </p>
            )}
          </div>
        </div>
      )}

      {/* 2. PLAIN TEXT FORM */}
      {type === 'text' && (
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="text-input" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Text Content <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-400 font-mono">
                {formData.text.text.length} chars
              </span>
            </div>
            <textarea
              id="text-input"
              rows={4}
              value={formData.text.text}
              onChange={(e) => onChangeData('text', { text: e.target.value })}
              placeholder="Enter notes, addresses, coupon codes, serial keys, or any plain text..."
              className={`w-full px-3.5 py-2.5 text-sm rounded-lg bg-white dark:bg-slate-900 border transition-colors focus:outline-none focus:ring-2 resize-y ${
                fieldErrors.text
                  ? 'border-rose-300 dark:border-rose-800 focus:ring-rose-500/20 text-rose-900 dark:text-rose-200'
                  : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 dark:text-slate-100'
              }`}
            />
            {fieldErrors.text ? (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{fieldErrors.text}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Any raw text formatted and decoded directly upon scanning.
              </p>
            )}
          </div>
        </div>
      )}

      {/* 3. EMAIL FORM */}
      {type === 'email' && (
        <div className="space-y-3">
          <div>
            <label htmlFor="email-address" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Recipient Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              id="email-address"
              type="email"
              value={formData.email.email}
              onChange={(e) => onChangeData('email', { email: e.target.value })}
              placeholder="recipient@domain.com"
              className={`w-full px-3.5 py-2.5 text-sm rounded-lg bg-white dark:bg-slate-900 border transition-colors focus:outline-none focus:ring-2 ${
                fieldErrors.email
                  ? 'border-rose-300 dark:border-rose-800 focus:ring-rose-500/20 text-rose-900 dark:text-rose-200'
                  : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 dark:text-slate-100'
              }`}
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="email-subject" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Subject Line (Optional)
            </label>
            <input
              id="email-subject"
              type="text"
              value={formData.email.subject}
              onChange={(e) => onChangeData('email', { subject: e.target.value })}
              placeholder="e.g., Application Inquiry or Feedback"
              className="w-full px-3.5 py-2 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label htmlFor="email-body" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email Body Message (Optional)
            </label>
            <textarea
              id="email-body"
              rows={3}
              value={formData.email.body}
              onChange={(e) => onChangeData('email', { body: e.target.value })}
              placeholder="Pre-populate the email message body for scanners..."
              className="w-full px-3.5 py-2 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-slate-100 resize-y"
            />
          </div>
        </div>
      )}

      {/* 4. PHONE FORM */}
      {type === 'phone' && (
        <div className="space-y-3">
          <div>
            <label htmlFor="phone-input" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <input
              id="phone-input"
              type="tel"
              value={formData.phone.phone}
              onChange={(e) => onChangeData('phone', { phone: e.target.value })}
              placeholder="+1 (555) 234-5678"
              className={`w-full px-3.5 py-2.5 text-sm rounded-lg bg-white dark:bg-slate-900 border transition-colors focus:outline-none focus:ring-2 ${
                fieldErrors.phone
                  ? 'border-rose-300 dark:border-rose-800 focus:ring-rose-500/20 text-rose-900 dark:text-rose-200'
                  : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 dark:text-slate-100'
              }`}
            />
            {fieldErrors.phone ? (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{fieldErrors.phone}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Include country code (e.g. +91 or +1) for international compatibility.
              </p>
            )}
          </div>
        </div>
      )}

      {/* 5. WI-FI FORM */}
      {type === 'wifi' && (
        <div className="space-y-3">
          <div>
            <label htmlFor="wifi-ssid" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Network Name (SSID) <span className="text-rose-500">*</span>
            </label>
            <input
              id="wifi-ssid"
              type="text"
              value={formData.wifi.ssid}
              onChange={(e) => onChangeData('wifi', { ssid: e.target.value })}
              placeholder="e.g., Campus_Guest_WiFi"
              className={`w-full px-3.5 py-2.5 text-sm rounded-lg bg-white dark:bg-slate-900 border transition-colors focus:outline-none focus:ring-2 ${
                fieldErrors.ssid
                  ? 'border-rose-300 dark:border-rose-800 focus:ring-rose-500/20 text-rose-900 dark:text-rose-200'
                  : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 dark:text-slate-100'
              }`}
            />
            {fieldErrors.ssid && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{fieldErrors.ssid}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Security Protocol
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'WPA', label: 'WPA / WPA2' },
                  { id: 'WEP', label: 'WEP' },
                  { id: 'nopass', label: 'None (Open)' },
                ] as { id: WifiSecurity; label: string }[]
              ).map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => onChangeData('wifi', { security: sec.id })}
                  className={`py-2 px-2 text-xs font-medium rounded-lg border transition-all ${
                    formData.wifi.security === sec.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>
          </div>

          {formData.wifi.security !== 'nopass' && (
            <div>
              <label htmlFor="wifi-password" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Network Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="wifi-password"
                  type={showWifiPassword ? 'text' : 'password'}
                  value={formData.wifi.password}
                  onChange={(e) => onChangeData('wifi', { password: e.target.value })}
                  placeholder="Enter Wi-Fi password..."
                  className={`w-full pl-3.5 pr-10 py-2.5 text-sm rounded-lg bg-white dark:bg-slate-900 border transition-colors focus:outline-none focus:ring-2 ${
                    fieldErrors.password
                      ? 'border-rose-300 dark:border-rose-800 focus:ring-rose-500/20 text-rose-900 dark:text-rose-200'
                      : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 dark:text-slate-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowWifiPassword(!showWifiPassword)}
                  aria-label={showWifiPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  {showWifiPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{fieldErrors.password}</p>
              )}
            </div>
          )}

          <div className="pt-1">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.wifi.hidden}
                onChange={(e) => onChangeData('wifi', { hidden: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-700 focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Hidden Network (SSID is not broadcasting)
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
