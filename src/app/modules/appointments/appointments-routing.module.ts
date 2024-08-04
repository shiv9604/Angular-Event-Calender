import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';
import { AppointmentsCalenderNewComponent } from './pages/appointments-calender-new/appointments-calender-new.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'calender-new',
    pathMatch : 'full'
  },
  {
    path: 'calender-new',
    component : AppointmentsCalenderNewComponent    
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
