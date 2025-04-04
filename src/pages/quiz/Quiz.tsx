import { useState } from 'react';
import { Button, Flex, Stack } from '@mantine/core';
import { getRandomChord } from '../../utils';
import { usePlayer } from '../../player';
import { ChordsGrid } from '../../components/ChordsGrid';
import {
  IconCheck,
  IconChevronRight,
  IconRepeat,
  IconVolume,
  IconX,
} from '@tabler/icons-react';
import { Shell } from '../../layout/Shell';
import { useSearchParams } from 'react-router';
import { $currentChordSet } from '../../store/chordSet';
import { useStore } from '@nanostores/react';
import { Chord } from '../../model/chord';
import { chordSets } from '../../model/chordSet';

export function Quiz() {
  const [searchParams] = useSearchParams();
  const chordSetKey = searchParams.get('chordSet');

  const { playChord, getRandomMidiNote } = usePlayer();

  const chordSet = useStore($currentChordSet);

  const availableChords =
    chordSets.find(({ key }) => key === chordSetKey)?.chords ??
    chordSet.chords ??
    [];

  const [startNote, setStartNote] = useState<number>();
  const [currentChord, setCurrentChord] = useState<Chord>();
  const [chordGuess, setChordGuess] = useState<Chord>();

  const guessedCorrectly = chordGuess?.name === currentChord?.name;

  const handlePlayNextChord = () => {
    const randomChord = getRandomChord(availableChords);

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
            availableChords={availableChords}
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
