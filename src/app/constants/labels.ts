import { Label, LabelText } from '../types/types';

//   HIGHEST_PRIORITY = 'Highest priority',
//   URGENT = 'Urgent',
//   STANDARD = 'Standard',
//   SECONDARY = 'Secondary',

export const STANDARD: Label = {
  id: 0,
  text: LabelText.STANDARD,
  kind: 'priority',
  color: 'deepskyblue',
  backgroundColor: '#bde1f0',
};

export const SECONDARY: Label = {
  id: 1,
  text: LabelText.SECONDARY,
  kind: 'priority',
  color: 'darkgray',
  backgroundColor: 'lightgray',
};
export const URGENT: Label = {
  id: 2,
  text: LabelText.URGENT,
  kind: 'priority',
  color: 'darkred',
  backgroundColor: '#eb7f7f',
};
export const HIGHEST_PRIORITY: Label = {
  id: 3,
  text: LabelText.HIGHEST_PRIORITY,
  kind: 'priority',
  color: '#a30000',
  backgroundColor: '#e85a5a',
};
