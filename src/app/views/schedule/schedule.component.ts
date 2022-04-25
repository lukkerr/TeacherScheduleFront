import { Component, OnInit } from '@angular/core';
import { LoginPublisher } from 'src/app/service/login-publisher.service';
import { Usuario } from 'src/app/model/usuario';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/service/facade.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  usuarioLogado: Usuario = null;
  loaded: boolean = false;

  constructor(private facadeService: FacadeService, private loginPublisher: LoginPublisher, private router: Router) { }

  ngOnInit(): void {
    this.loginPublisher.addSubscriber(this);
    this.loginPublisher.verificaLogin(this);
  }

  updateSubscriber(usuarioLogado: Usuario) {
    this.usuarioLogado = usuarioLogado;
    if(usuarioLogado)
      this.updateLogado();
    else
      this.router.navigate(['login']);
  }

  async updateLogado() {
    this.loaded = true;
  }
}
