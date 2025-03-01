import * as Tone from 'tone';
import { basicTensions, intervalDistanceMap } from './notes';
import { getRandomNote } from './utils';
import { Button, createTheme, MantineProvider } from '@mantine/core';

import '@mantine/core/styles.css';

const theme = createTheme({});

function App() {
  const synth = new Tone.PolySynth().toDestination();

  return (
    <MantineProvider theme={theme}>
      {basicTensions.map((chord) => (
        <Button
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
        </Button>
      ))}
    </MantineProvider>
  );
}

export default App;
