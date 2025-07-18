import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ButtonModule, TimelineModule, AnimateOnScrollModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, AfterViewInit {
  protected elementRef = inject(ElementRef);

  protected wordsList = [
    'Create',
    'Plan',
    'Complete',
    'Schedule',
    'Reorder',
    'Apply',
  ];
  protected joinedWords = this.wordsList.join(' ');
  protected timelineValues = ['Plan', 'Create', 'Schedule', 'Complete'];
  protected timelinePoints = [
    {
      id: 0,
      header: this.timelineValues[0],
      description: 'Decide what to put on a list',
      iconClass: 'pi pi-lightbulb',
    },
    {
      id: 1,
      header: this.timelineValues[1],
      description:
        'Add notes describing what and how you want to achieve your goal',
      iconClass: 'pi pi-plus',
    },
    {
      id: 2,
      header: this.timelineValues[2],
      description: 'Prepare a finish date',
      iconClass: 'pi pi-calendar',
    },
    {
      id: 3,
      header: this.timelineValues[3],
      description: 'Cross finished goals from the list!',
      iconClass: 'pi pi-check',
    },
  ];
  protected scrollButton: HTMLElement | null = null;
  protected scrollAnimationEnd: (() => void) | null = null;
  protected isAtBottom = false;

  ngOnInit() {
    this.joinedWords = this.joinedWords + ' ' + this.joinedWords;
    this.scrollButton = this.elementRef.nativeElement.querySelector(
      '#scroll-down-button'
    ) as HTMLElement;
  }

  ngAfterViewInit() {}

  @HostListener('window:scroll', ['$event'])
  @HostListener('')
  checkIsAtBottom() {
    this.isAtBottom =
      window.scrollY + window.innerHeight >= document.body.scrollHeight;

    if (!this.scrollButton) return;
    if (this.isAtBottom) {
      this.scrollButton.style.animation = `800ms fadeOut 1`;

      if (this.scrollAnimationEnd) {
        this.scrollButton.removeEventListener(
          'animationend',
          this.scrollAnimationEnd
        );
        this.scrollAnimationEnd = null;
      }

      this.scrollAnimationEnd = () => {
        if (this.scrollButton) this.scrollButton.style.display = 'none';

        if (this.scrollButton && this.scrollAnimationEnd) {
          this.scrollButton.removeEventListener(
            'animationend',
            this.scrollAnimationEnd
          );
          this.scrollAnimationEnd = null;
        }
      };

      this.scrollButton.addEventListener(
        'animationend',
        this.scrollAnimationEnd
      );
    } else {
      this.scrollButton.style.animation = '2000ms bounceTranslated infinite';
      this.scrollButton.style.display = 'flex';
    }
  }

  scrollDown(e: MouseEvent) {
    if (e) {
      window.scrollBy({
        left: 0,
        top: document.body.scrollHeight - window.innerHeight,
      });
    }
  }
}
