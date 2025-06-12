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

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NoteComponent,
    FormsModule,
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
  notesList: Note[] = [];

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
}
