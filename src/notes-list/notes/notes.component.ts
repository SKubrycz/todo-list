import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ListboxModule } from 'primeng/listbox';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { ValidatorService } from '../../validator.service';
import { NoteComponent } from '../note/note.component';
import {
  Label,
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
import { NgIf, NgStyle } from '@angular/common';
import { ChipModule } from 'primeng/chip';
import { SelectModule } from 'primeng/select';
import { StorageService } from '../../storage/storage.service';

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
export class NotesComponent implements OnInit, OnDestroy {
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
    'Finished first',
    'Not finished first',
    'Date done (from oldest)',
    'Date done (from newest)',
  ];
  protected selectedNote: number = -1;
  protected notesList: Note[] = [];
  protected filteredNotesList: Note[] = [];
  protected filterCriteria: SearchFilter = {
    text: '',
    priority: null,
    other: null,
  };
  protected noteLoadingTimeout!: number;

  protected isAddNoteButtonDisplayed = false;
  protected isNoteRemovalDisplayed = false;
  protected isNoteCreatorDisplayed = false;

  ngOnInit() {
    this.initializeNoteForm();
    this.getLocalViewKind();

    // Timeout later to be replaced by API call from the backend
    this.noteLoadingTimeout = window.setTimeout(() => {
      this.getNotes();
      this.setCurrentViewKind();
      this.setNotesView(this.currentViewKind);
      this.sortLabels();
      this.filteredNotesList = [...this.notesList];
      this.isAddNoteButtonDisplayed = true;
    }, 500);
  }

  ngOnDestroy() {
    clearTimeout(this.noteLoadingTimeout);
  }

  private initializeNoteForm() {
    this.noteForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', []],
      labels: this.fb.array([], [this.minArray(0)]),
    });
  }

  private getLocalViewKind() {
    const viewKind: ViewKind | null = this.storageService.read(
      this.VIEWKIND_KEY
    );

    if (viewKind || viewKind === 0) this.currentViewKind = viewKind;
  }

  private setLocalViewKind() {
    this.storageService.save(this.currentViewKind, this.VIEWKIND_KEY);
  }

  setCurrentViewKind() {
    if (this.currentViewKind || this.currentViewKind === 0) {
      this.notesList.forEach(
        (_, i) => (this.notesList[i].viewKind = this.currentViewKind)
      );
    } else {
      this.currentViewKind = this.notesList[0].viewKind;
    }
  }

  private getNotes() {
    const notes: Note[] | null = this.storageService.read(
      this.LOCALSTORAGE_KEY
    );
    if (notes) {
      this.notesList = notes;
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

  sortNotes() {
    if (this.selectedSort as NoteSorting) {
      switch (this.selectedSort as NoteSorting) {
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
        case 'Finished first':
          this.filteredNotesList.sort((a: Note, b: Note) => {
            return Number(b.done) - Number(a.done);
          });
          break;
        case 'Not finished first':
          this.filteredNotesList.sort((a: Note, b: Note) => {
            return Number(a.done) - Number(b.done);
          });
          break;
        case 'Date done (from oldest)':
          this.filteredNotesList.sort((a: Note, b: Note) => {
            if (a.done !== b.done) {
              return b.done ? 1 : -1;
            }

            let dateA = a.dateDone
              ? a.dateDone.getTime()
              : Number.MAX_SAFE_INTEGER;
            let dateB = b.dateDone
              ? b.dateDone.getTime()
              : Number.MAX_SAFE_INTEGER;
            return dateA - dateB;
          });
          break;
        case 'Date done (from newest)':
          this.filteredNotesList.sort((a: Note, b: Note) => {
            if (a.done !== b.done) {
              return b.done ? 1 : -1;
            }

            let dateA = a.dateDone
              ? a.dateDone.getTime()
              : Number.MAX_SAFE_INTEGER;
            let dateB = b.dateDone
              ? b.dateDone.getTime()
              : Number.MAX_SAFE_INTEGER;
            return dateB - dateA;
          });
          break;
        default:
          break;
      }
    }
  }

  // Sort labels for all notes
  sortLabels() {
    this.notesList.forEach((_, i) =>
      this.notesList[i].labels.sort((a: Label, b: Label) => {
        const aLabel = a.kind === 'priority' ? 1 : -1;
        const bLabel = b.kind === 'priority' ? 1 : -1;

        return aLabel - bLabel;
      })
    );
  }

  receiveMarkAsDone(noteId: number) {
    this.filteredNotesList.map((note) => {
      if (note.id === noteId) {
        note.done = true;
        note.dateDone = new Date(Date.now());
      }
    });
    this.saveNotes();
    this.sortNotes();
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
    this.sortNotes();
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

  displayNoteRemoval(noteId: number) {
    if (noteId) {
      this.selectedNote = noteId;
      const note = this.findNoteById(noteId);

      if (note) {
        this.isNoteRemovalDisplayed = true;
      }
    }
  }

  hideNoteRemoval() {
    this.isNoteRemovalDisplayed = false;
  }

  removeSelectedNote() {
    if (this.selectedNote && this.selectedNote !== -1) {
      const note = this.findNoteById(this.selectedNote);

      if (note) {
        this.notesList = this.notesList.filter((n: Note) => n.id !== note.id);
        this.filterNotes();
        this.sortNotes();
        this.saveNotes();
        this.selectedNote = -1;
        this.isNoteRemovalDisplayed = false;
      }
    }
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
