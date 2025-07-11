import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { Label } from '../../types/types';
import {
  HIGHEST_PRIORITY,
  SECONDARY,
  STANDARD,
  URGENT,
} from '../../constants/labels';
import { SelectTagComponent } from '../select-tag/select-tag.component';

@Component({
  selector: 'app-navbar',
  imports: [
    FormsModule,
    ToolbarModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    SelectTagComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @Input() options: any[] = [];
  @Input() optionLabel: string = '';
  @Input() placeholder: string = '';
  protected selectedOption = this.options[0] ?? '';

  protected labelList: Label[] = [
    STANDARD,
    SECONDARY,
    URGENT,
    HIGHEST_PRIORITY,
  ];
}
