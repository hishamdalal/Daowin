import { dbService } from './db';
import { Note, CategoryItem } from '../types/note';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'offline' | 'error';

export interface SyncState {
  status: SyncStatus;
  isOnline: boolean;
  lastSyncedText: string;
  pendingCount: number;
}

type SyncListener = (state: SyncState) => void;

class SyncService {
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private status: SyncStatus = 'idle';
  private lastSyncedText: string = dbService.getLastSyncTime();
  private pendingCount: number = 0;
  private listeners: Set<SyncListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.notify();
        this.syncNow();
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
        this.status = 'offline';
        this.notify();
      });

      // Initial auto-sync after a brief moment to let DB initialize
      setTimeout(() => {
        this.syncNow();
      }, 800);
    }
  }

  getState(): SyncState {
    return {
      status: this.status,
      isOnline: this.isOnline,
      lastSyncedText: this.lastSyncedText,
      pendingCount: this.pendingCount,
    };
  }

  subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }

  markMutation() {
    this.pendingCount += 1;
    this.notify();
    if (this.isOnline) {
      this.syncNow();
    }
  }

  async syncNow(): Promise<boolean> {
    if (!this.isOnline) {
      this.status = 'offline';
      this.notify();
      return false;
    }

    this.status = 'syncing';
    this.notify();

    return new Promise((resolve) => {
      // Simulate network round-trip & delta encryption verification
      setTimeout(() => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const syncText = `اليوم، ${hours}:${minutes}`;

        this.status = 'synced';
        this.pendingCount = 0;
        this.lastSyncedText = syncText;
        dbService.setLastSyncTime(syncText);
        this.notify();

        setTimeout(() => {
          if (this.status === 'synced') {
            this.status = 'idle';
            this.notify();
          }
        }, 3000);

        resolve(true);
      }, 900);
    });
  }

  exportData(notes: Note[], categories: CategoryItem[]): void {
    const data = {
      app: 'NoteCraft دوّن',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      notes,
      categories,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notecraft-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const syncService = new SyncService();
