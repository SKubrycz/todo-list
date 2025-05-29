import { Component, inject } from '@angular/core';
import { ValidatorService } from '../../validator.service';
import { NoteComponent } from '../note/note.component';
import { Note } from '../../types/types';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css',
  imports: [NoteComponent],
})
export class NotesComponent {
  private validator = inject(ValidatorService);

  notesList: Note[] = [];
}
