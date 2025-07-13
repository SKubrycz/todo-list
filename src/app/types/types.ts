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
  [LabelText.HOBBY, LabelText.EMPTY]
>;
export interface Label {
  id: number;
  text: LabelText;
  kind: LabelKind;
  color: string;
  backgroundColor: string;
}

export type ViewKind = 0 | 1;

export interface Note {
  id: number;
  title: string;
  description: string;
  dateCreated: Date;
  dateDone: Date | null;
  labels: Label[];
  done: boolean;
  viewKind: ViewKind;
}

export interface SearchFilter {
  text: string; // title
  priority: LabelTextForPriority | null;
}

export type NoteSorting = 'None' | 'Priority' | 'Date created';
