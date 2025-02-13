// galeria.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

interface Image {
  url: string;
  name: string;
}

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.css']
})
export class GaleriaComponent {
  images: Image[] = [];

  onFileSelected(event: any): void {
    const files = Array.from(event.target.files) as File[];
    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name
    }));
    this.images = [...this.images, ...newImages];
  }

  removeImage(index: number): void {
    this.images.splice(index, 1);
  }

  drop(event: CdkDragDrop<Image[]>) {
    moveItemInArray(this.images, event.previousIndex, event.currentIndex);
  }
}