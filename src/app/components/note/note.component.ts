import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { type Note } from '../../types/types';
import { STANDARD } from '../../constants/labels';
import { DatePipe, NgStyle } from '@angular/common';

@Component({
  selector: 'app-note',
  imports: [CardModule, PanelModule, TagModule, DatePipe, NgStyle],
  templateUrl: './note.component.html',
  styleUrl: './note.component.css',
})
export class NoteComponent {
  @Input() noteData: Note = {
    id: 0,
    title: '',
    description: '',
    dateCreated: new Date(Date.now()),
    dateDone: new Date(Date.now()),
    labels: [STANDARD],
    done: false,
    viewKind: 0,
  };
}
