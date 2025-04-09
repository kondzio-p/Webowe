import { Routes } from '@angular/router';
import { ListViewComponent } from './components/list-view/list-view.component';
import { ListFormComponent } from './components/list-form/list-form.component';

export const routes: Routes = [
  { path: '', component: ListViewComponent },
  { path: 'new-list', component: ListFormComponent },
  { path: 'edit-list/:id', component: ListFormComponent },
  { path: '**', redirectTo: '' }
];