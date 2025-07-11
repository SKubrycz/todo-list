import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ListboxModule } from 'primeng/listbox';
import { DialogModule } from 'primeng/dialog';
import { ValidatorService } from '../../validator.service';
import { NoteComponent } from '../note/note.component';
import { Label, Note, ViewKind } from '../../types/types';
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
  protected selectedOption: Label | null = null;
  protected notesList: Note[] = [
    {
      id: 1,
      title: 'Do three pushups',
      description: '...or even more',
      dateCreated: new Date(Date.now()),
      dateDone: null,
      labels: [this.labels[3]],
      done: false,
      viewKind: this.currentViewKind,
    },
  ];

  protected isNoteCreatorDisplayed = false;

  ngOnInit() {
    this.noteForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', []],
      labels: this.fb.array([], [this.minArray(1)]),
    });
    this.setNotesView(0);
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

      this.isNoteCreatorDisplayed = false;
    }
  }

  // Set view to be either box or list
  setNotesView(viewKind: ViewKind) {
    this.currentViewKind = viewKind;
    this.notesList.forEach((_, i) => {
      this.notesList[i].viewKind = this.currentViewKind;
    });
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
