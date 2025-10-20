import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ListboxModule } from 'primeng/listbox';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { NoteComponent } from '../note/note.component';
import {
  Label,
  NoteSorting,
  SearchFilter,
  UUID,
  ViewKind,
} from './notes.model';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  HIGHEST_PRIORITY,
  HOBBY,
  SECONDARY,
  STANDARD,
  URGENT,
} from '../../constants/labels';
import { NavbarComponent } from '../navbar/navbar.component';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectTagComponent } from '../../shared/select-tag/select-tag.component';
import { NgIf, NgStyle } from '@angular/common';
import { ChipModule } from 'primeng/chip';
import { SelectModule } from 'primeng/select';
import { NotesService } from './notes.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css',
  imports: [
    NgStyle,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    NoteComponent,
    NavbarComponent,
    PanelModule,
    ChipModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    TextareaModule,
    ListboxModule,
    DialogModule,
    SelectModule,
    SelectTagComponent,
    SkeletonModule,
  ],
})
export class NotesComponent implements OnInit {
  protected notesService = inject(NotesService);
  private fb = inject(FormBuilder);

  protected noteForm!: FormGroup;
  protected selectedLabels: Label[] = [];
  protected selectedNoteId: UUID = ''; // if no selection, then ''
  protected isNoteRemovalDisplayed: boolean = false;
  protected isNoteCreatorDisplayed: boolean = false;
  protected isAddNoteButtonDisplayed = true;
  protected allCollapsed: boolean = true;

  // Constants
  protected labels: Label[] = [
    STANDARD,
    SECONDARY,
    URGENT,
    HIGHEST_PRIORITY,
    HOBBY,
  ];

  protected sortingOptions: NoteSorting[] = [
    'Most important first',
    'Least important first',
    'Date created (from oldest)',
    'Date created (from newest)',
    'Finished first',
    'Not finished first',
    'Date done (from oldest)',
    'Date done (from newest)',
  ];

  ngOnInit() {
    this.initializeNoteForm();
  }

  private initializeNoteForm() {
    this.noteForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', []],
      labels: this.fb.array([], [this.minArray(0)]),
    });
  }

  private minArray(minLength: number = 0): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const length = control.value ? control.value.length : 0;
      return length < minLength
        ? { minArray: { requiredLength: minLength, actualLength: length } }
        : null;
    };
  }

  private updateLabelsFormArray() {
    let labels = this.noteForm.get('labels') as FormArray;
    labels.clear();

    this.selectedLabels.forEach((label) => {
      labels.push(this.fb.group(label));
    });

    labels.markAsDirty();
    labels.updateValueAndValidity();
  }

  private clearNoteCreator() {
    this.noteForm.reset();
    this.selectedLabels = [];
    this.selectedNoteId = '';
  }

  protected onSortChange(event: { value: NoteSorting }) {
    this.notesService.setSort(event.value);
  }

  protected setNotesView(viewKind: ViewKind) {
    this.notesService.setViewKind(viewKind);
  }

  protected receiveSearchFilterEvent(value: SearchFilter) {
    this.notesService.setFilter(value);
  }

  protected receiveMarkAsDone(noteId: UUID) {
    this.notesService.markAsDone(noteId);
  }

  protected removeSelectedNote() {
    if (this.selectedNoteId) {
      this.notesService.deleteNote(this.selectedNoteId);
      this.hideNoteRemoval(); // Resets local UI state
    }
  }

  protected toggleNotesCollapse() {
    this.allCollapsed = !this.allCollapsed;
    this.notesService.toggleAllCollapsed(this.allCollapsed);
  }

  protected submitNote() {
    if (this.noteForm.valid) {
      const formValue = this.noteForm.value;
      const noteData = {
        title: formValue.title,
        description: formValue.description,
        labels: formValue.labels,
      };

      if (this.selectedNoteId) {
        this.notesService.updateNote(this.selectedNoteId, noteData);
      } else {
        this.notesService.addNote(noteData);
      }

      this.isNoteCreatorDisplayed = false;
      this.clearNoteCreator();
    }
  }

  protected displayNoteCreator(noteId?: UUID) {
    // If no noteId present, create a new note
    // Else display information about the note that is being currently edited
    this.clearNoteCreator(); // Make sure that note creator is empty

    if (noteId) {
      const note = this.notesService.findNoteById(noteId);
      if (note) {
        this.selectedNoteId = note.id;
        this.noteForm.patchValue({
          title: note.title,
          description: note.description,
        });
        this.selectedLabels = [...note.labels];
        this.updateLabelsFormArray();
      }
    }
    this.isNoteCreatorDisplayed = true;
  }

  protected displayNoteRemoval(noteId: UUID) {
    if (noteId) {
      this.selectedNoteId = noteId;
      this.isNoteRemovalDisplayed = true;
    }
  }

  protected hideNoteRemoval() {
    this.isNoteRemovalDisplayed = false;
    this.selectedNoteId = '';
  }

  protected receiveSelectedLabel(e: Label) {
    if (!e) return;
    if (Object.keys(e).includes('id') && !this.selectedLabels.includes(e)) {
      let hasPriority = false;
      let priorityIndex = -1;
      for (const label of this.selectedLabels) {
        if (label.kind == 'priority' && e.kind == 'priority') {
          hasPriority = true;
          priorityIndex = this.selectedLabels.indexOf(label);
          break;
        }
      }
      if (!hasPriority) {
        this.selectedLabels.push(e);
      } else {
        this.selectedLabels[priorityIndex] = e;
      }
      this.updateLabelsFormArray();
    }
  }

  protected removeSelectedLabel(label: Label) {
    if (this.selectedLabels.indexOf(label) !== -1) {
      this.selectedLabels = this.selectedLabels.filter((el) => el !== label);
      this.updateLabelsFormArray();
    }
  }
}
