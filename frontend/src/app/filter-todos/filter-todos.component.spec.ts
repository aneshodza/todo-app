import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterTodosComponent } from './filter-todos.component';

describe('FilterTodosComponent', () => {
  let component: FilterTodosComponent;
  let fixture: ComponentFixture<FilterTodosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterTodosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterTodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
