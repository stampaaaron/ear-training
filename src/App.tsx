import * as Tone from 'tone';
import { basicTensions, intervalDistanceMap } from './notes';
import { getRandomNote } from './utils';

function App() {
  const synth = new Tone.PolySynth().toDestination();

  return (
    <>
      {basicTensions.map((chord) => (
        <button
          onClick={async () => {
            await Tone.start();
            const now = Tone.now();

            const startNote = getRandomNote();

            const notes = chord.intervals.map((note) =>
              Tone.Frequency(startNote)
                .transpose(intervalDistanceMap[note])
                .toNote()
            );

            notes.forEach((note, index) => {
              synth.triggerAttack(note, now + index);
            });
            synth.triggerRelease(notes, now + notes.length);
          }}
        >
          {chord.name}
        </button>
      ))}
    </>
  );
}

export default App;
