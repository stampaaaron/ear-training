import { Chord, seventhChords } from './chord';

export enum DiatonicChordFunction {
  'I6' = 'I6',
  'Ij7' = 'Ij7',
  'IIm7' = 'IIm7',
  'IIIm7' = 'IIIm7',
  'IVj7' = 'IVj7',
  'V7' = 'V7',
  'VIm7' = 'VIm7',
  'VIIm7b5' = 'VIIm7b5',
}
export enum SecondaryDominatChordFunction {
  'V7/II' = 'V7/II',
  'V7/III' = 'V7/III',
  'V7/IV' = 'V7/IV',
  'V7/V' = 'V7/V',
  'V7/VI' = 'V7/VI',
}
export enum SubstitutionDominantChordFunction {
  'subV7/I' = 'subV7/I',
  'subV7/II' = 'subV7/II',
  'subV7/III' = 'subV7/III',
  'subV7/IV' = 'subV7/IV',
  'subV7/V' = 'subV7/V',
  'subV7/VI' = 'subV7/VI',
}

export const diatonicChordFunctions = Object.values(DiatonicChordFunction);

export const nonFunctionalDiatonicChordFunctions = [
  DiatonicChordFunction.IIm7,
  DiatonicChordFunction.IIIm7,
  DiatonicChordFunction.IVj7,
  DiatonicChordFunction.VIm7,
  DiatonicChordFunction.VIIm7b5,
];

export const secondaryDominantChordFunctions = Object.values(
  SecondaryDominatChordFunction
);
export const substitutionDominantCadanceChords = Object.values(
  SubstitutionDominantChordFunction
);

export const iChords = [DiatonicChordFunction.I6, DiatonicChordFunction.Ij7];

export type ChordFunction =
  | DiatonicChordFunction
  | SecondaryDominatChordFunction
  | SubstitutionDominantChordFunction;

export const chordFunctionVoicings: Record<ChordFunction, Chord> = {
  I6: seventhChords['maj.6'],
  Ij7: seventhChords['maj.7'],
  IIm7: seventhChords['min.b7'],
  IIIm7: seventhChords['min.b7'],
  IVj7: seventhChords['maj.7'],
  V7: seventhChords['dom.b7'],
  VIm7: seventhChords['min.b7'],
  VIIm7b5: seventhChords['dim.b7'],
  'V7/II': seventhChords['dom.b7'],
  'V7/III': seventhChords['dom.b7'],
  'V7/IV': seventhChords['dom.b7'],
  'V7/V': seventhChords['dom.b7'],
  'V7/VI': seventhChords['dom.b7'],
  'subV7/I': seventhChords['dom.b7'],
  'subV7/II': seventhChords['dom.b7'],
  'subV7/III': seventhChords['dom.b7'],
  'subV7/IV': seventhChords['dom.b7'],
  'subV7/V': seventhChords['dom.b7'],
  'subV7/VI': seventhChords['dom.b7'],
};

export const dominantMap: Record<ChordFunction, ChordFunction[]> = {
  [DiatonicChordFunction['I6']]: [
    DiatonicChordFunction.V7,
    SubstitutionDominantChordFunction['subV7/I'],
  ],
  [DiatonicChordFunction['Ij7']]: [
    DiatonicChordFunction.V7,
    SubstitutionDominantChordFunction['subV7/I'],
  ],
  [DiatonicChordFunction['IIm7']]: [
    SecondaryDominatChordFunction['V7/II'],
    SubstitutionDominantChordFunction['subV7/II'],
  ],
  [DiatonicChordFunction['IIIm7']]: [
    SecondaryDominatChordFunction['V7/III'],
    SubstitutionDominantChordFunction['subV7/III'],
  ],
  [DiatonicChordFunction['IVj7']]: [
    SecondaryDominatChordFunction['V7/IV'],
    SubstitutionDominantChordFunction['subV7/IV'],
  ],
  [DiatonicChordFunction['V7']]: [
    SecondaryDominatChordFunction['V7/V'],
    SubstitutionDominantChordFunction['subV7/V'],
  ],
  [DiatonicChordFunction['VIm7']]: [
    SecondaryDominatChordFunction['V7/VI'],
    SubstitutionDominantChordFunction['subV7/VI'],
  ],
  [DiatonicChordFunction['VIIm7b5']]: [],
  [SecondaryDominatChordFunction['V7/II']]: [
    SecondaryDominatChordFunction['V7/VI'],
    SubstitutionDominantChordFunction['subV7/VI'],
  ],
  [SecondaryDominatChordFunction['V7/III']]: [],
  [SecondaryDominatChordFunction['V7/IV']]: [
    DiatonicChordFunction.V7,
    SubstitutionDominantChordFunction['subV7/I'],
  ],
  [SecondaryDominatChordFunction['V7/V']]: [
    SecondaryDominatChordFunction['V7/II'],
    SubstitutionDominantChordFunction['subV7/II'],
  ],
  [SecondaryDominatChordFunction['V7/VI']]: [],
  [SubstitutionDominantChordFunction['subV7/I']]: [],
  [SubstitutionDominantChordFunction['subV7/II']]: [],
  [SubstitutionDominantChordFunction['subV7/III']]: [],
  [SubstitutionDominantChordFunction['subV7/IV']]: [],
  [SubstitutionDominantChordFunction['subV7/V']]: [],
  [SubstitutionDominantChordFunction['subV7/VI']]: [],
};

export const diatonicIIMap: { [F in ChordFunction]?: ChordFunction } = {
  [DiatonicChordFunction['V7']]: DiatonicChordFunction.IIm7,
  [SecondaryDominatChordFunction['V7/II']]: DiatonicChordFunction.IIIm7,
  [SecondaryDominatChordFunction['V7/V']]: DiatonicChordFunction.VIm7,
  [SecondaryDominatChordFunction['V7/VI']]: DiatonicChordFunction.VIIm7b5,
};
