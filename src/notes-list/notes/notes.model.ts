export type LabelKind = 'priority' | 'other';
export enum LabelText {
  EMPTY = 'None',
  HIGHEST_PRIORITY = 'Highest priority',
  URGENT = 'Urgent',
  STANDARD = 'Standard',
  SECONDARY = 'Secondary',
  HOBBY = 'Hobby',
}
export type LabelTextForPriority = Exclude<
  LabelText,
  LabelText.HOBBY | LabelText.EMPTY
>;
export type LabelTextForOther = Exclude<
  LabelText,
  | LabelText.HIGHEST_PRIORITY
  | LabelText.URGENT
  | LabelText.STANDARD
  | LabelText.SECONDARY
  | LabelText.EMPTY
>;
export type Label =
  | {
      id: number;
      text: LabelText;
      kind: 'priority';
      priority: number;
      color: string;
      backgroundColor: string;
    }
  | {
      id: number;
      text: LabelText;
      kind: Exclude<LabelKind, 'priority'>;
      priority?: never;
      color: string;
      backgroundColor: string;
    };

export type ViewKind = 0 | 1;

export interface Note {
  id: string; // UUID
  title: string;
  description: string;
  dateCreated: Date;
  dateDone: Date | null;
  labels: Label[];
  done: boolean;
  viewKind: ViewKind;
  collapsed: boolean;
}

export interface NoteDTO {
  id: string; // UUID
  title: string;
  description: string;
  dateCreated: Date;
  dateDone: Date | null;
  labels: Label[];
  done: boolean;
}

export interface SearchFilter {
  text: string; // Either title or description
  priority: Label | null;
  other: Label | null;
}

export type NoteSorting =
  | 'None'
  | 'Most important first'
  | 'Least important first'
  | 'Date created (from oldest)'
  | 'Date created (from newest)'
  | 'Finished first'
  | 'Not finished first'
  | 'Date done (from oldest)'
  | 'Date done (from newest)';
