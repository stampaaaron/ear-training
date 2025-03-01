import { useState } from 'react';
import { basicTensions, Chord } from '../notes';
import { Button, Card, Flex, SimpleGrid, Stack, Title } from '@mantine/core';
import { getRandomChord } from '../utils';
import { playChord } from '../player';

export function Quiz() {
  const [currentChord, setCurrentChord] = useState<Chord>();
  const [chordGuess, setChordGuess] = useState<Chord>();

  const guessedCorrectly = chordGuess?.name === currentChord?.name;

  const handlePlayNextChord = () => {
    const randomChord = getRandomChord(basicTensions);
    setChordGuess(undefined);
    setCurrentChord(randomChord);
    playChord(randomChord.intervals);
  };

  return (
    <Card shadow="sm">
      <Card.Section>
        <Title> What chord is played?</Title>
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
        <Button onClick={handlePlayNextChord}>
          {currentChord ? 'Skip' : 'Start'}
        </Button>

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
