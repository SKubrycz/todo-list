import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { type Note } from '../../types/types';
import { STANDARD } from '../../constants/labels';
import { DatePipe, NgStyle } from '@angular/common';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
@Component({
  selector: 'app-note',
  imports: [
    CardModule,
    PanelModule,
    TagModule,
    TooltipModule,
    DatePipe,
    TimeAgoPipe,
    NgStyle,
  ],
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

  @Output() markAsDoneEvent = new EventEmitter<number>();

  markAsDone(noteId: number) {
    this.markAsDoneEvent.emit(noteId);
  }
}
