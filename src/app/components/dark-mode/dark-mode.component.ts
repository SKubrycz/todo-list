import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-dark-mode',
  templateUrl: 'dark-mode.component.html',
  styleUrl: 'dark-mode.component.css',
  imports: [],
})
export class DarkModeComponent {
  darkMode = false;
  document = inject(DOCUMENT);

  toggleDarkMode() {
    const html = this.document.querySelector('html');
    if (!html) return;
    if (!this.darkMode) {
      html.classList.remove('my-app-light');
      html.classList.add('my-app-dark');
      this.darkMode = true;
    } else {
      html.classList.remove('my-app-dark');
      html.classList.add('my-app-light');
      this.darkMode = false;
    }
  }
}
