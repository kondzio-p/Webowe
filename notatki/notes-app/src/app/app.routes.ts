import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { NotesComponent } from './notes/notes.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/notes', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  { path: 'notes', component: NotesComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/notes' }
];