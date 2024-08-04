import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-appointment',
  templateUrl: './view-appointment.component.html',
  styleUrls: ['./view-appointment.component.css']
})
export class ViewAppointmentComponent implements OnInit {

  
  constructor(public dialogRef: MatDialogRef<ViewAppointmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  public onEdit(): void {
    this.dialogRef.close({ type: 'EDIT', appointment: this.data.appointment })
  }

  public onDelete(): void {
    this.dialogRef.close({ type: 'DELETE', appointment: this.data.appointment })
  }

  public onClose(): void {
    this.dialogRef.close();
  }

}
