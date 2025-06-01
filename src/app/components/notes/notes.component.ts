import { Component, inject, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ValidatorService } from '../../validator.service';
import { NoteComponent } from '../note/note.component';
import { Label, LabelText, Note } from '../../types/types';
import { FormsModule } from '@angular/forms';
import { URGENT } from '../../constants/labels';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css',
  imports: [NoteComponent, FormsModule, ButtonModule, InputTextModule],
})
export class NotesComponent {
  private validator = inject(ValidatorService);

  inputValue = '';

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

  notesList: Note[] = [
    {
      id: 1,
      title: 'Title',
      subtitle: 'sdadsad',
      dateCreated: new Date(Date.now()),
      dateDone: new Date(Date.now()),
      done: true,
      label: URGENT,
    },
  ];
}
