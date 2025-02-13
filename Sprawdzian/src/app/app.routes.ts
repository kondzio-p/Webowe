import { Routes } from '@angular/router';
import { ProjektyComponent } from './projekty/projekty.component';
import { HomeComponent } from './home/home.component';
import { ONasComponent } from './o-nas/o-nas.component';

export const routes: Routes = [
    // Dodanie routing'u
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'o-nas', component: ONasComponent},
    {path: 'projekty', component: ProjektyComponent},
];
