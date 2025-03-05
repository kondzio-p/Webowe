import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NoteFormComponent } from './note-form/note-form.component';
import { NoteListComponent } from './note-list/note-list.component';
import { NoteService } from './services/note.service'; // Add this import

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NoteFormComponent,
    NoteListComponent,
  ],
  providers: [NoteService], // Add this line
  template: `
    <div class="container mt-5">
      <h1 class="text-center mb-4">Notatki</h1>
      <div class="row">
        <div class="col-md-4">
          <app-note-form></app-note-form>
        </div>
        <div class="col-md-8">
          <app-note-list></app-note-list>
        </div>
      </div>
    </div>
  `,
})
export class AppComponent {
  title = 'notesApp';
}
