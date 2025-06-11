import {
  ChordFunction,
  diatonicChordFunctions,
  iChords,
  dominantMap,
  diatonicIIMap,
  nonFunctionalDiatonicChordFunctions,
  diatonicDescendingFifthsMap,
  secondaryDominantMap,
  subDominantMap,
} from '../model/cadence';
import { getRandomFromArray } from '../utils';

const diatonicDominantWeight = 20;
const secondaryDominantWeight = 8;
const subDominantWeight = 6;
const diatonicIIWeight = 16;
const diatonicDescedningFifthWeight = diatonicIIWeight;
const nonFunctionalDiatonicWeight = 4;
const allDiatonicWeight = 1;

type CadenceConfig = {
  startOn1: boolean;
  endsOn1: boolean;
  withSecondaryDominants: boolean;
  withSubDominants: boolean;
  messures: number;
};

export function getRandomCadence({
  startOn1 = true,
  endsOn1 = true,
  messures = 12,
  withSecondaryDominants = true,
  withSubDominants = true,
}: Partial<CadenceConfig>) {
  const chords: ChordFunction[] = [];

  for (let i = 0; i < messures; i++) {
    if (i === 0 || i === messures - 1) {
      if ((startOn1 && i === messures - 1) || (endsOn1 && i === 0)) {
        chords.push(getRandomFromArray(iChords));
      } else {
        chords.push(getRandomFromArray(diatonicChordFunctions));
      }
      continue;
    }

    const prev = chords[i - 1];

    const chordPool: ChordFunction[] = [];

    pushWeighted(chordPool, dominantMap[prev], diatonicDominantWeight);
    pushWeighted(chordPool, diatonicIIMap[prev], diatonicIIWeight);
    pushWeighted(
      chordPool,
      diatonicDescendingFifthsMap[prev],
      diatonicDescedningFifthWeight
    );

    const nextNonFunctionalDiatonic = getRandomFromArray(
      nonFunctionalDiatonicChordFunctions.filter((chord) => chord !== prev)
    );
    pushWeighted(
      chordPool,
      nextNonFunctionalDiatonic,
      nonFunctionalDiatonicWeight
    );

    const nextDiatonic = getRandomFromArray(
      diatonicChordFunctions.filter((chord) => chord !== prev)
    );
    pushWeighted(chordPool, nextDiatonic, allDiatonicWeight);

    if (withSecondaryDominants)
      pushWeighted(
        chordPool,
        secondaryDominantMap[prev],
        secondaryDominantWeight
      );

    if (withSubDominants)
      pushWeighted(chordPool, subDominantMap[prev], subDominantWeight);

    chords.push(getRandomFromArray(chordPool));
  }

  return chords.reverse();
}

const pushWeighted = <T>(array: T[], item: T | T[] = [], weight = 1) => {
  for (let index = 0; index < weight; index++) {
    array.push(...(Array.isArray(item) ? item : [item]));
  }
};
