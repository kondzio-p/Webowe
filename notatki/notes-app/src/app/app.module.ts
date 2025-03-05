import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { NoteFormComponent } from './note-form/note-form.component';
import { NoteListComponent } from './note-list/note-list.component';
import { NoteService } from './services/note.service'; // Add this import

@NgModule({
  declarations: [AppComponent, NoteFormComponent, NoteListComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule],
  providers: [NoteService], // Add this line
  bootstrap: [AppComponent],
})
export class AppModule {}
