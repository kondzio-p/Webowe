import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-panel',
  imports: [CommonModule, FormsModule],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})
export class PanelComponent {
constructor(private router: Router) {
  //D
}

logout() {
  this.router.navigate(['/login']);
}
}
