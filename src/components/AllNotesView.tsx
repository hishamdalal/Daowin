import React, { useState } from 'react';
import { Note } from '../types/note';
import { NoteCard } from './NoteCard';

interface AllNotesViewProps {
  notes: Note[];
  onOpenNote: (note: Note) => void;
  onTogglePin: (id: string, e: React.MouseEvent) => void;
  onToggleCheckItem: (noteId: string, itemId: string, e: React.MouseEvent) => void;
  onOpenReminder: (note: Note, e: React.MouseEvent) => void;
  onDeleteNote: (id: string, e: React.MouseEvent) => void;
  onOpenAdvancedSearch: () => void;
  isGridView: boolean;
}

export const AllNotesView: React.FC<AllNotesViewProps> = ({
  notes,
  onOpenNote,
  onTogglePin,
  onToggleCheckItem,
  onOpenReminder,
  onDeleteNote,
  onOpenAdvancedSearch,
  isGridView,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter chips list
  const filterChips = [
    { id: 'all', label: `الكل (${notes.length})`, icon: 'all_inbox' },
    {
      id: 'reminders',
      label: `التذكيرات (${notes.filter((n) => n.reminder?.enabled).length})`,
      icon: 'notifications_active',
    },
    {
      id: 'work',
      label: `العمل (${notes.filter((n) => n.category.includes('العمل')).length})`,
      icon: 'work',
    },
    {
      id: 'projects-2025',
      label: `العمل > مشاريع 2025 (${notes.filter((n) => n.subCategory?.includes('2025')).length})`,
      icon: 'folder_copy',
    },
    {
      id: 'personal',
      label: `شخصي (${notes.filter((n) => n.category.includes('شخصي')).length})`,
      icon: 'person',
    },
    {
      id: 'tag-important',
      label: '#مهم',
      isTag: true,
    },
    {
      id: 'tag-ideas',
      label: '#أفكار',
      isTag: true,
    },
    {
      id: 'tag-meeting',
      label: '#اجتماع',
      isTag: true,
    },
    {
      id: 'tag-budget',
      label: '#ميزانية',
      isTag: true,
    },
  ];

  // Filtering logic
  const filteredNotes = notes.filter((note) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = note.title.toLowerCase().includes(q);
      const matchContent = note.content.toLowerCase().includes(q);
      const matchTags = note.tags.some((t) => t.toLowerCase().includes(q));
      const matchCat = note.category.toLowerCase().includes(q);
      if (!matchTitle && !matchContent && !matchTags && !matchCat) {
        return false;
      }
    }

    // Active chip filter
    if (activeFilter === 'all') return true;
    if (activeFilter === 'reminders') return !!note.reminder?.enabled;
    if (activeFilter === 'work') return note.category.includes('العمل');
    if (activeFilter === 'projects-2025') return note.subCategory?.includes('2025');
    if (activeFilter === 'personal') return note.category.includes('شخصي');
    if (activeFilter === 'tag-important') return note.tags.includes('#مهم');
    if (activeFilter === 'tag-ideas') return note.tags.includes('#أفكار');
    if (activeFilter === 'tag-meeting') return note.tags.includes('#اجتماع');
    if (activeFilter === 'tag-budget') return note.tags.includes('#ميزانية');

    return true;
  });

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const otherNotes = filteredNotes.filter((n) => !n.isPinned);

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Search Bar with Tune Button */}
      <div className="relative w-full mb-4">
        <div className="relative flex items-center w-full h-12 bg-surface-container rounded-full px-4 shadow-xs transition-all focus-within:shadow-md focus-within:bg-surface-container-lowest">
          <span className="material-symbols-outlined text-outline text-[22px] ml-2 select-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`ابحث في ${notes.length} مذكرة، وسم، أو قائمة...`}
            className="w-full bg-transparent border-0 outline-none text-on-surface text-sm md:text-base placeholder:text-outline text-right"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="w-7 h-7 flex items-center justify-center rounded-full text-outline hover:text-on-surface"
              title="مسح البحث"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
          <button
            onClick={onOpenAdvancedSearch}
            aria-label="تصفية إضافية"
            title="البحث المتقدم والتصفية الهرمية"
            className="w-8 h-8 flex items-center justify-center rounded-full text-outline hover:text-primary hover:bg-surface-container-high transition-colors mr-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Filter Chips */}
      <div className="w-full overflow-x-auto no-scrollbar -mx-4 px-4 mb-6 flex items-center gap-2 scroll-smooth">
        {filterChips.map((chip) => {
          const isActive = activeFilter === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
                isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {chip.icon && (
                <span
                  className={`material-symbols-outlined text-[16px] ${
                    isActive ? 'fill-1' : ''
                  }`}
                >
                  {chip.icon}
                </span>
              )}
              {chip.isTag && <span className="font-bold text-primary">#</span>}
              <span>{chip.isTag ? chip.label.replace('#', '') : chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* Pinned Notes Section */}
      {pinnedNotes.length > 0 && (
        <section className="mb-6">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] text-primary fill-1">
                push_pin
              </span>
              <span className="text-sm font-bold text-on-surface">المثبتة</span>
            </div>
            <span className="text-xs text-outline font-medium">
              {pinnedNotes.length} {pinnedNotes.length === 1 ? 'مذكرة' : 'مذكرات'}
            </span>
          </div>

          <div
            className={`grid gap-4 ${
              isGridView ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
            }`}
          >
            {pinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onOpen={onOpenNote}
                onTogglePin={onTogglePin}
                onToggleCheckItem={onToggleCheckItem}
                onOpenReminder={onOpenReminder}
                onDeleteNote={onDeleteNote}
              />
            ))}
          </div>
        </section>
      )}

      {/* Other Notes Section */}
      <section>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">notes</span>
            <span className="text-sm font-bold text-on-surface">باقي الملاحظات</span>
          </div>
          <span className="text-xs text-outline font-medium">
            {otherNotes.length} {otherNotes.length === 1 ? 'مذكرة' : 'مذكرات'}
          </span>
        </div>

        {otherNotes.length > 0 ? (
          <div
            className={`grid gap-4 ${
              isGridView ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
            }`}
          >
            {otherNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onOpen={onOpenNote}
                onTogglePin={onTogglePin}
                onToggleCheckItem={onToggleCheckItem}
                onOpenReminder={onOpenReminder}
                onDeleteNote={onDeleteNote}
              />
            ))}
          </div>
        ) : (
          <div className="w-full p-8 rounded-3xl bg-surface-container-low text-center flex flex-col items-center justify-center gap-2">
            <span className="material-symbols-outlined text-4xl text-outline">description</span>
            <p className="text-sm text-outline">لا توجد ملاحظات مطابقة للتصفية الحالية</p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-1.5 rounded-full bg-primary text-white text-xs font-bold"
            >
              عرض جميع المذكرات
            </button>
          </div>
        )}
      </section>

      {/* End of Feed Tactile Hint */}
      <div className="w-full flex flex-col items-center justify-center py-8 gap-2 text-outline">
        <div className="w-12 h-1 rounded-full bg-surface-container-highest" />
        <span className="text-xs font-medium">تم استعراض جميع مذكراتك النشطة</span>
      </div>
    </div>
  );
};
