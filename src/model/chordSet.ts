import { QuizSet } from '../store/sets';
import { defaultSettings } from '../store/settings';
import {
  baseChords,
  Chord,
  getAllOneTensionChords,
  getAllTwoTensionChords,
  seventhChords,
} from './chord';
import {
  alternativeVoicings,
  isVoicingValidForChord,
  seventhInversionVoicings,
  triadInversionVoicings,
} from './voicing';

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

// Maj7, Dominant7 and Min7 in their three inversions (3rd/5th/7th in the
// bass instead of the root) — see inversionVoicings in ./voicing.
export const invertibleSeventhChords = [
  seventhChords['maj.7'],
  seventhChords['maj.b7'],
  seventhChords['min.b7'],
];

// Maj and Min triads in their two inversions (3rd/5th in the bass).
export const invertibleTriads = [baseChords['maj'], baseChords['min']];

const basicSeventhChordsWithTensions = basicSeventhChords.flatMap(
  getAllOneTensionChords
);
const basicSeventhChordsWithTwoTensions = basicSeventhChords.flatMap(
  getAllTwoTensionChords
);

const allSeventhChordsIncludingAdd = Object.values(seventhChords);

// The "add" entries (Majadd, Minadd, Sus4add) have no interval on their own -
// they only make sense once a tension is added (e.g. Cadd9). Without a
// tension they're indistinguishable from the plain triad, so they're
// excluded from the bare seventh-chord listing but kept for tension
// generation below.
const allSeventhChords = (
  Object.entries(seventhChords) as [string, Chord][]
)
  .filter(([key]) => !key.endsWith('.add'))
  .map(([, chord]) => chord);

const allChordsWithTensions = allSeventhChordsIncludingAdd.flatMap(
  getAllOneTensionChords
);

const allChordsWithTwoTensions = allSeventhChordsIncludingAdd.flatMap(
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

const candidateChordsForAlternativeVoicings = [
  ...basicSeventhChordsWithAllTensions.filter(
    ({ name }) => !name.includes('Min7b5') && !name.includes('Min(maj7)')
  ),
  ...allAddChords,
];

export const possibleChordsForAlternativeVoicings =
  candidateChordsForAlternativeVoicings.filter((chord) =>
    alternativeVoicings.some((voicing) => isVoicingValidForChord(voicing, chord))
  );

export const chordSets: ChordSet[] = [
  {
    key: 'triads',
    label: 'Triads',
    options: allTriads,
    description: {
      prefix: 'All triads (',
      names: allTriads.map(({ name }) => name),
      suffix: ')',
    },
  },
  {
    key: 'triad-inversions',
    label: 'Triad Inversions',
    options: invertibleTriads,
    description: {
      names: invertibleTriads.map(({ name }) => name),
      suffix: ' in their 1st and 2nd inversion',
    },
    settings: {
      ...defaultSettings,
      inversions: true,
      inversionVoicings: triadInversionVoicings,
    },
  },
  {
    key: 'basic-seventh-chords',
    label: 'Basic Seventh Chords',
    options: basicSeventhChords,
    description: { names: basicSeventhChords.map(({ name }) => name) },
  },
  {
    key: 'all-seventh-chords',
    label: 'All Seventh Chords',
    options: allSeventhChords,
    description: { names: allSeventhChords.map(({ name }) => name) },
  },
  {
    key: 'seventh-chord-inversions',
    label: 'Seventh Chord Inversions',
    options: invertibleSeventhChords,
    description: {
      names: invertibleSeventhChords.map(({ name }) => name),
      suffix: ' in their 1st, 2nd and 3rd inversion',
    },
    settings: {
      ...defaultSettings,
      inversions: true,
      inversionVoicings: seventhInversionVoicings,
    },
  },
  {
    key: 'basic-single-tensions',
    label: 'Basic Tensions (1 Tensions)',
    options: basicSeventhChordsWithTensions,
    description: {
      names: basicSeventhChords.map(({ name }) => name),
      suffix: ' with one Tension',
    },
  },
  {
    key: 'all-single-tensions',
    label: 'All Tensions (1 Tensions)',
    options: allChordsWithTensions,
    description: {
      names: allSeventhChords.map(({ name }) => name),
      suffix: ' with one Tensions',
    },
  },
  {
    key: 'basic-two-tensions',
    label: 'Basic Tensions (2 Tensions)',
    options: basicSeventhChordsWithTwoTensions,
    description: {
      names: basicSeventhChords.map(({ name }) => name),
      suffix: ' with two Tension',
    },
  },
  {
    key: 'all-two-tensions',
    label: 'All Tensions (2 Tensions)',
    options: allChordsWithTwoTensions,
    description: {
      names: allSeventhChords.map(({ name }) => name),
      suffix: ' with two Tensions',
    },
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
