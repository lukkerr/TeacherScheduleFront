import { Component, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { LoginPublisher } from 'src/app/service/login-publisher.service';
import { Usuario } from 'src/app/model/usuario';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/service/facade.service';
import { CalendarEvent } from 'angular-calendar';
import { Schedule } from 'src/app/model/schedule';
import { ScheduleCreate } from 'src/app/model/scheduleCreate';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  usuarioLogado: Usuario = null;
  loaded: boolean = false;
  viewDate: Date = new Date();
  flagTurno: string = (new Date()).getHours() <= 11 ? "0" : "1";
  schedules: Schedule[] = [];
  teachers: Usuario[] = [];
  students: Usuario[] = [];
  events : CalendarEvent[] = [];
  hours: Object = { "0": [7,11], "1": [13,17] }
  flagShowPopup = false;
  flagShowConfirm = false;
  popUpMode = null;
  schedule: Schedule|ScheduleCreate = null;
  eraseScheduleEdit: Schedule = {
    id: null,
    subject: null,
    teacher: null,
    dateTimeBegin: null,
    students: [],
    dateTimeEnd: null,
    description: null
  };
  eraseScheduleCreate: ScheduleCreate = {
    subject: null,
    idTeacher: null,
    dateTimeBegin: null,
    dateTimeEnd: null,
    description: null
  }
  studentsAdd: Usuario[] = [];

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
    await this.getSchedules();
    await this.getTeachers();
    await this.getStudents();
    this.loaded = true;
  }

  showPopUp(mode: String, schedule: Schedule|ScheduleCreate): void {
    this.flagShowPopup = !this.flagShowPopup;
    if(!this.flagShowPopup)
      this.flagShowConfirm = false;

    this.popUpMode = mode;
    this.schedule = JSON.parse( JSON.stringify(schedule) );
    if(mode === "edit") {
      const scheduleEdit = <Schedule> JSON.parse( JSON.stringify(schedule) );
      this.studentsAdd = this.students.map(s => {
        s.addList = scheduleEdit.students.filter(st => st.id === s.id).length > 0;
        return s;
      });
    }
  }

  clickPoUp(event: Event, popUp: HTMLDivElement) {
    if(event.target === popUp) {
      this.showPopUp(null, this.eraseScheduleEdit);
    }
  }

  clickConfirm(event: Event, popUp: HTMLDivElement) {
    if(event.target === popUp) {
      this.closeConfirm();
    }
  }

  openConfirm(): void {
    this.flagShowConfirm = true;
  }

  closeConfirm(): void {
    this.flagShowConfirm = false;
  }

  async getSchedules(): Promise<void> {
    await this.facadeService.read("schedule").subscribe(r => {
      this.schedules = r.filter(s =>
        (this.usuarioLogado.isTeacher && s.teacher.id === this.usuarioLogado.id) ||
        (!this.usuarioLogado.isTeacher && s.students.filter(st => st.id === this.usuarioLogado.id).length > 0)
      ).sort((a,b) => a.id - b.id).reverse();

      this.events = this.schedules.map(s => {
        return {
          start: new Date(s.dateTimeBegin),
          end: new Date(s.dateTimeEnd),
          title: "",
          // title: s.description,
          actions: [{
            label: `${s.subject} | ${s.teacher.name}`,
            onClick: ({ event }: { event: CalendarEvent }): void => {
              if(this.usuarioLogado.isTeacher)
                this.showPopUp('edit', s);
            }
          }]
        }
      });
    });
  }

  async getTeachers(): Promise<void> {
    this.facadeService.read("usuario").subscribe(r => {
      this.teachers = r.filter(t => t.isTeacher).sort((a,b) => a.id - b.id).reverse();
    });
  }

  async getStudents(): Promise<void> {
    this.facadeService.read("usuario").subscribe(r => {
      this.students = r.filter(t => !t.isTeacher).sort((a,b) => a.id - b.id).reverse();
    });
  }

  getSegundaFeira() : Date {
    let date = new Date();
    date.setDate(date.getDate() - (date.getDay() - (6 - date.getDay())));
    return date;
  }

  dateChanged(eventDate: string, type: string): Date | null {
    const newDate = !!eventDate ? new Date(eventDate) : null;
    if (newDate && type === 'begin')
      this.schedule.dateTimeBegin = newDate.toISOString();
    else if(newDate)
      this.schedule.dateTimeEnd = newDate.toISOString();
    
    return newDate;
  }

  
  saveSchedule(buttonSalvar: MatButton, buttonCancelar: MatButton): void {
    if (this.usuarioLogado !== null && this.usuarioLogado.isTeacher) {

      let condictions: boolean[] = [];

      if(!Object.keys(this.schedule).includes("id")) {
        const schedule: ScheduleCreate = <ScheduleCreate> this.schedule
        
        condictions.push(schedule.subject && schedule.subject.trim().length > 0);
        condictions.push(schedule.idTeacher != null && schedule.idTeacher != undefined);
        condictions.push(schedule.dateTimeBegin && schedule.dateTimeBegin.trim().length > 0);
        condictions.push(schedule.dateTimeEnd && schedule.dateTimeEnd.trim().length > 0);
        condictions.push(schedule.description && schedule.description.trim().length > 0);

        if(condictions.filter(c => !c).length === 0) {

          buttonSalvar.disabled = true;
          buttonCancelar.disabled = true;

          this.facadeService.create("schedule", schedule).subscribe(()=>{
            this.facadeService.showMessage("schedule","Horário Cadastrado!");
            this.updateLogado();
            this.showPopUp(null, this.eraseScheduleEdit);
          });

        } else {
          this.facadeService.showMessage("usuario","Preencha todos os campos!");
        }

      } else {
        const schedule: Schedule = <Schedule> this.schedule

        condictions.push(schedule.subject && schedule.subject.trim().length > 0);
        condictions.push(schedule.teacher != null && schedule.teacher != undefined);
        condictions.push(schedule.dateTimeBegin && schedule.dateTimeBegin.trim().length > 0);
        condictions.push(schedule.dateTimeEnd && schedule.dateTimeEnd.trim().length > 0);
        condictions.push(schedule.description && schedule.description.trim().length > 0);

        if(condictions.filter(c => !c).length === 0) {

          buttonSalvar.disabled = true;
          buttonCancelar.disabled = true;

          schedule.students = <Usuario[]> JSON.parse( JSON.stringify( this.studentsAdd.filter(s => s.addList) ) );
          schedule.students = schedule.students.map(s => {
            delete s.addList;
            return s;
          });

          this.facadeService.update("schedule", schedule).subscribe(()=>{
            this.facadeService.showMessage("schedule","Horário Atualizado!");
            this.updateLogado();
            this.showPopUp(null, this.eraseScheduleEdit);
          });

        } else {
          this.facadeService.showMessage("usuario","Preencha todos os campos!");
        }
      }
    } else
      this.facadeService.showMessage("usuario","Você não Possui Privilégios!")
  }

  eraseSchedule(): void {
    this.facadeService.delete("schedule",this.schedule).subscribe(()=>{
      this.facadeService.showMessage("schedule","Horário Removido!");
      this.updateLogado();
      this.showPopUp(null, this.eraseScheduleEdit);
    });
  }
}
