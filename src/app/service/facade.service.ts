import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UsuarioService } from "./usuario.service";
import { MessageService } from "./message.service";
import { ScheduleService } from "./schedule.service";

@Injectable({
  providedIn:'root'
})

export class FacadeService {

  constructor(private usuarioService: UsuarioService,
              private messageService: MessageService,
              private scheduleService: ScheduleService) {}

  private services = {
    "usuario": this.usuarioService,
    "message": this.messageService,
    "schedule": this.scheduleService,
  }

  create(tipo: string, newObject: any): Observable<any> {
    return this.services[tipo].create(newObject);
  };

  update(tipo: string, newObject: any): Observable<any> {
    return this.services[tipo].update(newObject);
  };

  delete(tipo: string, newObject: any): Observable<any> {
    return this.services[tipo].delete(newObject);
  };

  read(tipo: string):Observable<any[]> {
    return this.services[tipo].read();
  }

  readById(tipo: string, id:string) : Observable<any> {
    return this.services[tipo].readById(id);
  }

  readForUser(tipo: string, idUser: number): Observable<any[]> {
    return this.services[tipo].readForUser(idUser);
  }

  showMessage(tipo: string, message: string): Observable<any> {
    return this.services[tipo].showMessage(message);
  }
}
