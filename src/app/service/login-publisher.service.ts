import { Injectable } from '@angular/core';
import { Usuario } from "../model/usuario";
import { Login } from "../model/login";
import { first } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: 'root'
})
export class LoginPublisher {

  private usuarioLogado: Usuario = null;
  private subscribers: any[] = [];

  baseUrl = `${environment.api}/login`;


  constructor(private snackBar: MatSnackBar ,private http: HttpClient) { }


  showMessage(msg: string):void{
    this.snackBar.open(msg,'X', {duration:3000,
      horizontalPosition:"center",
      verticalPosition:"top"})
  }

  async fazerLogin(login: Login): Promise<boolean>{
    const logado: Usuario = await this.http.post<Usuario>(this.baseUrl, login).pipe(first()).toPromise();
    if(logado != null && Object.values(logado).filter(i => i !== null).length > 0) {
      localStorage.setItem("usuarioLogado", JSON.stringify(login));
      this.usuarioLogado = logado;
    }

    this.notifySubscribers();
    return this.usuarioLogado !== null;
  }

  async verificaLogin(subscriber: any): Promise<void> {
    if(this.usuarioLogado === null) {
      const userStorage = localStorage.getItem("usuarioLogado");
      if(userStorage !== null) {
        await this.fazerLogin( <Login> JSON.parse(userStorage) );
        if(!this.usuarioLogado)
          localStorage.removeItem("usuarioLogado");
      }
    }

    this.notifySubscriber(subscriber);
  }

  logout(): void {
    this.usuarioLogado = null;
    localStorage.removeItem("usuarioLogado");
    this.notifySubscribers();
  }

  addSubscriber(subscriber: any) {
    this.subscribers.push(subscriber);
    subscriber.updateSubscriber(this.usuarioLogado);
  }

  removeSubscriber(subscriber: any) {
    this.subscribers.filter(sub => sub !== subscriber);
  }

  notifySubscriber(subscriber: any) {
    subscriber.updateSubscriber(this.usuarioLogado);
  }

  notifySubscribers() {
    this.subscribers.forEach( s => s.updateSubscriber(this.usuarioLogado) );
  }

}

