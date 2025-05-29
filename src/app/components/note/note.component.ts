import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Label, Note } from '../../types/types';

@Component({
  selector: 'app-note',
  imports: [CardModule],
  templateUrl: './note.component.html',
  styleUrl: './note.component.css',
})
export class NoteComponent {
  @Input() noteData: Note = {
    id: 0,
    title: '',
    subtitle: '',
    dateCreated: new Date(Date.now()),
    dateDone: new Date(Date.now()),
    label: Label.STANDARD,
    done: false,
  };
}
