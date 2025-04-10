import { Stack } from '@mantine/core';
import { OptionSet } from './OptionSet';
import { QuizOption, quizGroups, QuizMode, quizOptions } from '../model/quiz';

type OptionsGridProps<M extends QuizMode> = {
  availableOptions?: QuizOption<M>[];
  guess?: QuizOption<M>;
  guessedCorrectly?: boolean;
  selectedOptions?: QuizOption<M>[];
  onSelect: (option: QuizOption<M>) => void;
  quizMode: M;
};

export function OptionsGrid<M extends QuizMode>({
  availableOptions,
  onSelect,
  guess: optionGuess,
  guessedCorrectly,
  selectedOptions,
  quizMode,
}: OptionsGridProps<M>) {
  return (
    <Stack>
      {Object.entries(quizGroups[quizMode]).map(([groupKey, groupName]) => {
        console.log(groupKey);

        console.log(availableOptions);

        const options = (availableOptions ?? quizOptions[quizMode]).filter(
          ({ group }) => group === groupKey
        );

        console.log(options);

        return (
          !!options.length && (
            <OptionSet
              label={groupName}
              optionSet={options}
              selectedOptions={selectedOptions}
              onSelect={onSelect}
              guess={optionGuess}
              guessedCorrectly={guessedCorrectly}
            />
          )
        );
      })}
    </Stack>
  );
}
