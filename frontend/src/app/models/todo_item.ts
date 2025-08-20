import { Priority } from "./priority";

export interface TodoItem {
  id: number;
  title: string;
  done: boolean;
  priority: Priority;
  createdAt: Date;
  dueAt: Date | null;
}
