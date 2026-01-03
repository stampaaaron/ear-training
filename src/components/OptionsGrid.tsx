import { Stack } from '@mantine/core';
import { OptionSet } from './OptionSet';
import { QuizOption, quizGroups, QuizMode, quizOptions } from '../model/quiz';

type OptionsGridProps<M extends QuizMode> = {
  availableOptions?: QuizOption<M>[];
  guess?: QuizOption<M>;
  guessedCorrectly?: boolean;
  value?: QuizOption<M>[];
  onChange?: (options: QuizOption<M>[]) => void;
  onSelect?: (option: QuizOption<M>) => void;
  quizMode: M;
};

export function OptionsGrid<M extends QuizMode>({
  availableOptions,
  onSelect,
  guess: optionGuess,
  guessedCorrectly,
  value: selectedOptions,
  onChange,
  quizMode,
}: OptionsGridProps<M>) {
  const groupEntries = Object.entries(quizGroups[quizMode]);
  const options = availableOptions ?? quizOptions[quizMode] ?? [];

  const handleSelect = (option: QuizOption<M>) => {
    onSelect?.(option);
    onChange?.(
      selectedOptions?.some((c) => c.name === option.name)
        ? selectedOptions.filter((c) => c.name !== option.name)
        : [...(selectedOptions ?? []), option]
    );
  };

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
                onSelect={handleSelect}
                guess={optionGuess}
                guessedCorrectly={guessedCorrectly}
              />
            )
          );
        })
      ) : (
        <OptionSet
          label=""
          options={options}
          selectedOptions={selectedOptions}
          onSelect={handleSelect}
          guess={optionGuess}
          guessedCorrectly={guessedCorrectly}
        />
      )}
    </Stack>
  );
}
