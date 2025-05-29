import { Component, Input } from '@angular/core';
import { Label, Note } from '../../types/types';

@Component({
  selector: 'app-note',
  imports: [],
  templateUrl: './note.component.html',
  styleUrl: './note.component.css',
})
export class NoteComponent {
  @Input() noteData: Note = {
    id: 0,
    text: '',
    dateCreated: new Date(Date.now()),
    dateDone: new Date(Date.now()),
    label: Label.STANDARD,
    done: false,
  };
}
