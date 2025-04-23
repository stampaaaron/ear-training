import {
  baseChords,
  Chord,
  getAllTensionChords,
  seventhChords,
  SeventhChords,
} from './chord';
import { Entries } from './helper';
import { QuizSet } from './quizSet';

export type ChordSet = QuizSet<Chord>;

const allTriads = [
  baseChords['maj'],
  baseChords['min'],
  baseChords['dim'],
  baseChords['aug'],
  baseChords['sus'],
  baseChords['sus2'],
];

const basicSenventhChordsWithoutDominant = [
  seventhChords['maj.7'],
  seventhChords['maj.6'],
  seventhChords['min.b7'],
  seventhChords['min.6'],
  seventhChords['min.7'],
  seventhChords['sus.b7'],
  seventhChords['dim.b7'],
];

const basicSeventhChords = [
  ...basicSenventhChordsWithoutDominant,
  seventhChords['maj.b7'],
];

const basicSeventhChordsWithTensions = [
  ...basicSenventhChordsWithoutDominant,
  seventhChords['dom.b7'],
].flatMap(getAllTensionChords);

const allSeventhChords = (
  Object.entries(seventhChords) as Entries<SeventhChords>
)
  .filter(([key]) => key !== 'dom.b7')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .map(([_, value]) => value);

const allChordsWithTensions =
  Object.values(seventhChords).flatMap(getAllTensionChords);

export const allChords = [
  ...allTriads,
  ...allSeventhChords,
  ...allChordsWithTensions,
];

export const chordSets: ChordSet[] = [
  {
    key: 'triads',
    label: 'Triads',
    options: allTriads,
    description: `All triads (${allTriads.map(({ name }) => name).join(', ')})`,
  },
  {
    key: 'basic-seventh-chords',
    label: 'Basic Seventh Chords',
    options: basicSeventhChords,
    description: basicSeventhChords.map(({ name }) => name).join(', '),
  },
  {
    key: 'all-seventh-chords',
    label: 'All Seventh Chords',
    options: allSeventhChords,
    description: allSeventhChords.map(({ name }) => name).join(', '),
  },
  {
    key: 'basic-tensions',
    label: 'Basic Tensions',
    options: basicSeventhChordsWithTensions,
    description: `${basicSeventhChords.map(({ name }) => name).join(', ')} with Tensions`,
  },
  {
    key: 'all-tensions',
    label: 'All Tensions',
    options: allChordsWithTensions,
    description: `${allSeventhChords.map(({ name }) => name).join(', ')} with Tensions`,
  },
];
