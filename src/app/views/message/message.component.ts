import { Component, OnInit } from '@angular/core';
import { LoginPublisher } from 'src/app/service/login-publisher.service';
import { Usuario } from 'src/app/model/usuario';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { FacadeService } from 'src/app/service/facade.service';
import { Message } from 'src/app/model/message';
import { MessageCreate } from 'src/app/model/messageCreate';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  filterFields: string[] = ['Título', 'Contéudo'];
  filterField: string = '';
  filterMensagem: Message[] = [];
  displayedColumns: string[] = ['title', 'description'];
  usuarioLogado: Usuario = null;
  usuarios: Usuario[] = [];
  loaded: boolean = false;
  messages: Message[] = [];
  flagShowPopup = false;
  messagePopup: Message = null;
  flagShowPopupCreate = false;
  messagePopupCreate: MessageCreate = null;
  messageCreateErase: MessageCreate = {
    title: '',
    description: '',
    userIdOrigin: 0,
    userIdDestination: 0
  }


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
    this.getMessages();
    this.getUsuarios();
    this.loaded = true;
  }

  async getMessages() {
    await this.facadeService.readForUser("message", this.usuarioLogado.id).subscribe(r => {
      this.messages = r.map(m => {
          m.dateTime = this.formatDate(m.dateTime);
          return m;
      }).sort((a,b) => a.id - b.id).reverse();
      this.filterMensagem = this.messages;
    });
  }

  async getUsuarios() {
    await this.facadeService.read("usuario").subscribe(r => {
      this.usuarios = r.filter(u =>
        (this.usuarioLogado.isTeacher && u.id !== this.usuarioLogado.id) || 
        (!this.usuarioLogado.isTeacher && u.id !== this.usuarioLogado.id && u.isTeacher)
      ).sort((a,b) => a.id - b.id).reverse();
    });
  }

  formatDate(dateTime: string): string {
    const elements = dateTime.split(/[T|.]/);
    const dateElements = elements[0].split("-");
    const hourElements = elements[1].split(":");
    return `${dateElements.reverse().join("/")} ${hourElements[0]}:${hourElements[1]}`;
  }

  createMessage(buttonSalvar: MatButton, buttonCancelar: MatButton):void{
    if (this.usuarioLogado !== null){
      if(this.messagePopupCreate.title != '' && this.messagePopupCreate.description != '' &&
        this.messagePopupCreate.userIdOrigin != 0 && this.messagePopupCreate.userIdDestination != 0) {
        
        buttonSalvar.disabled = true;
        buttonCancelar.disabled = true;

        this.facadeService.create("message",this.messagePopupCreate).subscribe((messageSave)=>{
          this.getMessages();
          this.flagShowPopupCreate = false;
          this.facadeService.showMessage("message","Mensagem Cadastrada!");
        })

      } else {
        this.facadeService.showMessage("message","Preencha todos os campos!")
      }
    } else{
      this.facadeService.showMessage("message","Você não Possui Privilégios!")
    }
  }

  search(input: HTMLInputElement) {
    const searchText = input.value;
    this.filterMensagem = this.messages.filter(message => {

      let listaNulls = ['telephone'];
      return Object.keys(message).filter(key => {
        if(message[key] != undefined) {
          const validText = message[key].toString().toLowerCase().includes(searchText.toLowerCase());
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

  showPopUp(): void {
    this.flagShowPopupCreate = !this.flagShowPopupCreate;
    this.messagePopupCreate = <MessageCreate> JSON.parse( JSON.stringify(this.messageCreateErase) );
    this.messagePopupCreate.userIdOrigin = this.usuarioLogado.id;
  }

  changePopUp(message: Message): void {
    this.messagePopup = message;
    this.flagShowPopup = !this.flagShowPopup;
  }

  changePopUpCreate(messageCreate: MessageCreate): void {
    this.messagePopupCreate = messageCreate;    
    this.flagShowPopupCreate = !this.flagShowPopupCreate;
  }

  clickPoUp(event: Event, popUp: HTMLDivElement) {
    if(event.target === popUp) {
      this.changePopUp(null);
    }
  }

  clickPoUpCreate(event: Event, popUp: HTMLDivElement) {
    if(event.target === popUp) {
      this.changePopUpCreate(null);
    }
  }
}
