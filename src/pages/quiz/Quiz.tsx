import { useState } from 'react';
import { ActionIcon, Button, Flex, Group, Stack, Switch } from '@mantine/core';
import { getRandomFromArray } from '../../utils';
import { usePlayer } from '../../player';
import { OptionsGrid } from '../../components/OptionsGrid';
import {
  IconCheck,
  IconChevronRight,
  IconPlayerPause,
  IconPlayerPlay,
  IconRepeat,
  IconSettings,
  IconVolume,
  IconX,
} from '@tabler/icons-react';
import { Shell } from '../../layout/Shell';
import { Link, useSearchParams } from 'react-router';
import { $currentSet } from '../../store/currentSet';
import { useStore } from '@nanostores/react';
import { QuizOption, QuizMode } from '../../model/quiz';
import { allSets } from '../../model/quizSet';
import { $settings } from '../../store/settings';

export function Quiz() {
  const [searchParams] = useSearchParams();
  const quizSetKey = searchParams.get('quizSet');
  const mode = searchParams.get('mode') as QuizMode;

  const { handlePlayOption, getRandomMidiNote } = usePlayer();

  const { autoPlayNext, ...restSettings } = useStore($settings);

  const customSet = useStore($currentSet);

  const availableOptions =
    allSets.find(({ key }) => key === quizSetKey)?.options ??
    customSet.options ??
    [];

  const [startNote, setStartNote] = useState<number>();
  const [current, setCurrent] = useState<QuizOption<typeof mode>>();
  const [guess, setGuess] = useState<QuizOption<typeof mode>>();

  const guessedCorrectly = guess?.name === current?.name;

  const handlePlayNext = () => {
    const randomOption = getRandomFromArray(availableOptions);

    const startNote = getRandomMidiNote();
    setStartNote(startNote);
    setGuess(undefined);
    setCurrent(randomOption);

    handlePlayOption(mode, randomOption, startNote);
  };

  return (
    <Shell
      title="Choose the correct answer"
      rightSection={
        <Group>
          <Group>
            <Switch
              labelPosition="left"
              onLabel={<IconPlayerPlay size={12} />}
              offLabel={<IconPlayerPause size={12} />}
              checked={autoPlayNext}
              onChange={({ target: { checked } }) =>
                $settings.set({ ...restSettings, autoPlayNext: checked })
              }
              label="Autoplay next"
            />
          </Group>
          <ActionIcon component={Link} variant="subtle" to="/settings">
            <IconSettings />
          </ActionIcon>
        </Group>
      }
    >
      <Stack>
        <Flex justify="center" p="xl">
          {current ? (
            guess ? (
              guessedCorrectly ? (
                <IconCheck size={50} color="green" />
              ) : (
                <IconX size={50} color="red" />
              )
            ) : (
              <IconVolume size={50} />
            )
          ) : (
            <Button onClick={handlePlayNext}>Start</Button>
          )}
        </Flex>
        <Button.Group w="100%">
          <Button
            flex={1}
            variant="outline"
            disabled={!current}
            leftSection={<IconRepeat size={16} />}
            onClick={() => {
              if (current) handlePlayOption(mode, current, startNote);
            }}
          >
            Replay
          </Button>
          <Button
            flex={1}
            disabled={!current || (current && guess && guessedCorrectly)}
            variant="outline"
            rightSection={<IconChevronRight size={16} />}
            onClick={handlePlayNext}
          >
            {current && guess && guessedCorrectly && !autoPlayNext
              ? 'Next'
              : 'Skip'}
          </Button>
        </Button.Group>

        {current && (
          <OptionsGrid
            availableOptions={availableOptions}
            onSelect={(option) => {
              setGuess(option);
              if (option.name === current?.name) {
                if (autoPlayNext) {
                  setTimeout(handlePlayNext, 1000);
                }
              }
            }}
            guess={guess}
            guessedCorrectly={guessedCorrectly}
            quizMode={mode}
          />
        )}
      </Stack>
    </Shell>
  );
}
