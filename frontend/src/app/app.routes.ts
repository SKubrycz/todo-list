import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { NotesComponent } from '../notes-list/notes/notes.component';
import { RegisterComponent } from '../auth/register/register.component';
import { LoginComponent } from '../auth/login/login.component';
import { VerifyComponent } from '../auth/verify/verify.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'verify', component: VerifyComponent },
  { path: 'notes', component: NotesComponent },
];
