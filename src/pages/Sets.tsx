import { Stack } from '@mantine/core';
import { Shell } from '../layout/Shell';
import { SetButton } from '../components/SetButton';
import { useSearchParams } from 'react-router';
import { quizSets } from '../model/quizSet';
import { QuizMode } from '../model/quiz';

export function Sets() {
  const [searchParams] = useSearchParams();

  const mode = searchParams.get('mode');

  if (!mode) return null;

  return (
    <Shell title="Choose your set" backUrl="/">
      <Stack>
        {quizSets[mode as QuizMode].length ? (
          <>
            {quizSets[mode as QuizMode].map((quizSet) => (
              <SetButton key={quizSet.key} quizSet={quizSet} />
            ))}
            <SetButton
              quizSet={{ key: 'custom', label: 'Custom' }}
              to="/quiz/new"
            />
          </>
        ) : (
          <p>Comming soon</p>
        )}
      </Stack>
    </Shell>
  );
}
