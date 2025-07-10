export type LabelKind = 'priority' | 'other';
export enum LabelText {
  HIGHEST_PRIORITY = 'Highest priority',
  URGENT = 'Urgent',
  STANDARD = 'Standard',
  SECONDARY = 'Secondary',
}
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
