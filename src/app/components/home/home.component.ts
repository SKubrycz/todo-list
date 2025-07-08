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

  ngOnInit() {
    this.joinedWords = this.joinedWords + ' ' + this.joinedWords;
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const words = this.elementRef.nativeElement.querySelector('.words');
      const space = this.elementRef.nativeElement.querySelector('#space');
      const wordsChildren = words.children;
      let fullWidth = 0;
      for (const child of wordsChildren) {
        fullWidth +=
          child.offsetWidth + space.offsetWidth + space.offsetWidth / 2 - 1;
      }

      words.animate(
        [
          { transform: 'translateX(0)' },
          { transform: `translate(-${fullWidth / 2}px)` },
        ],
        {
          duration: 9000,
          iterations: Infinity,
        }
      );
    }
  }
}
