import {
  Badge,
  Checkbox,
  Divider,
  Group,
  Stack,
  Tooltip,
} from '@mantine/core';
import { ReactNode } from 'react';
import {
  alternativeVoicings,
  chordIntervalBaseMap,
  Voicing,
  VoicingIntervalOctave,
  voicingContainsChord,
} from '../model/chord';
import { useIsMobile } from '../hooks/useIsMobile';
import classes from './VoicingList.module.css';
import { possibleChordsForAlternativeVoicings } from '../model/chordSet';
import { IconInfoCircle } from '@tabler/icons-react';

export const getVoicingKey = (voicing: Voicing) => voicing.flat().join(',');

type VoicingBadgesProps = {
  voicing: Voicing;
  trailing?: ReactNode;
  isMobile?: boolean;
};

export function VoicingBadges({
  voicing,
  trailing,
  isMobile,
}: VoicingBadgesProps) {
  const possibleChords = possibleChordsForAlternativeVoicings.filter(
    (chord) => voicingContainsChord(voicing, chord)
  );

  const renderOctave = (octave: VoicingIntervalOctave) =>
    octave.map((interval) => (
      <Badge
        variant="default"
        style={{ textTransform: 'lowercase' }}
        key={interval}
      >
        {chordIntervalBaseMap[interval]
          .filter((i) =>
            possibleChords.some((chord) => chord.intervals.includes(i))
          )
          .join(' / ')}
      </Badge>
    ));

  if (isMobile) {
    return (
      <Stack gap={4}>
        {voicing.map((octave, index) => (
          <Group gap="xs" justify="space-between" key={index} wrap="nowrap">
            <Group gap="xs">{renderOctave(octave)}</Group>
            {index === voicing.length - 1 && trailing}
          </Group>
        ))}
      </Stack>
    );
  }

  return (
    <Group gap="sm" justify="space-between" wrap="nowrap">
      <Group gap="sm">
        {voicing.map((octave, index) => (
          <Group gap="xs" key={index} wrap="nowrap">
            {renderOctave(octave)}
            {index < voicing.length - 1 && (
              <Divider orientation="vertical" />
            )}
          </Group>
        ))}
      </Group>
      {trailing}
    </Group>
  );
}

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
  const isMobile = useIsMobile();
  const selectedKeys = value?.map(getVoicingKey) ?? [];

  return (
    <Checkbox.Group
      value={selectedKeys}
      onChange={(keys) => {
        onChange?.(voicings.filter((v) => keys.includes(getVoicingKey(v))));
      }}
    >
      <Stack>
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
              <VoicingBadges
                voicing={voicing}
                isMobile={isMobile}
                trailing={
                  <Group gap="xs" wrap="nowrap" ml="auto">
                    <Tooltip
                      label={`This voicing work for the following chords: ${possibleChords.map((chord) => chord.name).join(', ')}`}
                    >
                      <IconInfoCircle size={18} />
                    </Tooltip>
                    <Checkbox.Indicator />
                  </Group>
                }
              />
            </Checkbox.Card>
          );
        })}
      </Stack>
    </Checkbox.Group>
  );
}
