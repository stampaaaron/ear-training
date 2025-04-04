import { baseChords, Chord, getAllTensionChords, seventhChords } from './chord';

export type ChordSet = {
  key: string;
  label: string;
  description?: string;
  chords: Chord[];
};

const allTriads = [
  baseChords['maj'],
  baseChords['min'],
  baseChords['dim'],
  baseChords['aug'],
  baseChords['sus'],
  baseChords['sus2'],
];

const basicSenventhChords = [
  seventhChords['maj.7'],
  seventhChords['maj.6'],
  seventhChords['min.7'],
  seventhChords['min.6'],
  seventhChords['maj.b7'],
  seventhChords['sus.b7'],
  seventhChords['dim.b7'],
];

const allSeventhChords = Object.values(seventhChords);

const allChordsWithTensions = allSeventhChords.flatMap(getAllTensionChords);

export const allChords = [
  ...allTriads,
  ...allSeventhChords,
  ...allChordsWithTensions,
];

export const chordSets: ChordSet[] = [
  {
    key: 'triads',
    label: 'Triads',
    chords: allTriads,
    description: `All triads (${allTriads.map(({ name }) => name).join(', ')})`,
  },
  {
    key: 'basic-seventh-chords',
    label: 'Basic Seventh Chords',
    chords: basicSenventhChords,
    description: basicSenventhChords.map(({ name }) => name).join(', '),
  },
  {
    key: 'all-seventh-chords',
    label: 'All Seventh Chords',
    chords: allSeventhChords,
    description: allSeventhChords.map(({ name }) => name).join(', '),
  },
  {
    key: 'basic-tensions',
    label: 'Basic Tensions',
    chords: basicSenventhChords.flatMap(getAllTensionChords),
    description: `${basicSenventhChords.map(({ name }) => name).join(', ')} with Tensions`,
  },
  {
    key: 'all-tensions',
    label: 'All Tensions',
    chords: allChordsWithTensions,
    description: `${allSeventhChords.map(({ name }) => name).join(', ')} with Tensions`,
  },
];
