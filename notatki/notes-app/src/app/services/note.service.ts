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

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.apiUrl);
  }

  getNote(id: number): Observable<Note> {
    return this.http.get<Note>(`${this.apiUrl}/${id}`);
  }

  createNote(noteData: FormData): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, noteData);
  }

  updateNote(id: number, noteData: FormData): Observable<Note> {
    if (!noteData.has('id')) {
      noteData.append('id', id.toString());
    }
    return this.http.put<Note>(`${this.apiUrl}/${id}`, noteData);
  }

  updateNoteOrder(notes: Note[]): Observable<any> {
    const updates = notes.map((note, index) => ({
      id: note.id,
      order: index
    }));
    return this.http.put(`${this.apiUrl}/update-order`, updates);
  }

  deleteNote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  notifyNoteAdded(): void {
    this.noteAddedSubject.next();
  }

  setNoteToEdit(note: Note): void {
    this.noteToEditSubject.next(note);
  }
}