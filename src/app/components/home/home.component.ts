import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  elementRef = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);

  wordsList = ['Create', 'Plan', 'Complete', 'Schedule', 'Reorder', 'Apply'];
  joinedWords = this.wordsList.join(' ');

  interval: NodeJS.Timeout | null = null;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const words = this.elementRef.nativeElement.querySelector('.words');
      words.animate(
        [{ transform: 'translateX(0)' }, { transform: 'translate(-100%)' }],
        {
          duration: 3000,
          iterations: Infinity,
        }
      );
    }
  }
}
