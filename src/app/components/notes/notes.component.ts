import { Component, inject, OnInit } from '@angular/core';
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
import { StorageService } from '../../storage/storage.service';

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
export class NotesComponent implements OnInit {
  protected noteForm!: FormGroup;

  private validatorService = inject(ValidatorService);
  private fb = inject(FormBuilder);
  private storageService = inject(StorageService);

  private LOCALSTORAGE_KEY = 'notes';
  private VIEWKIND_KEY = 'notes-viewkind';
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
  protected selectedNote: number = -1;
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
    {
      id: 4,
      title: 'Learn Japanese',
      description: '私は日本語を勉強します',
      dateCreated: new Date(Date.now() - 1000 * 10),
      dateDone: new Date(Date.now() - 700),
      labels: [this.labels[2]],
      done: true,
      viewKind: this.currentViewKind,
    },
    {
      id: 5,
      title: 'Draw something',
      description: '',
      dateCreated: new Date(Date.now() - 1000 * 5),
      dateDone: new Date(Date.now() - 600),
      labels: [this.labels[1]],
      done: false,
      viewKind: this.currentViewKind,
    },
  ];
  protected filteredNotesList: Note[] = [];
  protected filterCriteria: SearchFilter = {
    text: '',
    priority: null,
    other: null,
  };

  protected isNoteCreatorDisplayed = false;

  ngOnInit() {
    this.initializeNoteForm();
    this.getNotes();
    this.setCurrentViewKind();
    this.setNotesView(this.currentViewKind);
    this.filteredNotesList = [...this.notesList];
  }

  private initializeNoteForm() {
    this.noteForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', []],
      labels: this.fb.array([], [this.minArray(1)]),
    });
  }

  private getLocalViewKind(): ViewKind | null {
    const viewKind: ViewKind | null = this.storageService.read(
      this.VIEWKIND_KEY
    );

    return viewKind;
  }

  private setLocalViewKind() {
    this.storageService.save(this.currentViewKind, this.VIEWKIND_KEY);
  }

  setCurrentViewKind() {
    const viewKind: ViewKind | null = this.getLocalViewKind();
    if (viewKind || viewKind === 0) {
      this.notesList.forEach((_, i) => (this.notesList[i].viewKind = viewKind));
      this.currentViewKind = viewKind;
    } else {
      this.currentViewKind = this.notesList[0].viewKind;
    }
  }

  private getNotes() {
    const notes = this.storageService.read(this.LOCALSTORAGE_KEY);
    if (notes) {
      this.notesList = notes as Note[];
      this.filteredNotesList = [...this.notesList];
      this.filterNotes();
    }
  }

  private saveNotes() {
    this.storageService.save(this.notesList, this.LOCALSTORAGE_KEY);
  }

  private clearNoteCreator() {
    this.noteForm.reset();
    this.selectedLabels = [];
  }

  private filterNotes() {
    const passesCriteria = (element: Note) => {
      const titlePass = element.title
        .toLowerCase()
        .includes(this.filterCriteria.text.toLowerCase());
      const descriptionPass = element.description
        .toLowerCase()
        .includes(this.filterCriteria.text.toLowerCase());
      const priorityPass = this.filterCriteria.priority
        ? element.labels.find((el) => {
            return (
              el.kind == 'priority' &&
              el.text == this.filterCriteria.priority?.text
            );
          })
        : true;

      const otherPass = this.filterCriteria.other
        ? element.labels.find((el) => {
            return (
              el.kind == 'other' && el.text == this.filterCriteria.other?.text
            );
          })
        : true;

      return (titlePass || descriptionPass) && priorityPass && otherPass;
    };

    this.filteredNotesList = [];

    for (const note of this.notesList) {
      if (passesCriteria(note)) {
        this.filteredNotesList.push(note);
      }
    }
  }

  private minArray(minLength: number = 0): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value < minLength ? { minArray: null } : null;
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

  submitNote() {
    if (this.noteForm.valid) {
      const controls = this.noteForm.controls;

      if (this.selectedNote !== -1) {
        const note = this.notesList.find((n) => n.id === this.selectedNote);
        if (!note) return;
        note.title = controls['title'].value;
        note.description = controls['description'].value;
        note.labels = controls['labels'].value;
      } else {
        const note: Note = {
          id: this.notesList.length + 1,
          title: controls['title'].value,
          description: controls['description'].value,
          labels: controls['labels'].value,
          done: false,
          dateCreated: new Date(Date.now()),
          dateDone: null,
          viewKind: this.currentViewKind,
        };
        this.notesList.push(note);
      }
      this.filterNotes(); // Reapply filter function to add the note that was created
      this.saveNotes();

      this.selectedNote = -1;
      this.isNoteCreatorDisplayed = false;
      this.clearNoteCreator();
    }
  }

  sortNotes(e: SelectChangeEvent) {
    if (!e) return;
    if (e.value as NoteSorting) {
      switch (e.value as NoteSorting) {
        case 'None':
          this.filteredNotesList.sort((a: Note, b: Note) => {
            return a.id - b.id;
          });
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

  receiveMarkAsDone(noteId: number) {
    this.filteredNotesList.map((note) => {
      if (note.id === noteId) {
        note.done = true;
        note.dateDone = new Date(Date.now());
      }
    });
    this.saveNotes();
  }

  // Set view to be either box or list
  setNotesView(viewKind: ViewKind) {
    this.currentViewKind = viewKind;
    this.notesList.forEach((_, i) => {
      this.notesList[i].viewKind = this.currentViewKind;
    });
    this.setLocalViewKind();
  }

  receiveSearchFilterEvent(value: SearchFilter) {
    this.filterCriteria = value;
    this.filterNotes();
  }

  findNoteById(noteId: number): Note | undefined {
    if (noteId) {
      let found: Note | undefined = this.notesList.find(
        (note) => note.id === noteId
      );
      return found;
    }

    return undefined;
  }

  displayNoteCreator(noteId?: number) {
    // If no noteId present, create a new note
    // Else display information about the note that is being currently edited
    if (noteId) {
      this.selectedNote = noteId;
      const note = this.findNoteById(noteId);

      if (note) {
        this.noteForm.patchValue({
          title: note.title,
          description: note.description,
        });
        this.selectedLabels = [];
        if (note.labels && note.labels.length) {
          note.labels.forEach((label) => this.selectedLabels.push(label));
          this.updateLabelsFormArray();
        }
      }
    } else {
      this.selectedNote = -1;
    }
    this.isNoteCreatorDisplayed = true;
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
      } else {
        this.selectedLabels[priorityIndex] = e;
      }
      this.updateLabelsFormArray();
    }
  }

  removeSelectedLabel(label: Label) {
    if (this.selectedLabels.indexOf(label) !== -1) {
      this.selectedLabels = this.selectedLabels.filter((el) => el !== label);
      this.updateLabelsFormArray();
    }
  }
}
