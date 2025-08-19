export interface TodoItem {
  id: number;
  title: string;
  done: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  dueAt: Date | null;
}
