import { Badge, Checkbox, Divider, Group, SimpleGrid } from '@mantine/core';
import { alternativeVoicings, Voicing } from '../model/chord';
import classes from './VoicingList.module.css';

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
                          <Badge variant="default">{interval}</Badge>
                        ))}
                      </Group>
                      {index < length - 1 && <Divider orientation="vertical" />}
                    </>
                  ))}
                </Group>
              </Group>
            </Checkbox.Card>
          );
        })}
      </SimpleGrid>
    </Checkbox.Group>
  );
}
