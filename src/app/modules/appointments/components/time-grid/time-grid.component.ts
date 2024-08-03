import {
  CdkDragDrop,
  CdkDragEnd,
  CdkDragMove,
  CdkDragStart,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
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
  lastDroppedHours!: string;
  minuteSlots = [15, 30, 45, 60];
  minSlot: number = 0 ;
  overLapresults: boolean[] = [];
  isDragging: boolean = false;
  draggingAppointment: Appointment = {
    startTime: '',
    endTime : ''
  } as Appointment;

  constructor(private store: Store) { }

  
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

  getDraggingAppointmentData(element:HTMLElement): Appointment {
    let updatedAppointment = {} as Appointment;
    const appointmentId = parseInt(
      element.getAttribute(
        'appointment-id'
      ) ?? ''
    );
    const appointment: Appointment =
      this.appointments.find((item) => item.id === appointmentId) ??
      ({} as Appointment);
    const [hourValue] = this.convertTo24Hour(this.lastDroppedHours).split(':');
    const existingMinutes = parseInt(appointment.startTime.split(':')[1]);
    const newHours = parseFloat(hourValue);
    const currentContainerDate = new Date(this.lastDroppedDate);
    currentContainerDate.setHours(newHours, existingMinutes, 0, 0);

    if (appointment) {
      const newDate = this.replaceDate(
        new Date(appointment.date),
        currentContainerDate
      );

      const newStartTime = `${newHours}:${existingMinutes}`;

      const newTime = {
        startTime: this.convertTo24Hour(newStartTime),
        endTime: this.calculateNewEndTime(
          newStartTime,
          appointment.duration as any
        ),
      };
      updatedAppointment = {
        ...appointment,
        date: newDate.toLocaleDateString(),
        startTime: newTime.startTime,
        endTime: newTime.endTime,
      };
      return updatedAppointment
    }
    return updatedAppointment
  }
    
  onDrop(event: CdkDragDrop<Appointment[]>): void {
    const updatedAppointment = this.getDraggingAppointmentData(event.item.element.nativeElement);
    if(updatedAppointment) this.store.dispatch(updateAppointment({ data: updatedAppointment }));
  }

  replaceDate(oldDate: Date, newDate: Date): Date {
    const updatedDate = new Date(oldDate);
    updatedDate.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
    return updatedDate;
  }

  calculateNewEndTime(startTime: string, durationMinutes: number): string {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = startTotalMinutes + durationMinutes;
    const endHour = Math.floor(endTotalMinutes / 60) % 24;
    const endMinute = endTotalMinutes % 60;
    const newEndTime = `${endHour.toString().padStart(2, '0')}:${endMinute
      .toString()
      .padStart(2, '0')}`;
    return newEndTime;
  }

  onDragStarted(event: CdkDragStart) {
    this.isDragging = true;
  }

  onDragEnded(event: CdkDragEnd) {
    this.isDragging = false;
  }

  onDragMoved(event: CdkDragMove) {
    this.draggingAppointment = this.getDraggingAppointmentData(event.source.element.nativeElement) ?? {} as Appointment;
  }

  getHeight(element: HTMLElement): string {
    const regex = /height:\s*([\d.]+%)/;
    const match = element.outerHTML.match(regex);
    return match ? match[1] : '';
  }

  
  setDraggableDropDate(date: Date) {
    this.lastDroppedDate = date;
  }

  setDraggableHours(h12: string) {
    this.lastDroppedHours = h12;
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
  }}
