import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Appointment } from 'src/app/models/appointment.interfaces';
import { ViewAppointmentComponent } from '../../components/view-appointment/view-appointment.component';
import { Store } from '@ngrx/store';
import { deleteAppointment } from '../../store/appointments.action';
import { MatCalendar } from '@angular/material/datepicker';
import { AppointmentFormComponent } from '../../components/appointment-form/appointment-form.component';

@Component({
  selector: 'app-appointments-calender-new',
  templateUrl: './appointments-calender-new.component.html',
  styleUrls: ['./appointments-calender-new.component.css']
})
export class AppointmentsCalenderNewComponent implements OnInit {

  @ViewChild(MatCalendar, { static: false }) private calendar!: MatCalendar<Date>;

  public selectedDate: Date = new Date();

  constructor(private dialog: MatDialog, private store: Store) { }

  ngOnInit(): void {
  }

  public view(appointment: Appointment): void {
    const dialogRef = this.dialog.open(ViewAppointmentComponent, {
      minWidth: '35%',
      data: { selectedDate: this.selectedDate, appointment }
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

  public create(): void {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      minWidth: '35%',
      data: { selectedDate: this.selectedDate }
    })
  }

  public createFromGrid(data: { minSlot: number, hourIn24: string }): void {
    const startTime = `${data.hourIn24.split(':')[0]}:${data.minSlot}`;
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      minWidth: '35%',
      data: { selectedDate: this.selectedDate, startTime }
    })
  }

  public edit(appointment: Appointment): void {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      minWidth: '35%',
      data: { id: appointment.id, selectedDate: this.selectedDate }
    })
  }

  public delete(appointment: Appointment): void {
    this.store.dispatch(deleteAppointment({ id: appointment.id }));
  }

  public onSelect(event: any): void {
    this.selectedDate = structuredClone(event);
  }

  public today(): void {
    this.selectedDate = new Date();
    this.calendar._goToDateInView(this.selectedDate, 'month');
  }

}
