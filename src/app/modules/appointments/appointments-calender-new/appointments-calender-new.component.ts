import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentService } from 'src/app/shared/services/appointment/appointment.service';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import { Appointment } from 'src/app/models/appointment.interfaces';
import { ViewAppointmentComponent } from '../components/view-appointment/view-appointment.component';
import { Store } from '@ngrx/store';
import { deleteAppointment } from '../store/appointments.action';
import { MatCalendar } from '@angular/material/datepicker';

@Component({
  selector: 'app-appointments-calender-new',
  templateUrl: './appointments-calender-new.component.html',
  styleUrls: ['./appointments-calender-new.component.css']
})
export class AppointmentsCalenderNewComponent implements OnInit {

  @ViewChild(MatCalendar, {static: false}) calendar!: MatCalendar<Date>;

  selectedDate: Date = new Date();

  constructor(private dialog:MatDialog,private store:Store) { }

  ngOnInit(): void {
  }

  onSelect(event: any) {
    this.selectedDate = structuredClone(event);
    console.log(event);
  }

  today() {
    this.selectedDate = new Date();
    this.calendar._goToDateInView(this.selectedDate,'month');
  }

  view(appointment:Appointment) {
    const dialogRef = this.dialog.open(ViewAppointmentComponent, {
      minWidth: '35%',
      data : {selectedDate : this.selectedDate, appointment}
    })

    dialogRef.afterClosed().subscribe((res: { type: string, appointment: Appointment }) => {
      if (res?.type == 'EDIT') { 
        this.edit(appointment);
        return
      } 
      if (res?.type == 'DELETE') { 
        this.delete(appointment);
        return
      } 
    })
  }

  create() {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      minWidth: '35%',
      data : {selectedDate : this.selectedDate}
    })
  }

  edit(appointment:Appointment) {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      minWidth: '35%',
      data : {id:appointment.id,selectedDate : this.selectedDate}
    })
  }

  delete(appointment:Appointment) {
    this.store.dispatch(deleteAppointment({ id: appointment.id }));
  }

}
