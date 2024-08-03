import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Appointment } from 'src/app/models/appointment.interfaces';
import { AppointmentService } from 'src/app/shared/services/appointment/appointment.service';
import { selectAppointments } from '../../store/appointments.selector';
import { updateAppointment } from '../../store/appointments.action';

@Component({
  selector: 'app-time-grid',
  templateUrl: './time-grid.component.html',
  styleUrls: ['./time-grid.component.css'],
})
export class TimeGridComponent implements OnInit, OnChanges {

  @Input() selectedDate: Date = new Date();

  @Output() onSelect: EventEmitter<Appointment> = new EventEmitter();
  
  hours: string[] = Array.from({ length: 24 }, (_, i) => this.formatTime(i));
  weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  days: { name: string, date: Date }[] = [];
  subscriptions: Subscription[] = [];
  appointments: Appointment[] = [];
  selectedAppointment!: Appointment;
  lastDroppedDate!: Date;
  minuteSlots = [15, 30, 45, 60];
  minSlot: number = 0 ;
  constructor(private store:Store) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDate']) this.updateHeaderDates();
  }

  ngOnInit(): void { 
    this.getAppointments();
  }
  
  getAppointments() {
    const subscription = this.store.select(selectAppointments).subscribe((res) => {
      if (!res) return;
      this.appointments = res;  
      console.log(this.appointments);
    })
    this.subscriptions.push(subscription);
  }

  formatTime(hour: number): string {
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:00 ${period}`;
  }

  convertTo24Hour(time12: string): string {
    // Extract the time and period (AM/PM)
    const [time, period] = time12.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
  
    // Convert to 24-hour format
    let hours24 = hours;
    if (period === 'PM' && hours !== 12) {
      hours24 = hours + 12;
    } else if (period === 'AM' && hours === 12) {
      hours24 = 0; // Midnight case
    }
  
    return `${hours24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  updateHeaderDates() {
    if (!this.selectedDate) return;
    const startOfWeek = this.getStartOfWeek(this.selectedDate);
    this.days = this.weekdays.map((dayName, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return { name: dayName, date };
    });
  }

  getStartOfWeek(date: Date): Date {
    const deepCopy = structuredClone(date);
    const day = deepCopy.getDay();
    const diff = deepCopy.getDate() - day;
    const result = new Date(deepCopy.setDate(diff));
    return result
  }
  
  getAppointmentsForTimeSlot(date: Date, hour: number): Appointment[] {
    return this.appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.toDateString() === date.toDateString() &&
             appointmentDate.getHours() === hour;
    });
  }

  selectAppointment(appointment: Appointment) {
    this.selectedAppointment = appointment;
    this.onSelect.emit(appointment)
  }

  getAppointmentsForDay(date: Date): Appointment[] {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    return this.appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate >= dayStart && appointmentDate <= dayEnd;
    });
  }

  getAppointmentStyle(appointment: Appointment): any {
    const [startHour, startMinute] = appointment.startTime.split(':').map(Number);
    const [endHour, endMinute] = appointment.endTime.split(':').map(Number);
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    const durationMinutes = endTotalMinutes - startTotalMinutes;

    const top = (startTotalMinutes * 100) / (24 * 60); 
    const height = (durationMinutes * 100) / (24 * 60); 

    return {
      top: `${top}%`,
      height: `${height}%`
    };
  }

  onDrop(event: CdkDragDrop<Appointment[]>): void {
    const renderedHour = (event.container.element.nativeElement as HTMLElement).getAttribute('rendered-hour') ?? ''
    const [hourValue, minuteValue] = this.convertTo24Hour(renderedHour).split(':');
    const parsedHour = parseFloat(hourValue);
    const parsedMinute = parseFloat(hourValue);
    const currentContainerDate = new Date(this.lastDroppedDate);
    currentContainerDate.setHours(parsedHour, parsedMinute, 0, 0); // Set to the exact hour dropped
  
    const appointmentId = parseInt((event.item.element.nativeElement as HTMLElement).getAttribute('appointment-id') ?? '');
    if (!appointmentId) return;
  
    const appointment = this.appointments.find(item => item.id === appointmentId);
    if (appointment) {
      const newDate = this.replaceDate(new Date(appointment.date), currentContainerDate);
      const newTime = this.calculateNewTime(event, parsedHour, appointment.startTime.split(':')[1]);
      const updatedAppointment = { ...appointment, date: newDate.toLocaleDateString(), startTime: newTime.startTime, endTime: newTime.endTime };
      this.store.dispatch(updateAppointment({ data: updatedAppointment }));
    }
  }
  
  replaceDate(oldDate: Date, newDate: Date): Date {
    const updatedDate = new Date(oldDate);
    updatedDate.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
    return updatedDate;
  }
  


  calculateNewTime(event: CdkDragDrop<Appointment[]>, hours: number, minutes:string): { startTime: string, endTime: string } {
    const [startHour, startMinute] = [hours,minutes];
    const endHour = startHour + 1;
    const newStartTime = `${startHour.toString().padStart(2, '0')}:${startMinute}`;
    const newEndTime = `${endHour.toString().padStart(2, '0')}:${startMinute}`;

    
    return {
      startTime: newStartTime,
      endTime: newEndTime
    };
  }

  setDraggableDropDate(date:Date) {
    this.lastDroppedDate = date;
  }

  setMinSlot(slot:number) {
    this.minSlot = slot;  
  }
  
  isActive(date: Date) {
    const selectedDate = this.selectedDate.getDate();
    const inputDate = date.getDate();
    return inputDate === selectedDate;
  }
  
  isSelected(appointment: Appointment): boolean {
    return this.selectedAppointment === appointment;
  }

  ngOnDestroy() {
  }
}
