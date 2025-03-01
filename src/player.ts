import * as Tone from 'tone';
import { Interval, intervalDistanceMap } from './notes';
import { getRandomNote } from './utils';
import { noteToNoteDelay } from './config';

const synth = new Tone.PolySynth().toDestination();

export const playChord = async (chord: Interval[]) => {
  await Tone.start();
  const now = Tone.now();

  const startNote = getRandomNote();

  const notes = chord.map((note) =>
    Tone.Frequency(startNote).transpose(intervalDistanceMap[note]).toNote()
  );

  notes.forEach((note, index) => {
    synth.triggerAttack(note, now + index * noteToNoteDelay);
  });
  synth.triggerRelease(notes, now + notes.length * noteToNoteDelay);
};
