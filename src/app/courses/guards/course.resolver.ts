import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Course } from '../model/course';
import { inject } from '@angular/core';
import { CoursesService } from '../services/courses.service';

export const courseResolver: ResolveFn<Observable<Course>> = (
  route,
  state,
  service: CoursesService = inject(CoursesService)
) => {
  if (route.params?.['id']) {
    return service.loadById(route.params['id']);
  }
  return of({ id: Number(''), name: '', category: '', lessons: [] });
};
