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
  @ViewChild('fileInput') fileInput!: ElementRef;

  note: Note = {
    title: '',
    content: '',
    sensitive: false,
  };
  selectedFile: File | null = null;
  isEditing = false;
  private editSubscription!: Subscription;

  constructor(private noteService: NoteService) {}

  ngOnInit(): void {
    this.editSubscription = this.noteService.noteToEdit$.subscribe((note) => {
      if (note) {
        this.isEditing = true;
        this.note = { ...note };
      }
    });
  }

  ngOnDestroy(): void {
    this.editSubscription.unsubscribe();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('title', this.note.title);
    formData.append('content', this.note.content);
    formData.append('sensitive', this.note.sensitive ? 'true' : 'false');

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    if (this.isEditing && this.note.id) {
      formData.append('id', this.note.id.toString());
      this.noteService.updateNote(this.note.id, formData).subscribe({
        next: () => {
          this.resetForm();
          this.noteService.notifyNoteAdded();
        },
        error: (err) => console.error('Update error:', err),
      });
    } else {
      this.noteService.createNote(formData).subscribe({
        next: () => {
          this.resetForm();
          this.noteService.notifyNoteAdded();
        },
        error: (err) => console.error('Create error:', err),
      });
    }
  }

  resetForm(): void {
    this.note = { title: '', content: '', sensitive: false };
    this.selectedFile = null;
    this.isEditing = false;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  cancelEdit(): void {
    this.resetForm();
  }
}
