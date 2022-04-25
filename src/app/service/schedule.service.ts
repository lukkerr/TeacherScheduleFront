import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Schedule } from "../model/schedule";
import { ScheduleCreate } from "../model/scheduleCreate";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment"
import { catchError } from "rxjs/operators";
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ScheduleService {

  baseUrl = `${environment.api}/schedule`;

  constructor(private snackBar: MatSnackBar, private http: HttpClient) {
  }

  showMessage(msg: string):void {
    this.snackBar.open(msg,'X', {duration:3000,
                                              horizontalPosition:"right",
                                              verticalPosition:"top"})
  }

  create(scheduleCreate: ScheduleCreate): Observable<Schedule> {
    return this.http.post<Schedule>(this.baseUrl, scheduleCreate).pipe(catchError(e => {
      this.showMessage(e.errorMessage);
      return of<Schedule>();
    }));
  }

  update(schedule: Schedule): Observable<Schedule> {
    return this.http.put<Schedule>(`${this.baseUrl}/${schedule.id}`, schedule).pipe(catchError(e => {
      this.showMessage(e.errorMessage);
      return of<Schedule>();
    }));
  }

  delete(schedule: Schedule): Observable<Schedule> {
    return this.http.delete<Schedule>(`${this.baseUrl}/${schedule.id}`).pipe(catchError(e => {
      this.showMessage(e.errorMessage);
      return of<Schedule>();
    }));
  }

  read(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(this.baseUrl).pipe(catchError(e => {
      this.showMessage(e.errorMessage);
      return of<Schedule[]>();
    }));
  }

  readById(id:string | null): Observable<Schedule> {
    const url = `${this.baseUrl}/${id}}`
    return this.http.get<Schedule>(url).pipe(catchError(e => {
      this.showMessage(e.errorMessage);
      return of<Schedule>();
    }));
  }

  readForUser(userId: number): Observable<Schedule[]> {
    const url = `${this.baseUrl}-user/${userId}`
    return this.http.get<Schedule[]>(url).pipe(catchError(e => {
      this.showMessage(e.errorMessage);
      return of<Schedule[]>();
    }));
  }
}
