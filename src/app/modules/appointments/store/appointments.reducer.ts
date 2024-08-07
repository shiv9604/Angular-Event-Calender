import { Action, createReducer, on } from "@ngrx/store";
import { AppointmentState, appointmentState } from "./appointments.state";
import { bookAppointment, deleteAppointment, updateAppointment, updateMultipleAppointments } from "./appointments.action";

const reducer = createReducer(appointmentState,

    on(bookAppointment, (state: AppointmentState, { data }) => {
        const scheduledAppointments = state.scheduledAppointments ? [...state.scheduledAppointments, data] : [data];
        return {
            ...state,
            scheduledAppointments
        }
    }),
    on(deleteAppointment, (state: AppointmentState, { id }) => {
        const updatedAppointments = state.scheduledAppointments.filter(appointment => appointment.id !== id);
        return {
            ...state,
            scheduledAppointments: updatedAppointments
        }
    }),
    on(updateAppointment, (state: AppointmentState, { data }) => {
        const updatedAppointments = state.scheduledAppointments.map(appointment => {
            return appointment.id === data.id ? data : appointment
        });
        return {
            ...state,
            scheduledAppointments: updatedAppointments
        }
    }),
    on(updateMultipleAppointments, (state, { data }) => {
        const updatedAppointments = state.scheduledAppointments.map(appointment => {
            const updated = data.find(a => a.id === appointment.id);
            return updated ? updated : appointment;
        });
        return {
            ...state,
            scheduledAppointments: updatedAppointments
        };
    })
);

export function appointmentsReducer(state: AppointmentState, action: Action) {
    return reducer(state, action)
}