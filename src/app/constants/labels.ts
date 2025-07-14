import { Label, LabelText } from '../types/types';

//   HIGHEST_PRIORITY = 'Highest priority',
//   URGENT = 'Urgent',
//   STANDARD = 'Standard',
//   SECONDARY = 'Secondary',

// kind = 'priority'
export const STANDARD: Label = {
  id: 0,
  text: LabelText.STANDARD,
  kind: 'priority',
  color: '#00a7de',
  backgroundColor: '#b5e4f9',
};

export const SECONDARY: Label = {
  id: 1,
  text: LabelText.SECONDARY,
  kind: 'priority',
  color: 'gray',
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

// kind = 'other'
export const HOBBY: Label = {
  id: 4,
  text: LabelText.HOBBY,
  kind: 'other',
  color: 'green',
  backgroundColor: 'lightgreen',
};
