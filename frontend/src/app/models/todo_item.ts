import { Priority } from "./priority";

export interface TodoItem {
  id: number;
  title: string;
  done: boolean;
  priority: Priority;
  createdAt: string;
  dueAt: string | null;
}
