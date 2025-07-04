import { Component, Input, SimpleChanges } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { type Note } from '../../types/types';
import { STANDARD } from '../../constants/labels';
import { DatePipe, NgStyle } from '@angular/common';

@Component({
  selector: 'app-note',
  imports: [CardModule, TagModule, DatePipe, NgStyle],
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
    labels: [STANDARD],
    done: false,
    viewKind: 0,
  };
}
