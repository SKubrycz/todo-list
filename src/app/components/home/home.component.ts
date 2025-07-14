import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ButtonModule, TimelineModule],
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

  ngOnInit() {
    this.joinedWords = this.joinedWords + ' ' + this.joinedWords;
  }

  ngAfterViewInit() {}
}
