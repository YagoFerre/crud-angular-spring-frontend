import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';
import { Course } from '../../model/course';
import { CoursesService } from '../../services/courses.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {
  courses$: Observable<Course[]> | null = null;

  constructor(
    private coursesService: CoursesService,
    private dialog: MatDialog,
    private router: Router,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    this.refresh();
  }

  refresh() {
    this.courses$ = this.coursesService.list().pipe(
      catchError(() => {
        this.onError('Erro ao carregar cursos.');
        return of([]);
      })
    );
  }

  onAdd() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onEdit(id: number) {
    this.router.navigate(['edit', id], { relativeTo: this.route });
  }

  onRemove(id: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: 'Tem certeza que deseja remover esse curso?',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (!result) {
        return;
      }

      this.coursesService.remove(id).subscribe(
        () => {
          this._snackBar.open('Curso removido com sucesso!', 'X', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });

          this.refresh();
        },
        () => this.onError('Erro ao tentar remover curso.')
      );
    });
  }

  onError(errorMessage: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: errorMessage,
    });
  }

  ngOnInit(): void {}
}
