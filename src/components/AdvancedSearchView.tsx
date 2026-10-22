import React, { useState, useMemo } from 'react';
import { Note, NoteColor } from '../types/note';

interface AdvancedSearchViewProps {
  notes: Note[];
  onOpenNote: (note: Note) => void;
  onBackToFeed: () => void;
}

export const AdvancedSearchView: React.FC<AdvancedSearchViewProps> = ({
  notes,
  onOpenNote,
  onBackToFeed,
}) => {
  const [keyword, setKeyword] = useState<string>('تصميم واجهة');
  const [includeSubcategories, setIncludeSubcategories] = useState<boolean>(true);

  // Selected filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'العمل',
    'مشاريع 2025',
    'الأفكار اليومية والتأملات',
  ]);
  const [selectedTags, setSelectedTags] = useState<string[]>(['#تصميم', '#مهم']);
  const [contentType, setContentType] = useState<{
    images: boolean;
    checklists: boolean;
    pinnedOnly: boolean;
  }>({
    images: false,
    checklists: true,
    pinnedOnly: false,
  });
  const [selectedColor, setSelectedColor] = useState<NoteColor | 'all'>('all');

  const availableTags = [
    '#مهم',
    '#تصميم',
    '#أفكار',
    '#ميزانية',
    '#عاجل',
    '#اجتماع',
    '#ملهم',
    '#تقنية',
    '#شخصي',
  ];

  // Toggle category
  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Toggle tag
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setKeyword('');
    setSelectedCategories([]);
    setSelectedTags([]);
    setContentType({ images: false, checklists: false, pinnedOnly: false });
    setSelectedColor('all');
  };

  // Filter computation
  const matchingNotes = useMemo(() => {
    return notes.filter((note) => {
      // Keyword matching
      if (keyword.trim()) {
        const q = keyword.toLowerCase().trim();
        const words = q.split(/\s+/);
        const textToSearch = `${note.title} ${note.content} ${note.category} ${note.tags.join(' ')}`.toLowerCase();
        const hasAnyWord = words.some((w) => textToSearch.includes(w));
        if (!hasAnyWord) return false;
      }

      // Category matching
      if (selectedCategories.length > 0) {
        const matchesCategory = selectedCategories.some(
          (c) =>
            note.category.includes(c) ||
            (includeSubcategories && note.subCategory && note.subCategory.includes(c))
        );
        if (!matchesCategory) return false;
      }

      // Tag matching
      if (selectedTags.length > 0) {
        const matchesTag = selectedTags.some((t) => note.tags.includes(t));
        if (!matchesTag) return false;
      }

      // Content type matching
      if (contentType.images) {
        const hasImages = note.attachments?.some((a) => a.type === 'image');
        if (!hasImages) return false;
      }
      if (contentType.checklists) {
        const hasChecklist = note.checklists && note.checklists.length > 0;
        if (!hasChecklist) return false;
      }
      if (contentType.pinnedOnly) {
        if (!note.isPinned) return false;
      }

      // Color filter
      if (selectedColor !== 'all' && note.color !== selectedColor) {
        return false;
      }

      return true;
    });
  }, [notes, keyword, selectedCategories, includeSubcategories, selectedTags, contentType, selectedColor]);

  // Helper to highlight matching words in title/content
  const renderHighlightedText = (text: string) => {
    if (!keyword.trim()) return text;
    const words = keyword.trim().split(/\s+/).filter(Boolean);
    const regex = new RegExp(`(${words.join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-primary-fixed dark:bg-primary text-on-primary-fixed dark:text-white px-1 rounded font-bold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="flex flex-col w-full pb-32">
      {/* Sticky Search Header */}
      <div className="sticky top-16 z-30 pt-2 pb-3 bg-surface/90 backdrop-blur-md">
        <div className="relative flex items-center">
          <div className="absolute right-4 flex items-center pointer-events-none text-primary">
            <span className="material-symbols-outlined text-[24px]">search</span>
          </div>
          <input
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="ابحث في عناوين ونصوص الملاحظات..."
            className="w-full h-14 pr-12 pl-12 rounded-full bg-surface-container-high text-on-surface text-sm md:text-base placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:shadow-md transition-all"
          />
          {keyword && (
            <button
              onClick={() => setKeyword('')}
              className="absolute left-3 w-9 h-9 flex items-center justify-center rounded-full text-outline hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>

        {/* Active Filter Quick Chips Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mt-3 pt-1">
          <span className="text-xs text-outline px-1 shrink-0 font-bold">نشط:</span>
          {selectedCategories.slice(0, 2).map((cat) => (
            <span
              key={cat}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-semibold shrink-0"
            >
              <span>{cat}</span>
              <button onClick={() => toggleCategory(cat)}>
                <span className="material-symbols-outlined text-[15px]">close</span>
              </button>
            </span>
          ))}
          {selectedTags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold shrink-0"
            >
              <span>{tag}</span>
              <button onClick={() => toggleTag(tag)}>
                <span className="material-symbols-outlined text-[15px]">close</span>
              </button>
            </span>
          ))}
          {contentType.checklists && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-semibold shrink-0">
              <span>قوائم مهام</span>
              <button
                onClick={() => setContentType({ ...contentType, checklists: false })}
              >
                <span className="material-symbols-outlined text-[15px]">close</span>
              </button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs text-primary font-bold underline px-2 shrink-0 cursor-pointer"
          >
            مسح الكل
          </button>
        </div>
      </div>

      {/* Filter Groups Container */}
      <div className="flex flex-col gap-4 mt-2">
        {/* Category Hierarchy Accordion */}
        <div className="p-4 md:p-5 rounded-3xl bg-surface-container-low shadow-xs border border-outline-variant/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">folder_special</span>
              </div>
              <div>
                <h2 className="text-base font-bold text-on-surface">الأقسام والشُعب</h2>
                <p className="text-xs text-outline">حدد مجالات البحث ومساراتها</p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary text-white font-bold">
              مُفعل {selectedCategories.length}
            </span>
          </div>

          {/* Auto Subcategories Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container mb-3.5">
            <div className="flex flex-col pr-1">
              <span className="text-xs md:text-sm font-semibold text-on-surface">
                تضمين الأقسام الفرعية تلقائياً
              </span>
              <span className="text-[11px] text-outline">
                شمول المجلدات المتفرعة عند اختيار القسم الرئيسي
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeSubcategories}
                onChange={(e) => setIncludeSubcategories(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>

          {/* Category Tree Items */}
          <div className="flex flex-col gap-2">
            {/* Category 1: Work */}
            <div className="rounded-2xl bg-surface-container-lowest dark:bg-surface-container p-3 border border-outline-variant/10">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes('العمل')}
                    onChange={() => toggleCategory('العمل')}
                    className="w-4 h-4 rounded accent-primary cursor-pointer"
                  />
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    apartment
                  </span>
                  <span className="text-sm font-bold text-on-surface">العمل والمؤسسة</span>
                </div>
                <span className="text-xs text-outline">18 ملاحظة</span>
              </label>

              <div className="mt-2.5 mr-6 flex flex-col gap-1.5 pt-2 border-r-2 border-outline-variant/30 pr-3">
                <label className="flex items-center justify-between cursor-pointer py-0.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes('مشاريع 2025')}
                      onChange={() => toggleCategory('مشاريع 2025')}
                      className="w-3.5 h-3.5 rounded accent-primary cursor-pointer"
                    />
                    <span className="text-xs md:text-sm text-on-surface">مشاريع 2025</span>
                  </div>
                  <span className="text-[11px] text-outline bg-surface-container px-2 py-0.5 rounded-full">
                    11
                  </span>
                </label>
                <label className="flex items-center justify-between cursor-pointer py-0.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes('العملاء والعقود الرسمية')}
                      onChange={() => toggleCategory('العملاء والعقود الرسمية')}
                      className="w-3.5 h-3.5 rounded accent-primary cursor-pointer"
                    />
                    <span className="text-xs md:text-sm text-on-surface">العملاء والعقود الرسمية</span>
                  </div>
                  <span className="text-[11px] text-outline bg-surface-container px-2 py-0.5 rounded-full">
                    7
                  </span>
                </label>
              </div>
            </div>

            {/* Category 2: Personal */}
            <div className="rounded-2xl bg-surface-container-lowest dark:bg-surface-container p-3 border border-outline-variant/10">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes('شخصي')}
                    onChange={() => toggleCategory('شخصي')}
                    className="w-4 h-4 rounded accent-primary cursor-pointer"
                  />
                  <span className="material-symbols-outlined text-secondary text-[20px]">
                    person
                  </span>
                  <span className="text-sm font-bold text-on-surface">المساحة الشخصية</span>
                </div>
                <span className="text-xs text-outline">14 ملاحظة</span>
              </label>

              <div className="mt-2.5 mr-6 flex flex-col gap-1.5 pt-2 border-r-2 border-outline-variant/30 pr-3">
                <label className="flex items-center justify-between cursor-pointer py-0.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes('المشتريات والتسوق')}
                      onChange={() => toggleCategory('المشتريات والتسوق')}
                      className="w-3.5 h-3.5 rounded accent-primary cursor-pointer"
                    />
                    <span className="text-xs md:text-sm text-on-surface">المشتريات والتسوق</span>
                  </div>
                  <span className="text-[11px] text-outline bg-surface-container px-2 py-0.5 rounded-full">
                    4
                  </span>
                </label>
                <label className="flex items-center justify-between cursor-pointer py-0.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes('الأفكار اليومية والتأملات')}
                      onChange={() => toggleCategory('الأفكار اليومية والتأملات')}
                      className="w-3.5 h-3.5 rounded accent-primary cursor-pointer"
                    />
                    <span className="text-xs md:text-sm text-on-surface">الأفكار اليومية والتأملات</span>
                  </div>
                  <span className="text-[11px] text-outline bg-surface-container px-2 py-0.5 rounded-full">
                    10
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Tags Multi-selection */}
        <div className="p-4 md:p-5 rounded-3xl bg-surface-container-low shadow-xs border border-outline-variant/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">tag</span>
              </div>
              <div>
                <h2 className="text-base font-bold text-on-surface">الوسوم النشطة</h2>
                <p className="text-xs text-outline">تصفح عبر الكلمات الدلالية</p>
              </div>
            </div>
            <span className="text-xs text-outline font-medium">اختر للتصفية</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {availableTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-surface-container-lowest dark:bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {isSelected && (
                    <span className="material-symbols-outlined text-[15px]">check</span>
                  )}
                  <span>{tag}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Type Filter */}
        <div className="p-4 md:p-5 rounded-3xl bg-surface-container-low shadow-xs border border-outline-variant/20">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">filter_alt</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-on-surface">نوع المحتوى المرفق</h2>
              <p className="text-xs text-outline">عزل الملاحظات حسب طبيعة العناصر</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-lowest dark:bg-surface-container cursor-pointer hover:bg-surface-container transition-colors">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">image</span>
                <span className="text-xs md:text-sm font-semibold text-on-surface">
                  صور ومعارض
                </span>
              </div>
              <input
                type="checkbox"
                checked={contentType.images}
                onChange={(e) => setContentType({ ...contentType, images: e.target.checked })}
                className="w-4 h-4 rounded accent-primary cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-secondary-fixed/40 dark:bg-secondary-fixed/20 border border-secondary/20 cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">checklist</span>
                <span className="text-xs md:text-sm font-bold text-on-surface">
                  قوائم مهام وإنجاز
                </span>
              </div>
              <input
                type="checkbox"
                checked={contentType.checklists}
                onChange={(e) => setContentType({ ...contentType, checklists: e.target.checked })}
                className="w-4 h-4 rounded accent-primary cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-lowest dark:bg-surface-container cursor-pointer hover:bg-surface-container transition-colors">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">push_pin</span>
                <span className="text-xs md:text-sm font-semibold text-on-surface">
                  مثبتة فقط
                </span>
              </div>
              <input
                type="checkbox"
                checked={contentType.pinnedOnly}
                onChange={(e) => setContentType({ ...contentType, pinnedOnly: e.target.checked })}
                className="w-4 h-4 rounded accent-primary cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Color Swatches Filter */}
        <div className="p-4 md:p-5 rounded-3xl bg-surface-container-low shadow-xs border border-outline-variant/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-secondary-fixed text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">palette</span>
              </div>
              <div>
                <h2 className="text-base font-bold text-on-surface">تلوين الملاحظات</h2>
                <p className="text-xs text-outline">الفرز وفق نمط البطاقة الباستيلي</p>
              </div>
            </div>
            <span className="text-xs text-outline">
              {selectedColor === 'all' ? 'أي لون' : selectedColor}
            </span>
          </div>

          <div className="flex items-center justify-around py-1">
            <button
              onClick={() => setSelectedColor('all')}
              title="جميع الألوان"
              className={`w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-bold ${
                selectedColor === 'all' ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">done_all</span>
            </button>
            <button
              onClick={() => setSelectedColor('lavender')}
              title="خزامى"
              className={`w-10 h-10 rounded-full bg-[#ded5fb] hover:scale-110 transition-transform ${
                selectedColor === 'lavender' ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
            />
            <button
              onClick={() => setSelectedColor('mint')}
              title="نعناع"
              className={`w-10 h-10 rounded-full bg-[#c7ecdf] hover:scale-110 transition-transform ${
                selectedColor === 'mint' ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
            />
            <button
              onClick={() => setSelectedColor('peach')}
              title="خوخي"
              className={`w-10 h-10 rounded-full bg-[#ffd5c4] hover:scale-110 transition-transform ${
                selectedColor === 'peach' ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
            />
            <button
              onClick={() => setSelectedColor('sky')}
              title="سماوي"
              className={`w-10 h-10 rounded-full bg-[#c5e1fb] hover:scale-110 transition-transform ${
                selectedColor === 'sky' ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
            />
            <button
              onClick={() => setSelectedColor('rose')}
              title="وردي"
              className={`w-10 h-10 rounded-full bg-[#fccad6] hover:scale-110 transition-transform ${
                selectedColor === 'rose' ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
            />
            <button
              onClick={() => setSelectedColor('yellow')}
              title="أصفر"
              className={`w-10 h-10 rounded-full bg-[#faeec0] hover:scale-110 transition-transform ${
                selectedColor === 'yellow' ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
            />
          </div>
        </div>

        {/* Immediate Results Counter Banner */}
        <div className="flex items-center justify-between p-4 rounded-3xl bg-primary text-white shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[19px]">auto_awesome</span>
            </div>
            <div>
              <span className="text-sm md:text-base font-bold block">
                {matchingNotes.length} ملاحظات مطابقة للتصفية
              </span>
              <span className="text-[11px] opacity-80">تم التحديث الفوري بناءً على المعايير</span>
            </div>
          </div>
          <button
            onClick={onBackToFeed}
            className="px-4 py-2 rounded-full bg-surface-container-lowest text-primary font-bold text-xs shadow-xs hover:bg-surface-bright active:scale-95 transition-all cursor-pointer"
          >
            تطبيق وعرض
          </button>
        </div>

        {/* Live Matching Results List */}
        <div className="flex flex-col gap-3 mt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-bold text-on-surface">معاينة النتائج المباشرة</h3>
            <span className="text-xs text-outline">ترتيب حسب: الأحدث تعديلاً</span>
          </div>

          {matchingNotes.map((mNote) => (
            <div
              key={mNote.id}
              onClick={() => onOpenNote(mNote)}
              className="relative p-4 md:p-5 rounded-3xl bg-surface-container-lowest dark:bg-surface-container shadow-xs hover:shadow-md transition-all cursor-pointer border border-outline-variant/20"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-semibold">
                    {mNote.category} {mNote.subCategory ? `/ ${mNote.subCategory}` : ''}
                  </span>
                  <span className="text-outline text-xs">• {mNote.updatedAt}</span>
                </div>
                {mNote.isPinned && (
                  <span className="material-symbols-outlined text-primary text-[18px] fill-1">
                    push_pin
                  </span>
                )}
              </div>

              <h4 className="text-base md:text-lg font-bold text-on-surface mb-1.5">
                {renderHighlightedText(mNote.title)}
              </h4>
              <p className="text-xs md:text-sm text-outline line-clamp-2 mb-3 leading-relaxed">
                {renderHighlightedText(mNote.content.slice(0, 150))}
              </p>

              {/* Task summary if checklist exists */}
              {mNote.checklists && mNote.checklists.length > 0 && (
                <div className="flex flex-col gap-1 mb-2 bg-surface-container-low p-2 rounded-xl text-xs">
                  {mNote.checklists.slice(0, 2).map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-2 ${
                        item.completed ? 'line-through opacity-70' : 'font-medium'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px] text-tertiary">
                        {item.completed ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <span>{renderHighlightedText(item.text)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {mNote.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-primary font-bold flex items-center gap-1 hover:underline">
                  فتح الملاحظة
                  <span className="material-symbols-outlined text-[15px] rotate-180">
                    arrow_back
                  </span>
                </span>
              </div>
            </div>
          ))}

          {matchingNotes.length === 0 && (
            <div className="p-8 text-center bg-surface-container-low rounded-3xl text-outline">
              لا توجد مذكرات مطابقة لمعايير البحث الحالية
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
