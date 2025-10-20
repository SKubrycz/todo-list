import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from '../../storage/storage.service';
import {
  Label,
  Note,
  NoteDTO,
  NoteSorting,
  SearchFilter,
  UUID,
  ViewKind,
} from './notes.model';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private storageService = inject(StorageService);
  private NOTES_KEY: string = 'notes';
  private VIEWKIND_KEY: string = 'notes-viewkind';

  public viewKind = signal<ViewKind>(0);
  public sort = signal<NoteSorting>('Most important first');
  private notes = signal<Note[]>([]);
  private filter = signal<SearchFilter>({
    text: '',
    priority: null,
    other: null,
  });

  public filteredNotes = computed(() => {
    const notes = this.notes();
    const filter = this.filter();
    const sort = this.sort();

    const filtered = this.applyFilter(notes, filter);
    const sorted = this.applySort(filtered, sort);

    return sorted;
  });

  constructor() {
    this.loadViewKind();
    this.loadNotes();

    effect(() => {
      const notesToSave: NoteDTO[] = this.notes().map((note) => ({
        id: note.id,
        title: note.title,
        description: note.description,
        dateCreated: note.dateCreated,
        dateDone: note.dateDone,
        labels: note.labels,
        done: note.done,
      }));
      this.storageService.save(notesToSave, this.NOTES_KEY);
    });

    effect(() => {
      this.storageService.save(this.viewKind(), this.VIEWKIND_KEY);
    });
  }

  public loadNotes() {
    const notesFromStorage: Note[] | null = this.storageService.read(
      this.NOTES_KEY
    );
    if (notesFromStorage) {
      const mappedNotes = notesFromStorage.map((note) => ({
        ...note,
        labels: this.sortLabels(note.labels),
        collapsed: true,
        viewKind: this.viewKind(),
      }));
      this.notes.set(mappedNotes);
    }
  }

  public loadViewKind() {
    const viewKindFromStorage: ViewKind | null = this.storageService.read(
      this.VIEWKIND_KEY
    );

    if (viewKindFromStorage) {
      this.viewKind.set(viewKindFromStorage);
    }
  }

  private applyFilter(notes: Note[], filter: SearchFilter): Note[] {
    return notes.filter((element) => {
      const textPass =
        element.title.toLowerCase().includes(filter.text.toLowerCase()) ||
        element.description.toLowerCase().includes(filter.text.toLowerCase());

      const priorityPass = filter.priority
        ? element.labels.find(
            (el) => el.kind == 'priority' && el.text == filter.priority?.text
          )
        : true;

      const otherPass = filter.other
        ? element.labels.find(
            (el) => el.kind == 'other' && el.text == filter.other?.text
          )
        : true;

      return textPass && !!priorityPass && !!otherPass;
    });
  }

  private applySort(notes: Note[], sort: NoteSorting) {
    const sortedNotes = [...notes];

    switch (sort) {
      case 'Most important first':
        return sortedNotes.sort((a: Note, b: Note) => {
          const aLabel = a.labels.find(
            (label: Label) => label.kind === 'priority'
          );
          const bLabel = b.labels.find(
            (label: Label) => label.kind === 'priority'
          );

          if (!aLabel || !bLabel) return 0;
          return bLabel.priority - aLabel.priority;
        });
      case 'Least important first':
        return sortedNotes.sort((a: Note, b: Note) => {
          const aLabel = a.labels.find(
            (label: Label) => label.kind === 'priority'
          );
          const bLabel = b.labels.find(
            (label: Label) => label.kind === 'priority'
          );

          if (!aLabel || !bLabel) return 0;
          return aLabel.priority - bLabel.priority;
        });
      case 'Date created (from oldest)':
        return sortedNotes.sort((a: Note, b: Note) => {
          return a.dateCreated.getTime() - b.dateCreated.getTime();
        });
      case 'Date created (from newest)':
        return sortedNotes.sort((a: Note, b: Note) => {
          return b.dateCreated.getTime() - a.dateCreated.getTime();
        });
      case 'Finished first':
        return sortedNotes.sort((a: Note, b: Note) => {
          return Number(b.done) - Number(a.done);
        });
      case 'Not finished first':
        return sortedNotes.sort((a: Note, b: Note) => {
          return Number(a.done) - Number(b.done);
        });
      case 'Date done (from oldest)':
        return sortedNotes.sort((a: Note, b: Note) => {
          if (a.done !== b.done) {
            return b.done ? 1 : -1;
          }

          let dateA = a.dateDone
            ? a.dateDone.getTime()
            : Number.MAX_SAFE_INTEGER;
          let dateB = b.dateDone
            ? b.dateDone.getTime()
            : Number.MAX_SAFE_INTEGER;
          return dateA - dateB;
        });
      case 'Date done (from newest)':
        return sortedNotes.sort((a: Note, b: Note) => {
          if (a.done !== b.done) {
            return b.done ? 1 : -1;
          }

          let dateA = a.dateDone
            ? a.dateDone.getTime()
            : Number.MAX_SAFE_INTEGER;
          let dateB = b.dateDone
            ? b.dateDone.getTime()
            : Number.MAX_SAFE_INTEGER;
          return dateB - dateA;
        });
      default:
        return sortedNotes;
    }
  }

  private sortLabels(labels: Label[]): Label[] {
    return [...labels].sort((a: Label, b: Label) => {
      const aPriority = a.kind === 'priority' ? 1 : -1;
      const bPriority = b.kind === 'priority' ? 1 : -1;

      return aPriority - bPriority;
    });
  }

  // Public methods
  public setFilter(filter: SearchFilter) {
    this.filter.set(filter);
  }

  public setSort(sort: NoteSorting) {
    this.sort.set(sort);
  }

  public setViewKind(kind: ViewKind) {
    this.viewKind.set(kind);
    this.notes.update((currentNotes) =>
      currentNotes.map((note) => ({
        ...note,
        viewKind: kind,
      }))
    );
  }

  public findNoteById(id: UUID): Note | undefined {
    return this.notes().find((note) => note.id === id);
  }

  public addNote(noteData: {
    title: string;
    description: string;
    labels: Label[];
  }) {
    const newNote: Note = {
      id: uuidv4(),
      title: noteData.title,
      description: noteData.description,
      labels: noteData.labels,
      done: false,
      dateCreated: new Date(Date.now()),
      dateDone: null,
      viewKind: this.viewKind(),
      collapsed: true,
    };
    this.notes.update((currentNotes) => [...currentNotes, newNote]);
  }

  public updateNote(
    id: UUID,
    noteData: { title: string; description: string; labels: Label[] }
  ) {
    this.notes.update((currentNotes) =>
      currentNotes.map((note) =>
        note.id === id
          ? {
              ...note,
              title: noteData.title,
              description: noteData.description,
              labels: noteData.labels,
            }
          : note
      )
    );
  }

  public deleteNote(id: UUID) {
    this.notes.update((currentNotes) =>
      currentNotes.filter((note) => note.id !== id)
    );
  }

  public markAsDone(id: UUID) {
    this.notes.update((currentNotes) =>
      currentNotes.map((note) =>
        note.id === id
          ? { ...note, done: true, dateDone: new Date(Date.now()) }
          : note
      )
    );
  }

  public toggleAllCollapsed(allCollapsed: boolean) {
    this.notes.update((currentNotes) =>
      currentNotes.map((note) => ({
        ...note,
        collapsed: allCollapsed,
      }))
    );
  }
}
