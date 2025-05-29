import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NotesComponent } from './components/notes/notes.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'notes', component: NotesComponent },
];
