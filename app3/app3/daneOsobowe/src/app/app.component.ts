import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OsobyComponent } from "./osoby/osoby.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, OsobyComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'daneOsobowe';
}
