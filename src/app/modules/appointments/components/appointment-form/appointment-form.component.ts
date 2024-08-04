import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectAppointmentById, selectAppointments } from '../../store/appointments.selector';
import { bookAppointment, updateAppointment } from '../../store/appointments.action';
import { Appointment } from 'src/app/models/appointment.interfaces';
import { Subscription, first } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validator';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css'],
  // Preventing unnecessary chnage detection for Performance Optimisation.
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentFormComponent implements OnInit {
  private today: Date = new Date();
  private appointments!: Appointment[];
  private lastInserted!: Appointment;
  public toUpdate!: Appointment;
  private subsriptions: Subscription[] = [];
  public appointmentForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    desc: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    date: new FormControl('', [Validators.required]),
    startTime: new FormControl('', [Validators.required]),
    endTime: new FormControl('', [Validators.required, CustomValidators.endTimeValidator])
  });

  constructor(private store: Store, private cdr: ChangeDetectorRef, private snackBar: SnackbarService, private dialogRef: MatDialogRef<AppointmentFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.getAppointments();
    this.checkIfUpdate();
    if(!this.data.id) this.checkForExistingValues();
  }

  private getAppointments(): void {
    const subscription = this.store.select(selectAppointments).subscribe((res) => {
      if (!res) return;
      this.appointments = res;
      let reverseSorted = [...this.appointments].sort((a, b) => b.id - a.id);
      this.lastInserted = reverseSorted[0];
      this.cdr.markForCheck();
    })
    this.subsriptions.push(subscription);
  }

  public onSubmit(): void {
    if (!this.appointmentForm.valid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }
    const appointment: Appointment = { ...this.appointmentForm.value };
    const duration = this.calculateDuration(appointment.startTime, appointment.endTime);
    appointment.duration = duration;
    appointment.date = new Date(appointment.date).toLocaleDateString();
    appointment.id = this.lastInserted.id + 1;
    this.store.dispatch(bookAppointment({ data: appointment }));
    this.snackBar.open('Appointment Created Successfully!');
    this.onClose();
  }

  public onUpdate(): void {
    const updated = { ...this.appointmentForm.value };
    updated.date = new Date(updated.date).toLocaleDateString();
    updated.id = this.toUpdate.id;
    this.store.dispatch(updateAppointment({ data: updated }));
    this.snackBar.open('Appointment Updated Successfully!');
    this.onClose();
  }

  private checkIfUpdate(): void {
    if (!this.data && this.data.id) return;
    const id = this.data.id;
    // Unsubscribing observable after getting first value.
    this.store.select(selectAppointmentById, { id }).pipe(first()).subscribe((res) => {
      if (!res) return;
      this.toUpdate = res as Appointment;
      this.appointmentForm.patchValue({
        title: this.toUpdate.title,
        desc: this.toUpdate.desc,
        date: new Date(this.toUpdate.date),
        startTime: this.toUpdate.startTime,
        endTime: this.toUpdate.endTime,
      })
      this.cdr.markForCheck();
    })
  }

  private calculateDuration(startTime: string, endTime: string): number {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    const durationMinutes = endTotalMinutes - startTotalMinutes;
    return durationMinutes;
  }

  private checkForExistingValues(): void {
    this.appointmentForm.patchValue({
      date: this.data.selectedDate,
      startTime: this.data.startTime
    })
  }

  public onCancel(): void {
    this.appointmentForm.reset();
  }

  public onClose(): void {
    this.dialogRef.close();
  }

  public getControl(name: string): AbstractControl | null {
    return this.appointmentForm.get(name);
  }

  public get isValid(): boolean {
    return this.appointmentForm.valid
  }

  ngOnDestroy() {
    // Preventing Memory Leaks due to unsubscribed observables
    this.subsriptions.forEach(subscription => {
      subscription.unsubscribe()
    });
  }


}
