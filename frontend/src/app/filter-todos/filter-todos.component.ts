import { Component, EventEmitter, Output } from '@angular/core';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'filter-todos',
  imports: [MatCheckbox],
  templateUrl: './filter-todos.component.html',
  styleUrl: './filter-todos.component.scss'
})
export class FilterTodosComponent {
  @Output() filterChange = new EventEmitter<void>();

  filterDone: boolean = localStorage.getItem('filterDone') === 'true'
  filterUrgent: boolean = localStorage.getItem('filterUrgent') === 'true'

  onFilterChange(event: MatCheckboxChange, key: string) {
    localStorage.setItem(key, String(event.checked));
    this.filterChange.emit();
  }
}
