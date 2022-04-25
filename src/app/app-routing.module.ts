import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { UsuarioCreateComponent } from './views/usuario/usuario-create/usuario-create.component';
import { LoginComponent } from './views/login/login.component';
import { ScheduleComponent } from './views/schedule/schedule.component';
import { MessageComponent } from './views/message/message.component';

const routes: Routes = [
  {
    path:"",
    component: HomeComponent
  },
  {
    path:"usuario",
    component: UsuarioCreateComponent
  },
  {
    path:"login",
    component: LoginComponent
  },
  {
    path:"horario",
    component: ScheduleComponent
  },
  {
    path:"mensagem",
    component: MessageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
