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

  ngOnInit() {
    this.joinedWords = this.joinedWords + ' ' + this.joinedWords;
  }

  ngAfterViewInit() {}
}
