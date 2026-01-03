import { Button, Flex, Group, Stack, Switch } from '@mantine/core';
import { usePlayer } from '../../player';
import { OptionsGrid } from '../../components/OptionsGrid';
import {
  IconCheck,
  IconChevronRight,
  IconPlayerPause,
  IconPlayerPlay,
  IconRepeat,
  IconVolume,
  IconX,
} from '@tabler/icons-react';
import { Shell } from '../../layout/Shell';
import { createSearchParams, useSearchParams } from 'react-router';
import { useStore } from '@nanostores/react';
import { $settings, defaultSettings } from '../../store/settings';
import { useSet } from '../../store/sets';
import { useQuiz } from '../../store/quiz';

export function Quiz() {
  const [searchParams] = useSearchParams();
  const quizSetKey = searchParams.get('quizSet');

  const { autoPlayNext, ...restSettings } = useStore($settings);

  const { set, mode } = useSet(quizSetKey ?? '');
  const availableOptions = set?.options ?? [];

  const { handlePlayOption } = usePlayer(set?.settings ?? defaultSettings);

  const {
    quiz: { current, guess },
    nextQuestion,
    setGuess,
  } = useQuiz();

  const guessedCorrectly = guess?.name === current?.option.name;

  const handlePlayNext = async () => {
    const current = nextQuestion(availableOptions);
    handlePlayOption(mode, current.option, current.startNote);
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
        </Group>
      }
      backUrl={{
        pathname: '/sets',
        search: createSearchParams({ mode }).toString(),
      }}
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
            <Button onClick={handlePlayNext}>Continue</Button>
          )}
        </Flex>
        <Button.Group w="100%">
          <Button
            flex={1}
            variant="outline"
            disabled={!current}
            leftSection={<IconRepeat size={16} />}
            onClick={() => {
              if (current)
                handlePlayOption(mode, current.option, current.startNote);
            }}
          >
            Replay
          </Button>
          <Button
            flex={1}
            disabled={
              !current || (current && guess && guessedCorrectly && autoPlayNext)
            }
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

              if (option.name === current?.option.name) {
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
