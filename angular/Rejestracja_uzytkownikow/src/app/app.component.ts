import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RejestracjaComponent } from "./rejestracja/rejestracja.component";


@Component({
  selector: 'app-root',
  imports: [RejestracjaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Rejestracja_uzytkownikow';
}
