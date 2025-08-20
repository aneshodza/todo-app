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
}
