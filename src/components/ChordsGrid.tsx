import { Stack } from '@mantine/core';
import { ChordSet } from './ChordSet';
import { allChords, Chord, ChordBase, chordGroupNaming } from '../model/chord';

type ChordsGridProps = {
  availableChords?: Chord[];
  chordGuess?: Chord;
  guessedCorrectly?: boolean;
  selectedChords?: Chord[];
  onChordClick: (chord: Chord) => void;
};

export function ChordsGrid({
  availableChords,
  onChordClick,
  chordGuess,
  guessedCorrectly,
  selectedChords,
}: ChordsGridProps) {
  return (
    <Stack>
      {Object.values(ChordBase).map((base) => {
        const chords = (availableChords ?? allChords).filter(
          ({ group }) => group === base
        );
        return (
          !!chords.length && (
            <ChordSet
              label={chordGroupNaming[base] ?? ''}
              chordSet={chords}
              selectedChords={selectedChords}
              onChordClick={onChordClick}
              chordGuess={chordGuess}
              guessedCorrectly={guessedCorrectly}
            />
          )
        );
      })}
    </Stack>
  );
}
