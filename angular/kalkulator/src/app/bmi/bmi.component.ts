import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bmi',
  imports: [FormsModule, CommonModule],
  templateUrl: './bmi.component.html',
  styleUrl: './bmi.component.css'
})
export class BmiComponent {
  weight: number | null = null;
  height: number | null = null;
  bmi: number | null = null;
  bmiCategory: string = '';

  calculateBMI() {
    if (this.weight && this.height) {
      // Convert height to meters if needed
      const heightInMeters = this.height / 100;
      this.bmi = this.weight / (heightInMeters * heightInMeters);
      this.bmi = Number(this.bmi.toFixed(1));

      // Determine BMI category
      if (this.bmi < 18.5) {
        this.bmiCategory = 'Niedowaga';
      } else if (this.bmi >= 18.5 && this.bmi < 25) {
        this.bmiCategory = 'Prawidłowa waga';
      } else if (this.bmi >= 25 && this.bmi < 30) {
        this.bmiCategory = 'Nadwaga';
      } else {
        this.bmiCategory = 'Otyłość';
      }
    } else {
      this.bmi = null;
      this.bmiCategory = '';
    }
  }
}