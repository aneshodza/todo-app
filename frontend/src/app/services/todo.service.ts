import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DoneChange, TodoItem } from '@models';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private apiUrl = 'http://localhost:5161/api/todos';

  constructor(private http: HttpClient) {}

  index(): Observable<TodoItem[]> {
    return this.http
      .get<TodoItem[]>(`${this.apiUrl}`);
  }

  create(title: string, priority: string, dueAt: Date | null): Observable<TodoItem> {
    return this.http
      .post<TodoItem>(`${this.apiUrl}/create`, { title, priority, dueAt });
  }

  markDone(doneChanges: DoneChange[]): Observable<Object> {
    const ids = doneChanges.map(doneChange => doneChange.id)

    return this.http
      .patch(`${this.apiUrl}/toggle`, { Ids: ids })
  }
}
