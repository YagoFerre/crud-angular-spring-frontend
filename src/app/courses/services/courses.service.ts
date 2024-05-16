import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, first } from 'rxjs';
import { Course } from '../model/course';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private readonly baseUrl = 'api/courses';

  constructor(private httpClient: HttpClient) {}

  list(): Observable<Course[]> {
    return this.httpClient.get<Course[]>(this.baseUrl).pipe(first());
  }

  loadById(id: number): Observable<Course> {
    return this.httpClient.get<Course>(`${this.baseUrl}/${id}`).pipe(first());
  }

  save(course: Partial<Course>): Observable<Course> {
    if (course.id) {
      return this.update(course.id, course);
    }

    return this.create(course);
  }

  private create(course: Partial<Course>): Observable<Course> {
    return this.httpClient.post<Course>(this.baseUrl, course).pipe(first());
  }

  private update(id: number, course: Partial<Course>): Observable<Course> {
    return this.httpClient
      .put<Course>(`${this.baseUrl}/${id}`, course)
      .pipe(first());
  }

  remove(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`).pipe(first());
  }
}
