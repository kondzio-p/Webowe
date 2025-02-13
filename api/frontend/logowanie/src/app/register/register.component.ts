import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, HttpClientModule, RouterLink, RouterOutlet],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone: true
})
export class RegisterComponent {
  user = {
    username: '',
    password: ''
  };

  komunikat: boolean = false;
  isSubmitted: boolean = false;

  private apiUrl = 'http://localhost:3000'
  constructor(private http: HttpClient){};

  register() {
    this.isSubmitted = true;
    this.http.post<any>(`${this.apiUrl}/register`, this.user).subscribe({
      next: (response) => {
        //console.log(response);
        this.komunikat = true;
      },
      error: (error) => {
        //console.log(error);
        this.komunikat = false;
      }
    });
    this.user = {username: '', password: ''};
  }
}