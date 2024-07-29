import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsCalenderComponent } from './appointments-calender/appointments-calender.component';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';

const routes: Routes = [
  {
    path: '',
    component : AppointmentsCalenderComponent    
  },
  {
    path: 'create',
    component : AppointmentFormComponent
  },
  {
    path: 'edit/:id',
    component : AppointmentFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsRoutingModule { }
