import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppointmentState, appointmentState_key } from "./appointments.state";

const featureSelector = createFeatureSelector<AppointmentState>(appointmentState_key);

export const selectAppointments = createSelector(
    featureSelector,
    (stateObj: AppointmentState) => {
      if (!stateObj.scheduledAppointments) return null;
      return stateObj.scheduledAppointments;
    }
);
  
export const selectAppointmentById = createSelector(
  featureSelector,
  (stateObj: AppointmentState,params:{id:number}) => {
    if (!stateObj.scheduledAppointments) return null;
    return stateObj.scheduledAppointments.find(item=> item.id == params['id']);
  }
);
