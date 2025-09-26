import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { Label, SearchFilter } from '../notes/notes.model';
import { SelectTagComponent } from '../../shared/select-tag/select-tag.component';

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
export class NavbarComponent implements OnInit {
  @Input() options: Label[] = [];
  @Input() priorityPlaceholder: string = '';
  @Input() otherPlaceholder: string = '';

  protected priorityOptionLabel: string = '';
  protected priorityOptions: Label[] = [];
  protected prioritySelectedOption = '';

  protected otherOptionLabel: string = '';
  protected otherOptions: Label[] = [];
  protected otherSelectedOption = '';

  protected searchFilter: SearchFilter = {
    text: '',
    priority: null,
    other: null,
  };
  @Output() readonly searchFilterEvent: EventEmitter<SearchFilter> =
    new EventEmitter<SearchFilter>();
  @Output() readonly filterNotesEvent: EventEmitter<void> =
    new EventEmitter<void>();

  ngOnInit() {
    this.initializeLabels();
  }

  private initializeLabels() {
    this.priorityOptions = this.options.filter(
      (label) =>
        label.kind === 'priority' && Object.keys(label).includes('priority')
    );
    this.otherOptions = this.options.filter((label) => label.kind === 'other');
  }

  protected clearAllFilters() {
    const emptyFilter: SearchFilter = {
      text: '',
      priority: null,
      other: null,
    };

    this.priorityOptionLabel = '';
    this.prioritySelectedOption = '';
    this.otherOptionLabel = '';
    this.otherSelectedOption = '';

    this.searchFilter = emptyFilter;

    this.searchFilterEvent.emit(emptyFilter);
  }

  protected updateSearchText(newText: string) {
    this.searchFilter = {
      ...this.searchFilter,
      text: newText,
    };
    this.searchFilterEvent.emit(this.searchFilter);
  }
  protected updateSearchPriority(newPriority: Label | null) {
    this.searchFilter = {
      ...this.searchFilter,
      priority: newPriority,
    };
    this.searchFilterEvent.emit(this.searchFilter);
  }
  protected updateSearchOther(newOther: Label | null) {
    this.searchFilter = {
      ...this.searchFilter,
      other: newOther,
    };
    this.searchFilterEvent.emit(this.searchFilter);
  }
}
