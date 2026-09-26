import React from 'react';
import { QRType } from '../types';
import { Link2, AlignLeft, Mail, Phone, Wifi } from 'lucide-react';

interface QRTypeSelectorProps {
  selectedType: QRType;
  onChangeType: (type: QRType) => void;
}

const QR_TYPES: { id: QRType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'url', label: 'URL', icon: Link2 },
  { id: 'text', label: 'Plain Text', icon: AlignLeft },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'phone', label: 'Phone Number', icon: Phone },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
];

export const QRTypeSelector: React.FC<QRTypeSelectorProps> = ({ selectedType, onChangeType }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Select QR Code Type
        </label>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          5 standard formats supported
        </span>
      </div>

      <div
        role="tablist"
        aria-label="QR Code Type Selection"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800"
      >
        {QR_TYPES.map((item) => {
          const Icon = item.icon;
          const isActive = selectedType === item.id;
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => onChangeType(item.id)}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-medium transition-all whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/70 dark:border-slate-700/60 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/40'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
