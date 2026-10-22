import React, { useState } from 'react';
import { Note, NoteReminder } from '../types/note';

interface ReminderBottomSheetProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveReminder: (noteId: string, reminder: NoteReminder) => void;
}

export const ReminderBottomSheet: React.FC<ReminderBottomSheetProps> = ({
  note,
  isOpen,
  onClose,
  onSaveReminder,
}) => {
  if (!isOpen || !note) return null;

  const currentReminder = note.reminder || {
    enabled: true,
    pinToStatusBar: true,
    scheduledTime: '18:00',
    scheduledDate: new Date().toISOString().slice(0, 10),
    countdownMinutes: 45,
    repeatingDailyTimes: ['09:00', '14:00', '18:00'],
  };

  const [pinToStatusBar, setPinToStatusBar] = useState<boolean>(currentReminder.pinToStatusBar);
  const [scheduledDate, setScheduledDate] = useState<string>(
    currentReminder.scheduledDate || new Date().toISOString().slice(0, 10)
  );
  const [scheduledTime, setScheduledTime] = useState<string>(
    currentReminder.scheduledTime || '18:00'
  );
  const [countdownMinutes, setCountdownMinutes] = useState<number | undefined>(
    currentReminder.countdownMinutes || 45
  );
  const [repeatingDailyTimes, setRepeatingDailyTimes] = useState<string[]>(
    currentReminder.repeatingDailyTimes || ['09:00', '14:00', '18:00']
  );
  const [selectedPreset, setSelectedPreset] = useState<string>('today-18');

  const handleSave = () => {
    onSaveReminder(note.id, {
      enabled: true,
      pinToStatusBar,
      scheduledDate,
      scheduledTime,
      countdownMinutes,
      repeatingDailyTimes,
      lastNotificationText: `NoteCraft • ${note.title}`,
    });
    onClose();
  };

  const handleAddRepeatingTime = () => {
    const time = window.prompt('أدخل وقت التذكير بصيغة 24 ساعة (مثلاً 21:00):', '20:00');
    if (time && !repeatingDailyTimes.includes(time)) {
      setRepeatingDailyTimes([...repeatingDailyTimes, time]);
    }
  };

  const handleRemoveRepeatingTime = (t: string) => {
    setRepeatingDailyTimes(repeatingDailyTimes.filter((item) => item !== t));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Sheet Modal Container */}
      <div className="relative w-full max-w-lg bg-surface-bright dark:bg-[#1a1823] rounded-t-3xl shadow-2xl p-5 md:p-6 max-h-[90vh] overflow-y-auto flex flex-col gap-4 border-t border-outline-variant/30 animate-in slide-in-from-bottom duration-200">
        {/* Grab Handle */}
        <div className="w-12 h-1.5 rounded-full bg-outline-variant/70 mx-auto self-center" />

        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">notification_add</span>
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-on-surface">
                ضبط التذكير والتنبيهات
              </h3>
              <p className="text-xs text-outline">إدارة مواعيد الإشعار وتثبيت المذكرة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Pin to Status Bar Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary-fixed/20 dark:bg-secondary-fixed/10 border border-secondary/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-secondary-container text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[19px]">push_pin</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs md:text-sm font-bold text-on-surface">
                  تثبيت دائم في شريط الحالة
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-secondary/20 text-secondary text-[10px] font-bold">
                  Pin to Status Bar
                </span>
              </div>
              <p className="text-[11px] text-outline">إبقاء المذكرة مرئية في منطقة التنبيهات حتى إنجازها</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={pinToStatusBar}
              onChange={(e) => setPinToStatusBar(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:after:bg-white peer-checked:bg-secondary after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-outline after:rounded-full after:h-5 after:w-5 after:transition-all" />
          </label>
        </div>

        {/* Android Status Bar Notification Preview */}
        <div className="p-3 rounded-2xl bg-[#1e1e24] text-white shadow-xs flex flex-col gap-1 border border-white/10">
          <div className="flex items-center justify-between text-[11px] text-gray-400">
            <span>معاينة إشعار شريط الحالة (Android)</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">lock</span> مثبت
            </span>
          </div>
          <div className="flex items-center gap-2.5 pt-1">
            <div className="w-7 h-7 rounded bg-primary flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined text-[16px]">edit_note</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">NoteCraft • {note.title}</p>
              <p className="text-[11px] text-gray-300 truncate">
                {note.checklists && note.checklists.length > 0
                  ? `${note.checklists[0].text} • ${note.checklists.length} مهام نشطة...`
                  : note.content.slice(0, 45)}
              </p>
            </div>
            <span className="text-[11px] font-mono text-gray-400">الآن</span>
          </div>
        </div>

        {/* Quick Date Presets & Pickers */}
        <div className="flex flex-col gap-2">
          <label className="text-xs md:text-sm font-bold text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">schedule</span>
            وقت محدد (تاريخ وساعة)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedPreset('today-18');
                setScheduledTime('18:00');
              }}
              className={`py-2 px-2 rounded-xl text-xs font-semibold transition-colors text-center ${
                selectedPreset === 'today-18'
                  ? 'bg-secondary-fixed text-on-secondary-fixed shadow-2xs font-bold'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              اليوم 06:00 م
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedPreset('today-21');
                setScheduledTime('21:00');
              }}
              className={`py-2 px-2 rounded-xl text-xs font-semibold transition-colors text-center ${
                selectedPreset === 'today-21'
                  ? 'bg-secondary-fixed text-on-secondary-fixed shadow-2xs font-bold'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              اليوم 09:00 م
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedPreset('tomorrow-09');
                setScheduledTime('09:00');
              }}
              className={`py-2 px-2 rounded-xl text-xs font-semibold transition-colors text-center ${
                selectedPreset === 'tomorrow-09'
                  ? 'bg-secondary-fixed text-on-secondary-fixed shadow-2xs font-bold'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              غداً 09:00 ص
            </button>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="flex-1 py-2 px-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-xs"
            />
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="py-2 px-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-xs font-mono"
            />
          </div>
        </div>

        {/* Countdown Timer Duration */}
        <div className="flex flex-col gap-2">
          <label className="text-xs md:text-sm font-bold text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[18px]">timer</span>
            مؤقت تنازلي (Countdown Duration)
          </label>
          <div className="flex flex-wrap items-center gap-1.5">
            {[15, 30, 45, 60, 180].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setCountdownMinutes(mins)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  countdownMinutes === mins
                    ? 'bg-secondary-container text-white shadow-2xs'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {mins === 60 ? '1 ساعة' : mins === 180 ? '3 ساعات' : `${mins} دقيقة`}
                {countdownMinutes === mins ? ' (نشط)' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Multiple Repeating Scheduled Times */}
        <div className="flex flex-col gap-2">
          <label className="text-xs md:text-sm font-bold text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-tertiary text-[18px]">update</span>
            تكرار مجدول متعدد (Repeating Daily)
          </label>
          <div className="p-3 rounded-2xl bg-surface-container-low flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-on-surface">التكرار اليومي في عدة مواعيد:</span>
              <span className="font-bold text-tertiary">{repeatingDailyTimes.length} أوقات مفعلة</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {repeatingDailyTimes.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary text-white font-mono text-xs font-bold shadow-2xs"
                >
                  <span>{t}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRepeatingTime(t)}
                    className="hover:opacity-80"
                  >
                    <span className="material-symbols-outlined text-[13px]">close</span>
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={handleAddRepeatingTime}
                className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary hover:bg-primary-fixed transition-colors"
                title="إضافة وقت"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/20">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 px-4 rounded-2xl bg-primary text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-md hover:bg-primary-container active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">check</span>
            حفظ وتفعيل التذكير
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-2xl bg-surface-container text-on-surface font-medium text-xs md:text-sm hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};
