import * as Tone from 'tone';
import { Interval, intervalDistanceMap } from './notes';
import { getRandomMidiNote } from './utils';
import { noteToNoteDelay, releaseDelay } from './config';

export const piano = new Tone.Sampler({
  urls: {
    A3: 'A3.wav',
    A4: 'A4.wav',
    A5: 'A5.wav',
  },
  baseUrl: './',
}).toDestination();

export const playChord = async (
  chord: Interval[],
  startNote = getRandomMidiNote()
) => {
  await Tone.start();
  const now = Tone.now();

  const notes = chord.map((note) =>
    Tone.Frequency(startNote, 'midi')
      .transpose(intervalDistanceMap[note])
      .toNote()
  );

  notes.forEach((note, index) => {
    piano.triggerAttack(note, now + index * noteToNoteDelay, 1);
  });
  piano.releaseAll(now + notes.length * noteToNoteDelay + releaseDelay);
};
