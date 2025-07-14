import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ListboxModule } from 'primeng/listbox';
import { DialogModule } from 'primeng/dialog';
import { ValidatorService } from '../../validator.service';
import { NoteComponent } from '../note/note.component';
import {
  Label,
  LabelText,
  Note,
  NoteSorting,
  SearchFilter,
  ViewKind,
} from '../../types/types';
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
import { SelectTagComponent } from '../select-tag/select-tag.component';
import { NgStyle } from '@angular/common';
import { ChipModule } from 'primeng/chip';
import { SelectChangeEvent, SelectModule } from 'primeng/select';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css',
  imports: [
    NgStyle,
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
  ],
})
export class NotesComponent {
  protected noteForm!: FormGroup;

  private validator = inject(ValidatorService);
  private fb = inject(FormBuilder);

  protected currentViewKind: ViewKind = 0;
  protected titleValue = '';
  protected descriptionValue = '';
  protected selectedLabels: Label[] = [];
  protected labels = [STANDARD, SECONDARY, URGENT, HIGHEST_PRIORITY, HOBBY];
  protected priorityLabels = this.labels.filter(
    (label) => label.kind === 'priority'
  );
  protected selectedOption: Label | null = null;
  protected selectedSort: NoteSorting = 'None';
  protected sortingOptions: NoteSorting[] = [
    'None',
    'Most important first',
    'Least important first',
    'Date created (from oldest)',
    'Date created (from newest)',
  ];
  protected notesList: Note[] = [
    {
      id: 1,
      title: 'Do three pushups',
      description: '...or even more',
      dateCreated: new Date(Date.now() - 1000 * 60 * 60),
      dateDone: null,
      labels: [this.labels[2]],
      done: false,
      viewKind: this.currentViewKind,
    },
    {
      id: 2,
      title: 'Do four pull ups',
      description: '...or even more',
      dateCreated: new Date(Date.now() - 1000 * 60 * 12),
      dateDone: null,
      labels: [this.labels[3]],
      done: false,
      viewKind: this.currentViewKind,
    },
    {
      id: 3,
      title: 'Leg day 🦵',
      description: 'Gotta do it',
      dateCreated: new Date(Date.now() - 1000 * 55),
      dateDone: new Date(Date.now() - 500),
      labels: [this.labels[0]],
      done: true,
      viewKind: this.currentViewKind,
    },
  ];
  protected filteredNotesList: Note[] = [];
  protected filterCriteria: SearchFilter = {
    text: '',
    priority: LabelText.HIGHEST_PRIORITY,
  };

  protected isNoteCreatorDisplayed = false;

  ngOnInit() {
    this.noteForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', []],
      labels: this.fb.array([], [this.minArray(1)]),
    });
    this.setNotesView(0);
    this.filteredNotesList = [...this.notesList];
  }

  createNote() {
    if (this.noteForm.valid) {
      const controls = this.noteForm.controls;

      const note: Note = {
        id: this.notesList.length,
        title: controls['title'].value,
        description: controls['description'].value,
        labels: controls['labels'].value,
        done: false,
        dateCreated: new Date(Date.now()),
        dateDone: null,
        viewKind: this.currentViewKind,
      };
      this.notesList.push(note);
      this.filterNotes(); // Reapply filter function to add the note that was created

      this.isNoteCreatorDisplayed = false;

      this.clearNoteCreator();
    }
  }

  clearNoteCreator() {
    this.noteForm.reset();
    this.selectedLabels = [];
  }

  sortNotes(e: SelectChangeEvent) {
    if (!e) return;
    if (e.value as NoteSorting) {
      switch (e.value as NoteSorting) {
        case 'None':
          break;
        case 'Most important first':
          this.filteredNotesList.sort((a: Note, b: Note) => {
            const aLabel = a.labels.find(
              (label: Label) => label.kind === 'priority'
            );
            const bLabel = b.labels.find(
              (label: Label) => label.kind === 'priority'
            );

            if (!aLabel || !bLabel) return 0;
            return bLabel.priority - aLabel.priority;
          });
          break;
        case 'Least important first':
          this.filteredNotesList.sort((a: Note, b: Note) => {
            const aLabel = a.labels.find(
              (label: Label) => label.kind === 'priority'
            );
            const bLabel = b.labels.find(
              (label: Label) => label.kind === 'priority'
            );

            if (!aLabel || !bLabel) return 0;
            return aLabel.priority - bLabel.priority;
          });
          break;
        case 'Date created (from oldest)':
          this.filteredNotesList.sort((a: Note, b: Note) => {
            return a.dateCreated.getTime() - b.dateCreated.getTime();
          });
          break;
        case 'Date created (from newest)':
          this.filteredNotesList.sort((a: Note, b: Note) => {
            return b.dateCreated.getTime() - a.dateCreated.getTime();
          });
          break;
        default:
          break;
      }
    }
  }

  // Set view to be either box or list
  setNotesView(viewKind: ViewKind) {
    this.currentViewKind = viewKind;
    this.notesList.forEach((_, i) => {
      this.notesList[i].viewKind = this.currentViewKind;
    });
  }

  filterNotes() {
    const passesCriteria = (element: Note) => {
      const textPass = element.title
        .toLowerCase()
        .includes(this.filterCriteria.text.toLowerCase());
      const priorityPass = this.filterCriteria.priority
        ? element.labels.find((el) => {
            return (
              el.kind == 'priority' && el.text == this.filterCriteria.priority
            );
          })
        : true;

      return textPass && priorityPass;
    };

    this.filteredNotesList = [];

    for (const note of this.notesList) {
      if (passesCriteria(note)) {
        this.filteredNotesList.push(note);
      }
    }
  }

  receiveSearchFilterEvent(value: SearchFilter) {
    this.filterCriteria = value;
    this.filterNotes();
  }

  displayNoteCreator() {
    this.isNoteCreatorDisplayed = true;
  }

  minArray(minLength: number = 0): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value < minLength ? { minArray: null } : null;
    };
  }

  updateLabelsFormArray() {
    let labels = this.noteForm.get('labels') as FormArray;
    labels.clear();

    this.selectedLabels.forEach((label) => {
      labels.push(this.fb.group(label));
    });

    labels.markAsDirty();
    labels.updateValueAndValidity();
  }

  receiveSelectedOption(e: Label) {
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
        this.updateLabelsFormArray();
      } else {
        this.selectedLabels[priorityIndex] = e;
        this.updateLabelsFormArray();
      }
    }
  }

  removeSelectedLabel(label: Label) {
    if (this.selectedLabels.indexOf(label) !== -1) {
      this.selectedLabels = this.selectedLabels.filter((el) => el !== label);
      this.updateLabelsFormArray();
    }
  }
}
