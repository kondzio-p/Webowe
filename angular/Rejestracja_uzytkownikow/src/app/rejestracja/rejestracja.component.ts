import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-rejestracja',
  templateUrl: './rejestracja.component.html',
  styleUrls: ['./rejestracja.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class RejestracjaComponent implements OnInit {
  rejestracja!: FormGroup; // Formularz rejestracji
  employees: any[] = []; // Tablica przechowująca listę pracowników
  photoPreview: string | null = null; // Zmienna przechowująca podgląd zdjęcia

  // Konstruktor z wstrzyknięciem zależności FormBuilder
  constructor(private fb: FormBuilder) {}

  // Inicjalizacja formularza w metodzie ngOnInit
  ngOnInit(): void {
    this.rejestracja = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]], // Imię, minimum 2 znaki
      lastName: ['', [Validators.required, Validators.minLength(2)]], // Nazwisko, minimum 2 znaki
      email: ['', [Validators.required, Validators.email]], // E-mail, musi być poprawnym adresem email
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])/)]], // Hasło, minimum 8 znaków, w tym liczby i znaki specjalne
      confirmPassword: ['', Validators.required], // Potwierdzenie hasła
      age: ['', [Validators.required, Validators.min(18)]], // Wiek, minimalnie 18 lat
      terms: [false, Validators.requiredTrue], // Zgoda na warunki, wymagana
      jobPosition: ['', Validators.required], // Stanowisko, wymagane
      photo: [null] // Zdjęcie, opcjonalne
    }, {
      validator: this.passwordMatchValidator // Funkcja ta przyjmuje cały formularz jako argument i sprawdza, czy wartości
                                             // w polach "password" i "confirmPassword" są identyczne.
    });
  }

  // Walidacja dopasowania haseł
  passwordMatchValidator(group: FormGroup): null | { mismatch: boolean } {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true }; // Sprawdzenie, czy hasła się zgadzają
  }

  // Metoda obsługująca wysłanie formularza
  onSubmit(): void {
    if (this.rejestracja.valid) { // Sprawdzenie, czy formularz jest poprawny
      const newEmployee = { ...this.rejestracja.value }; // Pobranie wartości formularza
      if (this.photoPreview) {
        newEmployee.photo = this.photoPreview; // Dodanie ścieżki zdjęcia
      }
      this.employees.push(newEmployee); // Dodanie nowego pracownika do listy
      console.log('Formularz wysłany', newEmployee);
      this.rejestracja.reset(); // Resetowanie formularza po wysłaniu
      this.photoPreview = null; // Resetowanie podglądu zdjęcia
    } else {
      console.log('Formularz jest niepoprawny');
    }
  }

  // Metoda usuwająca pracownika z listy
  deleteEmployee(employee: any): void {
    this.employees = this.employees.filter(emp => emp !== employee); // Usunięcie pracownika z listy
    console.log('Pracownik usunięty', employee);
  }

  // Metoda obsługująca zmianę pliku (zdjęcia)
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result; // Ustawienie podglądu zdjęcia
      };
      reader.readAsDataURL(file); // Wczytanie zdjęcia
    }
  }
}
