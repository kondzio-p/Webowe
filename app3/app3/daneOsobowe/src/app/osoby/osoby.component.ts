import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-osoby',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './osoby.component.html',
  styleUrls: ['./osoby.component.css']
})
export class OsobyComponent {
  osoby: any[] = [
    ["Adam", "Nowak", 22],
    ["Maria", "Kowalska", 30]
  ];

  imie: string = '';
  nazwisko: string = '';
  wiek: number | null = null;

  sprawdzCzyIstnieje() {
    const osobaExists = this.osoby.some(
      osoba => osoba[0] === this.imie && osoba[1] === this.nazwisko && osoba[2] === this.wiek
    );

    if (osobaExists) {
      alert("Osoba już istnieje");
    } else {
      alert("Nie ma takiej osoby");
      this.osoby.push([this.imie, this.nazwisko, this.wiek]);
    }
  }
}
