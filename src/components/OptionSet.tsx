import { Button, Fieldset, SimpleGrid } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { QuizOption, QuizMode } from '../model/quiz';
import { useQuiz } from '../store/quiz';

type OptionSetProps<M extends QuizMode> = {
  options: QuizOption<M>[];
  label: string;
  guess?: QuizOption<M>;
  guessedCorrectly?: boolean;
  selectedOptions?: QuizOption<M>[];
  onSelect: (option: QuizOption<M>) => void;
  isDisabled?: (option: QuizOption<M>) => boolean;
  resolveColor?: (option: QuizOption<M>) => string | undefined;
};

export function OptionSet<M extends QuizMode>({
  options,
  label,
  onSelect,
  guess,
  guessedCorrectly,
  selectedOptions,
  isDisabled,
  resolveColor,
}: OptionSetProps<M>) {
  const {
    quiz: { revealed },
  } = useQuiz();

  return (
    <Fieldset legend={label} p="sm">
      <SimpleGrid cols={2}>
        {options.map((option) => {
          return (
            <Button
              key={option.name}
              variant={
                option === guess ||
                selectedOptions?.some((c) => c.name === option.name)
                  ? 'outline'
                  : 'default'
              }
              disabled={isDisabled?.(option)}
              onClick={revealed ? undefined : () => onSelect(option)}
              color={
                resolveColor?.(option) ||
                (selectedOptions?.some((c) => c.name === option.name)
                  ? 'blue'
                  : undefined)
              }
              rightSection={
                option === guess &&
                (guessedCorrectly ? (
                  <IconCheck size={16} />
                ) : (
                  <IconX size={16} />
                ))
              }
            >
              {option.name}
            </Button>
          );
        })}
      </SimpleGrid>
    </Fieldset>
  );
}
