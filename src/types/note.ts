export type NoteColor = 'yellow' | 'lavender' | 'mint' | 'peach' | 'sky' | 'rose' | 'default';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  assignedTo?: string;
  subtitle?: string;
}

export interface Attachment {
  id: string;
  type: 'image' | 'audio' | 'file';
  url: string;
  title?: string;
  duration?: string;
  alt?: string;
}

export interface NoteReminder {
  enabled: boolean;
  pinToStatusBar: boolean;
  scheduledTime?: string; // e.g. "18:00"
  scheduledDate?: string; // e.g. "2025-05-15"
  countdownMinutes?: number;
  repeatingDailyTimes?: string[]; // e.g. ["09:00", "14:00", "18:00"]
  lastNotificationText?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string; // Markdown / raw text
  category: string; // e.g. "العمل"
  subCategory?: string; // e.g. "مشاريع 2025"
  tags: string[]; // e.g. ["#مهم", "#تصميم"]
  color: NoteColor;
  isPinned: boolean;
  updatedAt: string; // ISO string or display string
  createdAt: string;
  checklists?: ChecklistItem[];
  attachments?: Attachment[];
  reminder?: NoteReminder;
  quote?: {
    text: string;
    source: string;
  };
}

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  count: number;
  subcategories: {
    id: string;
    name: string;
    count: number;
  }[];
}
