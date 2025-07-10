import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, AfterViewInit {
  protected elementRef = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);

  protected wordsList = [
    'Create',
    'Plan',
    'Complete',
    'Schedule',
    'Reorder',
    'Apply',
  ];
  protected joinedWords = this.wordsList.join(' ');

  ngOnInit() {
    this.joinedWords = this.joinedWords + ' ' + this.joinedWords;
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const words = this.elementRef.nativeElement.querySelector('.words');
      const wordsChildren = words.children;
      let fullWidth = 0;
      for (const child of wordsChildren) {
        const childWidth = child.getBoundingClientRect().width;
        fullWidth += childWidth;
      }

      words.animate(
        [
          { transform: 'translateX(0)' },
          { transform: `translate(-${fullWidth / 2}px)` },
        ],
        {
          duration: 10000,
          iterations: Infinity,
        }
      );
    }
  }
}
