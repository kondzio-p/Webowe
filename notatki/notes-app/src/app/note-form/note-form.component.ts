import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Add this import
import { NoteService } from '../services/note.service';
import { Note } from '../models/note.model';

@Component({
  selector: 'app-note-form',
  standalone: true, // Add this line
  imports: [FormsModule], // Add this line
  templateUrl: './note-form.component.html',
  styleUrl: './note-form.component.css',
})
export class NoteFormComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  note: Note = {
    title: '',
    content: '',
  };
  selectedFile: File | null = null;

  constructor(private noteService: NoteService) {}

  ngOnInit(): void {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('title', this.note.title);
    formData.append('content', this.note.content);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.noteService.createNote(formData).subscribe(
      (response) => {
        this.resetForm();
        // Wywołaj metodę odświeżającą listę notatek
        this.noteService.notifyNoteAdded();
      },
      (error) => {
        console.error('Błąd podczas dodawania notatki', error);
      }
    );
  }

  resetForm(): void {
    this.note.title = '';
    this.note.content = '';
    this.selectedFile = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
