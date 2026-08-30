import { getRandomFromArray } from '../utils';
import { Chord, ChordBase, ChordTension } from './chord';
import { Interval, intervalDistanceMap } from './interval';

type VoicingInterval = 1 | 3 | 5 | 7 | 9 | '#9' | '10' | 11 | 13;

export const chordIntervalBaseMap: Record<VoicingInterval, Interval[]> = {
  '1': ['1'],
  '3': ['b3', '3', '4'],
  '5': ['5', 'b5'],
  '7': ['bb7', 'b7', '7', '6'],
  '9': ['b9', '9'],
  '#9': ['#9'],
  '10': ['10'],
  '11': ['11', '#11'],
  '13': ['b13', '13'],
};

export type VoicingIntervalOctave = VoicingInterval[];

export type Voicing = VoicingIntervalOctave[];

export const alternativeVoicings: Voicing[] = [
  // 1,5
  [
    [1, 5],
    [9, 3, 7],
  ],
  [
    [1, 5],
    [3, 11, 7],
  ],
  [
    [1, 5],
    [3, 13, 7],
  ],

  // add chords
  [
    [1, 5],
    [9, 3, 11],
  ],
  [
    [1, 11],
    [9, 3, 5],
  ],

  // 1,5,13
  [
    [1, 5, 13],
    [3, 7],
  ],

  // 1,13
  [
    [1, 13],
    [9, 3, 7],
  ],
  [
    [1, 13],
    [3, 11, 7],
  ],
  [
    [1, 13],
    [3, 5, 7],
  ],

  // 1,7
  [
    [1, 7],
    [9, 3, 5],
  ],
  [
    [1, 7],
    [9, 3, 11], // 10 prüfen
  ],
  [
    [1, 7],
    [9, 3, 13],
  ],
  [
    [1, 7],
    [3, 11, 5],
  ],
  [
    [1, 7],
    [3, 11, 13], // 10 prüfen
  ],
  [
    [1, 7],
    [3, 5, 13],
  ],

  // 1,11,7
  [
    [1, 11, 7],
    [9, 3],
  ],
  [
    [1, 11, 7],
    [3, 5],
  ],
  [
    [1, 11, 7],
    [3, 13],
  ],
  [[1, 11, 5, 7], [3]],

  //  1,3,7
  [
    [1, 3, 7],
    [11, 5],
  ],
  [
    [1, 3, 7],
    [9, 11],
  ],
  [
    [1, 3, 7],
    [9, 5],
  ],
  [
    [1, 3, 7],
    [11, 13],
  ],
  [
    [1, 3, 7],
    [9, 13],
  ],

  // 1,5,7
  [
    [1, 5, 7],
    [9, 3],
  ],
  [
    [1, 5, 7],
    [3, 11],
  ],
  [
    [1, 5, 7],
    [3, 13],
  ],

  [[1, 5], [9, 13], [3]],
  [
    [1, 5],
    [9, 3, 13],
  ],

  // #9
  [
    [1, 3],
    [9, '#9', 7],
  ],
  // #9 without a b9 alongside it
  [
    [1, 3, 5],
    ['#9', 7],
  ],
  [
    [1, 3, 7],
    ['#9', 5],
  ],

  // 10
  [
    [1, 3, 7],
    [9, '10'],
  ],
  [
    [1, 3, 7],
    ['10', 5],
  ],
  [
    [1, 3, 7],
    ['10', 13],
  ],
  [
    [1, 3],
    [9, '10', 7],
  ],
  [
    [1, 3, 13],
    ['10', 7],
  ],
  [
    [1, 3, 13],
    ['10', 5],
  ],

  [[1, 5, 13, 7], [3]],
  [[1, 3, 13, 7], [9]],
];

export const isTensionsVoicing = (voicing: Voicing, tensions: ChordTension[]) =>
  tensions?.every((t) =>
    voicing.flat().some((i) => chordIntervalBaseMap[i].includes(t))
  );

export const voicingContainsChord = (voicing: Voicing, chord: Chord) => {
  const chordWithFiveNotes = resolveChordIntervalsForVoicings(chord);

  return voicing
    .flat()
    .map((voicingInterval) => chordIntervalBaseMap[voicingInterval])
    .every((intervals) =>
      intervals.some((i) => chordWithFiveNotes.includes(i))
    );
};

const resolveChordIntervalsForVoicings = (chord: Chord) => {
  return chord.intervals.length > 5
    ? chord.intervals.filter((i) => i !== '5')
    : chord.intervals;
};

// A compound interval (9/10/11/13/#9, 12+ semitones) always sounds relative
// to whichever octave group it's placed in — so it's played as its simple,
// within-octave equivalent (9 -> 2, 11 -> 4, 13 -> 6, ...) and the group's
// own octave offset supplies the rest.
const reduceIntervalByOctave = (interval: Interval): Interval | undefined =>
  Object.entries(intervalDistanceMap).find(
    ([, value]) => value === intervalDistanceMap[interval] - 12
  )?.[0] as Interval | undefined;

export const resolveVoicingOctaveIntervals = (
  chord: Interval[],
  voicing = getRandomFromArray(alternativeVoicings)
) =>
  voicing.map((octave) =>
    octave
      .map((voicingInterval) => {
        const interval = chordIntervalBaseMap[voicingInterval].find((i) =>
          chord.includes(i)
        );

        if (!interval) return;

        const semitones = intervalDistanceMap[interval];

        if (semitones < 12) return interval;

        return reduceIntervalByOctave(interval);
      })
      .filter((x): x is Interval => !!x)
  );

// See docs/voicing-rules.md for the reasoning behind each of these.
export const MAX_ADJACENT_GAP = 9; // a major 6th
export const MIN_BASS_INTERVAL = 3; // a minor 3rd
export const MAX_TOTAL_SPAN = 24; // two octaves
const SPAN_EXCEPTION: Voicing = [[1, 5], [9, 13], [3]];
const HALFSTEP_EXCEPTION: [Interval, Interval] = ['2', 'b3'];

export type VoicingRuleViolation = {
  rule: 1 | 2 | 3 | 4 | 5 | 7 | 8 | 9 | 10 | 11;
  message: string;
};

type ResolvedNote = {
  slot: VoicingInterval;
  interval: Interval;
  group: number;
  semitone: number;
};

const resolveVoicingNotes = (
  voicing: Voicing,
  chord: Chord
): ResolvedNote[] | null => {
  const notes: ResolvedNote[] = [];

  for (let group = 0; group < voicing.length; group++) {
    for (const slot of voicing[group]) {
      const rawInterval = chordIntervalBaseMap[slot].find((i) =>
        chord.intervals.includes(i)
      );

      if (!rawInterval) return null;

      const rawSemitones = intervalDistanceMap[rawInterval];
      const isCompound = rawSemitones >= 12;

      const interval = isCompound
        ? (reduceIntervalByOctave(rawInterval) ?? rawInterval)
        : rawInterval;
      const semitone =
        (isCompound ? rawSemitones - 12 : rawSemitones) + group * 12;

      notes.push({ slot, interval, group, semitone });
    }
  }

  return notes;
};

const isRootSeventhPair = (a: ResolvedNote, b: ResolvedNote) =>
  a.group === 0 &&
  b.group === 0 &&
  ((a.slot === 1 && b.slot === 7) || (a.slot === 7 && b.slot === 1));

const isSameVoicing = (a: Voicing, b: Voicing) => JSON.stringify(a) === JSON.stringify(b);

/**
 * Checks a voicing against the rules in docs/voicing-rules.md for one
 * specific chord. Assumes `voicingContainsChord(voicing, chord)` is already
 * true — this only judges musical quality, not whether the shape applies.
 */
export const checkVoicingRules = (
  voicing: Voicing,
  chord: Chord
): VoicingRuleViolation[] => {
  const violations: VoicingRuleViolation[] = [];

  // Rule 1 — always 5 notes
  if (voicing.flat().length !== 5) {
    violations.push({ rule: 1, message: 'Voicing has more or fewer than 5 notes' });
  }

  // Rule 5 — no group may contain the full root-position triad (1-3-5)
  // with nothing else separating it from the rest of the voicing. If a 7
  // sits in a different (higher) octave group, the voicing isn't just the
  // bare triad anymore — the 7 makes it a genuinely different, spread-out
  // shape, not "the same old triad plus a tension on top".
  //
  // For dominant chords, the app's own chord model (chordBaseIntervals.dom
  // = ['1','3'], no 5th) treats root+3rd+7th as that quality's complete
  // identity without a 5th at all — so 1-3-7 only counts as the same kind
  // of "root position" when the 5th is missing from the voicing entirely.
  // The moment the 5th shows up anywhere (even as the top note), the
  // voicing includes something the "default" dominant sound doesn't have,
  // so it's no longer just root position.
  const rootThirdFifth: VoicingInterval[] = [1, 3, 5];
  const rootThirdSeventh: VoicingInterval[] = [1, 3, 7];
  const isDominant = chord.group === ChordBase.dom;
  const hasFifthAnywhere = voicing.flat().includes(5);
  const hasRootPositionCluster = voicing.some((group, groupIndex) => {
    const slots = new Set(group);
    const seventhInAnotherGroup = voicing.some(
      (g, i) => i !== groupIndex && g.includes(7)
    );
    return (
      (rootThirdFifth.every((s) => slots.has(s)) && !seventhInAnotherGroup) ||
      (isDominant && !hasFifthAnywhere && rootThirdSeventh.every((s) => slots.has(s)))
    );
  });
  if (hasRootPositionCluster) {
    violations.push({ rule: 5, message: 'A group contains the plain root-position cluster' });
  }

  // Rule 9 — the voicing must start with the root (the root is the bass note)
  if (!voicing[0]?.includes(1)) {
    violations.push({ rule: 9, message: 'The root is not in the bottom octave' });
  }

  const notes = resolveVoicingNotes(voicing, chord);
  if (!notes) return violations; // voicingContainsChord should already exclude this

  // Rule 10 — for sus chords, a compound 10 must sound above the suspended
  // 4th, never below it. Below it, the gap between them is a b9 (13
  // semitones) instead of the major 7th a 4-then-10 stack should have, and
  // the chord stops reading as sus and starts reading as an altered clash.
  const suspendedFourth = notes.find((n) => n.slot === 3 && n.interval === '4');
  const compoundTen = notes.find((n) => n.slot === '10');
  if (suspendedFourth && compoundTen && compoundTen.semitone < suspendedFourth.semitone) {
    violations.push({
      rule: 10,
      message: '10 sits below the suspended 4th (sounds like a b9, not sus)',
    });
  }

  // Rule 11 — a #9 must sound above the natural 3rd, never below it. Below
  // it, the reduced #9 (a minor 3rd/#2 by pitch class) sits right next to
  // the root where the ear expects the chord's real (major) 3rd, making a
  // dominant chord read as minor instead of as a dominant with a color tone.
  const naturalThird = notes.find((n) => n.slot === 3 && n.interval === '3');
  const sharpNine = notes.find((n) => n.slot === '#9');
  if (naturalThird && sharpNine && sharpNine.semitone < naturalThird.semitone) {
    violations.push({
      rule: 11,
      message: '#9 sits below the natural 3rd (sounds minor, not dominant)',
    });
  }

  // Rule 7 — ascending in the order the voicing is written
  for (let i = 1; i < notes.length; i++) {
    if (notes[i].semitone < notes[i - 1].semitone) {
      violations.push({
        rule: 7,
        message: `${notes[i - 1].interval} (group ${notes[i - 1].group}) is followed by a lower note ${notes[i].interval} (group ${notes[i].group})`,
      });
      break;
    }
  }

  const sorted = [...notes].sort((a, b) => a.semitone - b.semitone);

  // Rule 3 — bass interval at least a minor 3rd
  const bassInterval = sorted[1].semitone - sorted[0].semitone;
  if (bassInterval < MIN_BASS_INTERVAL) {
    violations.push({
      rule: 3,
      message: `Bottom two notes (${sorted[0].interval}, ${sorted[1].interval}) are only ${bassInterval} semitones apart`,
    });
  }

  // Rule 4 — max 2 octaves total span
  const span = sorted[sorted.length - 1].semitone - sorted[0].semitone;
  if (span > MAX_TOTAL_SPAN && !isSameVoicing(voicing, SPAN_EXCEPTION)) {
    violations.push({ rule: 4, message: `Spans ${span} semitones (more than 2 octaves)` });
  }

  // Rule 2 & 8 — gaps between adjacent (sorted) notes
  for (let i = 1; i < sorted.length; i++) {
    const gap = sorted[i].semitone - sorted[i - 1].semitone;
    const prev = sorted[i - 1];
    const cur = sorted[i];

    if (gap > MAX_ADJACENT_GAP && !isRootSeventhPair(prev, cur)) {
      violations.push({
        rule: 2,
        message: `${prev.interval} to ${cur.interval} is a ${gap}-semitone jump`,
      });
    }

    if (gap === 1) {
      const pair = [prev.interval, cur.interval].sort().join(',');
      const exceptionPair = [...HALFSTEP_EXCEPTION].sort().join(',');
      if (pair !== exceptionPair) {
        violations.push({
          rule: 8,
          message: `${prev.interval} and ${cur.interval} clash a half-step apart`,
        });
      }
    }
  }

  return violations;
};

export const isVoicingValidForChord = (voicing: Voicing, chord: Chord) =>
  voicingContainsChord(voicing, chord) &&
  checkVoicingRules(voicing, chord).length === 0;
