
import { appointmentsReducer } from "src/app/modules/appointments/store/appointments.reducer";
import { appointmentState_key } from './../app/modules/appointments/store/appointments.state';
import { ActionReducerMap } from "@ngrx/store";

export const appReducer:ActionReducerMap<any> = {
    [appointmentState_key] : appointmentsReducer
}