import { NumberInput, Stack } from '@mantine/core';
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
          <NumberInput
            {...form.getInputProps('noteToNoteDelay')}
            label="Note to note delay"
            rightSection={'Seconds'}
            rightSectionWidth={100}
            max={5}
            step={0.1}
            min={0.5}
          />
          <NumberInput
            {...form.getInputProps('releaseDelay')}
            label="How long the notes should ring out"
            rightSection={'Seconds'}
            rightSectionWidth={100}
            max={10}
            step={0.5}
            min={1}
          />
        </Stack>
      </form>
    </Shell>
  );
}
