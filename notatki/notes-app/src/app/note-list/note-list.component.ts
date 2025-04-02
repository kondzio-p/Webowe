import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { NoteService } from '../services/note.service';
import { Note } from '../models/note.model';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
declare var bootstrap: any;

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css']
})
export class NoteListComponent implements OnInit, OnDestroy {
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  selectedNote: Note | null = null;
  expandedNotes: {[key: number]: boolean} = {};
  showFilters: boolean = false;
  private notesSubscription!: Subscription;
  private contentModal: any;

  constructor(
    private noteService: NoteService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.userService.isLoggedIn) {
      this.router.navigate(['/auth']);
      return;
    }

    this.loadNotes();
    this.notesSubscription = this.noteService.noteAdded$.subscribe(() => {
      this.loadNotes();
    });
  }

  ngAfterViewInit() {
    this.contentModal = new bootstrap.Modal(document.getElementById('contentModal'));
  }

  ngOnDestroy(): void {
    if (this.notesSubscription) {
      this.notesSubscription.unsubscribe();
    }
  }

  loadNotes(): void {
    this.noteService.getNotes().subscribe({
      next: (data) => {
        this.notes = data.sort((a, b) => (a.order || 0) - (b.order || 0));
        this.filteredNotes = [...this.notes];
        
        // Initialize expanded state for all notes to false
        this.notes.forEach(note => {
          if (note.id !== undefined && this.expandedNotes[note.id] === undefined) {
            this.expandedNotes[note.id] = false;
          }
        });
      },
      error: (err) => console.error('Error loading notes:', err)
    });
  }

  toggleNote(note: Note): void {
    if (note.id !== undefined) {
      this.expandedNotes[note.id] = !this.expandedNotes[note.id];
    }
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  editNote(note: Note): void {
    this.noteService.setNoteToEdit(note);
  }

  deleteNote(id: number): void {
    if (confirm('Czy na pewno chcesz usunąć tę notatkę?')) {
      this.noteService.deleteNote(id).subscribe({
        next: () => {
          this.notes = this.notes.filter(note => note.id !== id);
          this.filteredNotes = this.filteredNotes.filter(note => note.id !== id);
        },
        error: (err) => console.error('Error deleting note:', err)
      });
    }
  }

  filterByDateRange(startDateStr: string, endDateStr: string): void {
    if (!startDateStr && !endDateStr) {
      this.filteredNotes = [...this.notes];
      return;
    }

    const startDate = startDateStr ? new Date(startDateStr) : new Date(0);
    const endDate = endDateStr ? new Date(endDateStr) : new Date();
    endDate.setHours(23, 59, 59, 999); // Set to end of day

    this.filteredNotes = this.notes.filter(note => {
      const noteDate = new Date(note.createdAt!);
      return noteDate >= startDate && noteDate <= endDate;
    });
  }

  resetFilters(): void {
    const startDateInput = document.getElementById('startDate') as HTMLInputElement;
    const endDateInput = document.getElementById('endDate') as HTMLInputElement;
    
    if (startDateInput) startDateInput.value = '';
    if (endDateInput) endDateInput.value = '';
    
    this.filteredNotes = [...this.notes];
  }

  onDrop(event: CdkDragDrop<Note[]>): void {
    moveItemInArray(this.filteredNotes, event.previousIndex, event.currentIndex);
    
    // Update order of all notes
    const updatedNotes = this.filteredNotes.map((note, index) => ({
      ...note,
      order: index
    }));
    
    this.noteService.updateNoteOrder(updatedNotes).subscribe({
      next: () => {
        this.notes = [...updatedNotes];
      },
      error: (err) => console.error('Error updating order:', err)
    });
  }

  showFullContent(note: Note): void {
    this.selectedNote = note;
    this.contentModal.show();
  }
}