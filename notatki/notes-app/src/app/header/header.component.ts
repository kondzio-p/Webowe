import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef; // Referencja do elementu input pliku
  user: any = null; // Informacje o bieżącym użytkowniku

  constructor(private userService: UserService, private router: Router) {}

  /**
   * Inicjalizuj komponent i subskrybuj aktualizacje użytkownika
   */
  ngOnInit(): void {
    // Subskrybuj zmiany użytkownika z UserService
    this.userService.currentUser$.subscribe((user) => {
      this.user = user;
    });
  }

  /**
   * Obsługuje wylogowanie użytkownika
   */
  logout(): void {
    this.userService.logout();
    this.router.navigate(['/auth']); // Przekieruj do strony autentykacji
  }

  /**
   * Obsługuje wybór i przesyłanie zdjęcia profilowego
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('profileImage', file);

      // Wyślij zdjęcie profilowe na serwer
      this.userService.updateProfileImage(formData).subscribe({
        next: () => {
          // Zdjęcie profilowe zostało zaktualizowane pomyślnie
        },
        error: (err) => {
          console.error('Błąd aktualizacji zdjęcia profilowego:', err);
        },
      });
    }
  }
}
