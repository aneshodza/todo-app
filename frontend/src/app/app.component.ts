import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoItem } from '@models';
import { TodoItemComponent } from 'app/todo-item/todo-item.component';
import { MatListModule } from '@angular/material/list';

const inDays = (d: number) => new Date(Date.now() + d * 86_400_000);

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, TodoItemComponent, MatListModule],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title: string = 'Your TODOs';
  todos: TodoItem[] = [
    { id: 1, title: 'Buy Apples', done: false, priority: 'medium', createdAt: new Date(), dueAt: inDays(-0.1)},
    { id: 2, title: 'Pick up parents from Airport', done: false, priority: 'high', createdAt: new Date(), dueAt: inDays(2)},
    { id: 3, title: 'Buy a new bike', done: true, priority: 'low', createdAt: new Date(), dueAt: null }
  ]
}
