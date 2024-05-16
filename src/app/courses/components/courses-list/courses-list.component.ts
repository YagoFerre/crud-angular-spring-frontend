import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Course } from '../../model/course';

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.scss'],
})
export class CoursesListComponent implements OnInit {
  @Input() courses: Course[] = [];
  @Output() add = new EventEmitter(false);
  @Output() edit = new EventEmitter(false);
  @Output() remove = new EventEmitter(false);

  constructor() {}

  readonly displayedColumns = ['name', 'category', 'actions'];

  onAdd() {
    this.add.emit(true);
  }

  onEdit(id: number) {
    this.edit.emit(id);
  }

  onDelete(id: number) {
    this.remove.emit(id);
  }

  ngOnInit(): void {}
}
