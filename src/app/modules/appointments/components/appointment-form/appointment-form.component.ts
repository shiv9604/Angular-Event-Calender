import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectAppointmentById, selectAppointments } from '../../store/appointments.selector';
import { bookAppointment, updateAppointment } from '../../store/appointments.action';
import { Appointment } from 'src/app/models/appointment.interfaces';
import { combineLatest, debounceTime, first, fromEvent, map, takeWhile } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validator';
import { ColorPickerService } from './../../../../shared/services/color-picker/color-picker.service';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css'],
  // Preventing unnecessary chnage detection for Performance Optimisation.
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentFormComponent implements OnInit, AfterViewInit {

  @ViewChild('endTime') endTimeInputRef!: ElementRef;
  @ViewChild('startTime') startTimeInputRef!: ElementRef;

  private appointments!: Appointment[];
  private lastInserted!: Appointment;
  public toUpdate!: Appointment;
  public appointmentForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    desc: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    date: new FormControl('', [Validators.required]),
    startTime: new FormControl('', [Validators.required, CustomValidators.startTimeValidator]),
    endTime: new FormControl('', [Validators.required, CustomValidators.endTimeValidator])
  });
  isAlive: boolean = true;

  constructor(private store: Store, private cdr: ChangeDetectorRef, private snackBar: SnackbarService, private colorPickerService: ColorPickerService, private dialogRef: MatDialogRef<AppointmentFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngAfterViewInit(): void {
    this.observeAndValidateTime();
  }

  ngOnInit(): void {
    this.addDebounceToValidator();
    this.getAppointments();
    this.checkIfUpdate();
    if (!this.data.id) this.checkForExistingValues();
  }

  private getAppointments(): void {
    this.store.select(selectAppointments).pipe(takeWhile(() => this.isAlive), map((appointments: Appointment[] | null) => {
      if (!appointments || !appointments.length) return;
      // Sorting array & returning sorted array.
      let reverseSorted = [...appointments].sort((a, b) => b.id - a.id);
      return reverseSorted
    })).subscribe((res) => {
      if (!res) return;
      this.appointments = res;
      this.lastInserted = res[0];
      this.cdr.markForCheck();
    })
  }

  public onSubmit(): void {
    if (!this.appointmentForm.valid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }
    const appointment: Appointment = { ...this.appointmentForm.value, bgColor: this.colorPickerService.getRandomColor() };
    const duration = this.calculateDuration(appointment.startTime, appointment.endTime);
    appointment.duration = duration;
    appointment.date = new Date(appointment.date).toLocaleDateString();
    appointment.id = this.lastInserted.id + 1;
    this.store.dispatch(bookAppointment({ data: appointment }));
    this.snackBar.open('Appointment Created Successfully!');
    this.onClose();
  }

  public onUpdate(): void {
    const updated: Appointment = { ...this.appointmentForm.value, bgColor: this.toUpdate.bgColor ?? this.colorPickerService.getRandomColor() };
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

  public addDebounceToValidator() {
    this.appointmentForm.valueChanges.pipe(takeWhile(() => this.isAlive), debounceTime(300)).subscribe(() => {
      this.appointmentForm.updateValueAndValidity({ emitEvent: false });
    })
  }

  public observeAndValidateTime() {
    const startTime$ = fromEvent(this.startTimeInputRef?.nativeElement, 'input').pipe(debounceTime(300), map(() => this.startTimeInputRef.nativeElement.value));
    const endTime$ = fromEvent(this.endTimeInputRef?.nativeElement, 'input').pipe(debounceTime(300), map(() => this.endTimeInputRef.nativeElement.value));

    // Combining Both observables will set value the one emits
    combineLatest([startTime$, endTime$]).pipe(takeWhile(() => this.isAlive)).subscribe(([startTime, endTime]) => {
      if (startTime) this.getControl('startTime')?.setValue(startTime, { emitEvent: false });
      if (endTime) this.getControl('endTime')?.setValue(endTime, { emitEvent: false });
      this.validateTimeFields();
    })
  }

  private validateTimeFields(): void {
    this.getControl('startTime')?.updateValueAndValidity();
    this.getControl('endTime')?.updateValueAndValidity();
    this.endTimeInputRef && this.endTimeInputRef.nativeElement.blur();
    this.startTimeInputRef && this.startTimeInputRef.nativeElement.blur();
    this.cdr.markForCheck();
  }

  private checkForExistingValues(): void {
    this.appointmentForm.patchValue({
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
    // Will mark isAlive false which will complete the observables due to takeWhile.
    this.isAlive = false;
  }
}
