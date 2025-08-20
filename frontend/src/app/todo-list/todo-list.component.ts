import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoItemComponent } from 'app/todo-item/todo-item.component';
import { MatListModule } from '@angular/material/list';
import { TodoService } from 'app/services/todo.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { DoneChange } from '@models';

@Component({
  selector: 'app-root',
  imports: [TodoItemComponent, MatListModule, CommonModule, MatProgressSpinnerModule, MatButtonModule, RouterLink],
  standalone: true,
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})

export class TodoListComponent {
  title: string = 'Your TODOs';
  todoService = inject(TodoService)

  todos$ = this.todoService.index();
  doneChanges: DoneChange[] = []
  pushDoneChangesDebounce?: ReturnType<typeof setTimeout>;

  collectDoneChanges(event: DoneChange) {
    const index = this.doneChanges.findIndex(change => change.id === event.id)
    if (index > -1) {
      this.doneChanges.splice(index, 1)
    } else {
      this.doneChanges.push(event)
    }

    clearTimeout(this.pushDoneChangesDebounce)
    this.pushDoneChangesDebounce = setTimeout(() => this.pushDoneChanges(), 1000)
  }

  pushDoneChanges() {
    if (this.doneChanges.length === 0) return

    this.todoService
      .markDone(this.doneChanges)
      .subscribe({ next: () => {}, error: e => console.error(e) });
    this.doneChanges = []
  }
}

