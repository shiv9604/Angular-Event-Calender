import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteNotFoundComponent } from './route-not-found/route-not-found.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimeConversionPipe } from './pipes/timeConversion/time-conversion.pipe';



@NgModule({
  declarations: [RouteNotFoundComponent, TimeConversionPipe],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    RouteNotFoundComponent,
    TimeConversionPipe,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
