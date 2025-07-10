import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DarkModeComponent } from './components/dark-mode/dark-mode.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DarkModeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
