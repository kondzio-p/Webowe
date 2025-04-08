import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  // Pola formularza
  username: string = '';
  password: string = '';
  isLogin: boolean = false; // Przełącznik między logowaniem a rejestracją
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router) {}

  /**
   * Przełącza między widokiem logowania i rejestracji
   */
  toggleAuthMode(): void {
    this.isLogin = !this.isLogin;
    this.errorMessage = ''; // Wyczyść ewentualne komunikaty o błędach
  }

  /**
   * Obsługuje wysłanie formularza zarówno dla logowania jak i rejestracji
   */
  onSubmit(): void {
    // Podstawowa walidacja formularza
    if (!this.username || !this.password) {
      this.errorMessage = 'Proszę wypełnić wszystkie pola';
      return;
    }

    if (this.isLogin) {
      // Obsługa logowania
      this.userService.login(this.username, this.password).subscribe({
        next: () => {
          // Przekieruj do strony notatek po udanym logowaniu
          this.router.navigate(['/notes']);
        },
        error: (error) => {
          // Wyświetl komunikat o błędzie
          this.errorMessage =
            'Błąd logowania: ' +
            (error.error?.message || 'Nieprawidłowe dane logowania');
        },
      });
    } else {
      // Obsługa rejestracji
      this.userService.register(this.username, this.password).subscribe({
        next: () => {
          // Przekieruj do strony notatek po udanej rejestracji
          this.router.navigate(['/notes']);
        },
        error: (error) => {
          // Wyświetl komunikat o błędzie
          this.errorMessage =
            'Błąd rejestracji: ' +
            (error.error?.message || 'Użytkownik już istnieje');
        },
      });
    }
  }
}
