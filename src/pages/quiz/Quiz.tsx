import {
  Alert,
  Badge,
  Button,
  Flex,
  Group,
  Stack,
  Switch,
} from '@mantine/core';
import { usePlayer } from '../../player';
import { OptionsGrid } from '../../components/OptionsGrid';
import {
  IconCheck,
  IconChevronRight,
  IconInfoCircle,
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
import { quizModeNamesSignular } from '../../model/quiz';

export function Quiz() {
  const [searchParams] = useSearchParams();
  const quizSetKey = searchParams.get('quizSet');

  const { autoPlayNext, ...restSettings } = useStore($settings);

  const { set, mode } = useSet(quizSetKey ?? '');
  const availableOptions = set?.options ?? [];

  const { handlePlayOption } = usePlayer(set?.settings ?? defaultSettings);

  const {
    quiz: { current, guess, revealed },
    nextQuestion,
    setGuess,
  } = useQuiz(set);

  const guessedCorrectly = guess?.name === current?.option.name;

  const handlePlayNext = async () => {
    const current = nextQuestion(availableOptions);

    handlePlayOption(mode, current.option, current.startNote, current.voicing);
  };

  const resolveIcon = () =>
    guessedCorrectly ? (
      revealed ? (
        <IconInfoCircle size={50} />
      ) : (
        <IconCheck size={50} />
      )
    ) : (
      <IconX size={50} />
    );

  const playNextDelayed = (delay = 1000) => {
    setTimeout(handlePlayNext, delay);
  };

  const resolveColor = () =>
    guess
      ? guessedCorrectly
        ? revealed
          ? 'orange'
          : 'green'
        : 'red'
      : 'blue';

  return (
    <Shell
      title={set?.label}
      rightSection={
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
      }
      backUrl={{
        pathname: '/sets',
        search: createSearchParams({ mode }).toString(),
      }}
    >
      <Stack>
        {!current && <Button onClick={handlePlayNext}>Continue</Button>}
        {current && (
          <Alert
            h={90}
            title={
              <Flex w="100%" justify="space-between">
                {guess ? guess.name : 'Listen'}
              </Flex>
            }
            icon={guess ? resolveIcon() : <IconVolume />}
            color={resolveColor()}
          >
            {guess && (guessedCorrectly || revealed) && 'intervals' in guess ? (
              <Group gap="xs">
                {guess.intervals.map((i) => (
                  <Badge color={resolveColor()} variant="outline">
                    <span style={{ textTransform: 'none' }}>{i}</span>
                  </Badge>
                ))}
              </Group>
            ) : (
              <Flex justify="space-between">
                {guess ? 'Try again' : `Choose ${quizModeNamesSignular[mode]}`}
                {!guessedCorrectly && (
                  <Button
                    size="xs"
                    variant="subtle"
                    onClick={() => {
                      setGuess(current.option, true);

                      if (autoPlayNext) {
                        playNextDelayed(2000);
                      }
                    }}
                  >
                    Reveal Answer
                  </Button>
                )}
              </Flex>
            )}
          </Alert>
        )}
        <div>
          <Button.Group w="100%">
            <Button
              flex={1}
              variant="outline"
              disabled={!current}
              leftSection={<IconRepeat size={16} />}
              onClick={() => {
                if (current)
                  handlePlayOption(
                    mode,
                    current.option,
                    current.startNote,
                    current.voicing
                  );
              }}
            >
              Replay
            </Button>
            <Button
              flex={1}
              disabled={
                !current ||
                (current && guess && guessedCorrectly && autoPlayNext)
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
        </div>

        {current && (
          <OptionsGrid
            availableOptions={availableOptions}
            onSelect={(option) => {
              setGuess(option);

              if (option.name === current?.option.name) {
                if (autoPlayNext) {
                  playNextDelayed();
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
