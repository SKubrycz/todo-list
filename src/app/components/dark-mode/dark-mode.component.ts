import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { afterNextRender, Component, Inject, PLATFORM_ID } from '@angular/core';
import { WINDOW } from '../../window';

@Component({
  selector: 'app-dark-mode',
  templateUrl: 'dark-mode.component.html',
  styleUrl: 'dark-mode.component.css',
  imports: [],
})
export class DarkModeComponent {
  private isBrowser: boolean;
  darkMode = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window
  ) {
    this.document = document;
    this.window = window;
    this.isBrowser = isPlatformBrowser(platformId);

    afterNextRender(() => {
      let result;
      if (this.isBrowser) {
        result = JSON.stringify(localStorage.getItem('darkmode'));
      }
      if (
        !result &&
        this.window &&
        this.window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        this.updateDarkMode(true);
      }
    });
  }

  updateDarkMode(value: boolean) {
    this.darkMode = value;
    this.toggleDarkMode();
  }

  ngOnInit() {
    if (this.isBrowser) {
      const result = JSON.stringify(localStorage.getItem('darkmode'));
      if (result && typeof Boolean(result) === 'boolean') {
        this.updateDarkMode(Boolean(result));
      }
    }
  }
  toggleDarkMode() {
    const html = this.document.querySelector('html');
    if (!html) return;
    if (this.darkMode) {
      html.classList.remove('my-app-light');
      html.classList.add('my-app-dark');
      if (this.isBrowser) {
        localStorage.setItem('darkmode', 'true');
      }
    } else {
      html.classList.remove('my-app-dark');
      html.classList.add('my-app-light');
      if (this.isBrowser) {
        localStorage.setItem('darkmode', 'false');
      }
    }
  }
}
