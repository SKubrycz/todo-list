import { Component, ElementRef, inject } from '@angular/core';
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
  wordsList = ["Create", "Plan", "Complete", "Schedule", "Reorder", "Apply"];

}
