import {
  CdkDragDrop,
  CdkDragEnd,
  CdkDragMove,
  CdkDragStart,
} from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Appointment, DayofWeek } from 'src/app/models/appointment.interfaces';
import { selectAppointments } from '../../store/appointments.selector';
import { updateAppointment } from '../../store/appointments.action';

@Component({
  selector: 'app-time-grid',
  templateUrl: './time-grid.component.html',
  styleUrls: ['./time-grid.component.css'],
  // Preventing unnecessary chnage detection for Performance Optimisation.
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeGridComponent implements OnInit, OnChanges {

  // Data Bindings
  @Input() public selectedDate: Date = new Date();

  // Events
  @Output() public onSelect: EventEmitter<Appointment> = new EventEmitter();
  @Output() public createFromGrid: EventEmitter<{ minSlot: number, hourIn24: string }> = new EventEmitter();

  // Properties
  public hours: string[] = Array.from({ length: 24 }, (_, i) => this.formatTime(i));
  public weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  public days: DayofWeek[] = [];
  private subscriptions: Subscription[] = [];
  private appointments: Appointment[] = [];
  private selectedAppointment!: Appointment;
  private lastDroppedDate!: Date;
  private lastDroppedHours!: string;
  public minuteSlots: number[] = [15, 30, 45, 60];
  public minSlot: number = 0;
  public isDragging: boolean = false;
  public draggingAppointment: Appointment = {
    startTime: '',
    endTime: ''
  } as Appointment;

  constructor(private store: Store, private cdRef:ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDate']) this.updateHeaderDates();
  }

  ngOnInit(): void {
    this.getAppointments();
  }

  private getAppointments(): void {
    const subscription = this.store.select(selectAppointments).subscribe((res) => {
      if (!res) return;
      this.appointments = res;
    })
    this.subscriptions.push(subscription);
  }

  private getStartOfWeek(date: Date): Date {
    const deepCopy = structuredClone(date);
    const day = deepCopy.getDay();
    const diff = deepCopy.getDate() - day;
    const result = new Date(deepCopy.setDate(diff));
    return result
  }

  public getAppointmentsForTimeSlot(date: Date, hour: number): Appointment[] {
    return this.appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.toDateString() === date.toDateString() &&
        appointmentDate.getHours() === hour;
    });
  }

  public getAppointmentsForDay(date: Date): Appointment[] {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    return this.appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate >= dayStart && appointmentDate <= dayEnd;
    });
  }

  public getAppointmentStyle(appointment: Appointment): any {
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

  private getDraggingAppointmentData(element: HTMLElement): Appointment {
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

  public getHeight(element: HTMLElement): string {
    const regex = /height:\s*([\d.]+%)/;
    const match = element.outerHTML.match(regex);
    return match ? match[1] : '';
  }

  private convertTo24Hour(time12: string): string {
    const [time, period] = time12.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let hours24 = hours;
    if (period === 'PM' && hours !== 12) {
      hours24 = hours + 12;
    } else if (period === 'AM' && hours === 12) {
      hours24 = 0;
    }
    return `${hours24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  private updateHeaderDates(): void {
    if (!this.selectedDate) return;
    const startOfWeek = this.getStartOfWeek(this.selectedDate);
    this.days = this.weekdays.map((dayName, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return { name: dayName, date };
    });
    this.cdRef.markForCheck();
  }

  private calculateNewEndTime(startTime: string, durationMinutes: number): string {
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

  private replaceDate(oldDate: Date, newDate: Date): Date {
    const updatedDate = new Date(oldDate);
    updatedDate.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
    return updatedDate;
  }

  public onCreate(minSlot: number, hourIn12: string): void {
    const hourIn24 = this.convertTo24Hour(hourIn12);
    this.createFromGrid.emit({ minSlot, hourIn24 });
  }

  private formatTime(hour: number): string {
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:00 ${period}`;
  }

  public selectAppointment(appointment: Appointment): void {
    this.selectedAppointment = appointment;
    this.onSelect.emit(appointment)
  }

  public onDrop(event: CdkDragDrop<Appointment[]>): void {
    const updatedAppointment = this.getDraggingAppointmentData(event.item.element.nativeElement);
    if (updatedAppointment) this.store.dispatch(updateAppointment({ data: updatedAppointment }));
  }

  public onDragStarted(event: CdkDragStart): void {
    this.isDragging = true;
  }

  public onDragEnded(event: CdkDragEnd): void {
    this.isDragging = false;
  }

  public onDragMoved(event: CdkDragMove): void {
    this.draggingAppointment = this.getDraggingAppointmentData(event.source.element.nativeElement) ?? {} as Appointment;
  }

  public setDraggableDropDate(date: Date): void {
    this.lastDroppedDate = date;
  }

  public setDraggableHours(h12: string): void {
    this.lastDroppedHours = h12;
  }

  public setMinSlot(slot: number): void {
    this.minSlot = slot;
  }

  public trackByDate(index: number, day: DayofWeek): string {
    return day.date.getMilliseconds().toString()
  }

  public trackByHour(index: number, hour: number): string {
    return hour.toString();
  }

  public trackByAppointment(index: number, appointment: Appointment): string {
    return appointment.id.toString()
  }

  public trackByMinuteSlot(index: number, minSlot: number): string {
    return minSlot.toString();
  }

  public isActive(date: Date) {
    const selectedDate = this.selectedDate.getDate();
    const inputDate = date.getDate();
    return inputDate === selectedDate;
  }

  public isSelected(appointment: Appointment): boolean {
    return this.selectedAppointment === appointment;
  }

  ngOnDestroy() {
    // Preventing Memory Leaks due to unsubscribed observables
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
