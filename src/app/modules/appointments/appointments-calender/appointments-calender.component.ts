import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAppointments } from '../store/appointments.selector';
import { Appointment } from 'src/app/models/appointment.interfaces';
import { deleteAppointment } from '../store/appointments.action';
import { Router } from '@angular/router';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-appointments-calender',
  templateUrl: './appointments-calender.component.html',
  styleUrls: ['./appointments-calender.component.css']
})
export class AppointmentsCalenderComponent implements OnInit {

  appointments: Appointment[] = [];
  currentYear: number;
  currentMonth: number;
  days: number[] = [];
  dates: { day: number, appointments: Appointment[] }[] = [];
  daysList: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthsList: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  constructor(private store: Store, private router:Router) { 
    const now = new Date();
    this.currentYear = now.getFullYear();
    this.currentMonth = now.getMonth();
  }

  
  ngOnInit(): void {
    this.getAppointments();
    this.initCalender();
  }

  getAppointments() {
    this.store.select(selectAppointments).subscribe((res) => {
      if (!res) return;
      this.appointments = res;  
      this.appendAppointments();
      console.log(res)
    })
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

  getToolTip(appointment:Appointment) : string {
    const toolTip = `
    Title : ${appointment.title},
    \nDescription : ${appointment.desc},
    \nTime : ${appointment.time},
    \nBooked By : ${appointment.userName}
    `
    return toolTip
  }

  updateAppointment(appointment:Appointment) {
    this.router.navigate(['/appointments/edit', appointment.id]);
  }

  deleteAppointment(appointment:Appointment) {
    this.store.dispatch(deleteAppointment({ id: appointment.id }));
  }
  onDrop(event : CdkDragDrop<Appointment[]>){
    console.log(event);
  }

}
