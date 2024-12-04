import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pole-objetosc-kola',
  imports: [FormsModule, CommonModule],
  templateUrl: './pole-objetosc-kola.component.html',
  styleUrl: './pole-objetosc-kola.component.css'
})
export class PoleObjetoscKolaComponent {
  radius: number | null = null;  // Promień
  area: number | null = null;  // Pole koła
  volume: number | null = null;  // Objętość kuli

  calculateCircle() {
    if (this.radius) {
      // Obliczanie pola kuli: P = 4π * r²
      this.area = 4*Math.PI * Math.pow(this.radius, 2);

      // Obliczanie objętości kuli: V = (4/3) * π * r³
      this.volume = (4 / 3) * Math.PI * Math.pow(this.radius, 3);
    }
  }
}
