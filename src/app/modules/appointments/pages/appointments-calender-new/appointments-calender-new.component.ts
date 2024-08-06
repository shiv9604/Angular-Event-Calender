import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Appointment, TimeSlot } from 'src/app/models/appointment.interfaces';
import { ViewAppointmentComponent } from '../../components/view-appointment/view-appointment.component';
import { Store } from '@ngrx/store';
import { deleteAppointment } from '../../store/appointments.action';
import { MatCalendar } from '@angular/material/datepicker';
import { AppointmentFormComponent } from '../../components/appointment-form/appointment-form.component';
import { takeWhile } from 'rxjs';
import { AppointmentsService } from 'src/app/shared/services/appointments/appointments.service';

@Component({
  selector: 'app-appointments-calender-new',
  templateUrl: './appointments-calender-new.component.html',
  styleUrls: ['./appointments-calender-new.component.css']
})
export class AppointmentsCalenderNewComponent implements OnInit {

  @ViewChild(MatCalendar, { static: false }) private calendar!: MatCalendar<Date>;

  public selectedDate: Date = new Date();
  private isAlive: boolean = true;

  constructor(private dialog: MatDialog, private store: Store, private appointmentService:AppointmentsService) { }

  ngOnInit(): void {
    this.observeSelectedAppointment();
    this.observeSelectedTimeSlot();
  }

  public view(appointment: Appointment): void {
    const dialogRef = this.dialog.open(ViewAppointmentComponent, {
      minWidth: '35%',
      data: { selectedDate: this.selectedDate, appointment }
    })

    dialogRef.afterClosed().pipe(takeWhile(()=>this.isAlive)).subscribe((res: { type: string, appointment: Appointment }) => {
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
    this.dialog.open(AppointmentFormComponent, {
      minWidth: '35%',
      data: { selectedDate: this.selectedDate }
    })
  }

  public createFromGrid(startTime:string): void {
    this.dialog.open(AppointmentFormComponent, {
      minWidth: '35%',
      data: { selectedDate: this.selectedDate, startTime }
    })
  }

  public edit(appointment: Appointment): void {
    this.dialog.open(AppointmentFormComponent, {
      minWidth: '35%',
      data: { id: appointment.id, selectedDate: this.selectedDate }
    })
  }

  public delete(appointment: Appointment): void {
    this.store.dispatch(deleteAppointment({ id: appointment.id }));
  }

  public onSelect(event: any): void {
    this.selectedDate = structuredClone(event);
    this.appointmentService.selectCalenderDate(this.selectedDate);
  }

  public today(): void {
    this.selectedDate = new Date();
    this.appointmentService.selectCalenderDate(this.selectedDate);
    this.calendar._goToDateInView(this.selectedDate, 'month');
  }

  public observeSelectedAppointment() {
    this.appointmentService.selectedAppointment$.pipe(takeWhile(() => this.isAlive)).subscribe((selectedAppointment:Appointment) => {
      this.view(selectedAppointment);
    })
  }

  public observeSelectedTimeSlot() {
    this.appointmentService.selectedTime$.pipe(takeWhile(() => this.isAlive)).subscribe((selectedTime: string) => {
      this.createFromGrid(selectedTime);
    })
  }

  ngOnDestroy() {
    // Will mark isAlive false which will complete the observables due to takeWhile.
    this.isAlive = false;
  }

}
