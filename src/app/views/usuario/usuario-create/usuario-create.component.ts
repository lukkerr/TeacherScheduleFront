import { Component, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Usuario } from "../../../model/usuario";
import { Router } from "@angular/router";
import { LoginPublisher } from "../../../service/login-publisher.service";
import { FacadeService } from 'src/app/service/facade.service';

@Component({
  selector: 'app-usuario-create',
  templateUrl: './usuario-create.component.html',
  styleUrls: ['./usuario-create.component.scss']
})
export class UsuarioCreateComponent implements OnInit {

  filterFields: string[] = ['Id', 'CPF', 'Nome', 'Matrícula', 'E-mail', 'Professor', 'Telefone'];
  filterField: string = '';
  filterUsuario: Usuario[] = [];
  usuarios: Usuario[] = [];
  flagShowPopup = false;
  flagShowConfirm = false;
  displayedColumns: string[] = ['id', 'cpf', 'name', 'registration', 'email', 'isTeacher', 'telephone'];
  usuario: Usuario = null;
  eraseUsuario: Usuario = {
    name:'',
    cpf:'',
    registration:'',
    password:'',
    email: '',
    telephone: '',
    isTeacher: false,
  };
  usuarioLogado: Usuario = null;
  loaded: boolean = false;
  popUpMode = null;

  constructor(private facadeService: FacadeService, private router: Router, private loginPublisher: LoginPublisher) { }

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
    this.getUsuarios();
    this.loaded = true;
  }

  showPopUp(mode: String, usuario: Usuario): void {
    this.flagShowPopup = !this.flagShowPopup;
    if(!this.flagShowPopup)
      this.flagShowConfirm = false;

    this.popUpMode = mode;
    this.usuario = <Usuario> JSON.parse( JSON.stringify(usuario) );
  }

  async getUsuarios() {
    this.facadeService.read("usuario").subscribe((usuarios: Usuario[]) => {
      this.usuarios = usuarios;
      this.filterUsuario = usuarios;
    });

  }

  saveUser(buttonSalvar: MatButton, buttonCancelar: MatButton):void{
    if (this.usuarioLogado !== null && this.usuarioLogado.isTeacher){
      if(this.usuario.name.trim() !== '' && this.usuario.cpf.trim() !== '' &&
        this.usuario.registration.trim() !== '' && this.usuario.password.trim() !== '' &&
        this.usuario.telephone.trim() !== '' && this.usuario.email.trim() !== ''){

        this.usuario.name = this.usuario.name.trim();
        this.usuario.cpf = this.usuario.cpf.trim();
        this.usuario.registration = this.usuario.registration.trim();
        this.usuario.password = this.usuario.password.trim();
        this.usuario.telephone = this.usuario.telephone.trim();
        this.usuario.email = this.usuario.email.trim();

        buttonSalvar.disabled = true;
        buttonCancelar.disabled = true;

        if(this.usuario.id) {
          this.facadeService.update("usuario",this.usuario).subscribe(()=>{
            this.facadeService.showMessage("usuario","Usuário Atualizado!");
            this.getUsuarios();
            this.showPopUp(null, this.eraseUsuario);
          });
        } else {
          this.facadeService.create("usuario",this.usuario).subscribe((user)=>{
            if(user) {
              this.facadeService.showMessage("usuario","Usuário Cadastrado!");
              this.getUsuarios();
              this.showPopUp(null, this.eraseUsuario);  
            } else {
              this.facadeService.showMessage("usuario","Erro: CPF ou Email já utilizados por outro usuário.");
            }
          });
        }
      } else {
        this.facadeService.showMessage("usuario","Preencha todos os campos!");
      }
    } else
      this.facadeService.showMessage("usuario","Você não Possui Privilégios!")
  }

  eraseUser(): void {
    this.facadeService.delete("usuario",this.usuario).subscribe(()=>{
      this.facadeService.showMessage("usuario","Usuário Removido!");
      this.getUsuarios();
      this.showPopUp(null, this.eraseUsuario);
    });
  }

  openConfirm(): void {
    this.flagShowConfirm = true;
  }

  closeConfirm(): void {
    this.flagShowConfirm = false;
  }

  cancelCadastro():void{
    this.router.navigate(['login'])
  }

  search(input: HTMLInputElement) {
    const searchText = input.value;
    this.filterUsuario = this.usuarios.filter(usuario => {

      let listaNulls = ['telephone'];
      return Object.keys(usuario).filter(key => {
        if(key === "isTeacher" && usuario[key] != undefined) {
          const validText = usuario[key] && "sim".includes(searchText.toLowerCase()) ||
            !usuario[key] &&  "não".includes(searchText.toLowerCase()) ||
            !usuario[key] &&  "nao".includes(searchText.toLowerCase());

            return validText && this.filterField === key || validText && this.filterField === "";
        } else if(usuario[key] != undefined) {
          const validText = usuario[key].toString().toLowerCase().includes(searchText.toLowerCase());
          return validText && this.filterField === key || validText && this.filterField === "";
        } else if(listaNulls.includes(key)) {
          const validText = "-".includes(searchText.toLowerCase());
          return validText && this.filterField === key || validText && this.filterField === "";
        } else {
          return false;
        }
      }).length > 0;

    });
  }

  clickPoUp(event: Event, popUp: HTMLDivElement) {
    if(event.target === popUp) {
      this.showPopUp(null, this.eraseUsuario);
    }
  }

  clickConfirm(event: Event, popUp: HTMLDivElement) {
    if(event.target === popUp) {
      this.closeConfirm();
    }
  }

}
