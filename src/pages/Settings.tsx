import { Slider, Stack, Text } from '@mantine/core';
import { Shell } from '../layout/Shell';
import { useForm } from '@mantine/form';
import { useStore } from '@nanostores/react';
import { $settings } from '../store/settings';

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
          <Text>Note to note delay: {form.getValues().noteToNoteDelay}s</Text>
          <Slider
            {...form.getInputProps('noteToNoteDelay')}
            label={(value) => `${value} Seconds`}
            max={5}
            step={0.1}
            min={0.5}
          />
          <Text>
            How long the notes should ring out: {form.getValues().releaseDelay}s
          </Text>
          <Slider
            {...form.getInputProps('releaseDelay')}
            label={(value) => `${value} Seconds`}
            max={10}
            step={0.5}
            min={1}
          />
        </Stack>
      </form>
    </Shell>
  );
}
