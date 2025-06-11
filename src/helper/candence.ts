import {
  ChordFunction,
  diatonicChordFunctions,
  iChords,
  dominantMap,
} from '../model/cadence';
import { getRandomFromArray } from '../utils';

type CadenceConfig = {
  startOn1: boolean;
  endsOn1: boolean;
  messures: number;
};

export function getRandomCadence({
  startOn1 = true,
  endsOn1 = true,
  messures = 8,
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

    chords.push(
      getRandomFromArray(
        [...diatonicChordFunctions, ...dominantMap[prev]].filter(
          (chord) => chord !== prev
        )
      )
    );
  }

  return chords.reverse();
}
