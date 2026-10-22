import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { SyncState } from '../services/syncService';

interface HeaderProps {
  currentView: string;
  onOpenSettings: () => void;
  syncState: SyncState;
  onSyncClick: () => void;
  isGridView: boolean;
  onToggleGridView: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  syncState,
  onSyncClick,
  isGridView,
  onToggleGridView,
}) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/20 shadow-xs pt-safe">
      <div className="h-16 px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Zone: Logo + Name */}
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSAv22ATFBXcf1_oaFrOYG6fNzGi-0EJm1DarHRMDltfrpI2jRZEhid61i9LccY8nJGLYCUp5UyFPSHFlHnTnxL5WoUCpjkKWcFnM9ti3FzoWmpAPL2yebDC0tnbfUiICIpTfLmFl1CZDP6_Lea_VpKMvFiNpggKFQXRSV_b_btjB4lAr7GQmVXvjfY1TBpGTMMiQUaNB0ZKQkGXpH2gzDxKY1MquNqWgbgiy4f3uozL1pOzyPUmkc"
            alt="NoteCraft Logo"
            className="h-8 w-auto object-contain shrink-0"
          />
          <div className="flex flex-col truncate">
            <span className="font-bold text-xl text-primary tracking-tight leading-none">دوّن</span>
            <span className="text-[11px] font-medium text-outline hidden xs:block">NoteCraft</span>
          </div>
        </div>

        {/* Action Zone: Sync Indicator + Dark Mode + Grid View + Profile */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Sync Button & Status */}
          <button
            onClick={onSyncClick}
            title={
              !syncState.isOnline
                ? 'وضع دون اتصال - التخزين المحلي نشط'
                : syncState.status === 'syncing'
                ? 'جارِ المزامنة الآن...'
                : `تمت المزامنة: ${syncState.lastSyncedText}`
            }
            className={`h-9 px-2.5 sm:px-3 rounded-full flex items-center gap-1.5 text-xs font-medium transition-all active:scale-95 ${
              !syncState.isOnline
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                : syncState.status === 'syncing'
                ? 'bg-primary-fixed text-primary font-bold animate-pulse'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[17px] ${
                syncState.status === 'syncing' ? 'animate-spin' : ''
              }`}
            >
              {!syncState.isOnline
                ? 'cloud_off'
                : syncState.status === 'syncing'
                ? 'sync'
                : 'cloud_done'}
            </span>
            <span className="hidden md:inline">
              {!syncState.isOnline
                ? 'أوفلاين'
                : syncState.status === 'syncing'
                ? 'مزامنة...'
                : 'متزامن'}
            </span>
          </button>

          {/* Dark Mode Quick Switcher */}
          <button
            onClick={toggleDarkMode}
            aria-label="تبديل الوضع الداكن"
            title={isDarkMode ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
            className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined text-[22px]">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* View toggle (Grid / List) */}
          <button
            onClick={onToggleGridView}
            aria-label="تبديل طريقة العرض"
            title={isGridView ? 'عرض كقائمة' : 'عرض كشبكة'}
            className={`w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container transition-colors ${
              isGridView ? 'text-primary' : ''
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">
              {isGridView ? 'view_agenda' : 'grid_view'}
            </span>
          </button>

          {/* User Profile Avatar with link to Settings */}
          <button
            onClick={onOpenSettings}
            aria-label="الملف الشخصي والإعدادات"
            title="الإعدادات والمزامنة"
            className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-primary-fixed hover:ring-primary transition-all active:scale-95 ml-1"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8yIQMtUx9NCt1DDGZzWeglokaBv2uYPujWbyMeg9UTqk8_HyLFhJBj0MjT-CurJNX1VGEBKr0xrfJWcIP2eaociSyXgSzl_nXRr78O3R6BSdnmjni9D8fFpezmSFN6X2GbluKlx6-5z5p0xU7O4GjL79n_ILOugTaCw_sMnMpykwd9nAeXjulzY3tXJo02EYuHrrz1L5ExAvvPf-bsSJk_gCwqkRexAGnEABBZPsBfAYFbE7JRLMv"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
