import React, { useEffect, useState } from 'react';
import { Note, CategoryItem, NoteReminder } from './types/note';
import { dbService } from './services/db';
import { syncService, SyncState } from './services/syncService';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { AllNotesView } from './components/AllNotesView';
import { NoteEditorView } from './components/NoteEditorView';
import { AdvancedSearchView } from './components/AdvancedSearchView';
import { CategoriesView } from './components/CategoriesView';
import { SettingsView } from './components/SettingsView';
import { ReminderBottomSheet } from './components/ReminderBottomSheet';

function MainApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [currentTab, setCurrentTab] = useState<NavTab | 'editor'>('all-notes');
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [reminderNote, setReminderNote] = useState<Note | null>(null);
  const [isGridView, setIsGridView] = useState(false);
  const [syncState, setSyncState] = useState<SyncState>(syncService.getState());

  // Load initial data from IndexedDB
  const loadData = async () => {
    await dbService.init();
    const fetchedNotes = await dbService.getAllNotes();
    const fetchedCats = await dbService.getAllCategories();
    setNotes(fetchedNotes);
    setCategories(fetchedCats);
  };

  useEffect(() => {
    loadData();

    // Subscribe to sync service updates
    const unsubscribe = syncService.subscribe((state) => {
      setSyncState(state);
    });

    return () => unsubscribe();
  }, []);

  // Save or update note
  const handleSaveNote = async (updatedNote: Note) => {
    await dbService.saveNote(updatedNote);
    syncService.markMutation();
    setNotes((prev) => {
      const idx = prev.findIndex((n) => n.id === updatedNote.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updatedNote;
        return copy;
      }
      return [updatedNote, ...prev];
    });
    if (activeNote?.id === updatedNote.id) {
      setActiveNote(updatedNote);
    }
  };

  // Create new note
  const handleCreateNewNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: 'ملاحظة جديدة بدون عنوان',
      content: '# ملاحظة جديدة\n\nاكتب أفكارك ومشاريعك هنا...',
      category: 'شخصي',
      subCategory: 'الأفكار اليومية والتأملات',
      tags: ['#أفكار'],
      color: 'lavender',
      isPinned: false,
      updatedAt: 'الآن',
      createdAt: new Date().toISOString(),
    };
    handleSaveNote(newNote);
    setActiveNote(newNote);
    setCurrentTab('editor');
  };

  // Open note in editor
  const handleOpenNote = (note: Note) => {
    setActiveNote(note);
    setCurrentTab('editor');
  };

  // Toggle pin
  const handleTogglePin = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const target = notes.find((n) => n.id === id);
    if (!target) return;
    const updated = { ...target, isPinned: !target.isPinned };
    await handleSaveNote(updated);
  };

  // Toggle checklist item
  const handleToggleCheckItem = async (noteId: string, itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const target = notes.find((n) => n.id === noteId);
    if (!target || !target.checklists) return;

    const updatedChecklists = target.checklists.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    const updated = { ...target, checklists: updatedChecklists };
    await handleSaveNote(updated);
  };

  // Open reminder modal
  const handleOpenReminder = (note: Note, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setReminderNote(note);
    setIsReminderOpen(true);
  };

  // Save reminder from modal
  const handleSaveReminder = async (noteId: string, reminder: NoteReminder) => {
    const target = notes.find((n) => n.id === noteId);
    if (!target) return;
    const updated = { ...target, reminder };
    await handleSaveNote(updated);
  };

  // Delete note
  const handleDeleteNote = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    await dbService.deleteNote(id);
    syncService.markMutation();
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (activeNote?.id === id) {
      setActiveNote(null);
      setCurrentTab('all-notes');
    }
  };

  // Reset demo data
  const handleResetData = async () => {
    await dbService.resetToDefault();
    await loadData();
    syncService.syncNow();
  };

  // Add new category
  const handleNewCategory = async (name: string) => {
    const newCat: CategoryItem = {
      id: `cat-${Date.now()}`,
      name,
      icon: 'folder',
      count: 0,
      subcategories: [],
    };
    await dbService.saveCategory(newCat);
    setCategories((prev) => [...prev, newCat]);
  };

  return (
    <div className="bg-surface text-on-surface font-body-md flex flex-col min-h-screen selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Top Application Header */}
      <Header
        currentView={currentTab}
        onOpenSettings={() => setCurrentTab('settings')}
        syncState={syncState}
        onSyncClick={() => syncService.syncNow()}
        isGridView={isGridView}
        onToggleGridView={() => setIsGridView(!isGridView)}
      />

      {/* Main Screen Content Viewport */}
      <main className="flex-1 flex flex-col relative w-full pt-20 px-4 md:px-8 max-w-7xl mx-auto">
        {currentTab === 'all-notes' && (
          <AllNotesView
            notes={notes}
            onOpenNote={handleOpenNote}
            onTogglePin={handleTogglePin}
            onToggleCheckItem={handleToggleCheckItem}
            onOpenReminder={handleOpenReminder}
            onDeleteNote={handleDeleteNote}
            onOpenAdvancedSearch={() => setCurrentTab('advanced-search')}
            isGridView={isGridView}
          />
        )}

        {currentTab === 'editor' && activeNote && (
          <NoteEditorView
            note={activeNote}
            onSave={handleSaveNote}
            onBack={() => {
              setActiveNote(null);
              setCurrentTab('all-notes');
            }}
            onOpenReminder={(n) => handleOpenReminder(n)}
            onDelete={handleDeleteNote}
          />
        )}

        {currentTab === 'advanced-search' && (
          <AdvancedSearchView
            notes={notes}
            onOpenNote={handleOpenNote}
            onBackToFeed={() => setCurrentTab('all-notes')}
          />
        )}

        {currentTab === 'categories' && (
          <CategoriesView
            categories={categories}
            notes={notes}
            onSelectCategory={() => setCurrentTab('all-notes')}
            onNewCategory={handleNewCategory}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            syncState={syncState}
            notes={notes}
            categories={categories}
            onDataImported={loadData}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Floating Action Button & Bottom Tab Bar (hidden when inside full editor) */}
      {currentTab !== 'editor' && (
        <BottomNav
          activeTab={currentTab as NavTab}
          onTabChange={(tab) => setCurrentTab(tab)}
          onNewNote={handleCreateNewNote}
        />
      )}

      {/* Reminder Bottom Sheet Modal */}
      <ReminderBottomSheet
        note={reminderNote}
        isOpen={isReminderOpen}
        onClose={() => {
          setIsReminderOpen(false);
          setReminderNote(null);
        }}
        onSaveReminder={handleSaveReminder}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
