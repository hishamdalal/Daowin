import React from 'react';
import { Note } from '../types/note';

interface NoteCardProps {
  note: Note;
  onOpen: (note: Note) => void;
  onTogglePin: (id: string, e: React.MouseEvent) => void;
  onToggleCheckItem?: (noteId: string, itemId: string, e: React.MouseEvent) => void;
  onOpenReminder?: (note: Note, e: React.MouseEvent) => void;
  onDeleteNote?: (id: string, e: React.MouseEvent) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onOpen,
  onTogglePin,
  onToggleCheckItem,
  onOpenReminder,
  onDeleteNote,
}) => {
  // Theme gradients & color styles for light & dark mode
  const getThemeStyles = () => {
    switch (note.color) {
      case 'yellow':
        return {
          cardBg:
            'bg-gradient-to-br from-[#fef8e7] via-[#fef4d2] to-[#faeec0] dark:from-[#2e2610] dark:via-[#261f0d] dark:to-[#1e1909] text-[#423200] dark:text-[#fae5a8] shadow-[0_4px_20px_-2px_rgba(180,140,20,0.12)]',
          badge1: 'bg-[#f3deb0] dark:bg-[#46360c] text-[#584100] dark:text-[#f8d998]',
          badge2: 'bg-[#fbe7b3] dark:bg-[#523e0e] text-[#785900] dark:text-[#ffdf91]',
          pinBtn: 'bg-[#fae5a8] dark:bg-[#46360c] text-[#584100] dark:text-[#fae5a8]',
          checkBg: 'bg-white/70 dark:bg-black/30',
          progressBar: 'bg-[#00897b]',
          checkActiveText: 'text-[#00897b]',
          footerText: 'text-[#7d6006] dark:text-[#c4a95d]',
        };
      case 'lavender':
        return {
          cardBg:
            'bg-gradient-to-br from-[#f2effe] via-[#ece7fd] to-[#e4dcfb] dark:from-[#231a3d] dark:via-[#1c1532] dark:to-[#171029] text-[#2b1f54] dark:text-[#e0d6ff] shadow-[0_4px_20px_-2px_rgba(111,95,234,0.12)]',
          badge1: 'bg-[#ded5fb] dark:bg-[#382b61] text-[#3c2978] dark:text-[#d3c4fc]',
          badge2: 'bg-[#e8e0fc] dark:bg-[#433374] text-[#4f3899] dark:text-[#decffe]',
          pinBtn: 'bg-[#ded5fb] dark:bg-[#382b61] text-[#3c2978] dark:text-[#d3c4fc]',
          checkBg: 'bg-white/70 dark:bg-black/30',
          progressBar: 'bg-[#5644d0]',
          checkActiveText: 'text-[#5644d0] dark:text-[#9a8dff]',
          footerText: 'text-[#665494] dark:text-[#b4a4df]',
        };
      case 'mint':
        return {
          cardBg:
            'bg-gradient-to-br from-[#e8f8f3] via-[#def4ed] to-[#d2eee5] dark:from-[#112d26] dark:via-[#0e251f] dark:to-[#0a1b16] text-[#023e32] dark:text-[#bdf2e1] shadow-[0_4px_20px_-2px_rgba(0,184,148,0.1)]',
          badge1: 'bg-[#c7ecdf] dark:bg-[#1a473c] text-[#004e3e] dark:text-[#a0ebd4]',
          badge2: 'bg-[#d5f2e8] dark:bg-[#205447] text-[#006954] dark:text-[#b4f3df]',
          pinBtn: 'bg-[#c7ecdf] dark:bg-[#1a473c] text-[#004e3e] dark:text-[#a0ebd4]',
          checkBg: 'bg-white/70 dark:bg-black/30',
          progressBar: 'bg-[#00897b]',
          checkActiveText: 'text-[#00897b] dark:text-[#3cd5be]',
          footerText: 'text-[#2d7062] dark:text-[#88cbbd]',
        };
      case 'peach':
        return {
          cardBg:
            'bg-gradient-to-br from-[#fff0ea] via-[#ffe7dd] to-[#fddccc] dark:from-[#3a1f17] dark:via-[#2f1811] dark:to-[#24110c] text-[#552718] dark:text-[#ffcfbe] shadow-[0_4px_20px_-2px_rgba(255,138,101,0.12)]',
          badge1: 'bg-[#ffd5c4] dark:bg-[#52291d] text-[#712814] dark:text-[#ffc1aa]',
          badge2: 'bg-[#ffded1] dark:bg-[#5e2f21] text-[#8e3820] dark:text-[#ffd0bd]',
          pinBtn: 'bg-[#ffd5c4] dark:bg-[#52291d] text-[#712814] dark:text-[#ffc1aa]',
          checkBg: 'bg-white/70 dark:bg-black/30',
          progressBar: 'bg-[#e65100]',
          checkActiveText: 'text-[#00897b]',
          footerText: 'text-[#8b4532] dark:text-[#e4a594]',
        };
      case 'sky':
        return {
          cardBg:
            'bg-gradient-to-br from-[#eaf4fd] via-[#dfedfc] to-[#d3e5f9] dark:from-[#13283f] dark:via-[#0f2032] dark:to-[#0b1825] text-[#143657] dark:text-[#c9e4ff] shadow-[0_4px_20px_-2px_rgba(41,128,185,0.1)]',
          badge1: 'bg-[#c5e1fb] dark:bg-[#1d4066] text-[#124270] dark:text-[#b4d8fd]',
          badge2: 'bg-[#d4e9fc] dark:bg-[#254f7e] text-[#195691] dark:text-[#c4e2fe]',
          pinBtn: 'bg-[#c5e1fb] dark:bg-[#1d4066] text-[#124270] dark:text-[#b4d8fd]',
          checkBg: 'bg-white/70 dark:bg-black/30',
          progressBar: 'bg-[#1976d2]',
          checkActiveText: 'text-[#1976d2]',
          footerText: 'text-[#3b6692] dark:text-[#9bc2e8]',
        };
      case 'rose':
        return {
          cardBg:
            'bg-gradient-to-br from-[#fff0f3] via-[#ffe3e9] to-[#ffd4de] dark:from-[#3a1520] dark:via-[#2f1019] dark:to-[#240a12] text-[#5e192c] dark:text-[#ffc6d4] shadow-[0_4px_20px_-2px_rgba(225,29,72,0.1)]',
          badge1: 'bg-[#fccad6] dark:bg-[#571f2e] text-[#7a1833] dark:text-[#ffb5c6]',
          badge2: 'bg-[#fed7e1] dark:bg-[#652335] text-[#932241] dark:text-[#ffcad7]',
          pinBtn: 'bg-[#fccad6] dark:bg-[#571f2e] text-[#7a1833] dark:text-[#ffb5c6]',
          checkBg: 'bg-white/70 dark:bg-black/30',
          progressBar: 'bg-[#e91e63]',
          checkActiveText: 'text-[#e91e63]',
          footerText: 'text-[#8c3e53] dark:text-[#e59fad]',
        };
      default:
        return {
          cardBg:
            'bg-surface-container-lowest dark:bg-surface-container text-on-surface border border-outline-variant/30 shadow-sm',
          badge1: 'bg-surface-container text-on-surface-variant',
          badge2: 'bg-primary-fixed text-on-primary-fixed',
          pinBtn: 'bg-surface-container text-on-surface-variant',
          checkBg: 'bg-surface-container-low',
          progressBar: 'bg-primary',
          checkActiveText: 'text-primary',
          footerText: 'text-outline',
        };
    }
  };

  const style = getThemeStyles();

  // Progress calculations if checklists are present
  const totalTasks = note.checklists?.length || 0;
  const completedTasks = note.checklists?.filter((t) => t.completed).length || 0;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <article
      onClick={() => onOpen(note)}
      className={`w-full rounded-3xl p-5 md:p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 relative overflow-hidden cursor-pointer group ${style.cardBg}`}
    >
      {/* Top Header: Category, Tag, Pin Button */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${style.badge1}`}
            >
              <span className="material-symbols-outlined text-[13px]">folder</span>
              {note.category} {note.subCategory ? `> ${note.subCategory}` : ''}
            </span>
            {note.tags && note.tags.length > 0 && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${style.badge2}`}
              >
                {note.tags[0]}
              </span>
            )}
          </div>
          <h2 className="text-lg md:text-xl font-bold tracking-tight mt-1 line-clamp-1">
            {note.title}
          </h2>

          {/* Active Reminder Ribbon if enabled */}
          {note.reminder && note.reminder.enabled && (
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenReminder?.(note, e);
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${style.badge1} shadow-xs hover:scale-105 transition-transform`}
              >
                <span className="material-symbols-outlined text-[14px] fill-1">
                  notifications_active
                </span>
                <span>اليوم، {note.reminder.scheduledTime || '06:00 م'}</span>
              </span>
              {note.reminder.countdownMinutes && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/70 dark:bg-black/40">
                  <span className="material-symbols-outlined text-[12px] text-tertiary">timer</span>
                  <span>متبقي {note.reminder.countdownMinutes} دقيقة</span>
                </span>
              )}
              {note.reminder.pinToStatusBar && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/70 dark:bg-black/40">
                  <span className="material-symbols-outlined text-[12px] text-primary">
                    notification_important
                  </span>
                  <span>مثبت بالإشعارات</span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pin button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(note.id, e);
          }}
          aria-label={note.isPinned ? 'إلغاء التثبيت' : 'تثبيت المذكرة'}
          title={note.isPinned ? 'إلغاء التثبيت' : 'تثبيت'}
          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${
            note.isPinned ? `${style.pinBtn} shadow-xs` : 'opacity-60 hover:opacity-100'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[19px] ${note.isPinned ? 'fill-1' : ''}`}
          >
            push_pin
          </span>
        </button>
      </div>

      {/* Checklist Widget */}
      {note.checklists && note.checklists.length > 0 && (
        <div className={`flex flex-col gap-2 my-2.5 ${style.checkBg} backdrop-blur-xs p-3.5 rounded-2xl`}>
          <div className="flex items-center justify-between text-[12px] font-bold mb-0.5">
            <span className="flex items-center gap-1">
              <span className={`material-symbols-outlined text-[16px] ${style.checkActiveText}`}>
                check_circle
              </span>
              إنجاز المهام
            </span>
            <span>
              {completedTasks} من {totalTasks} مكتملة
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className={`${style.progressBar} h-full rounded-full transition-all duration-500`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Interactive Checkbox Items */}
          <div className="flex flex-col gap-1.5 mt-1 text-[13px]">
            {note.checklists.slice(0, 3).map((item) => (
              <label
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCheckItem?.(note.id, item.id, e);
                }}
                className="flex items-center justify-between gap-2 cursor-pointer select-none group/item"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`material-symbols-outlined text-[18px] transition-transform active:scale-90 ${
                      item.completed ? `${style.checkActiveText} fill-1` : 'opacity-60'
                    }`}
                  >
                    {item.completed ? 'check_box' : 'check_box_outline_blank'}
                  </span>
                  <span
                    className={`truncate transition-all ${
                      item.completed ? 'line-through opacity-70' : 'font-medium'
                    }`}
                  >
                    {item.text}
                  </span>
                </div>
                {item.subtitle && (
                  <span
                    className={`text-[11px] font-bold shrink-0 ${
                      item.completed ? 'text-[#00897b]' : 'opacity-70'
                    }`}
                  >
                    {item.subtitle}
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Quote Block if present */}
      {note.quote && (
        <div className="relative bg-white/75 dark:bg-black/35 backdrop-blur-xs p-3.5 rounded-2xl my-2 border-r-4 border-primary/80">
          <span className="material-symbols-outlined text-[20px] text-primary mb-1 select-none opacity-80">
            format_quote
          </span>
          <p className="text-sm italic leading-relaxed">"{note.quote.text}"</p>
        </div>
      )}

      {/* Text Excerpt if no checklist or as summary */}
      {!note.checklists && !note.quote && note.content && (
        <p className="text-sm line-clamp-2 leading-relaxed opacity-90 my-2">
          {note.content.replace(/[#*`_\[\]()>-]/g, '').trim()}
        </p>
      )}

      {/* Embedded Photo Gallery Preview */}
      {note.attachments &&
        note.attachments.filter((a) => a.type === 'image').length > 0 && (
          <div className="grid grid-cols-2 gap-2 my-2">
            {note.attachments
              .filter((a) => a.type === 'image')
              .slice(0, 2)
              .map((img, i) => (
                <div
                  key={img.id}
                  className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-black/10 dark:bg-white/10 shadow-xs group/img"
                >
                  <img
                    src={img.url}
                    alt={img.alt || img.title || 'Attached photo'}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                  />
                  {i === 1 && note.attachments && note.attachments.length > 2 && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center text-white text-xs font-bold">
                      +{note.attachments.length - 1} صور
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}

      {/* Audio Recording Attachment Bar */}
      {note.attachments?.some((a) => a.type === 'audio') && (
        <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/70 dark:bg-black/30 text-xs font-medium my-2">
          <span className="material-symbols-outlined text-[18px]">mic</span>
          <span className="flex-1 truncate">
            {note.attachments.find((a) => a.type === 'audio')?.title || 'تسجيل صوتي مرفق'}
          </span>
          <span className="material-symbols-outlined text-[18px]">headphones</span>
        </div>
      )}

      {/* Bottom Card Footer: Date & Quick Action Icons */}
      <div className={`flex items-center justify-between pt-2 text-xs ${style.footerText}`}>
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[15px]">schedule</span>
          <span>{note.updatedAt || 'اليوم'}</span>
        </div>
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {note.quote && (
            <span className="truncate max-w-[120px] font-semibold">{note.quote.source}</span>
          )}
          {note.reminder && (
            <button
              onClick={(e) => onOpenReminder?.(note, e)}
              className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              title="ضبط التذكير"
            >
              <span className="material-symbols-outlined text-[16px]">notifications</span>
            </button>
          )}
          {onDeleteNote && (
            <button
              onClick={(e) => onDeleteNote(note.id, e)}
              className="p-1 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors"
              title="حذف الملاحظة"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
