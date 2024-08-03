import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';
import { AppointmentsCalenderComponent } from './appointments-calender/appointments-calender.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfirmTimechangeComponent } from './confirm-timechange/confirm-timechange.component';
import { AppointmentsCalenderNewComponent } from './appointments-calender-new/appointments-calender-new.component';
import { TimeGridComponent } from './components/time-grid/time-grid.component';
import { ViewAppointmentComponent } from './components/view-appointment/view-appointment.component';


@NgModule({
  declarations: [
    AppointmentFormComponent,
    AppointmentsCalenderComponent,
    ConfirmTimechangeComponent,
    AppointmentsCalenderNewComponent,
    TimeGridComponent,
    ViewAppointmentComponent
  ],
  imports: [
    CommonModule,
    AppointmentsRoutingModule,
    SharedModule
  ]
})
export class AppointmentsModule { }
