import { Priority, TodoItem } from '@models';

export class TodoFactory {
  static createTodoItem(overrides: Partial<TodoItem> = {}): TodoItem {
    const id = Math.floor(Math.random() * 1000);

    return {
      id: id,
      title: `Sample Todo #${id}`,
      done: false,
      priority: Priority.Medium,
      dueAt: null,
      createdAt: new Date().toISOString(),
      ...overrides,
    };
  }

  static createTodoItems(count: number, overrides: Partial<TodoItem> = {}): TodoItem[] {
    return Array.from({ length: count }, () => this.createTodoItem(overrides));
  }
}
