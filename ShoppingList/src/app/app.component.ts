import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StoreComponent } from './store/store.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, StoreComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ShoppingList';
}
