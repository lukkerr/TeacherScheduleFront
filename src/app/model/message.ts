import { Usuario } from "./usuario";

export interface Message {
  id?: number,
  userIdOrigin: Usuario,
  userIdDestination: Usuario,
  dateTime: string,
  title: string,
  description: string,
  read: boolean
}