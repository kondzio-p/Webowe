import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteFormComponent } from '../note-form/note-form.component';
import { NoteListComponent } from '../note-list/note-list.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, HeaderComponent, NoteFormComponent, NoteListComponent],
  template: `
    <app-header></app-header>
    <div class="container-fluid py-4">
      <div class="row">
        <div class="col-md-4 mb-4 mb-md-0">
          <app-note-form></app-note-form>
        </div>
        <div class="col-md-8">
          <app-note-list></app-note-list>
        </div>
      </div>
    </div>
  `
})
export class NotesComponent {}