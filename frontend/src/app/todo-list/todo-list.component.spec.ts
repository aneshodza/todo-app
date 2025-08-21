import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from 'app/services/todo.service';
import { BehaviorSubject, firstValueFrom, of, Subject, take } from 'rxjs';
import { Priority, TodoItem } from '@models';
import { TodoFactory } from '@testing';
import { provideRouter } from '@angular/router';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('Todo List', () => {
  let index$!: Subject<TodoItem[]>;
  let todoServiceSpy: jasmine.SpyObj<TodoService>;
  let fixture: ComponentFixture<TodoListComponent>;
  let list: TodoListComponent;

  beforeEach(async () => {
    localStorage.clear();

    index$ = new BehaviorSubject<TodoItem[]>([]);

    todoServiceSpy = jasmine.createSpyObj('TodoService', {
      index: index$.asObservable(),
      markDone: of(void 0),
      create: of(TodoFactory.createTodoItem())
    });

    await TestBed.configureTestingModule({
      imports: [TodoListComponent],
      providers: [
        provideRouter([]),
        { provide: TodoService, useValue: todoServiceSpy }
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    index$.next(TodoFactory.createTodoItems(20, { priority: Priority.Medium, done: true }))

    fixture = TestBed.createComponent(TodoListComponent);
    list = fixture.componentInstance;

    fixture.detectChanges();
  })

  it('Should create the app', () => {
    expect(list).toBeTruthy();
  });

  it('Should filter only done', async () => {
    localStorage.setItem('filterDone', 'true')
    index$.next(TodoFactory.createTodoItems(5, { done: false }))
    fixture.detectChanges()

    const out = await firstValueFrom(list.todos$.pipe(take(1)));
    expect(out.length).toBe(5);
    expect(out.every(t => !t.done)).toBeTrue();
    expect(todoServiceSpy.index).toHaveBeenCalled();
  })

  it('Should filter only urgent', async () => {
    localStorage.setItem('filterUrgent', 'true')
    index$.next(TodoFactory.createTodoItems(5, { priority: Priority.High }))

    const out = await firstValueFrom(list.todos$.pipe(take(1)));
    expect(out.length).toBe(5);
    expect(out.every(t => t.priority === Priority.High)).toBeTrue();
    expect(todoServiceSpy.index).toHaveBeenCalled();
  })

  it('Should filter only past due', async () => {
    localStorage.setItem('filterUrgent', 'true')
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    index$.next(TodoFactory.createTodoItems(5, { dueAt: yesterday.toISOString() }))

    const out = await firstValueFrom(list.todos$.pipe(take(1)));
    expect(out.length).toBe(5);
    expect(out.every(t => t.dueAt && new Date(t.dueAt) < new Date())).toBeTrue();
    expect(todoServiceSpy.index).toHaveBeenCalled();
  })

  it('Can filter even when all are applied', async () => {
    localStorage.setItem('filterDone', 'true')
    localStorage.setItem('filterUrgent', 'true')
    localStorage.setItem('filterUrgent', 'true')

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    index$.next(TodoFactory.createTodoItems(10, { done: false, dueAt: new Date().toISOString(), priority: Priority.High }))
    index$.next(TodoFactory.createTodoItems(4, { done: true, dueAt: yesterday.toISOString(), priority: Priority.High }))
    index$.next(TodoFactory.createTodoItems(6, { done: false, dueAt: yesterday.toISOString(), priority: Priority.Medium }))
    index$.next(TodoFactory.createTodoItems(3, { done: false, dueAt: yesterday.toISOString(), priority: Priority.High }))

    const out = await firstValueFrom(list.todos$.pipe(take(1)));
    expect(out.length).toBe(3);
    expect(out.every(t => !t.done && t.dueAt && new Date(t.dueAt) < new Date() && t.priority === Priority.High)).toBeTrue();
    expect(todoServiceSpy.index).toHaveBeenCalled();
  })

  it('Renders all TODOs', () => {
    const listDOM: DebugElement = fixture.debugElement;
    const todoRows = listDOM.queryAll(By.css('.item'))

    expect(todoRows.length).toBe(20)
  })

  it('Applies filter to render', async () => {
    localStorage.setItem('filterDone', 'true')
    index$.next(TodoFactory.createTodoItems(5, { done: true }))

    const listDOM: DebugElement = fixture.debugElement;
    const todoRows = listDOM.queryAll(By.css('.item'))

    expect(todoRows.length).toBe(20)
  })

  it('Has a button to create a new TODO', async () => {
    const listDOM: DebugElement = fixture.debugElement;
    const todoRows = listDOM.queryAll(By.css('a[href$="todos/create"]'))

    expect(todoRows.length).toBe(1)
  })
});
