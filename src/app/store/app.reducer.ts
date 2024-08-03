
import { appointmentsReducer } from "src/app/modules/appointments/store/appointments.reducer";
import { ActionReducerMap } from "@ngrx/store";
import { appointmentState_key } from "../modules/appointments/store/appointments.state";

export const appReducer:ActionReducerMap<any> = {
    [appointmentState_key] : appointmentsReducer
}