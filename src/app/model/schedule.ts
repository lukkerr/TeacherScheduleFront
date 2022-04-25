import { Usuario } from "./usuario";

export interface Schedule {
  id?: number,
  subject: string,
  teacher: Usuario,
  students: Usuario[],
  dateTimeBegin: string,
  dateTimeEnd: string,
  description: string
}