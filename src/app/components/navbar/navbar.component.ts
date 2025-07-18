import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import {
  Label,
  LabelText,
  LabelTextForPriority,
  SearchFilter,
} from '../../types/types';
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
  @Input() options: Label[] = [];
  @Input() optionLabel: string = '';
  @Input() placeholder: string = '';
  protected selectedOption = this.options[0] ?? '';

  protected searchFilter: SearchFilter = {
    text: '',
    priority: LabelText.STANDARD,
  };
  @Output() readonly searchFilterEvent: EventEmitter<SearchFilter> =
    new EventEmitter<SearchFilter>();
  @Output() readonly filterNotesEvent: EventEmitter<void> =
    new EventEmitter<void>();

  protected labelList: Label[] = [
    STANDARD,
    SECONDARY,
    URGENT,
    HIGHEST_PRIORITY,
  ];

  updateSearchText(newText: string) {
    this.searchFilter = {
      ...this.searchFilter,
      text: newText,
    };
    this.searchFilterEvent.emit(this.searchFilter);
  }
  updateSearchPriority(newPriority: LabelTextForPriority | null) {
    this.searchFilter = {
      ...this.searchFilter,
      priority: newPriority,
    };
    this.searchFilterEvent.emit(this.searchFilter);
  }

  receiveSelectedOption(value: Label) {
    if (!value) this.updateSearchPriority(value);
    else this.updateSearchPriority(value.text as LabelTextForPriority);
  }
}
