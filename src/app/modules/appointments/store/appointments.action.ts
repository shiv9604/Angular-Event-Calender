import { createAction, props } from "@ngrx/store";
import { Appointment } from "src/app/models/appointment.interfaces";

export enum AppointmentActionTypes {
  BookAppointment = '[Appointment] Set Appointment',
  DeleteAppointment = '[Appointment] Delete Appointment',
  UpdateAppointment = '[Appointment] Update Appointment',
  UpdateMultipleAppointments = '[Appointments] Update Multiple Appointments',
}

export const bookAppointment = createAction(AppointmentActionTypes.BookAppointment, props<{ data: Appointment }>());
export const deleteAppointment = createAction(AppointmentActionTypes.DeleteAppointment, props<{ id: number }>());
export const updateAppointment = createAction(AppointmentActionTypes.UpdateAppointment, props<{ data: Appointment }>());
export const updateMultipleAppointments = createAction(AppointmentActionTypes.UpdateMultipleAppointments, props<{ data: Appointment[] }>());

// Export a union type of all action classes
export type AppointmentActions = typeof bookAppointment | typeof deleteAppointment | typeof updateAppointment | typeof updateMultipleAppointments;