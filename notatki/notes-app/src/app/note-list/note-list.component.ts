import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../services/note.service';
import { Note } from '../models/note.model';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, HttpClientModule],
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
        this.notes = notes.sort((a, b) => (a.order || 0) - (b.order || 0));
        this.filteredNotes = [...this.notes];
      },
      error: (err) => console.error('Błąd ładowania notatek', err)
    });
  }

  onDrop(event: CdkDragDrop<Note[]>) {
    moveItemInArray(this.filteredNotes, event.previousIndex, event.currentIndex);
    
    // Update order based on new position
    this.filteredNotes.forEach((note, index) => {
      note.order = index;
    });

    // Send update to backend
    this.noteService.updateNoteOrder(this.filteredNotes).subscribe({
      next: () => {
        console.log('Kolejność zaktualizowana');
      },
      error: (err) => console.error('Błąd aktualizacji kolejności', err)
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