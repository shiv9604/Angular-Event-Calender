import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Appointment } from 'src/app/models/appointment.interfaces';

@Component({
  selector: 'app-confirm-timechange',
  templateUrl: './confirm-timechange.component.html',
  styleUrls: ['./confirm-timechange.component.css']
})
export class ConfirmTimechangeComponent implements OnInit {

  constructor(private dialogRef:MatDialogRef<ConfirmTimechangeComponent>,@Inject(MAT_DIALOG_DATA) public data:Appointment) { }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close(this.data);
  }

}
