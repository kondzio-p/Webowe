import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <h1>{{title}}!</h1>
    <h2>{{imie}}</h2>
    <p>Potęga 3 do 8 to {{potega}}</p>
    <p>Losowa to: {{losowa}}</p>
    <img src="{{zdjecie}}" alt="My Image" width="300px">
    <img [src]="zdjecie" width="300px">

    <div *ngFor = "let img of imgs">
      <img [src]="img.src" [alt]="img.alt" width="300px">
    </div>

    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent {
  title: string = 'myFirstApp';
  imie: string = 'Andrzej';
  potega: number = Math.pow(3,8);
  losowa: number = Math.floor(Math.random() * 10) + 1;
  zdjecie: string = '/assets/images/pantera2.jpg';

  imgs = [ {src:'assets/images/pantera.jpg', alt:'pantera'},
          {src:'assets/images/pantera2.jpg', alt:'pantera2'}, 
          {src:'assets/images/pantera3.jpg', alt:'pantera3'},
          {src:'assets/images/wilk1.jpg', alt:'wilk1'},
        ]
}
