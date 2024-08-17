import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Appointment, TimeSlot } from 'src/app/models/appointment.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  today: Date = new Date();
  
  // Subjects & BehaviorSubject is used here to store the current appointment and emit to subscribers
  private selectedAppointmentSub: Subject<Appointment> = new Subject<Appointment>();
  private selectedCalenderDateSub: BehaviorSubject<Date> = new BehaviorSubject<Date>(this.today);
  private selectedTimeSub : Subject<string> = new Subject<string>();

  // Public Observables Streams to subscribe.
  public selectedAppointment$: Observable<Appointment> = this.selectedAppointmentSub.asObservable();
  public selectedCalenderDate$: Observable<Date> = this.selectedCalenderDateSub.asObservable();
  public selectedTime$: Observable<string> = this.selectedTimeSub.asObservable();
  
  constructor() { }

  public selectAppointment(appointment:Appointment): void {
    this.selectedAppointmentSub.next(appointment);
  }

  public selectCalenderDate(calenderDate: Date): void{
    this.selectedCalenderDateSub.next(calenderDate);
  }

  public selectTimeSlot(time: string): void {
    this.selectedTimeSub.next(time);
  }

}
