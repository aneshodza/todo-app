import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatListModule } from "@angular/material/list";
import { DoneChange, TodoItem } from "@models";
import { MatCheckbox, MatCheckboxChange } from "@angular/material/checkbox";

@Component({
  selector: 'todo-item',
  standalone: true,
  imports: [MatListModule, MatCheckbox],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss'
})

export class TodoItemComponent {
  @Input() todo!: TodoItem;
  @Output() doneChangeEvent = new EventEmitter<DoneChange>();

  onDoneChange(event: MatCheckboxChange, todo: TodoItem) {
    todo.done = event.checked
    this.doneChangeEvent.emit({ id: todo.id });
  }

  pastDueAt(dueAt: string | null): boolean {
    if (dueAt === null) return false

    const dueTime = new Date(dueAt)
    dueTime.setHours(0, 0, 0, 0);

    const curTime = new Date()
    curTime.setHours(0, 0, 0, 0);
    return dueTime < curTime
  }

  parseDueAt(dueAt: string | null): string | null {
    if (dueAt === null) return null

    const dueDate = new Date(dueAt)
    const dd = String(dueDate.getDate()).padStart(2, '0');
    const mm = String(dueDate.getMonth() + 1).padStart(2, '0');
    return `${dd}.${mm}`;
  }
}
