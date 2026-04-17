import {
  Badge,
  Checkbox,
  Divider,
  Group,
  SimpleGrid,
  Tooltip,
} from '@mantine/core';
import {
  alternativeVoicings,
  chordIntervalBaseMap,
  Voicing,
  voicingContainsChord,
} from '../model/chord';
import classes from './VoicingList.module.css';
import { possibleChordsForAlternativeVoicings } from '../model/chordSet';
import { IconInfoCircle } from '@tabler/icons-react';

type Props = {
  voicings?: Voicing[];
  value?: Voicing[];
  onChange?: (value: Voicing[]) => void;
};

export function VoicingList({
  voicings = alternativeVoicings,
  value,
  onChange,
}: Props) {
  const getVoicingKey = (voicing: Voicing) => voicing.flat().join(',');

  const selectedKeys = value?.map(getVoicingKey) ?? [];

  return (
    <Checkbox.Group
      value={selectedKeys}
      onChange={(keys) => {
        onChange?.(voicings.filter((v) => keys.includes(getVoicingKey(v))));
      }}
    >
      <SimpleGrid cols={{ xs: 1, sm: 2 }} spacing="sm">
        {voicings.map((voicing) => {
          const possibleChords = possibleChordsForAlternativeVoicings.filter(
            (chord) => voicingContainsChord(voicing, chord)
          );

          return (
            <Checkbox.Card
              className={classes.root}
              value={getVoicingKey(voicing)}
              key={getVoicingKey(voicing)}
              p="sm"
            >
              <Group>
                <Checkbox.Indicator />
                <Group gap="sm">
                  {voicing.map((octave, index, { length }) => (
                    <>
                      <Group>
                        {octave.map((interval) => (
                          <Badge
                            variant="default"
                            style={{ textTransform: 'lowercase' }}
                          >
                            {chordIntervalBaseMap[interval]
                              .filter((i) =>
                                possibleChords.some((chord) =>
                                  chord.intervals.includes(i)
                                )
                              )
                              .join(' / ')}
                          </Badge>
                        ))}
                      </Group>
                      {index < length - 1 && <Divider orientation="vertical" />}
                    </>
                  ))}
                </Group>
                <Tooltip
                  label={`This voicing work for the following chords: ${possibleChords.map((chord) => chord.name).join(', ')}`}
                >
                  <IconInfoCircle style={{ marginLeft: 'auto' }} />
                </Tooltip>
              </Group>
            </Checkbox.Card>
          );
        })}
      </SimpleGrid>
    </Checkbox.Group>
  );
}
