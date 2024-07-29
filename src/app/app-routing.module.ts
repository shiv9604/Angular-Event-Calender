import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteNotFoundComponent } from './shared/route-not-found/route-not-found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'appointments',
    pathMatch : 'full',
  },
  {
    path: 'appointments',
    loadChildren: () => import('src/app/modules/appointments/appointments.module').then(m => m.AppointmentsModule)
  },
  {
    path: '**',
    component : RouteNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
