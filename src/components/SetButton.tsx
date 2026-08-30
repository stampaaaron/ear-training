import { NavLink } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { createSearchParams, Link, To } from 'react-router';
import { QuizMode, QuizOption } from '../model/quiz';
import { QuizSet } from '../store/sets';
import { MusicText } from './MusicText';

type SetButtonType<M extends QuizMode> = {
  mode: M;
  quizSet: QuizSet<QuizOption<M>>;
  to?: To;
  withDivider?: boolean;
};

// Bare intervals never get the raised/superscript chord-symbol treatment —
// only full chord and scale names do.
function renderDescription<M extends QuizMode>(mode: M, quizSet: QuizSet<QuizOption<M>>) {
  const { description } = quizSet;
  if (!description || typeof description === 'string') return description;

  const { prefix, names, suffix } = description;
  const raise = mode !== QuizMode.intervals;

  return (
    <>
      {prefix}
      {names.map((name, index) => (
        <span key={index}>
          {index > 0 && ', '}
          <MusicText raise={raise}>{name}</MusicText>
        </span>
      ))}
      {suffix}
    </>
  );
}

export function SetButton<M extends QuizMode>({
  mode,
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
      description={renderDescription(mode, quizSet)}
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
