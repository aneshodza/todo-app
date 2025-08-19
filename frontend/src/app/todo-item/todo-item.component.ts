import { Component, Input } from "@angular/core";
import { MatListModule } from "@angular/material/list";
import { TodoItem } from "@models";
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

  onDoneChange(event: MatCheckboxChange, todo: TodoItem) {
    todo.done = event.checked
    console.log(event.checked, todo.title)
  }
}
