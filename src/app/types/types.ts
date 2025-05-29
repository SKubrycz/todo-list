export enum Label {
  HIGHEST_PRIORITY = 'Highest priority',
  URGENT = 'Urgent',
  STANDARD = 'Standard',
  SECONDARY = 'Secondary',
}
export interface Note {
  id: number;
  title: string;
  subtitle: string;
  dateCreated: Date;
  dateDone: Date;
  label: Label;
  done: boolean;
}
