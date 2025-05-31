import { Label, LabelText } from '../../types/types';

//   HIGHEST_PRIORITY = 'Highest priority',
//   URGENT = 'Urgent',
//   STANDARD = 'Standard',
//   SECONDARY = 'Secondary',

export const STANDARD: Label = {
  text: LabelText.STANDARD,
  color: 'skyblue',
  backgroundColor: '#bde1f0',
};

export const SECONDARY: Label = {
  text: LabelText.SECONDARY,
  color: 'darkgray',
  backgroundColor: 'lightgray',
};
export const URGENT: Label = {
  text: LabelText.URGENT,
  color: 'darkred',
  backgroundColor: '#eb7f7f',
};
export const HIGHEST_PRIORITY: Label = {
  text: LabelText.HIGHEST_PRIORITY,
  color: '#bf0000',
  backgroundColor: '#e85a5a',
};
