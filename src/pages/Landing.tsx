import {
  Anchor,
  Badge,
  Button,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { Link } from 'react-router';
import {
  IconBolt,
  IconBrandGithub,
  IconEar,
  IconHeadphones,
  IconPiano,
  IconStairs,
  IconTargetArrow,
  IconWaveSine,
} from '@tabler/icons-react';
import { ComponentType } from 'react';
import { BuyMeACoffeeButton } from '../components/BuyMeACoffeeButton';

type Feature = {
  icon: ComponentType<{ size?: number }>;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: IconWaveSine,
    title: 'Intervals',
    description:
      'Train your ear on intervals from a unison up through compound intervals — the foundation of relative pitch.',
  },
  {
    icon: IconPiano,
    title: 'Chords',
    description:
      'Identify seventh chords across major, minor, dominant, diminished, augmented and sus qualities, including tensions and alternate voicings.',
  },
  {
    icon: IconStairs,
    title: 'Scales',
    description:
      'Distinguish pentatonic, major-mode, minor, dominant and symmetric scales by ear.',
  },
];

const steps: Feature[] = [
  {
    icon: IconTargetArrow,
    title: 'Pick a mode',
    description:
      'Choose intervals, chords or scales, and build your own practice sets.',
  },
  {
    icon: IconHeadphones,
    title: 'Listen & guess',
    description: 'A sound plays. You pick the answer from the options.',
  },
  {
    icon: IconBolt,
    title: 'Instant feedback',
    description:
      'See what you got right immediately and keep drilling the rest.',
  },
];

export function Landing() {
  return (
    <Card padding="lg">
      <Stack gap={40}>
        <Stack gap="xs" align="center" ta="center">
          <ThemeIcon size={64} radius="xl" variant="light">
            <IconEar size={36} />
          </ThemeIcon>
          <Badge size="lg" variant="light">
            Free ear trainer
          </Badge>
          <Title order={1} fz={{ base: 36, sm: 48 }} mt="xs">
            freear
          </Title>
          <Text size="lg" c="dimmed" maw={480}>
            Train your ear for intervals, chords and scales — right in your
            browser.
          </Text>
          <Button component={Link} to="/modes" size="md" mt="sm">
            Start training
          </Button>
        </Stack>

        <Stack gap="md">
          <Title order={2} ta="center">
            What you can train
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {features.map((feature) => (
              <Card key={feature.title} padding="lg" withBorder>
                <Group>
                  <ThemeIcon size={40} radius="md" variant="light">
                    <feature.icon size={22} />
                  </ThemeIcon>
                  <Title order={3}>{feature.title}</Title>
                </Group>
                <Text c="dimmed" mt="sm">
                  {feature.description}
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>

        <Stack gap="md">
          <Title order={2} ta="center">
            How it works
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
            {steps.map((step, index) => (
              <Stack key={step.title} align="center" ta="center" gap="xs">
                <ThemeIcon size={48} radius="xl" variant="light">
                  <step.icon size={26} />
                </ThemeIcon>
                <Text fw={600}>
                  {index + 1}. {step.title}
                </Text>
                <Text size="sm" c="dimmed">
                  {step.description}
                </Text>
              </Stack>
            ))}
          </SimpleGrid>
        </Stack>

        <Group justify="center">
          <Button component={Link} to="/modes" size="lg">
            Start training now
          </Button>
        </Group>

        <Stack gap="md" align="center" ta="center">
          <Title order={2}>Want to support the project?</Title>
          <Text c="dimmed" maw={480}>
            freear is free, ad-free and built in my spare time. If it's
            helped your ear training, a coffee keeps it going.
          </Text>
          <BuyMeACoffeeButton />
        </Stack>

        <Text size="sm" c="dimmed" ta="center">
          Found a bug or have a feature request?{' '}
          <Anchor
            href="https://github.com/stampaaaron/ear-training/issues"
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
          >
            <IconBrandGithub
              size={14}
              style={{ verticalAlign: 'text-bottom' }}
            />{' '}
            Open a GitHub issue
          </Anchor>{' '}
          or <Anchor href="mailto:aaron@stampa.ch" size="sm">send an email</Anchor>.
        </Text>
      </Stack>
    </Card>
  );
}
