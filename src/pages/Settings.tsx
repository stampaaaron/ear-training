import { RangeSlider, Slider, Stack, Text } from '@mantine/core';
import { Shell } from '../layout/Shell';
import { useForm } from '@mantine/form';
import { useStore } from '@nanostores/react';
import { $settings } from '../store/settings';
import { Frequency } from 'tone';

type SettingsForm = NonNullable<typeof $settings.value>;

export function Settings() {
  const settings = useStore($settings);

  const form = useForm<SettingsForm>({
    initialValues: settings,
    onValuesChange: $settings.set,
  });

  return (
    <Shell title="Settings" backUrl="..">
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Stack>
          <Stack gap="xs">
            <Text>Note to note delay: {form.getValues().noteToNoteDelay}s</Text>
            <Slider
              {...form.getInputProps('noteToNoteDelay')}
              label={(value) => `${value} Seconds`}
              max={5}
              step={0.1}
              min={0.1}
            />
          </Stack>
          <Stack gap="xs">
            <Text>
              How long the notes should ring out:{' '}
              {form.getValues().releaseDelay}s
            </Text>
            <Slider
              {...form.getInputProps('releaseDelay')}
              label={(value) => `${value} Seconds`}
              max={10}
              step={0.5}
              min={1}
            />
          </Stack>
          <Stack gap="xs">
            <Text>
              Note range (
              {Frequency(form.getValues().startNoteRange[0], 'midi').toNote()} -{' '}
              {Frequency(form.getValues().startNoteRange[1], 'midi').toNote()})
            </Text>
            <RangeSlider
              {...form.getInputProps('startNoteRange')}
              minRange={1}
              min={36} // C2
              max={84} // C6
              label={(value) => Frequency(value, 'midi').toNote()}
              step={1}
            />
          </Stack>
        </Stack>
      </form>
    </Shell>
  );
}
