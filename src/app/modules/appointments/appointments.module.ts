import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { TimeGridComponent } from './components/time-grid/time-grid.component';
import { ViewAppointmentComponent } from './components/view-appointment/view-appointment.component';
import { AppointmentsCalenderNewComponent } from './pages/appointments-calender-new/appointments-calender-new.component';


@NgModule({
  declarations: [
    AppointmentFormComponent,
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
