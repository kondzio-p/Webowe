import { CommonModule } from '@angular/common';
import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../services/note.service';
import { Note } from '../models/note.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.css'],
})
export class NoteFormComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef; // Referencja do elementu input pliku

  // Model danych notatki
  note: Note = {
    title: '',
    content: '',
    sensitive: false,
  };
  selectedFile: File | null = null; // Przechowuj wybrany plik obrazka
  isEditing = false; // Śledź czy tworzymy czy edytujemy notatkę
  private editSubscription!: Subscription; // Subskrypcja zdarzeń edycji notatki

  constructor(private noteService: NoteService) {}

  /**
   * Subskrybuj zdarzenia edycji notatki z serwisu
   */
  ngOnInit(): void {
    this.editSubscription = this.noteService.noteToEdit$.subscribe((note) => {
      if (note) {
        // Jeśli otrzymano notatkę, przejdź w tryb edycji
        this.isEditing = true;
        this.note = { ...note }; // Sklonuj notatkę aby uniknąć bezpośredniej referencji
      }
    });
  }

  /**
   * Wyczyść subskrypcje gdy komponent jest niszczony
   */
  ngOnDestroy(): void {
    this.editSubscription.unsubscribe();
  }

  /**
   * Obsługuje wybór pliku dla załączników notatki
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  /**
   * Przetwarza wysłanie formularza zarówno dla tworzenia jak i aktualizacji
   */
  onSubmit(): void {
    // Utwórz FormData do obsługi żądania multipart/form-data
    const formData = new FormData();
    formData.append('title', this.note.title);
    formData.append('content', this.note.content);
    formData.append('sensitive', this.note.sensitive ? 'true' : 'false');

    // Dodaj plik obrazka jeśli wybrano
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    if (this.isEditing && this.note.id) {
      // Aktualizuj istniejącą notatkę
      formData.append('id', this.note.id.toString());
      this.noteService.updateNote(this.note.id, formData).subscribe({
        next: () => {
          this.resetForm();
          this.noteService.notifyNoteAdded(); // Powiadom listę o odświeżeniu
        },
        error: (err) => console.error('Błąd aktualizacji:', err),
      });
    } else {
      // Utwórz nową notatkę
      this.noteService.createNote(formData).subscribe({
        next: () => {
          this.resetForm();
          this.noteService.notifyNoteAdded(); // Powiadom listę o odświeżeniu
        },
        error: (err) => console.error('Błąd tworzenia:', err),
      });
    }
  }

  /**
   * Resetuj formularz do stanu początkowego
   */
  resetForm(): void {
    this.note = { title: '', content: '', sensitive: false };
    this.selectedFile = null;
    this.isEditing = false;
    // Wyczyść input pliku
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  /**
   * Anuluj edycję i resetuj formularz
   */
  cancelEdit(): void {
    this.resetForm();
  }
}
