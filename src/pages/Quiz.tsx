import { useState } from 'react';
import { basicTensions, Chord } from '../notes';
import { Button, Card, Flex, SimpleGrid, Stack, Title } from '@mantine/core';
import { getRandomChord, getRandomMidiNote } from '../utils';
import { playChord } from '../player';

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
    <Card shadow="sm" padding="xl">
      <Card.Section inheritPadding withBorder py="sm">
        <Title order={3}> What chord is played?</Title>
      </Card.Section>

      <Stack>
        <Flex justify="center" p="xl">
          {currentChord ? (
            chordGuess ? (
              guessedCorrectly ? (
                'Correct!'
              ) : (
                'Try again'
              )
            ) : (
              'Listen'
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
            onClick={handlePlayNextChord}
          >
            Skip
          </Button>
        </Button.Group>

        <SimpleGrid cols={2}>
          {basicTensions.map((chord) => (
            <Button
              key={chord.name}
              variant="default"
              onClick={() => {
                setChordGuess(chord);
                if (chord.name === currentChord?.name) {
                  setTimeout(handlePlayNextChord, 1000);
                }
              }}
              rightSection={
                chord === chordGuess && (guessedCorrectly ? 'Correct' : 'x')
              }
            >
              {chord.name}
            </Button>
          ))}
        </SimpleGrid>
      </Stack>
    </Card>
  );
}
