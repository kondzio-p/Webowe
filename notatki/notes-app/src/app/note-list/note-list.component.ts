import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../services/note.service';
import { Note } from '../models/note.model';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css']
})
export class NoteListComponent implements OnInit {
  @ViewChild('startDate') startDateInput!: ElementRef;
  @ViewChild('endDate') endDateInput!: ElementRef;

  notes: Note[] = [];
  filteredNotes: Note[] = [];

  constructor(private noteService: NoteService) {}

  ngOnInit(): void {
    this.loadNotes();
    this.noteService.noteAdded$.subscribe(() => this.loadNotes());
  }

  loadNotes(): void {
    this.noteService.getNotes().subscribe({
      next: (notes) => {
        this.notes = notes;
        this.filteredNotes = [...notes];
      },
      error: (err) => console.error('Błąd ładowania notatek', err)
    });
  }

  filterByDateRange(startDate: string, endDate: string): void {
    if (!startDate || !endDate) {
      this.filteredNotes = [...this.notes];
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59);

    this.filteredNotes = this.notes.filter(note => {
      if (!note.createdAt) return false;
      const noteDate = new Date(note.createdAt);
      return noteDate >= start && noteDate <= end;
    });
  }

  resetFilters(): void {
    this.startDateInput.nativeElement.value = '';
    this.endDateInput.nativeElement.value = '';
    this.filteredNotes = [...this.notes];
  }

  deleteNote(id: number): void {
    this.noteService.deleteNote(id).subscribe({
      next: () => {
        this.notes = this.notes.filter(note => note.id !== id);
        this.filteredNotes = this.filteredNotes.filter(note => note.id !== id);
      },
      error: (err) => console.error('Błąd usuwania notatki', err)
    });
  }

  editNote(note: Note): void {
    this.noteService.setNoteToEdit({...note});
  }
}