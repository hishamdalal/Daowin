import React, { useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { syncService, SyncState } from '../services/syncService';
import { Note, CategoryItem } from '../types/note';
import { dbService } from '../services/db';

interface SettingsViewProps {
  syncState: SyncState;
  notes: Note[];
  categories: CategoryItem[];
  onDataImported: () => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  syncState,
  notes,
  categories,
  onDataImported,
  onResetData,
}) => {
  const { theme, setTheme } = useTheme();
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger manual sync
  const handleManualSync = async () => {
    setSyncFeedback('جارِ المزامنة مع السحابة المشفرة...');
    const ok = await syncService.syncNow();
    if (ok) {
      setSyncFeedback('تمت المزامنة بنجاح وحفظ كافة التعديلات');
    } else {
      setSyncFeedback('تعذر الاتصال - تم حفظ البيانات محلياً وسيتم المزامنة تلقائياً عند عودة الشبكة');
    }
    setTimeout(() => setSyncFeedback(null), 4000);
  };

  // Export JSON backup
  const handleExport = () => {
    syncService.exportData(notes, categories);
  };

  // Import JSON backup
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.notes && Array.isArray(json.notes)) {
          await dbService.importData(json);
          onDataImported();
          alert('تم استيراد البيانات بنجاح واستعادة المذكرات!');
        } else {
          alert('الملف المحدد لا يحتوي على صيغة مذكرات صحيحة.');
        }
      } catch (err) {
        alert('حدث خطأ أثناء قراءة الملف الاحتياطي.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Stats
  const totalTasks = notes.reduce((acc, n) => acc + (n.checklists?.length || 0), 0);
  const totalAttachments = notes.reduce((acc, n) => acc + (n.attachments?.length || 0), 0);

  return (
    <div className="flex flex-col w-full pb-32 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6 px-1">
        <h2 className="text-xl md:text-2xl font-bold text-on-surface">الإعدادات والمزامنة</h2>
        <p className="text-xs md:text-sm text-outline">
          تخصيص المظهر، إدارة النسخ الاحتياطية، وخيارات العمل دون اتصال
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Appearance & Dark Mode Card */}
        <section className="p-5 rounded-3xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/20 shadow-xs">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">palette</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface">المظهر والوضع الداكن</h3>
              <p className="text-xs text-outline">اختر نمط العرض اللوني المفضل لقراءة مريحة</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => setTheme('light')}
              className={`p-3.5 rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-surface-container-lowest border-primary text-primary shadow-xs font-bold ring-2 ring-primary/20'
                  : 'bg-surface-container/60 border-transparent text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">light_mode</span>
              <span className="text-xs">الوضع الفاتح</span>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`p-3.5 rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-surface-container-lowest border-primary text-primary shadow-xs font-bold ring-2 ring-primary/20'
                  : 'bg-surface-container/60 border-transparent text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">dark_mode</span>
              <span className="text-xs">الوضع الداكن</span>
            </button>

            <button
              onClick={() => setTheme('system')}
              className={`p-3.5 rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all cursor-pointer ${
                theme === 'system'
                  ? 'bg-surface-container-lowest border-primary text-primary shadow-xs font-bold ring-2 ring-primary/20'
                  : 'bg-surface-container/60 border-transparent text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">brightness_auto</span>
              <span className="text-xs">حسب النظام</span>
            </button>
          </div>
        </section>

        {/* Offline & Synchronization Center */}
        <section className="p-5 rounded-3xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/20 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">sync</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-on-surface">
                  العمل دون اتصال والمزامنة (Offline First)
                </h3>
                <p className="text-xs text-outline">تخزين محلي فوري مع مزامنة سحابية ذكية</p>
              </div>
            </div>

            {/* Connection status badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                syncState.isOnline
                  ? 'bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  syncState.isOnline ? 'bg-green-600' : 'bg-amber-600'
                }`}
              />
              {syncState.isOnline ? 'متصل بالشبكة' : 'وضع دون اتصال'}
            </span>
          </div>

          {/* Sync Stats Banner */}
          <div className="p-4 rounded-2xl bg-surface-container-lowest dark:bg-surface-container-high/60 border border-outline-variant/20 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs md:text-sm">
              <span className="text-outline">آخر مزامنة ناجحة:</span>
              <span className="font-bold text-on-surface font-mono">{syncState.lastSyncedText}</span>
            </div>

            <div className="flex items-center justify-between text-xs md:text-sm">
              <span className="text-outline">التعديلات المعلقة محلياً:</span>
              <span className="font-bold text-tertiary">
                {syncState.pendingCount === 0 ? 'كافة البيانات متزامنة' : `${syncState.pendingCount} تعديلات جاهزة`}
              </span>
            </div>

            <div className="text-[11px] text-outline leading-relaxed pt-2 border-t border-outline-variant/20">
              💡 <strong>سياسة الأوفلاين:</strong> يتم حفظ كل كلمة وكل تعديل فوراً داخل قاعدة بيانات{' '}
              <code className="px-1 py-0.5 rounded bg-surface-container">IndexedDB</code> المحلية على جهازك،
              وتتم المزامنة تلقائياً بمجرد فتح التطبيق أو استعادة اتصال الإنترنت.
            </div>

            {syncFeedback && (
              <div className="p-2.5 rounded-xl bg-primary-fixed/30 text-primary text-xs font-bold text-center animate-fade-in">
                {syncFeedback}
              </div>
            )}

            <button
              onClick={handleManualSync}
              disabled={syncState.status === 'syncing'}
              className="mt-1 w-full py-3 px-4 rounded-2xl bg-secondary text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-xs hover:bg-secondary-container active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              <span
                className={`material-symbols-outlined text-[18px] ${
                  syncState.status === 'syncing' ? 'animate-spin' : ''
                }`}
              >
                {syncState.status === 'syncing' ? 'sync' : 'cloud_sync'}
              </span>
              <span>{syncState.status === 'syncing' ? 'جارِ المزامنة...' : 'مزامنة يدوية الآن'}</span>
            </button>
          </div>
        </section>

        {/* Data Backup & Restore */}
        <section className="p-5 rounded-3xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/20 shadow-xs">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">save</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface">النسخ الاحتياطي وإدارة البيانات</h3>
              <p className="text-xs text-outline">تصدير واستيراد مذكراتك بأمان تام بصيغة JSON</p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="p-3 rounded-2xl bg-surface-container text-center">
              <span className="text-lg font-bold text-primary block">{notes.length}</span>
              <span className="text-[11px] text-outline">مذكرة محفوظة</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-container text-center">
              <span className="text-lg font-bold text-secondary block">{totalTasks}</span>
              <span className="text-[11px] text-outline">مهمة تفاعلية</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-container text-center">
              <span className="text-lg font-bold text-tertiary block">{totalAttachments}</span>
              <span className="text-[11px] text-outline">صورة ومرفق</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleExport}
              className="flex-1 py-3 px-4 rounded-2xl bg-surface-container-lowest dark:bg-surface-container-high border border-outline-variant/40 text-on-surface text-xs md:text-sm font-bold flex items-center justify-center gap-2 hover:bg-surface-container transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">download</span>
              <span>تصدير نسخة احتياطية (JSON)</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-3 px-4 rounded-2xl bg-surface-container-lowest dark:bg-surface-container-high border border-outline-variant/40 text-on-surface text-xs md:text-sm font-bold flex items-center justify-center gap-2 hover:bg-surface-container transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">upload</span>
              <span>استيراد ملف نسخة احتياطية</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </div>

          <div className="mt-4 pt-3 border-t border-outline-variant/20 flex justify-between items-center">
            <span className="text-xs text-outline">إعادة ضبط البيانات إلى النموذج الأولي:</span>
            <button
              onClick={() => {
                if (window.confirm('هل تريد استعادة البيانات النموذجية الافتراضية؟')) {
                  onResetData();
                }
              }}
              className="text-xs text-red-500 hover:text-red-700 font-bold underline cursor-pointer"
            >
              استعادة الملاحظات الافتراضية
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
