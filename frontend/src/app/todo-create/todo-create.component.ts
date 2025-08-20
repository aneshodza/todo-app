import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Priority, TodoItem } from '@models';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TodoService } from 'app/services/todo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo-create',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatSelectModule,
    MatDatepickerModule
  ],
  templateUrl: './todo-create.component.html',
  styleUrl: './todo-create.component.scss'
})

export class TodoCreateComponent {
  todoForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    priority: new FormControl('', [Validators.required]),
    dueAt: new FormControl<Date | null>(null),
  });
  serverError = null
  priorities = Object.values(Priority) as Priority[];
  todo = inject(TodoService);
  router = inject(Router);

  submit() {
    const { title, priority, dueAt } = this.todoForm.value;

    if (this.todoForm.invalid) return;

    this.todo.create(title!, priority!, dueAt ?? null).subscribe({
      next: (_res: TodoItem) => this.router.navigateByUrl('/todos', { replaceUrl: true }),
      error: (err) => this.serverError = err.error.message,
    })
  }
}

