import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ListboxModule } from 'primeng/listbox';
import { DialogModule } from 'primeng/dialog';
import { ValidatorService } from '../../validator.service';
import { NoteComponent } from '../note/note.component';
import { Note, ViewKind } from '../../types/types';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  HIGHEST_PRIORITY,
  SECONDARY,
  STANDARD,
  URGENT,
} from '../../constants/labels';
import { NavbarComponent } from '../navbar/navbar.component';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectTagComponent } from '../select-tag/select-tag.component';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NoteComponent,
    NavbarComponent,
    PanelModule,
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
  noteForm!: FormGroup;

  private validator = inject(ValidatorService);
  private fb = inject(FormBuilder);

  currentViewKind: ViewKind = 0;
  titleValue = '';
  descriptionValue = '';
  selectedLabels = [];
  labels = [STANDARD, SECONDARY, URGENT, HIGHEST_PRIORITY];
  notesList: Note[] = [
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

  isNoteCreatorDisplayed = false;

  ngOnInit() {
    this.noteForm = this.fb.group({
      title: ['', []],
      description: ['', []],
      labels: [[], []],
    });
    this.setNotesView(0);
  }

  createNote() {
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
  }

  // Set view to be either box or list
  setNotesView(viewKind: ViewKind) {
    this.currentViewKind = viewKind;
    this.notesList.forEach((_, i) => {
      this.notesList[i].viewKind = this.currentViewKind;
    });
  }

  displayNoteCreator() {
    console.log('Displaying Note Creator...');
    this.isNoteCreatorDisplayed = true;
  }
}
