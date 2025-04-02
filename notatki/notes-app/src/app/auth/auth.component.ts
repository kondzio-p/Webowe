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
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  username: string = '';
  password: string = '';
  isLogin: boolean = false;
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  toggleAuthMode(): void {
    this.isLogin = !this.isLogin;
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Proszę wypełnić wszystkie pola';
      return;
    }

    if (this.isLogin) {
      this.userService.login(this.username, this.password).subscribe({
        next: () => {
          this.router.navigate(['/notes']);
        },
        error: (error) => {
          this.errorMessage = 'Błąd logowania: ' + (error.error?.message || 'Nieprawidłowe dane logowania');
        }
      });
    } else {
      this.userService.register(this.username, this.password).subscribe({
        next: () => {
          this.router.navigate(['/notes']);
        },
        error: (error) => {
          this.errorMessage = 'Błąd rejestracji: ' + (error.error?.message || 'Użytkownik już istnieje');
        }
      });
    }
  }
}