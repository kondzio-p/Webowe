import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  moveItemInArray,
  DragDropModule,
} from '@angular/cdk/drag-drop'; // Do zmiany kolejności przez przeciąganie
import { Subscription } from 'rxjs';
import { NoteService } from '../services/note.service';
import { Note } from '../models/note.model';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
declare var bootstrap: any; // Bootstrap JS dla modalów

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css'],
})
export class NoteListComponent implements OnInit, OnDestroy {
  notes: Note[] = []; // Wszystkie notatki
  filteredNotes: Note[] = []; // Notatki po filtrowaniu
  selectedNote: Note | null = null; // Notatka wybrana do szczegółowego podglądu
  showFilters: boolean = false; // Przełącznik widoczności filtrów
  unblurredNotes: { [key: number]: boolean } = {}; // Śledź które wrażliwe notatki są odblokowane
  private notesSubscription!: Subscription; // Subskrypcja aktualizacji notatek
  private contentModal: any; // Referencja do modala Bootstrap

  constructor(
    private noteService: NoteService,
    private userService: UserService,
    private router: Router
  ) {}

  /**
   * Inicjalizuj komponent i załaduj notatki jeśli użytkownik jest zalogowany
   */
  ngOnInit(): void {
    // Przekieruj do autentykacji jeśli nie zalogowany
    if (!this.userService.isLoggedIn) {
      this.router.navigate(['/auth']);
      return;
    }

    this.loadNotes();
    // Subskrybuj powiadomienia o zmianach notatek
    this.notesSubscription = this.noteService.noteAdded$.subscribe(() => {
      this.loadNotes();
    });
  }

  /**
   * Inicjalizuj modal Bootstrap po renderowaniu widoku
   */
  ngAfterViewInit() {
    this.contentModal = new bootstrap.Modal(
      document.getElementById('contentModal')
    );
  }

  /**
   * Wyczyść subskrypcje gdy komponent jest niszczony
   */
  ngOnDestroy(): void {
    if (this.notesSubscription) {
      this.notesSubscription.unsubscribe();
    }
  }

  /**
   * Załaduj notatki z serwera i posortuj według kolejności
   */
  loadNotes(): void {
    this.noteService.getNotes().subscribe({
      next: (data) => {
        // Sortuj notatki według właściwości order
        this.notes = data.sort((a, b) => (a.order || 0) - (b.order || 0));
        this.filteredNotes = [...this.notes]; // Inicjalizuj przefiltrowane notatki wszystkimi notatkami
      },
      error: (err) => console.error('Błąd ładowania notatek:', err),
    });
  }

  /**
   * Przełącz widoczność panelu filtrów
   */
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  /**
   * Wyślij notatkę do komponentu formularza do edycji
   */
  editNote(note: Note): void {
    this.noteService.setNoteToEdit(note);
  }

  /**
   * Usuń notatkę z potwierdzeniem
   */
  deleteNote(id: number): void {
    if (confirm('Czy na pewno chcesz usunąć tę notatkę?')) {
      this.noteService.deleteNote(id).subscribe({
        next: () => {
          // Usuń usuniętą notatkę z tablic
          this.notes = this.notes.filter((note) => note.id !== id);
          this.filteredNotes = this.filteredNotes.filter(
            (note) => note.id !== id
          );
        },
        error: (err) => console.error('Błąd usuwania notatki:', err),
      });
    }
  }

  /**
   * Filtruj notatki według zakresu dat
   */
  filterByDateRange(startDateStr: string, endDateStr: string): void {
    if (!startDateStr && !endDateStr) {
      // Resetuj do wszystkich notatek jeśli nie podano dat
      this.filteredNotes = [...this.notes];
      return;
    }

    // Przekształć ciągi znaków dat na obiekty Date
    const startDate = startDateStr ? new Date(startDateStr) : new Date(0);
    const endDate = endDateStr ? new Date(endDateStr) : new Date();
    endDate.setHours(23, 59, 59, 999); // Ustaw na koniec dnia

    // Filtruj notatki według daty
    this.filteredNotes = this.notes.filter((note) => {
      const noteDate = new Date(note.createdAt!);
      return noteDate >= startDate && noteDate <= endDate;
    });
  }

  /**
   * Zresetuj wszystkie filtry i pola formularza
   */
  resetFilters(): void {
    const startDateInput = document.getElementById(
      'startDate'
    ) as HTMLInputElement;
    const endDateInput = document.getElementById('endDate') as HTMLInputElement;

    // Wyczyść pola dat
    if (startDateInput) startDateInput.value = '';
    if (endDateInput) endDateInput.value = '';

    // Zresetuj do wszystkich notatek
    this.filteredNotes = [...this.notes];
  }

  /**
   * Obsługuj zmianę kolejności notatek przez przeciąganie
   */
  onDrop(event: CdkDragDrop<Note[]>): void {
    // Zaktualizuj lokalną tablicę
    moveItemInArray(
      this.filteredNotes,
      event.previousIndex,
      event.currentIndex
    );

    // Zaktualizuj właściwość order wszystkich notatek
    const updatedNotes = this.filteredNotes.map((note, index) => ({
      ...note,
      order: index,
    }));

    // Wyślij zaktualizowaną kolejność na serwer
    this.noteService.updateNoteOrder(updatedNotes).subscribe({
      next: () => {
        this.notes = [...updatedNotes];
      },
      error: (err) => console.error('Błąd aktualizacji kolejności:', err),
    });
  }

  /**
   * Pokaż pełną zawartość notatki w modal
   */
  showFullContent(note: Note): void {
    this.selectedNote = note;
    this.contentModal.show();
  }

  /**
   * Odkryj zamazaną wrażliwą zawartość
   */
  revealContent(note: Note): void {
    if (note.id !== undefined) {
      this.unblurredNotes[note.id] = true; // Śledź które wrażliwe notatki są odkryte
    }
  }
}
