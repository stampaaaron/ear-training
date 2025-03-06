import { useState } from 'react';
import { basicTensions, Chord } from '../notes';
import { Button, Flex, Stack } from '@mantine/core';
import { getRandomChord, getRandomMidiNote } from '../utils';
import { playChord } from '../player';
import { ChordsGrid } from '../components/ChordsGrid';
import {
  IconCheck,
  IconChevronRight,
  IconRepeat,
  IconVolume,
  IconX,
} from '@tabler/icons-react';
import { Shell } from '../layout/Shell';

export function Quiz() {
  const [startNote, setStartNote] = useState<number>();
  const [currentChord, setCurrentChord] = useState<Chord>();
  const [chordGuess, setChordGuess] = useState<Chord>();

  const guessedCorrectly = chordGuess?.name === currentChord?.name;

  const handlePlayNextChord = () => {
    const randomChord = getRandomChord(basicTensions);
    const startNote = getRandomMidiNote();
    setStartNote(startNote);
    setChordGuess(undefined);
    setCurrentChord(randomChord);

    playChord(randomChord.intervals, startNote);
  };

  return (
    <Shell title="What chord is played?">
      <Stack>
        <Flex justify="center" p="xl">
          {currentChord ? (
            chordGuess ? (
              guessedCorrectly ? (
                <IconCheck size={50} color="green" />
              ) : (
                <IconX size={50} color="red" />
              )
            ) : (
              <IconVolume size={50} />
            )
          ) : (
            <Button onClick={handlePlayNextChord}>Start</Button>
          )}
        </Flex>
        <Button.Group w="100%">
          <Button
            flex={1}
            variant="outline"
            disabled={!currentChord}
            leftSection={<IconRepeat size={16} />}
            onClick={() => {
              playChord(currentChord!.intervals, startNote);
            }}
          >
            Replay
          </Button>
          <Button
            flex={1}
            disabled={!currentChord}
            variant="outline"
            rightSection={<IconChevronRight size={16} />}
            onClick={handlePlayNextChord}
          >
            Skip
          </Button>
        </Button.Group>

        {currentChord && (
          <ChordsGrid
            onChordClick={(chord) => {
              setChordGuess(chord);
              if (chord.name === currentChord?.name) {
                setTimeout(handlePlayNextChord, 1000);
              }
            }}
            chordGuess={chordGuess}
            guessedCorrectly={guessedCorrectly}
          />
        )}
      </Stack>
    </Shell>
  );
}
