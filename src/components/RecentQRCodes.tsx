import React from 'react';
import { StoredQRItem, QRType } from '../types';
import { History, RotateCcw, Trash2, ArrowRight, Clock, Link2, AlignLeft, Mail, Phone, Wifi } from 'lucide-react';

interface RecentQRCodesProps {
  items: StoredQRItem[];
  onLoadItem: (item: StoredQRItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

const TYPE_ICONS: Record<QRType, React.ComponentType<{ className?: string }>> = {
  url: Link2,
  text: AlignLeft,
  email: Mail,
  phone: Phone,
  wifi: Wifi,
};

export const RecentQRCodes: React.FC<RecentQRCodesProps> = ({
  items,
  onLoadItem,
  onDeleteItem,
  onClearAll,
}) => {
  const formatDate = (timestamp: number) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <section id="recent-codes" className="w-full space-y-4 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recent QR Codes
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Stored locally in your browser — reload any configuration with one click
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium py-1 px-2.5 rounded-lg border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors w-fit"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
          <Clock className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No Saved QR Codes Yet
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            Generate or save a QR code and it will appear here for quick reuse.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {items.map((item) => {
            const Icon = TYPE_ICONS[item.type] || Link2;
            return (
              <div
                key={item.id}
                className="group relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 flex flex-col justify-between hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800 transition-all"
              >
                <div>
                  {/* Header: Thumbnail + Type */}
                  <div className="flex items-start gap-3 mb-2.5">
                    {item.dataUrl ? (
                      <div
                        className="w-14 h-14 rounded-lg p-1 border border-slate-200 dark:border-slate-700 shrink-0 flex items-center justify-center overflow-hidden"
                        style={{ backgroundColor: item.settings.bgColor }}
                      >
                        <img
                          src={item.dataUrl}
                          alt={`${item.title} preview`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-slate-400" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded">
                          <Icon className="w-2.5 h-2.5" />
                          <span>{item.type}</span>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteItem(item.id);
                          }}
                          aria-label="Remove item"
                          className="text-slate-400 hover:text-rose-500 p-0.5 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate mt-1" title={item.title}>
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span>{item.settings.size}px</span>
                    <span>{formatDate(item.timestamp)}</span>
                  </div>
                </div>

                {/* Reuse / Load button */}
                <button
                  type="button"
                  onClick={() => onLoadItem(item)}
                  className="w-full py-1.5 px-2.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-colors flex items-center justify-center gap-1.5 group-hover:bg-indigo-600 group-hover:text-white cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Use Again</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
