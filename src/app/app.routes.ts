import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { NotesComponent } from '../notes-list/notes/notes.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'notes', component: NotesComponent },
];
