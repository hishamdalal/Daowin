import React from 'react';

export type NavTab = 'all-notes' | 'categories' | 'advanced-search' | 'settings';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onNewNote: () => void;
  hideOnDesktop?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onNewNote,
}) => {
  return (
    <>
      {/* Floating Action Button (FAB) - Elevated and ergonomic */}
      <aside className="fixed left-4 md:left-8 bottom-24 z-40 pb-safe">
        <button
          onClick={onNewNote}
          aria-label="ملاحظة جديدة"
          title="إنشاء ملاحظة جديدة"
          className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-white shadow-[0_10px_25px_-3px_rgba(94,53,177,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 group cursor-pointer"
        >
          <span className="material-symbols-outlined text-[28px] group-hover:rotate-12 transition-transform">
            edit
          </span>
        </button>
      </aside>

      {/* Bottom Navigation Bar */}
      <nav
        aria-label="التنقل الرئيسي"
        className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-surface-container-lowest/90 dark:bg-[#121118]/90 backdrop-blur-xl border-t border-outline-variant/20 shadow-[0_-2px_12px_rgba(0,0,0,0.05)]"
      >
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
          {/* Notes Feed Tab */}
          <button
            onClick={() => onTabChange('all-notes')}
            className={`flex flex-col items-center justify-center gap-1 min-w-[64px] h-12 transition-all cursor-pointer ${
              activeTab === 'all-notes'
                ? 'text-primary font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <div
              className={`flex items-center justify-center w-14 h-7 rounded-full transition-colors ${
                activeTab === 'all-notes'
                  ? 'bg-primary-fixed text-primary'
                  : 'hover:bg-surface-container'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[22px] ${
                  activeTab === 'all-notes' ? 'fill-1' : ''
                }`}
              >
                description
              </span>
            </div>
            <span className="text-[11px] font-medium">المذكرات</span>
          </button>

          {/* Categories Tab */}
          <button
            onClick={() => onTabChange('categories')}
            className={`flex flex-col items-center justify-center gap-1 min-w-[64px] h-12 transition-all cursor-pointer ${
              activeTab === 'categories'
                ? 'text-primary font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <div
              className={`flex items-center justify-center w-14 h-7 rounded-full transition-colors ${
                activeTab === 'categories'
                  ? 'bg-primary-fixed text-primary'
                  : 'hover:bg-surface-container'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[22px] ${
                  activeTab === 'categories' ? 'fill-1' : ''
                }`}
              >
                folder_open
              </span>
            </div>
            <span className="text-[11px] font-medium">الأقسام</span>
          </button>

          {/* Advanced Search Tab */}
          <button
            onClick={() => onTabChange('advanced-search')}
            className={`flex flex-col items-center justify-center gap-1 min-w-[64px] h-12 transition-all cursor-pointer ${
              activeTab === 'advanced-search'
                ? 'text-primary font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <div
              className={`flex items-center justify-center w-14 h-7 rounded-full transition-colors ${
                activeTab === 'advanced-search'
                  ? 'bg-primary-fixed text-primary'
                  : 'hover:bg-surface-container'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[22px] ${
                  activeTab === 'advanced-search' ? 'fill-1' : ''
                }`}
              >
                manage_search
              </span>
            </div>
            <span className="text-[11px] font-medium">البحث</span>
          </button>

          {/* Settings Tab */}
          <button
            onClick={() => onTabChange('settings')}
            className={`flex flex-col items-center justify-center gap-1 min-w-[64px] h-12 transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'text-primary font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <div
              className={`flex items-center justify-center w-14 h-7 rounded-full transition-colors ${
                activeTab === 'settings'
                  ? 'bg-primary-fixed text-primary'
                  : 'hover:bg-surface-container'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[22px] ${
                  activeTab === 'settings' ? 'fill-1' : ''
                }`}
              >
                settings
              </span>
            </div>
            <span className="text-[11px] font-medium">الإعدادات</span>
          </button>
        </div>
      </nav>
    </>
  );
};
