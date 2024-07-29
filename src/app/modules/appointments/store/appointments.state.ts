import { Appointment } from "src/app/models/appointment.interfaces"
import { defaultAppointments } from "src/app/models/default-appointments";

export const appointmentState_key = 'appointments';
export interface AppointmentState{
    scheduledAppointments : Appointment[],
}
export const appointmentState: AppointmentState = {
    scheduledAppointments : [...defaultAppointments]
}