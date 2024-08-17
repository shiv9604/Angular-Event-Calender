import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private _snackbar: MatSnackBar) {}

  public open(message: string, actionName?: string, duration = 2000): void {
    this._snackbar.open(message, actionName, { duration });
  }
}
