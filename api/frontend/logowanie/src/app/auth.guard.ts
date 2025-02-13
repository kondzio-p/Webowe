import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class AuthGuard implements CanActivate {
  constructor(private router: Router) {
    // tu coś będzie
  }
}