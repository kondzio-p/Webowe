import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, HttpClientModule, RouterOutlet],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent {

  users: any[] = [];
  user = {
    username: '',
    password: ''
  };

  komunikat: boolean = false;
  isSubmitted: boolean = false;

  private apiUrl = 'http://localhost:3000';
  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.isSubmitted = true;
    this.http.post<any>(`${this.apiUrl}/login`, this.user).subscribe({
      next: (response) => {
        this.komunikat = true;

        setTimeout(() => {
          this.router.navigate(['/panel']);
        }, 3000);
      },
      error: (error) => {
        this.komunikat = false;
      }
    });
    this.user = { username: '', password: '' };
  }
}