import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoItemComponent } from 'app/todo-item/todo-item.component';
import { MatListModule } from '@angular/material/list';
import { TodoService } from 'app/services/todo.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  imports: [TodoItemComponent, MatListModule, CommonModule, MatProgressSpinnerModule],
  standalone: true,
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})

export class TodoListComponent {
  title: string = 'Your TODOs';
  todoService = inject(TodoService)

  todos$ = this.todoService.index();
}

