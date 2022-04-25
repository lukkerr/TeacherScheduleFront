import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Usuario } from "../model/usuario";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment"
import { catchError } from "rxjs/operators";
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

  baseUrl = `${environment.api}/user`;

  constructor(private snackBar: MatSnackBar, private http: HttpClient) {
  }

  showMessage(msg: string):void {
    this.snackBar.open(msg,'X', {duration:3000,
                                              horizontalPosition:"right",
                                              verticalPosition:"top"})
  }

  create(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.baseUrl, usuario).pipe(catchError(e => {
      this.showMessage(e.errorMessage);
      return of<Usuario>();
    }));
  }

  update(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/${usuario.id}`, usuario).pipe(catchError(e => {
      this.showMessage(e.errorMessage);
      return of<Usuario>();
    }));
  }

  delete(usuario: Usuario): Observable<Usuario> {
    return this.http.delete<Usuario>(`${this.baseUrl}/${usuario.id}`).pipe(catchError(e => {
      this.showMessage(e.errorMessage);
      return of<Usuario>();
    }));
  }

  read(): Observable<Usuario[]> { 
    return this.http.get<Usuario[]>(this.baseUrl).pipe(catchError(e => {
      this.showMessage(e.errorMessage);
      return of<Usuario[]>();
    }));
  }

  readById(id:string | null): Observable<Usuario> {
    const url = `${this.baseUrl}/${id}}`
    return this.http.get<Usuario>(url).pipe(catchError(e => {
      this.showMessage(e.errorMessage);
      return of<Usuario>();
    }));
  }

  readForUser(idUser: number) : Observable<Usuario[]> {
    return null;
  }

}
