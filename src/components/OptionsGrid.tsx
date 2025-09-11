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
  const groupEntries = Object.entries(quizGroups[quizMode]);
  const options = availableOptions ?? quizOptions[quizMode] ?? [];  

  return (
    <Stack>
      {groupEntries.length ? (
        groupEntries.map(([groupKey, groupName]) => {
          const optionsInGroup = options.filter(
            ({ group }) => group === groupKey
          );

          return (
            !!optionsInGroup.length && (
              <OptionSet
                key={groupKey}
                label={groupName}
                options={optionsInGroup}
                selectedOptions={selectedOptions}
                onSelect={onSelect}
                guess={optionGuess}
                guessedCorrectly={guessedCorrectly}
              />
            )
          );
        })
      ) : (
        <OptionSet
          label=""
          options={options as QuizOption<M>[]} // TODO remove type assertion once all modes are implemented
          selectedOptions={selectedOptions}
          onSelect={onSelect}
          guess={optionGuess}
          guessedCorrectly={guessedCorrectly}
        />
      )}
    </Stack>
  );
}
