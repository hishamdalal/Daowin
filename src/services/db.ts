import { Note, CategoryItem } from '../types/note';
import { INITIAL_NOTES, INITIAL_CATEGORIES } from './mockData';

const DB_NAME = 'NoteCraftDB';
const DB_VERSION = 1;
const NOTES_STORE = 'notes';
const CATEGORIES_STORE = 'categories';
const META_STORE = 'metadata';

const LOCAL_STORAGE_NOTES_KEY = 'notecraft_notes_v1';
const LOCAL_STORAGE_CATS_KEY = 'notecraft_categories_v1';
const LOCAL_STORAGE_META_KEY = 'notecraft_meta_v1';

// Open IndexedDB database
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(NOTES_STORE)) {
        db.createObjectStore(NOTES_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(CATEGORIES_STORE)) {
        db.createObjectStore(CATEGORIES_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// LocalStorage helpers as durable fallback
function getLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
}

export const dbService = {
  async init(): Promise<void> {
    try {
      const existing = await this.getAllNotes();
      if (existing.length === 0) {
        await this.resetToDefault();
      }
    } catch {
      // Fallback already prepared
      const existing = getLocalStorage<Note[]>(LOCAL_STORAGE_NOTES_KEY, []);
      if (existing.length === 0) {
        setLocalStorage(LOCAL_STORAGE_NOTES_KEY, INITIAL_NOTES);
        setLocalStorage(LOCAL_STORAGE_CATS_KEY, INITIAL_CATEGORIES);
      }
    }
  },

  async getAllNotes(): Promise<Note[]> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(NOTES_STORE, 'readonly');
        const store = tx.objectStore(NOTES_STORE);
        const req = store.getAll();
        req.onsuccess = () => {
          const notes = req.result as Note[];
          if (!notes || notes.length === 0) {
            resolve(getLocalStorage<Note[]>(LOCAL_STORAGE_NOTES_KEY, INITIAL_NOTES));
          } else {
            setLocalStorage(LOCAL_STORAGE_NOTES_KEY, notes);
            resolve(notes);
          }
        };
        req.onerror = () => {
          resolve(getLocalStorage<Note[]>(LOCAL_STORAGE_NOTES_KEY, INITIAL_NOTES));
        };
      });
    } catch {
      return getLocalStorage<Note[]>(LOCAL_STORAGE_NOTES_KEY, INITIAL_NOTES);
    }
  },

  async getNoteById(id: string): Promise<Note | undefined> {
    const notes = await this.getAllNotes();
    return notes.find((n) => n.id === id);
  },

  async saveNote(note: Note): Promise<void> {
    const notes = await this.getAllNotes();
    const index = notes.findIndex((n) => n.id === note.id);
    let updated: Note[];
    if (index >= 0) {
      updated = [...notes];
      updated[index] = { ...note, updatedAt: 'الآن' };
    } else {
      updated = [{ ...note, updatedAt: 'الآن' }, ...notes];
    }

    setLocalStorage(LOCAL_STORAGE_NOTES_KEY, updated);

    try {
      const db = await openDB();
      const tx = db.transaction(NOTES_STORE, 'readwrite');
      const store = tx.objectStore(NOTES_STORE);
      store.put(index >= 0 ? { ...note, updatedAt: 'الآن' } : note);
    } catch (e) {
      console.warn('IDB put error, saved to local storage:', e);
    }
  },

  async deleteNote(id: string): Promise<void> {
    const notes = await this.getAllNotes();
    const filtered = notes.filter((n) => n.id !== id);
    setLocalStorage(LOCAL_STORAGE_NOTES_KEY, filtered);

    try {
      const db = await openDB();
      const tx = db.transaction(NOTES_STORE, 'readwrite');
      const store = tx.objectStore(NOTES_STORE);
      store.delete(id);
    } catch (e) {
      console.warn('IDB delete error:', e);
    }
  },

  async getAllCategories(): Promise<CategoryItem[]> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(CATEGORIES_STORE, 'readonly');
        const store = tx.objectStore(CATEGORIES_STORE);
        const req = store.getAll();
        req.onsuccess = () => {
          const cats = req.result as CategoryItem[];
          if (!cats || cats.length === 0) {
            resolve(getLocalStorage<CategoryItem[]>(LOCAL_STORAGE_CATS_KEY, INITIAL_CATEGORIES));
          } else {
            resolve(cats);
          }
        };
        req.onerror = () => {
          resolve(getLocalStorage<CategoryItem[]>(LOCAL_STORAGE_CATS_KEY, INITIAL_CATEGORIES));
        };
      });
    } catch {
      return getLocalStorage<CategoryItem[]>(LOCAL_STORAGE_CATS_KEY, INITIAL_CATEGORIES);
    }
  },

  async saveCategory(cat: CategoryItem): Promise<void> {
    const cats = await this.getAllCategories();
    const idx = cats.findIndex((c) => c.id === cat.id);
    let updated: CategoryItem[];
    if (idx >= 0) {
      updated = [...cats];
      updated[idx] = cat;
    } else {
      updated = [...cats, cat];
    }
    setLocalStorage(LOCAL_STORAGE_CATS_KEY, updated);
    try {
      const db = await openDB();
      const tx = db.transaction(CATEGORIES_STORE, 'readwrite');
      tx.objectStore(CATEGORIES_STORE).put(cat);
    } catch (e) {
      console.warn('IDB category save error:', e);
    }
  },

  async resetToDefault(): Promise<void> {
    setLocalStorage(LOCAL_STORAGE_NOTES_KEY, INITIAL_NOTES);
    setLocalStorage(LOCAL_STORAGE_CATS_KEY, INITIAL_CATEGORIES);
    try {
      const db = await openDB();
      const tx = db.transaction([NOTES_STORE, CATEGORIES_STORE], 'readwrite');
      const noteStore = tx.objectStore(NOTES_STORE);
      const catStore = tx.objectStore(CATEGORIES_STORE);
      noteStore.clear();
      catStore.clear();
      INITIAL_NOTES.forEach((n) => noteStore.put(n));
      INITIAL_CATEGORIES.forEach((c) => catStore.put(c));
    } catch (e) {
      console.warn('IDB reset error:', e);
    }
  },

  async importData(data: { notes: Note[]; categories?: CategoryItem[] }): Promise<void> {
    if (Array.isArray(data.notes)) {
      setLocalStorage(LOCAL_STORAGE_NOTES_KEY, data.notes);
      if (data.categories) {
        setLocalStorage(LOCAL_STORAGE_CATS_KEY, data.categories);
      }
      try {
        const db = await openDB();
        const tx = db.transaction([NOTES_STORE, CATEGORIES_STORE], 'readwrite');
        const noteStore = tx.objectStore(NOTES_STORE);
        noteStore.clear();
        data.notes.forEach((n) => noteStore.put(n));
        if (data.categories) {
          const catStore = tx.objectStore(CATEGORIES_STORE);
          catStore.clear();
          data.categories.forEach((c) => catStore.put(c));
        }
      } catch (e) {
        console.warn('IDB import error:', e);
      }
    }
  },

  getLastSyncTime(): string {
    return getLocalStorage<string>(LOCAL_STORAGE_META_KEY + '_last_sync', 'منذ 5 دقائق');
  },

  setLastSyncTime(display: string): void {
    setLocalStorage<string>(LOCAL_STORAGE_META_KEY + '_last_sync', display);
  },
};
