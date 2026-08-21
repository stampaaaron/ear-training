import { Card, Group, SimpleGrid, Text, ThemeIcon, Title } from '@mantine/core';
import { Shell } from '../layout/Shell';
import { createSearchParams, Link } from 'react-router';
import { QuizMode, quizModeNames } from '../model/quiz';
import { IconPiano, IconStairs, IconWaveSine } from '@tabler/icons-react';
import { ComponentType } from 'react';

const modeIcons: Record<QuizMode, ComponentType<{ size?: number }>> = {
  [QuizMode.intervals]: IconWaveSine,
  [QuizMode.chords]: IconPiano,
  [QuizMode.scales]: IconStairs,
};

const modeDescriptions: Record<QuizMode, string> = {
  [QuizMode.intervals]: 'From unison up through compound intervals.',
  [QuizMode.chords]: 'Seventh chords, tensions and alternate voicings.',
  [QuizMode.scales]: 'Pentatonic, major-mode, minor, dominant and symmetric.',
};

export function Modes() {
  return (
    <Shell title="Choose what you want to train" backUrl="/">
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        {Object.values(QuizMode).map((mode) => {
          const Icon = modeIcons[mode];
          return (
            <Card
              key={mode}
              component={Link}
              to={{
                pathname: '/sets',
                search: createSearchParams({ mode }).toString(),
              }}
              padding="lg"
              withBorder
            >
              <Group>
                <ThemeIcon size={40} radius="md" variant="light">
                  <Icon size={22} />
                </ThemeIcon>
                <Title order={3}>{quizModeNames[mode]}</Title>
              </Group>
              <Text c="dimmed" mt="sm" size="sm">
                {modeDescriptions[mode]}
              </Text>
            </Card>
          );
        })}
      </SimpleGrid>
    </Shell>
  );
}
