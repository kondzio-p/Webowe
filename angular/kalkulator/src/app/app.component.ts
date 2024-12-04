import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KalkulatorSService } from './kalkulator-s.service';
import { catchError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BmiComponent } from "./bmi/bmi.component";
import { PoleObjetoscKolaComponent } from "./pole-objetosc-kola/pole-objetosc-kola.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, BmiComponent, PoleObjetoscKolaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [KalkulatorSService]
})
export class AppComponent {
  title = 'kalkulator';
  num1: number = 0;
  num2: number = 0;
  wynik: {suma: number, roznica: number, iloczyn: number, iloraz: number} | null = null;
  errorMes : string | null = null;

  constructor(private kalkulator: KalkulatorSService) {}
    calculate(): void{
      try {
        this.errorMes = null;
        const suma = this.kalkulator.dodawanie(this.num1, this.num2);
        const roznica = this.kalkulator.odejmij(this.num1, this.num2);
        const iloczyn = this.kalkulator.mnozenie(this.num1, this.num2);
        const iloraz = this.kalkulator.dzielenie(this.num1, this.num2);
        this.wynik = {suma, roznica, iloczyn, iloraz};
      }
      catch (error:any) {
        this.errorMes = error.message;
        this.wynik = null;
      }
    }
}