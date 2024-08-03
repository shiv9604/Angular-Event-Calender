import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAppointments } from '../store/appointments.selector';
import { deleteAppointment, updateAppointment } from '../store/appointments.action';
import { Router } from '@angular/router';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmTimechangeComponent } from '../confirm-timechange/confirm-timechange.component';
import { Appointment, AppointmentDate } from '../../../models/appointment.interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-appointments-calender',
  templateUrl: './appointments-calender.component.html',
  styleUrls: ['./appointments-calender.component.css'],
  // Preventing unnecessary chnage detection for Performance Optimisation.
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentsCalenderComponent implements OnInit {
  today: Date;
  appointments: Appointment[] = [];
  currentYear: number;
  currentMonth: number;
  days: number[] = [];
  dates: AppointmentDate[] = [];
  daysList: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthsList: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  subscriptions: Subscription[] = [];
  constructor(private store: Store, private router:Router, private dialog:MatDialog,private cdr: ChangeDetectorRef) { 
    this.today = new Date();
    this.currentYear = this.today.getFullYear();
    this.currentMonth = this.today.getMonth();
  }

  
  ngOnInit(): void {
    this.getAppointments();
    this.initCalender();
  }

  getAppointments() {
    const subscription = this.store.select(selectAppointments).subscribe((res) => {
      if (!res) return;
      this.appointments = res;  
      this.cdr.markForCheck();
      this.appendAppointments();
      this.cdr.markForCheck();
    })
    this.subscriptions.push(subscription);
  }

  
  appendAppointments(){
    this.dates = this.days.map((day:number) => {
      return {
        day: day,
        appointments : day ? this.getAppointmentsForDay(day) : []
      }
    })
  }

  initCalender(): void {
    const startOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const endOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startDay = startOfMonth.getDay();
    const totalDays = endOfMonth.getDate();
    this.days = Array(startDay).fill(null).concat(Array.from({ length: totalDays }, (_, i) => i + 1));
    this.appendAppointments();
  }

  
  prev(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.initCalender();
  }

  next(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.initCalender();
  }

  getDateForDay(day:number) : Date {
    return new Date(`${this.monthsList[this.currentMonth]}-${day}-${this.currentYear}`)
  }

  getAppointmentsForDay(day: number) : Appointment[] {
    const dateForDay: Date = this.getDateForDay(day);
    const result = this.appointments.filter((appointment: Appointment) => appointment.date == dateForDay.toLocaleDateString());
    return result;
  }

  updateAppointment(appointment:Appointment) {
    this.router.navigate(['/appointments/edit', appointment.id]);
  }

  deleteAppointment(appointment:Appointment) {
    this.store.dispatch(deleteAppointment({ id: appointment.id }));
  }

  onDrop(event: CdkDragDrop<Appointment[]>) {
    const currentContainerDate = JSON.parse((event.container.element.nativeElement as HTMLElement).getAttribute('date') ?? '');
    const appointmentId = parseInt((event.item.element.nativeElement as HTMLElement).getAttribute('appointment-id') ?? '') ;
    if (!appointmentId) return;
    let data: Appointment | undefined = this.appointments.find((item) => item.id === appointmentId);
    if (data) {
      const previousDate:string = data?.date.split('/')[1] ?? '';
      const currentDate:string = currentContainerDate.day.toString();
      const resultDate = data.date.replace(previousDate, currentDate);  
      const dateUpdated = {...data,date:resultDate};
      this.confirmTimeChange(dateUpdated);
    }
  }

  confirmTimeChange(appointment:Appointment) {
    const dialogRef = this.dialog.open(ConfirmTimechangeComponent, {
      width: '300px',
      data: appointment
    })

    dialogRef.afterClosed().subscribe((data: Appointment) => { 
      this.store.dispatch(updateAppointment({ data }));
      this.cdr.markForCheck();
    })
  }

  currentDate() {
    this.currentMonth = this.today.getMonth();
    this.currentYear = this.today.getFullYear();
    this.initCalender();
  }
  
  getToolTip(appointment:Appointment) : string {
    const toolTip = `
    Title : ${appointment.title},
    \nDescription : ${appointment.desc},
    \nTime : ${appointment.startTime} - ${appointment.endTime},
    `
    return toolTip
  }
  isToday(date:AppointmentDate) {
    return this.getDateForDay(date.day).toLocaleDateString() === this.today.toLocaleDateString();
  }
  
  // For Performance Optimization
  trackByDay(index:number,date:AppointmentDate) : number {
    return date.day;
  }

  // For Performance Optimization
  trackById(index: number, appointment: Appointment) : number {
    return appointment.id;
  }

  ngOnDestroy() {
    // Preventing Memory Leaks due to unsubscribed observables
    this.subscriptions.forEach((subsription: Subscription) => {
      subsription.unsubscribe();
    });
  }
}
