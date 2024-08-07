import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorPickerService {
  // We can keep colors according to color palette.
  colors = [
    '#003366', // Deep Blue
    '#333333', // Charcoal Gray
    '#3D0A4A', // Royal Purple
    '#004d4d', // Dark Teal
    '#5268e5', // Default Color
    '#2F4F4F'  // Slate Gray
  ];
  private lastColor: string | null = null;
  private previousColors: string[] = [];

  constructor() { }

  public getRandomColor(): string {
    const availableColors = this.colors.filter(color => color !== this.lastColor);
    if (availableColors.length === 0) {
      throw new Error('No available colors to choose from');
    }
    const randomIndex = Math.floor(Math.random() * availableColors.length);
    const selectedColor = availableColors[randomIndex];
    this.previousColors.push(this.lastColor || '');
    if (this.previousColors.length > 2) {
      this.previousColors.shift();
    }
    this.lastColor = selectedColor;
    return selectedColor;
  }
}
