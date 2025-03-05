import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Add this import
import { NoteService } from '../services/note.service';
import { Note } from '../models/note.model';

@Component({
  selector: 'app-note-list',
  standalone: true, // Add this line
  imports: [CommonModule], // Add this line
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.css',
})
export class NoteListComponent implements OnInit {
  notes: Note[] = [];

  constructor(private noteService: NoteService) {}

  ngOnInit(): void {
    this.loadNotes();

    // Subskrybuj do powiadomień o dodaniu nowej notatki
    this.noteService.noteAdded$.subscribe(() => {
      this.loadNotes();
    });
  }

  loadNotes(): void {
    this.noteService.getNotes().subscribe(
      (notes) => {
        this.notes = notes;
      },
      (error) => {
        console.error('Błąd ładowania notatek', error);
      }
    );
  }

  deleteNote(id: number): void {
    this.noteService.deleteNote(id).subscribe(
      () => {
        this.notes = this.notes.filter((note) => note.id !== id);
      },
      (error) => {
        console.error('Błąd usuwania notatki', error);
      }
    );
  }

  editNote(note: Note): void {
    console.log('Edycja notatki', note);
  }
}
