import React, { useState, useRef, useEffect } from 'react';
import { Note, NoteColor, Attachment } from '../types/note';

interface NoteEditorViewProps {
  note: Note;
  onSave: (updatedNote: Note) => void;
  onBack: () => void;
  onOpenReminder: (note: Note) => void;
  onDelete: (id: string) => void;
}

export const NoteEditorView: React.FC<NoteEditorViewProps> = ({
  note: initialNote,
  onSave,
  onBack,
  onOpenReminder,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('preview');
  const [title, setTitle] = useState(initialNote.title);
  const [content, setContent] = useState(initialNote.content);
  const [color, setColor] = useState<NoteColor>(initialNote.color);
  const [category, setCategory] = useState(initialNote.category);
  const [subCategory, setSubCategory] = useState(initialNote.subCategory || 'مشاريع التطبيقات');
  const [tags, setTags] = useState<string[]>(initialNote.tags || ['#تصميم_واجهات', '#تطوير', '#Q1']);
  const [attachments, setAttachments] = useState<Attachment[]>(initialNote.attachments || []);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [undoStack, setUndoStack] = useState<string[]>([initialNote.content]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<string>('تم الحفظ تلقائياً قبل قليل');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-save debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const updated: Note = {
        ...initialNote,
        title,
        content,
        color,
        category,
        subCategory,
        tags,
        attachments,
      };
      onSave(updated);
      setSaveStatus('تم الحفظ تلقائياً قبل قليل');
    }, 400);

    return () => clearTimeout(timer);
  }, [title, content, color, category, subCategory, tags, attachments]);

  // Undo / Redo handlers
  const handleContentChange = (newText: string) => {
    setUndoStack((prev) => [...prev.slice(-20), content]);
    setRedoStack([]);
    setContent(newText);
    setSaveStatus('جارِ الحفظ...');
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack((s) => s.slice(0, -1));
    setRedoStack((r) => [...r, content]);
    setContent(prev);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((r) => r.slice(0, -1));
    setUndoStack((s) => [...s, content]);
    setContent(next);
  };

  // Insert syntax into textarea at cursor
  const insertSyntax = (syntax: string, isWrap = false, wrapSuffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    setActiveTab('edit');
    textarea.focus();

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);

    let replacement = '';
    let newCursorPos = start + syntax.length;

    if (isWrap) {
      replacement = `${syntax}${selected || 'نص'}${wrapSuffix || syntax}`;
      newCursorPos = start + syntax.length + (selected ? selected.length : 2);
    } else {
      replacement = syntax;
      newCursorPos = start + syntax.length;
    }

    const updated = content.substring(0, start) + replacement + content.substring(end);
    handleContentChange(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 50);
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  // Add new tag
  const handleAddTag = () => {
    if (newTagInput.trim()) {
      const formatted = newTagInput.startsWith('#') ? newTagInput.trim() : `#${newTagInput.trim()}`;
      if (!tags.includes(formatted)) {
        setTags([...tags, formatted]);
      }
      setNewTagInput('');
      setIsAddingTag(false);
    }
  };

  // Delete attached image
  const handleDeleteImage = (imgId: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== imgId));
  };

  // Add sample image
  const handleAddSampleImage = () => {
    const newImage: Attachment = {
      id: `img-${Date.now()}`,
      type: 'image',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSqw-MsN2KIEmHf0vX1WL4f2b48u8Fo9ium2SV78O4Q6AiVjwHWYCNgAWUcyQZA0jdB-95cXPzFVa28ROzM3IEWTr4e9uFyU95dxme82Q9p9UrrI9kakcxSp-3xTHTl8XXMwHgrlToV1ErrsZ9vK9dX9PlH4BnSdei0LydQPrcc_448q8KyWBl3DOawe1m5rm7tihBFvpsYsaKgW9bAj6yuNTc7PA0aIXXYfNttXdcio8iFd3yNoE3',
      title: 'واجهة تصميم إضافية',
      alt: 'تصميم واجهة الهاتف الذكي',
    };
    setAttachments((prev) => [...prev, newImage]);
  };

  // Toggle checklist item in preview mode
  const toggleMarkdownCheckbox = (lineIndex: number) => {
    const lines = content.split('\n');
    const targetLine = lines[lineIndex];
    if (targetLine.includes('- [ ]')) {
      lines[lineIndex] = targetLine.replace('- [ ]', '- [x]');
    } else if (targetLine.includes('- [x]')) {
      lines[lineIndex] = targetLine.replace('- [x]', '- [ ]');
    }
    handleContentChange(lines.join('\n'));
  };

  // Color map for note paper background
  const paperColors: Record<NoteColor, string> = {
    yellow: 'bg-[#fef9eb] dark:bg-[#201b0d] border-[#fae5a8] dark:border-[#584100]/40',
    lavender: 'bg-[#fbf7ff] dark:bg-[#1a1528] border-[#e4dfff] dark:border-[#4029ba]/40',
    mint: 'bg-[#f3faf6] dark:bg-[#0c1f19] border-[#c7ecdf] dark:border-[#005c49]/40',
    peach: 'bg-[#fff8f2] dark:bg-[#26150e] border-[#ffd5c4] dark:border-[#712814]/40',
    sky: 'bg-[#f4f7fe] dark:bg-[#0e1d2c] border-[#c5e1fb] dark:border-[#124270]/40',
    rose: 'bg-[#fff5f7] dark:bg-[#240e15] border-[#fccad6] dark:border-[#7a1833]/40',
    default: 'bg-surface-container-lowest dark:bg-surface-container border-outline-variant/30',
  };

  // Render markdown parser for Preview Mode
  const renderFormattedPreview = () => {
    const lines = content.split('\n');
    return (
      <div className="flex flex-col gap-3 leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          // H1
          if (trimmed.startsWith('# ')) {
            return (
              <h1 key={idx} className="text-xl md:text-2xl font-bold text-primary mt-2 mb-1">
                {trimmed.replace('# ', '')}
              </h1>
            );
          }
          // H2
          if (trimmed.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-lg md:text-xl font-bold text-on-surface mt-3 mb-1 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full bg-primary" />
                {trimmed.replace('## ', '')}
              </h2>
            );
          }
          // H3
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-base md:text-lg font-bold text-on-surface mt-2 mb-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-secondary">checklist</span>
                {trimmed.replace('### ', '')}
              </h3>
            );
          }
          // Checkbox Task Item
          if (trimmed.startsWith('- [ ]') || trimmed.startsWith('- [x]')) {
            const isChecked = trimmed.startsWith('- [x]');
            const taskText = trimmed.replace(/- \[[ x]\]\s*/, '');
            return (
              <label
                key={idx}
                onClick={() => toggleMarkdownCheckbox(idx)}
                className="flex items-center gap-3 p-2.5 rounded-2xl bg-surface-container-low/70 hover:bg-surface-container transition-all cursor-pointer select-none"
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors shadow-2xs ${
                    isChecked ? 'bg-tertiary text-white' : 'bg-surface-container-highest text-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px] font-bold">check</span>
                </div>
                <span
                  className={`text-sm md:text-base font-medium transition-all ${
                    isChecked ? 'line-through text-outline' : 'text-on-surface'
                  }`}
                >
                  {taskText}
                </span>
              </label>
            );
          }
          // Bullet item
          if (trimmed.startsWith('- ')) {
            return (
              <div key={idx} className="flex items-start gap-2 mr-2 text-sm md:text-base text-on-surface">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span>{trimmed.replace('- ', '')}</span>
              </div>
            );
          }
          // Blockquote
          if (trimmed.startsWith('> ')) {
            return (
              <blockquote
                key={idx}
                className="bg-primary-fixed/30 dark:bg-primary-fixed/10 border-r-4 border-primary p-4 rounded-2xl text-on-surface text-sm md:text-base italic my-2"
              >
                {trimmed.replace('> ', '')}
              </blockquote>
            );
          }
          // Horizontal divider
          if (trimmed === '---') {
            return <hr key={idx} className="border-outline-variant/30 my-2" />;
          }
          // Empty line
          if (!trimmed) {
            return <div key={idx} className="h-1" />;
          }
          // Regular text
          return (
            <p key={idx} className="text-sm md:text-base text-on-surface leading-relaxed">
              {trimmed}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full pb-32">
      {/* Top Action Ribbon: Back, Status, Undo/Redo, Palette */}
      <div className="flex items-center justify-between gap-2 py-2 mb-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onBack}
            aria-label="رجوع"
            title="رجوع للقائمة الرئيسية"
            className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container active:scale-95 transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
          </button>
          <div className="flex items-center gap-1.5 text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full text-xs font-medium">
            <span className="material-symbols-outlined text-[17px] text-tertiary fill-1">
              cloud_done
            </span>
            <span className="truncate max-w-[150px]">{saveStatus}</span>
          </div>
        </div>

        {/* Undo / Redo & Palette Swatches Popover */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleUndo}
            disabled={undoStack.length <= 1}
            aria-label="تراجع"
            title="تراجع"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors active:scale-95 disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-[19px]">undo</span>
          </button>
          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            aria-label="إعادة"
            title="إعادة"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors active:scale-95 disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-[19px]">redo</span>
          </button>

          {/* Palette Popover Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsPaletteOpen(!isPaletteOpen)}
              aria-label="تغيير لون المذكرة"
              title="تغيير لون ورقة المذكرة"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-primary-fixed text-primary hover:bg-primary-fixed-dim transition-transform active:scale-90"
            >
              <span className="material-symbols-outlined text-[19px] fill-1">palette</span>
            </button>

            {/* Dropdown Swatches */}
            {isPaletteOpen && (
              <div
                className="absolute top-11 start-0 z-50 p-2 bg-surface-container-lowest dark:bg-surface-container-high rounded-2xl shadow-xl flex items-center gap-2 border border-outline-variant/30"
                onClick={(e) => e.stopPropagation()}
              >
                {(['default', 'lavender', 'mint', 'peach', 'sky', 'rose', 'yellow'] as NoteColor[]).map(
                  (c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setColor(c);
                        setIsPaletteOpen(false);
                      }}
                      className={`w-6 h-6 rounded-full transition-transform active:scale-90 ${
                        c === 'default'
                          ? 'bg-surface-container-high border border-outline'
                          : c === 'yellow'
                          ? 'bg-[#faeec0]'
                          : c === 'lavender'
                          ? 'bg-[#ded5fb]'
                          : c === 'mint'
                          ? 'bg-[#c7ecdf]'
                          : c === 'peach'
                          ? 'bg-[#ffd5c4]'
                          : c === 'sky'
                          ? 'bg-[#c5e1fb]'
                          : 'bg-[#fccad6]'
                      } ${color === c ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                    />
                  )
                )}
              </div>
            )}
          </div>

          {/* Delete Note Button */}
          <button
            onClick={() => {
              if (window.confirm('هل أنت متأكد من حذف هذه المذكرة؟')) {
                onDelete(initialNote.id);
              }
            }}
            aria-label="حذف المذكرة"
            title="حذف المذكرة"
            className="w-9 h-9 flex items-center justify-center rounded-full text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[19px]">delete</span>
          </button>
        </div>
      </div>

      {/* Mode Selector Tabs (Segmented Button MD3) */}
      <div className="p-1 bg-surface-container rounded-full flex items-center mb-4 shadow-2xs">
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-2 px-4 rounded-full text-xs md:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'preview'
              ? 'bg-surface-container-lowest dark:bg-surface-container-high text-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">visibility</span>
          <span>منسّق (HTML)</span>
        </button>
        <button
          onClick={() => setActiveTab('edit')}
          className={`flex-1 py-2 px-4 rounded-full text-xs md:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'edit'
              ? 'bg-surface-container-lowest dark:bg-surface-container-high text-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">edit_note</span>
          <span>كتابة وماركداون</span>
        </button>
      </div>

      {/* Main Document Container Card */}
      <div
        className={`rounded-3xl p-5 md:p-7 shadow-xs border transition-colors flex flex-col gap-4 ${paperColors[color]}`}
      >
        {/* Category & Breadcrumbs */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1.5 bg-surface-container-low dark:bg-black/20 px-3 py-1.5 rounded-full text-xs font-medium text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-primary">folder_open</span>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-transparent border-0 outline-none w-20 text-on-surface font-semibold"
            />
            <span className="text-outline">/</span>
            <input
              type="text"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="bg-transparent border-0 outline-none w-32 text-on-surface font-semibold"
            />
          </div>

          <div className="flex items-center gap-1 text-on-surface-variant text-xs">
            <span className="material-symbols-outlined text-[15px]">schedule</span>
            <span>تحديث: {initialNote.updatedAt || 'الآن'}</span>
          </div>
        </div>

        {/* Note Title */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="أدخل عنوان الملاحظة هنا..."
            className="w-full bg-transparent text-xl md:text-3xl font-extrabold text-on-surface placeholder:text-outline-variant focus:outline-none tracking-tight leading-snug"
          />
        </div>

        {/* Interactive Tags Row */}
        <div className="flex items-center flex-wrap gap-1.5 py-0.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 bg-primary-fixed dark:bg-primary-fixed/40 text-on-primary-fixed dark:text-primary text-xs font-semibold px-3 py-1 rounded-full shadow-2xs"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/20"
              >
                <span className="material-symbols-outlined text-[13px]">close</span>
              </button>
            </span>
          ))}

          {isAddingTag ? (
            <div className="inline-flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-full">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="وسم..."
                className="w-20 bg-transparent text-xs outline-none text-on-surface"
                autoFocus
              />
              <button onClick={handleAddTag} className="text-primary font-bold text-xs">
                إضافة
              </button>
              <button onClick={() => setIsAddingTag(false)} className="text-outline text-xs">
                إلغاء
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingTag(true)}
              className="inline-flex items-center gap-1 bg-surface-container text-on-surface-variant text-xs font-medium px-3 py-1 rounded-full hover:bg-surface-container-high transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[15px]">add</span>
              <span>وسم جديد</span>
            </button>
          )}
        </div>

        {/* Active Reminder Ribbon Trigger */}
        <div
          onClick={() => onOpenReminder(initialNote)}
          className="p-3 rounded-2xl bg-secondary-fixed/40 dark:bg-secondary-fixed/20 border border-secondary/20 flex items-center justify-between gap-2.5 transition-all cursor-pointer hover:bg-secondary-fixed/60"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center shrink-0 shadow-2xs">
              <span className="material-symbols-outlined text-[18px]">alarm_on</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs md:text-sm font-bold text-on-surface">
                  {initialNote.reminder?.enabled
                    ? `تذكير نشط: اليوم ${initialNote.reminder.scheduledTime || '06:00 م'}`
                    : 'إعداد وضبط تذكير لهذه المذكرة'}
                </span>
                {initialNote.reminder?.enabled && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-secondary-container text-white text-[10px] font-bold">
                    <span className="material-symbols-outlined text-[11px]">repeat</span> يومياً
                  </span>
                )}
                {initialNote.reminder?.pinToStatusBar && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                    <span className="material-symbols-outlined text-[11px]">push_pin</span> مثبت
                    بالإشعارات
                  </span>
                )}
              </div>
              <span className="text-xs text-outline truncate mt-0.5">
                انقر لتعديل وقت التنبيه أو ضبط مؤقت تنازلي
              </span>
            </div>
          </div>
          <button className="w-7 h-7 flex items-center justify-center rounded-full text-secondary hover:bg-secondary-container/20">
            <span className="material-symbols-outlined text-[18px]">edit_calendar</span>
          </button>
        </div>

        {/* Attached Photos Gallery Section */}
        <div className="bg-surface-container-low dark:bg-black/20 rounded-2xl p-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-on-surface">
              <span className="material-symbols-outlined text-[19px] text-primary">photo_library</span>
              <span>معرض الصور والمرفقات ({attachments.length})</span>
            </div>
            <button
              onClick={handleAddSampleImage}
              className="inline-flex items-center gap-1 bg-surface-container-lowest dark:bg-surface-container-high text-primary text-xs font-bold px-3 py-1.5 rounded-full shadow-2xs hover:bg-primary-fixed transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
              <span>إضافة صور</span>
            </button>
          </div>

          {/* Horizontal Thumbnails Strip */}
          <div className="flex items-center gap-2.5 overflow-x-auto py-1 scroll-smooth no-scrollbar">
            {attachments.map((img) => (
              <div
                key={img.id}
                className="relative shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-surface-container group shadow-xs"
              >
                <img src={img.url} alt={img.title || 'Attached'} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(img.id)}
                  aria-label="حذف الصورة"
                  className="absolute top-1 start-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddSampleImage}
              className="shrink-0 w-24 h-24 rounded-xl bg-surface-container/60 border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-1 text-outline hover:text-primary hover:bg-surface-container transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[24px]">add</span>
              <span className="text-[11px] font-medium">رفع المزيد</span>
            </button>
          </div>
        </div>

        {/* Active View: Markdown Code vs Formatted Preview */}
        {activeTab === 'edit' ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-outline text-xs px-1">
              <span>محرر Markdown المباشر</span>
              <span>UTF-8 • RTL</span>
            </div>
            <div className="relative rounded-2xl bg-surface-container-low dark:bg-black/30 p-4">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="اكتب ملاحظتك باستخدام وسوم Markdown..."
                rows={14}
                className="w-full bg-transparent text-sm md:text-base font-mono text-on-surface placeholder:text-outline-variant focus:outline-none resize-none leading-relaxed tracking-normal"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {renderFormattedPreview()}

            {/* Note Footnote Callout */}
            <div className="mt-2 p-3.5 rounded-2xl bg-primary-fixed/20 dark:bg-primary-fixed/10 flex items-center gap-2.5">
              <span className="material-symbols-outlined text-primary text-[22px]">lightbulb</span>
              <p className="text-xs text-on-surface font-medium leading-normal">
                تلميح: يتم حفظ التعديلات وحالة المهام فوراً في التخزين المحلي ومزامنتها تلقائياً.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Floating Markdown Toolbar */}
      <div className="fixed bottom-3 inset-x-4 z-40 max-w-lg mx-auto">
        <div className="bg-surface-container-lowest/95 dark:bg-[#1e1c25]/95 backdrop-blur-xl rounded-full shadow-[0_10px_28px_-2px_rgba(94,53,177,0.25)] p-1.5 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar border border-outline-variant/30">
          <button
            onClick={() => insertSyntax('# ')}
            className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container hover:text-primary font-bold text-sm"
            title="عنوان رئيسي H1"
          >
            H1
          </button>
          <button
            onClick={() => insertSyntax('**', true)}
            className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container hover:text-primary"
            title="خط عريض"
          >
            <span className="material-symbols-outlined text-[20px]">format_bold</span>
          </button>
          <button
            onClick={() => insertSyntax('*', true)}
            className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container hover:text-primary"
            title="خط مائل"
          >
            <span className="material-symbols-outlined text-[20px]">format_italic</span>
          </button>
          <button
            onClick={() => insertSyntax('- [ ] ')}
            className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed-dim"
            title="صندوق مهمة"
          >
            <span className="material-symbols-outlined text-[20px]">check_box</span>
          </button>
          <button
            onClick={() => insertSyntax('- ')}
            className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container hover:text-primary"
            title="قائمة نقطية"
          >
            <span className="material-symbols-outlined text-[20px]">format_list_bulleted</span>
          </button>
          <button
            onClick={() => insertSyntax('[عنوان الرابط](https://...)')}
            className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container hover:text-primary"
            title="رابط تشعبي"
          >
            <span className="material-symbols-outlined text-[20px]">link</span>
          </button>
          <button
            onClick={() => insertSyntax('`كود`')}
            className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container hover:text-primary"
            title="كتلة كود"
          >
            <span className="material-symbols-outlined text-[20px]">code</span>
          </button>
          <button
            onClick={() => insertSyntax('![وصف الصورة](https://...)')}
            className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container hover:text-primary"
            title="صورة"
          >
            <span className="material-symbols-outlined text-[20px]">image</span>
          </button>
          <button
            onClick={() => insertSyntax('> ')}
            className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container hover:text-primary"
            title="اقتباس"
          >
            <span className="material-symbols-outlined text-[20px]">format_quote</span>
          </button>
        </div>
      </div>
    </div>
  );
};
