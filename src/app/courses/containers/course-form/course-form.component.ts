import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  UntypedFormArray,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../../model/course';
import { Lesson } from '../../model/lesson';
import { CoursesService } from '../../services/courses.service';
import { FormUtilsService } from 'src/app/shared/form/form-utils.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss'],
})
export class CourseFormComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private service: CoursesService,
    private _snackBar: MatSnackBar,
    private location: Location,
    private route: ActivatedRoute,
    public formUtils: FormUtilsService
  ) {}

  onSubmit() {
    if (this.form.valid) {
      this.service.save(this.form.value).subscribe(
        (result) => this.onSuccess(),
        (error) => this.onError()
      );
    } else {
      this.formUtils.validateAllFormFields(this.form);
    }
  }

  onBack() {
    this.location.back();
  }

  private onSuccess() {
    this._snackBar.open('Curso salvo com sucesso!', '', { duration: 3000 });
    this.onBack();
  }

  private onError() {
    this._snackBar.open('Erro ao salvar curso.', '', { duration: 3000 });
  }

  ngOnInit(): void {
    const course: Course = this.route.snapshot.data['course'];

    this.form = this.formBuilder.group({
      id: [Number(course.id)],
      name: [
        course.name,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      category: [course.category, [Validators.required]],
      lessons: this.formBuilder.array(
        this.retrieveLessons(course),
        Validators.required
      ),
    });
  }

  private createLesson(
    lesson: Lesson = { id: Number(''), name: '', youtubeUrl: '' }
  ) {
    return this.formBuilder.group({
      id: [lesson.id],
      name: [
        lesson.name,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      youtubeUrl: [
        lesson.youtubeUrl,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(11),
        ],
      ],
    });
  }

  private retrieveLessons(course: Course) {
    const lessons = [];

    if (course?.lessons) {
      course.lessons.forEach((lesson) =>
        lessons.push(this.createLesson(lesson))
      );
    }

    if (!course?.lessons) {
      lessons.push(this.createLesson());
    }

    return lessons;
  }

  getLessonsFormArray() {
    return (<UntypedFormArray>this.form.get('lessons')).controls;
  }

  addNewLesson() {
    const lessons = this.form.get('lessons') as UntypedFormArray;

    lessons.push(this.createLesson());
  }

  removeLesson(index: number) {
    const lessons = this.form.get('lessons') as UntypedFormArray;

    lessons.removeAt(index);
  }
}
