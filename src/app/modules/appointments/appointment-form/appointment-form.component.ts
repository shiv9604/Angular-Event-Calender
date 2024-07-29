import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectAppointmentById, selectAppointments } from '../store/appointments.selector';
import { bookAppointment, updateAppointment } from '../store/appointments.action';
import { Appointment } from 'src/app/models/appointment.interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, first } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css'],
  // Preventing unnecessary chnage detection for Performance Optimisation.
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentFormComponent implements OnInit {
  today: Date = new Date();
  appointmentForm: FormGroup =  new FormGroup({
    userName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    title : new FormControl('', [Validators.required]),
    desc: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    date: new FormControl('', [Validators.required]),
    time : new FormControl('', [Validators.required])
  }) ;
  appointments!: Appointment[];
  lastInserted!: Appointment;
  toUpdate!: Appointment;
  subsriptions: Subscription[] = [];
  constructor(private store:Store,private router:Router, private route:ActivatedRoute, private cdr:ChangeDetectorRef, private location:Location) { }

  ngOnInit(): void {
    this.getAppointments();
    this.checkIfUpdate();
  }

  getAppointments() {
    const subscription = this.store.select(selectAppointments).subscribe((res) => {
      if (!res) return;
      this.appointments = res;  
      let reverseSorted = [...this.appointments].sort((a, b) => b.id - a.id);
      this.lastInserted = reverseSorted[0];
      this.cdr.markForCheck();
    })
    this.subsriptions.push(subscription);
  }

  checkIfUpdate() {
    let id = this.route.snapshot.params['id'];
    // Unsubscribing observable after getting first value.
    this.store.select(selectAppointmentById, { id }).pipe(first()).subscribe((res) => {
      if (!res) return;
      this.toUpdate = res as Appointment;
      this.appointmentForm.patchValue({
        userName: this.toUpdate.userName,
        email: this.toUpdate.email,
        title : this.toUpdate.title,
        desc: this.toUpdate.desc,
        date: new Date(this.toUpdate.date),
        time : this.toUpdate.time
      })
      this.cdr.markForCheck();
    })
  }

  onSubmit() {
    if (!this.appointmentForm.valid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }
    
    const appointment: Appointment = { ...this.appointmentForm.value };
    appointment.date = new Date(appointment.date).toLocaleDateString();
    appointment.id = this.lastInserted.id + 1;
    this.store.dispatch(bookAppointment({ data: appointment }));
    this.router.navigate(['appointments']);
  }

  onUpdate() {
    const updated = { ...this.appointmentForm.value };
    updated.date = new Date(updated.date).toLocaleDateString();
    updated.id = this.toUpdate.id;
    this.store.dispatch(updateAppointment({ data: updated }));
    this.router.navigate(['appointments']);
  }

  onCancel() {
    this.appointmentForm.reset();
  }


  getControl(name:string): AbstractControl | null{
    return this.appointmentForm.get(name);
  }

  back() {
    this.location.back();
  }

  get isValid(): boolean {
    return this.appointmentForm.valid
  }
  
  ngOnDestroy() {
    // Preventing Memory Leaks due to unsubscribed observables
    this.subsriptions.forEach(subscription => {
      subscription.unsubscribe()
    });
  }


}
