import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Label, type Note } from '../notes/notes.model';
import { STANDARD } from '../../constants/labels';
import { DatePipe, NgStyle } from '@angular/common';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { v4 as uuidv4 } from 'uuid';

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
export class NoteComponent implements OnInit, OnChanges {
  @Input() noteData: Note = {
    id: uuidv4(),
    title: '',
    description: '',
    dateCreated: new Date(Date.now()),
    dateDone: new Date(Date.now()),
    labels: [STANDARD],
    done: false,
    viewKind: 0,
    collapsed: true,
  };

  @Output() readonly removeNoteEvent = new EventEmitter<void>();
  @Output() readonly editNoteEvent = new EventEmitter<void>();
  @Output() readonly markAsDoneEvent = new EventEmitter<string>();

  protected priorityLabel: Label | undefined;
  protected displayHeaderInfo: boolean = true;
  protected isHovered: boolean = false;

  ngOnInit() {
    this.processDates();
    this.findPriorityLabel();
  }

  ngOnChanges(_: SimpleChanges) {
    this.findPriorityLabel();
  }

  private processDates() {
    if (typeof this.noteData.dateCreated === 'string') {
      this.noteData.dateCreated = new Date(this.noteData.dateCreated);
    }

    if (typeof this.noteData.dateDone === 'string') {
      this.noteData.dateDone = new Date(this.noteData.dateDone);
    }
  }

  private findPriorityLabel() {
    this.priorityLabel = this.noteData.labels.find(
      (label) => label.kind === 'priority'
    );
  }

  protected displayEditButton(e: MouseEvent, display: boolean) {
    if (e.target) {
      this.isHovered = display;
    }
  }

  protected displayNoteRemoval() {
    this.removeNoteEvent.emit();
  }

  protected displayNoteCreator() {
    this.editNoteEvent.emit();
  }

  protected markAsDone(noteId: string) {
    this.markAsDoneEvent.emit(noteId);
  }

  protected toggleHeaderInfo(value: boolean) {
    this.displayHeaderInfo = value;
  }
}
