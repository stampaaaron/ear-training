import { Button, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconDeviceMobile, IconDownload } from '@tabler/icons-react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

export function InstallAppSection() {
  const { installed, canPromptInstall, isIos, promptInstall } =
    useInstallPrompt();

  if (installed) return null;

  return (
    <Stack gap="md" align="center" ta="center">
      <ThemeIcon size={48} radius="xl" variant="light">
        <IconDeviceMobile size={26} />
      </ThemeIcon>
      <Title order={2}>Install freear as an app</Title>
      <Text c="dimmed" maw={480}>
        Add freear to your home screen for quick, full-screen access — no
        app store required.
      </Text>
      {canPromptInstall ? (
        <Button
          leftSection={<IconDownload size={18} />}
          size="md"
          onClick={promptInstall}
        >
          Install app
        </Button>
      ) : isIos ? (
        <Text size="sm" c="dimmed" maw={420}>
          On iPhone or iPad: tap the Share icon in Safari, then "Add to Home
          Screen".
        </Text>
      ) : (
        <Text size="sm" c="dimmed" maw={420}>
          Open the browser menu and choose "Install app" or "Add to Home
          Screen".
        </Text>
      )}
    </Stack>
  );
}
