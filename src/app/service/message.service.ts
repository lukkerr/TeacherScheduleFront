import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Message } from "../model/message";
import { MessageCreate } from "../model/messageCreate";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment"
import { catchError } from "rxjs/operators";
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MessageService {

  baseUrl = `${environment.api}/message`;

  constructor(private snackBar: MatSnackBar, private http: HttpClient) {
  }

  showMessage(msg: string):void {
    this.snackBar.open(msg,'X', {duration:3000,
                                              horizontalPosition:"right",
                                              verticalPosition:"top"})
  }

  create(messageCreate: MessageCreate): Observable<Message> {
    return this.http.post<Message>(this.baseUrl, messageCreate).pipe(catchError(e => {
      this.showMessage(e.errorMessage);
      return of<Message>();
    }));
  }

  update(message: Message): Observable<Message> {
    return this.http.put<Message>(`${this.baseUrl}/${message.id}`, message).pipe(catchError(e => {
      this.showMessage(e.errorMessage);
      return of<Message>();
    }));
  }

  delete(message: Message): Observable<Message> {
    return this.http.delete<Message>(`${this.baseUrl}/${message.id}`).pipe(catchError(e => {
      this.showMessage(e.errorMessage);
      return of<Message>();
    }));
  }

  read(): Observable<Message[]> {
    return this.http.get<Message[]>(this.baseUrl).pipe(catchError(e => {
      this.showMessage(e.errorMessage);
      return of<Message[]>();
    }));
  }

  readById(id:string | null):Observable<Message> {
    const url = `${this.baseUrl}/${id}}`
    return this.http.get<Message>(url).pipe(catchError(e => {
      this.showMessage(e.errorMessage);
      return of<Message>();
    }));
  }

  readForUser(userId: number): Observable<Message[]> {
    const url = `${this.baseUrl}-user/${userId}`
    return this.http.get<Message[]>(url).pipe(catchError(e => {
      this.showMessage(e.errorMessage);
      return of<Message[]>();
    }));
  }

}
