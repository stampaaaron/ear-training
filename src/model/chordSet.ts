import { QuizSet } from '../store/sets';
import { defaultSettings } from '../store/settings';
import {
  baseChords,
  Chord,
  getAllOneTensionChords,
  getAllTwoTensionChords,
  seventhChords,
} from './chord';

export type ChordSet = QuizSet<Chord>;

const allTriads = [
  baseChords['maj'],
  baseChords['min'],
  baseChords['dim'],
  baseChords['aug'],
  baseChords['sus'],
  baseChords['sus2'],
];

const allAddChords = [
  seventhChords['maj.add'],
  seventhChords['sus.add'],
  seventhChords['min.add'],
].flatMap(getAllTwoTensionChords);

const basicSeventhChords = [
  seventhChords['maj.7'],
  seventhChords['maj.6'],
  seventhChords['min.b7'],
  seventhChords['min.6'],
  seventhChords['min.7'],
  seventhChords['sus.b7'],
  seventhChords['dim.b7'],
  seventhChords['maj.b7'],
];

const basicSeventhChordsWithTensions = basicSeventhChords.flatMap(
  getAllOneTensionChords
);
const basicSeventhChordsWithTwoTensions = basicSeventhChords.flatMap(
  getAllTwoTensionChords
);

const allSeventhChords = Object.values(seventhChords);

const allChordsWithTensions = allSeventhChords.flatMap(getAllOneTensionChords);

const allChordsWithTwoTensions = allSeventhChords.flatMap(
  getAllTwoTensionChords
);

export const allChords = [
  ...allTriads,
  ...allSeventhChords,
  ...allChordsWithTensions,
  ...allChordsWithTwoTensions,
];

const basicSeventhChordsWithAllTensions = [
  ...basicSeventhChordsWithTensions,
  ...basicSeventhChordsWithTwoTensions,
];

export const possibleChordsForAlternativeVoicings = [
  ...basicSeventhChordsWithAllTensions.filter(
    ({ name }) => !name.includes('Min7b5') && !name.includes('Min(maj7)')
  ),
  ...allAddChords,
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
    key: 'basic-single-tensions',
    label: 'Basic Tensions (1 Tensions)',
    options: basicSeventhChordsWithTensions,
    description: `${basicSeventhChords.map(({ name }) => name).join(', ')} with one Tension`,
  },
  {
    key: 'all-single-tensions',
    label: 'All Tensions (1 Tensions)',
    options: allChordsWithTensions,
    description: `${allSeventhChords.map(({ name }) => name).join(', ')} with one Tensions`,
  },
  {
    key: 'basic-two-tensions',
    label: 'Basic Tensions (2 Tensions)',
    options: basicSeventhChordsWithTwoTensions,
    description: `${basicSeventhChords.map(({ name }) => name).join(', ')} with two Tension`,
  },
  {
    key: 'all-two-tensions',
    label: 'All Tensions (2 Tensions)',
    options: allChordsWithTwoTensions,
    description: `${allSeventhChords.map(({ name }) => name).join(', ')} with two Tensions`,
  },
  {
    key: 'alternative-voicings',
    label: 'Chords with alternative Voicings (Beta)',
    options: possibleChordsForAlternativeVoicings,
    description:
      'A list of voicings where the intervals are played in a diffrent order',
    settings: { ...defaultSettings, alternativeVoicings: true },
  },
];
