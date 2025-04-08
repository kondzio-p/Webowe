import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  // Sprawdza czy użytkownik jest zalogowany i ma dostęp do chronionej ścieżki
  canActivate(): boolean {
    if (this.userService.isLoggedIn) {
      return true;
    }

    this.router.navigate(['/auth']);
    return false;
  }
}
