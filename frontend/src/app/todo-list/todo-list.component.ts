import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoItemComponent } from 'app/todo-item/todo-item.component';
import { MatListModule } from '@angular/material/list';
import { TodoService } from 'app/services/todo.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { DoneChange, Priority, TodoItem } from '@models';
import { map, Observable, shareReplay } from 'rxjs';
import { FilterTodosComponent } from 'app/filter-todos/filter-todos.component';

@Component({
  selector: 'app-root',
  imports: [
    TodoItemComponent,
    MatListModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    RouterLink,
    FilterTodosComponent,
  ],
  standalone: true,
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent {
  todoService = inject(TodoService);

  private allTodos$: Observable<TodoItem[]> = this.todoService.index().pipe(shareReplay(1));
  todos$: Observable<TodoItem[]> = this.allTodos$
  doneChanges: DoneChange[] = [];
  pushDoneChangesDebounce?: ReturnType<typeof setTimeout>;

  ngOnInit() {
    this.filter();
  }
  collectDoneChanges(event: DoneChange) {
    const index = this.doneChanges.findIndex(
      (change) => change.id === event.id,
    );
    if (index > -1) {
      this.doneChanges.splice(index, 1);
    } else {
      this.doneChanges.push(event);
    }

    clearTimeout(this.pushDoneChangesDebounce);
    this.pushDoneChangesDebounce = setTimeout(
      () => this.pushDoneChanges(),
      1000,
    );
  }

  pushDoneChanges() {
    if (this.doneChanges.length === 0) return;

    this.todoService
      .markDone(this.doneChanges)
      .subscribe({ next: () => { }, error: (e) => console.error(e) });
    this.doneChanges = [];
  }

  callFilter() {
    this.filter();
  }

  filter() {
    const filterDone: boolean = localStorage.getItem('filterDone') === 'true'
    const filterUrgent: boolean = localStorage.getItem('filterUrgent') === 'true'
    const filterPastDue: boolean = localStorage.getItem('filterPastDue') === 'true'
    this.todos$ = this.allTodos$.pipe(
      map(todos => filterDone ? todos.filter(todo => !todo.done) : todos),
      map(todos => filterUrgent? todos.filter(todo => todo.priority === Priority.High) : todos),
      map(todos => filterPastDue ? todos.filter(todo => {
        if (!todo.dueAt) return false;
        const dueDate = new Date(todo.dueAt);
        dueDate.setHours(0, 0, 0, 0);

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        return dueDate < currentDate;
      }) : todos),
    )
  }

}
