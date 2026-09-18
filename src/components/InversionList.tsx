import { Checkbox, Group, Stack, Text } from '@mantine/core';
import { getVoicingKey, NamedVoicing, Voicing } from '../model/voicing';
import classes from './InversionList.module.css';

type Props = {
  positions: NamedVoicing[];
  value?: Voicing[];
  onChange?: (value: Voicing[]) => void;
};

export function InversionList({ positions, value, onChange }: Props) {
  const selectedKeys = value?.map(getVoicingKey) ?? [];

  return (
    <Checkbox.Group
      value={selectedKeys}
      onChange={(keys) => {
        onChange?.(
          positions
            .filter(({ voicing }) => keys.includes(getVoicingKey(voicing)))
            .map(({ voicing }) => voicing)
        );
      }}
    >
      <Stack>
        {positions.map(({ label, voicing }) => (
          <Checkbox.Card
            className={classes.root}
            value={getVoicingKey(voicing)}
            key={getVoicingKey(voicing)}
            p="sm"
          >
            <Group justify="space-between" wrap="nowrap">
              <Text>{label}</Text>
              <Checkbox.Indicator />
            </Group>
          </Checkbox.Card>
        ))}
      </Stack>
    </Checkbox.Group>
  );
}
