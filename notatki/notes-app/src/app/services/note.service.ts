import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Note } from '../models/note.model';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private apiUrl = 'http://localhost:3000/api/notes';
  private noteAddedSubject = new Subject<void>();
  private noteToEditSubject = new Subject<Note>();

  noteAdded$ = this.noteAddedSubject.asObservable();
  noteToEdit$ = this.noteToEditSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Pobieranie wszystkich notatek
  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.apiUrl);
  }

  // Pobieranie pojedynczej notatki
  getNote(id: number): Observable<Note> {
    return this.http.get<Note>(`${this.apiUrl}/${id}`);
  }

  // Tworzenie nowej notatki
  createNote(noteData: FormData): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, noteData);
  }

  // Aktualizacja istniejącej notatki
  updateNote(id: number, noteData: FormData): Observable<Note> {
    if (!noteData.has('id')) {
      noteData.append('id', id.toString());
    }
    return this.http.put<Note>(`${this.apiUrl}/${id}`, noteData);
  }

  // Aktualizacja kolejności notatek
  updateNoteOrder(notes: Note[]): Observable<any> {
    const updates = notes.map((note, index) => ({
      id: note.id,
      order: index,
    }));
    return this.http.put(`${this.apiUrl}/update-order`, updates);
  }

  // Usuwanie notatki
  deleteNote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Powiadomienie o dodaniu notatki
  notifyNoteAdded(): void {
    this.noteAddedSubject.next();
  }

  // Ustawienie notatki do edycji
  setNoteToEdit(note: Note): void {
    this.noteToEditSubject.next(note);
  }
}
