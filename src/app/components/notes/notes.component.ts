import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ListboxModule } from 'primeng/listbox';
import { ValidatorService } from '../../validator.service';
import { NoteComponent } from '../note/note.component';
import { Note } from '../../types/types';
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

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NoteComponent,
    NavbarComponent,
    CardModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    ListboxModule,
  ],
})
export class NotesComponent {
  noteForm!: FormGroup;

  private validator = inject(ValidatorService);
  private fb = inject(FormBuilder);

  titleValue = '';
  subtitleValue = '';
  selectedLabels = [];
  labels = [STANDARD, SECONDARY, URGENT, HIGHEST_PRIORITY];
  notesList: Note[] = [
    {
      id: 1,
      title: 'Do three pushups',
      subtitle: '...or even more',
      dateCreated: new Date(Date.now()),
      dateDone: null,
      labels: [this.labels[0]],
      done: false,
    },
  ];

  ngOnInit() {
    this.noteForm = this.fb.group({
      title: ['', []],
      subtitle: ['', []],
      labels: [[], []],
    });
  }

  createNote() {
    const controls = this.noteForm.controls;

    const note = {
      id: this.notesList.length,
      title: controls['title'].value,
      subtitle: controls['subtitle'].value,
      labels: controls['labels'].value,
      done: false,
      dateCreated: new Date(Date.now()),
      dateDone: null,
    };

    this.notesList.push(note);
  }

  displayNoteCreator() {
    console.log('Displaying Note Creator...');
  }
}
