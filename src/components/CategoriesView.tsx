import React, { useState } from 'react';
import { CategoryItem, Note } from '../types/note';

interface CategoriesViewProps {
  categories: CategoryItem[];
  notes: Note[];
  onSelectCategory: (categoryName: string, subCategoryName?: string) => void;
  onNewCategory?: (name: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  notes,
  onSelectCategory,
  onNewCategory,
}) => {
  const [newCatName, setNewCatName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (newCatName.trim()) {
      onNewCategory?.(newCatName.trim());
      setNewCatName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-on-surface">الأقسام والشُعب</h2>
          <p className="text-xs text-outline">تنظيم وهيكلة مذكراتك حسب المجالات والمشاريع</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-primary text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[17px]">create_new_folder</span>
          <span>قسم جديد</span>
        </button>
      </div>

      {/* New category input row */}
      {isAdding && (
        <div className="p-4 rounded-3xl bg-surface-container mb-4 flex items-center gap-2 border border-primary/30">
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="اسم القسم الجديد..."
            className="flex-1 bg-surface-container-lowest px-4 py-2 rounded-2xl text-xs md:text-sm text-on-surface outline-none"
            autoFocus
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded-2xl bg-primary text-white text-xs font-bold"
          >
            إضافة
          </button>
          <button
            onClick={() => setIsAdding(false)}
            className="px-3 py-2 text-xs text-outline hover:text-on-surface"
          >
            إلغاء
          </button>
        </div>
      )}

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          // Dynamic note count for this category
          const categoryNotes = notes.filter(
            (n) => n.category.includes(cat.name) || cat.name.includes(n.category)
          );

          return (
            <div
              key={cat.id}
              className="p-5 rounded-3xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/20 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">
                      {cat.icon || 'folder'}
                    </span>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface-container text-outline font-bold">
                    {categoryNotes.length} ملاحظات
                  </span>
                </div>

                <h3
                  onClick={() => onSelectCategory(cat.name)}
                  className="text-base md:text-lg font-bold text-on-surface hover:text-primary transition-colors cursor-pointer mb-1"
                >
                  {cat.name}
                </h3>
                <p className="text-xs text-outline mb-4">
                  تتضمن مشاريع ومهام تابعة للقسم
                </p>

                {/* Subcategories list */}
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <div className="flex flex-col gap-1.5 pt-3 border-t border-outline-variant/20">
                    <span className="text-[11px] font-bold text-outline">الأقسام الفرعية:</span>
                    {cat.subcategories.map((sub) => {
                      const subCount = notes.filter((n) =>
                        n.subCategory?.includes(sub.name)
                      ).length;
                      return (
                        <div
                          key={sub.id}
                          onClick={() => onSelectCategory(cat.name, sub.name)}
                          className="flex items-center justify-between p-2 rounded-xl bg-surface-container-lowest/80 dark:bg-surface-container-high/60 hover:bg-surface-container cursor-pointer transition-colors"
                        >
                          <span className="text-xs text-on-surface font-medium flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[15px] text-outline">
                              subdirectory_arrow_left
                            </span>
                            {sub.name}
                          </span>
                          <span className="text-[11px] text-outline font-semibold">
                            {subCount}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-2">
                <button
                  onClick={() => onSelectCategory(cat.name)}
                  className="w-full py-2 px-3 rounded-xl bg-surface-container hover:bg-primary-fixed text-primary text-xs font-bold transition-colors cursor-pointer"
                >
                  استعراض مذكرات القسم
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
