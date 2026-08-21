import { NavLink } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { createSearchParams, Link, To } from 'react-router';
import { QuizMode, QuizOption } from '../model/quiz';
import { QuizSet } from '../store/sets';

type SetButtonType<M extends QuizMode> = {
  quizSet: QuizSet<QuizOption<M>>;
  to?: To;
  withDivider?: boolean;
};

export function SetButton<M extends QuizMode>({
  quizSet,
  to,
  withDivider,
}: SetButtonType<M>) {
  return (
    <NavLink
      component={Link}
      to={
        to ?? {
          pathname: '/quiz',
          search: createSearchParams({
            quizSet: quizSet.key,
          }).toString(),
        }
      }
      label={quizSet.label}
      description={quizSet.description}
      rightSection={<IconChevronRight size={16} />}
      py="sm"
      px="md"
      style={
        withDivider
          ? { borderTop: '1px solid var(--mantine-color-default-border)' }
          : undefined
      }
    />
  );
}
