import { Interval } from './interval';
import { QuizOptionBase, QuizSet } from './quizSet';

type ScaleGroup = 'penta' | 'maj' | 'min' | 'dom' | 'sym';

export const scaleGroupNaming: { [K in ScaleGroup]?: string } = {
  ['penta']: 'Pentatonic',
  ['maj']: 'Major',
  ['min']: 'Minor',
  ['dom']: 'Dominant',
  ['sym']: 'Symmetric',
};

type Scale = QuizOptionBase<ScaleGroup> & {
  intervals: Interval[];
};

// Pentatonic scales
const pentaMaj: Scale = {
  name: 'Pentatonic Major',
  group: 'penta',
  intervals: ['1', '2', '3', '5', '6'],
};

const pentaMin: Scale = {
  name: 'Pentatonic Minor',
  group: 'penta',
  intervals: ['1', 'b3', '4', '5', 'b7'],
};

const pentatonicScales: Scale[] = [pentaMaj, pentaMin];

// Major scales (with major 3rd)
const ionian: Scale = {
  name: 'Ionian',
  group: 'maj',
  intervals: ['1', '2', '3', '4', '5', '6', '7'],
};

const lydian: Scale = {
  name: 'Lydian',
  group: 'maj',
  intervals: ['1', '2', '3', '#4', '5', '6', '7'],
};

const mixolydian: Scale = {
  name: 'Mixolydian',
  group: 'dom',
  intervals: ['1', '2', '3', '4', '5', '6', 'b7'],
};

const majorScales: Scale[] = [ionian, lydian];

// Minor scales (with minor 3rd)
const dorian: Scale = {
  name: 'Dorian',
  group: 'min',
  intervals: ['1', '2', 'b3', '4', '5', '6', 'b7'],
};

const phrygian: Scale = {
  name: 'Phrygian',
  group: 'min',
  intervals: ['1', 'b2', 'b3', '4', '5', 'b6', 'b7'],
};

const aeolian: Scale = {
  name: 'Aeolian',
  group: 'min',
  intervals: ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
};

const locrian: Scale = {
  name: 'Locrian',
  group: 'min',
  intervals: ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'],
};

const harmonicMinor: Scale = {
  name: 'Harmonic Minor',
  group: 'min',
  intervals: ['1', '2', 'b3', '4', '5', 'b6', '7'],
};

const melodicMinor: Scale = {
  name: 'Melodic Minor',
  group: 'min',
  intervals: ['1', '2', 'b3', '4', '5', '6', '7'],
};

const dorianAug11: Scale = {
  name: 'Dorian #11',
  group: 'min',
  intervals: ['1', '2', 'b3', '#4', '5', '6', 'b7'],
};

const phrygian9: Scale = {
  name: 'Phrygian ♮9',
  group: 'min',
  intervals: ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
};

const basicMinorScales: Scale[] = [
  dorian,
  phrygian,
  aeolian,
  locrian,
  harmonicMinor,
  melodicMinor,
];

const minorScales: Scale[] = [...basicMinorScales, dorianAug11, phrygian9];

// Dominant scales (altered dominants & variants)
const mixob9b13: Scale = {
  name: 'Mixolydian b9 b13 (HM5)',
  group: 'dom',
  intervals: ['1', 'b2', '3', '4', '5', 'b6', 'b7'],
};

const mixob13: Scale = {
  name: 'Mixolydian b13 (MM5)',
  group: 'dom',
  intervals: ['1', '2', '3', '4', '5', 'b6', 'b7'],
};

const mixoAug11: Scale = {
  name: 'Mixolydian #11 (MM4)',
  group: 'dom',
  intervals: ['1', '2', '3', '#4', '5', '6', 'b7'],
};

const altered: Scale = {
  name: 'Altered (MM7)',
  group: 'dom',
  intervals: ['1', 'b2', '#2', '3', 'b5', '#5', 'b7'],
};

const dominantVariantScales: Scale[] = [
  mixolydian,
  mixob9b13,
  mixob13,
  mixoAug11,
  altered,
];

// Symmetric scales
const wholeTone: Scale = {
  name: 'Whole Tone',
  group: 'sym',
  intervals: ['1', '2', '3', '#4', '#5', 'b7'],
};

const halfWholeDim: Scale = {
  name: 'Half-Whole Diminished',
  group: 'sym',
  intervals: ['1', '2', 'b3', '4', 'b5', 'b6', '6', '7'],
};

const wholeHalfDim: Scale = {
  name: 'Whole-Half Diminished',
  group: 'sym',
  intervals: ['1', 'b2', '#2', '3', '#4', '5', '6', 'b7'],
};

const symmetricScales: Scale[] = [wholeTone, halfWholeDim, wholeHalfDim];

export const allScales = [
  ...pentatonicScales,
  ...majorScales,
  ...minorScales,
  ...dominantVariantScales,
  ...symmetricScales,
];

const basicScales = [...pentatonicScales, ionian, aeolian];

const majorModes = [
  ionian,
  dorian,
  phrygian,
  lydian,
  mixolydian,
  aeolian,
  locrian,
];

const basicMixed = [...pentatonicScales, ...majorScales, ...basicMinorScales];
const intermadiateMixed = [
  ...majorScales,
  ...basicMinorScales,
  ...symmetricScales,
];
const advancedMixed = [
  ...majorScales,
  ...basicMinorScales,
  ...dominantVariantScales,
  ...symmetricScales,
];

export const scaleSets: QuizSet<Scale>[] = [
  {
    key: 'basic-scales',
    label: 'Basic scales',
    description: basicScales.map(({ name }) => name).join(', '),
    options: basicScales,
  },
  {
    key: 'major-modes',
    label: 'Major modes',
    description: majorModes.map(({ name }) => name).join(', '),
    options: majorModes,
  },
  {
    key: 'basic-minor',
    label: 'Basic Minor scales',
    description: basicMinorScales.map(({ name }) => name).join(', '),
    options: basicMinorScales,
  },
  {
    key: 'all-minor',
    label: 'Advanced Minor scales',
    description: minorScales.map(({ name }) => name).join(', '),
    options: minorScales,
  },
  {
    key: 'dominant',
    label: 'Dominant scales',
    description: dominantVariantScales.map(({ name }) => name).join(', '),
    options: dominantVariantScales,
  },
  {
    key: 'symmetric',
    label: 'Symmetric scales',
    description: symmetricScales.map(({ name }) => name).join(', '),
    options: symmetricScales,
  },
  {
    key: 'basic-mixed',
    label: 'Mixed basic',
    description: basicMixed.map(({ name }) => name).join(', '),
    options: basicMixed,
  },
  {
    key: 'intermediate-mixed',
    label: 'Mixed intermediate',
    description: intermadiateMixed.map(({ name }) => name).join(', '),
    options: intermadiateMixed,
  },
  {
    key: 'advanced-mixed',
    label: 'Mixed advanced',
    description: advancedMixed.map(({ name }) => name).join(', '),
    options: advancedMixed,
  },
  {
    key: 'all',
    label: 'All',
    description: allScales.map(({ name }) => name).join(', '),
    options: allScales,
  },
];
