import React from 'react';
import { QrCode, Sparkles } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  onScrollToRecent: () => void;
  recentCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onScrollToRecent, recentCount }) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Application Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
            <QrCode className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                QR Studio
              </span>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 text-[11px] font-medium text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-950/60 rounded border border-indigo-200 dark:border-indigo-800/50">
                SRM Recruitment Edition
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a href="#generator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Generator
          </a>
          <a href="#customization" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Customization
          </a>
          <a href="#presets" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Presets
          </a>
          <button
            type="button"
            onClick={onScrollToRecent}
            className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            <span>Recent</span>
            {recentCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full">
                {recentCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onScrollToRecent}
            className="lg:hidden text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            History ({recentCount})
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
