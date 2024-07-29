import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';
import { AppointmentsCalenderComponent } from './appointments-calender/appointments-calender.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfirmTimechangeComponent } from './confirm-timechange/confirm-timechange.component';


@NgModule({
  declarations: [
    AppointmentFormComponent,
    AppointmentsCalenderComponent,
    ConfirmTimechangeComponent
  ],
  imports: [
    CommonModule,
    AppointmentsRoutingModule,
    SharedModule
  ]
})
export class AppointmentsModule { }
