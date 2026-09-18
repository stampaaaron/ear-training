import { createSearchParams, To, useNavigate, useParams } from 'react-router';
import { Shell } from '../../layout/Shell';
import { QuizSet, useSet } from '../../store/sets';
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Input,
  Menu,
  Modal,
  Stack,
  Switch,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { useIsMobile } from '../../hooks/useIsMobile';
import { usePlayer } from '../../player';
import { useQuiz } from '../../store/quiz';
import {
  IconAlertTriangle,
  IconDots,
  IconInfoCircle,
  IconPencil,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { QuizMode, QuizOption } from '../../model/quiz';
import { SettingsForm } from '../../components/SettingsForm';
import { OptionsGrid } from '../../components/OptionsGrid';
import {
  Form,
  formRootRule,
  hasLength,
  isNotEmpty,
  useForm,
} from '@mantine/form';
import { defaultSettings } from '../../store/settings';
import { useState } from 'react';
import { MusicText } from '../../components/MusicText';
import { Chord } from '../../model/chord';
import { invertibleSeventhChords, invertibleTriads } from '../../model/chordSet';
import { VoicingList } from '../../components/VoicingList';
import { InversionList } from '../../components/InversionList';
import {
  alternativeVoicings,
  isVoicingValidForChord,
  seventhChordPositions,
  triadChordPositions,
  Voicing,
} from '../../model/voicing';
import classes from './Set.module.css';

export function Set() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { set, mode, updateSet, deleteSet } = useSet(id ?? '');

  const { nextQuestion } = useQuiz(set);

  const isCreateForm = !set?.label;

  const chordSupportsVoicings = (chord: Chord, voicings: Voicing[]) =>
    voicings.some((voicing) => isVoicingValidForChord(voicing, chord));

  // A close-position voicing (root position / inversion) only has slots for
  // a chord's basic tones — it silently drops anything else. So unlike
  // alternativeVoicings (which deliberately also matches chords with extra
  // tensions on top), a chord only really "supports" inversions when it's
  // one of the chords an inversion catalog was actually built for.
  const invertibleChordFamilies = [
    { chords: invertibleTriads, positions: triadChordPositions },
    { chords: invertibleSeventhChords, positions: seventhChordPositions },
  ];

  const chordSupportsInversions = (chord: Chord) =>
    invertibleChordFamilies.some(({ chords }) =>
      chords.some(({ name }) => chord.name === name)
    );

  // Which position catalog(s) the Inversions dialog offers — only the
  // families actually represented among the chosen chords, so "1st
  // Inversion" isn't ambiguous between a triad and a seventh-chord shape.
  // Falls back to every family before any chords are chosen yet.
  const activeInversionPositions = () => {
    const options = (form.getValues().options ?? []) as Chord[];
    const active = invertibleChordFamilies.filter(({ chords }) =>
      options.some((option) => chords.some((c) => c.name === option.name))
    );

    return (active.length > 0 ? active : invertibleChordFamilies).flatMap(
      ({ positions }) => positions
    );
  };

  // Alternative voicings and inversions are independent toggles, but at
  // quiz time they're pooled together (see nextQuestion in store/quiz.ts) —
  // a chord just needs one playable voicing from whichever mechanisms are
  // switched on, not one from every single one of them. Requiring all of
  // them would mean no chord "supports" both at once, since their catalogs
  // target different chords (extended/tension chords vs. basic ones).
  const chordSupportsEnabledVoicingModes = (
    chord: Chord,
    settings?: Partial<typeof defaultSettings>
  ) => {
    if (!settings?.alternativeVoicings && !settings?.inversions) return true;

    return (
      (!!settings.alternativeVoicings &&
        chordSupportsVoicings(chord, settings.voicings ?? alternativeVoicings)) ||
      (!!settings.inversions && chordSupportsInversions(chord))
    );
  };

  const form = useForm<QuizSet<QuizOption>>({
    initialValues: set && {
      ...set,
      settings: set?.settings ?? defaultSettings,
    },
    validate: {
      label: isNotEmpty('Title must be set.'),
      options: {
        [formRootRule]:
          hasLength({ min: 2 }, 'At least two options have to be seleced.') &&
          ((value, values) =>
            (value as Chord[])?.every((chord) =>
              chordSupportsEnabledVoicingModes(chord, values.settings)
            )
              ? undefined
              : "Some of your chords selected doesn't support the selected voicing options"),
      },
    },
  });

  const chordSupportsCurrentVoicingModes = (chord: Chord) =>
    chordSupportsEnabledVoicingModes(chord, form.getValues().settings);

  // Explains, per chord, exactly which of the active mechanisms it fails —
  // rather than one generic "voicing options" message regardless of what's
  // actually switched on.
  const unsupportedVoicingModesMessage = (chord: Chord) => {
    const settings = form.getValues().settings;
    const reasons: string[] = [];

    if (
      settings?.alternativeVoicings &&
      !chordSupportsVoicings(chord, settings.voicings ?? alternativeVoicings)
    ) {
      reasons.push('alternative voicings');
    }

    if (settings?.inversions && !chordSupportsInversions(chord)) {
      reasons.push(
        `inversions (only available for ${invertibleChordFamilies
          .flatMap(({ chords }) => chords)
          .map(({ name }) => name)
          .join(', ')})`
      );
    }

    return reasons.length
      ? `Not available for ${reasons.join(' or ')}.`
      : undefined;
  };

  const [optionsModalOpen, setOptionsModalOpen] = useState(false);
  const [voicingsModalOpen, setVoicingsModalOpen] = useState(false);
  const [inversionsModalOpen, setInversionsModalOpen] = useState(false);
  const [discardModalOpen, setDiscardModalOpen] = useState(false);
  const [optionsModalFullScreen, setOptionsModalFullScreen] =
    useState(false);
  const [voicingsModalFullScreen, setVoicingsModalFullScreen] =
    useState(false);
  const [inversionsModalFullScreen, setInversionsModalFullScreen] =
    useState(false);
  const isMobile = useIsMobile();

  const { handlePlayOption } = usePlayer(
    form.getValues().settings ?? defaultSettings
  );

  if (!set) return null;

  const backUrl: To = {
    pathname: '/sets',
    search: createSearchParams({ mode }).toString(),
  };

  const goBack = () => {
    navigate(backUrl);
  };

  const handleUpdate = (values: Partial<QuizSet<QuizOption>>) => {
    updateSet(values);
    form.resetTouched();
  };

  const handleDelete = () => {
    deleteSet(set.key);
    goBack();
  };

  const handleBack = () => {
    if (isCreateForm) {
      setDiscardModalOpen(true);
    } else {
      goBack();
    }
  };

  return (
    <Form form={form} onSubmit={handleUpdate}>
      <Shell
        rightSection={
          <>
            {form.isTouched() && !isCreateForm && (
              <Button variant="outline" type="submit">
                Save
              </Button>
            )}
            <Menu position="bottom-end" trigger="click-hover">
              <Menu.Target>
                <ActionIcon variant="subtle">
                  <IconDots />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  color="red"
                  leftSection={<IconTrash />}
                  onClick={handleDelete}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </>
        }
        title={
          <Input
            w="100%"
            autoFocus={!set.label}
            variant="unstyled"
            placeholder="Set title..."
            {...form.getInputProps('label')}
          />
        }
        backUrl={backUrl}
        onBack={handleBack}
        footer={
          <Group>
            {isCreateForm && (
              <Button
                variant="outline"
                flex={1}
                color="red"
                onClick={handleDelete}
              >
                Discard
              </Button>
            )}
            {form.isTouched() && !isCreateForm && (
              <Button
                variant="outline"
                flex={1}
                type="reset"
                onClick={form.reset}
              >
                Discard changes
              </Button>
            )}

            <Button
              flex={1}
              type="submit"
              onClick={
                form.isValid()
                  ? () => {
                      const current = nextQuestion(
                        form.getValues().options ?? []
                      );
                      handlePlayOption(mode, current.option, current.startNote);

                      navigate({
                        pathname: '/quiz',
                        search: createSearchParams({
                          quizSet: set.key,
                        }).toString(),
                      });
                    }
                  : undefined
              }
            >
              {isCreateForm
                ? 'Create and Start'
                : form.isTouched()
                  ? 'Update and start'
                  : 'Start'}
            </Button>
          </Group>
        }
      >
        <Modal
          opened={discardModalOpen}
          onClose={() => setDiscardModalOpen(false)}
          title="Discard set?"
        >
          <Stack>
            <p>
              This set hasn't been saved yet. Going back will discard it.
            </p>
            <Group justify="flex-end">
              <Button
                variant="default"
                onClick={() => setDiscardModalOpen(false)}
              >
                Cancel
              </Button>
              <Button color="red" onClick={handleDelete}>
                Discard
              </Button>
            </Group>
          </Stack>
        </Modal>
        <Stack>
          <Stack gap="sm">
            <Group gap="xs">
              <Title order={3}>Options</Title>
              <Button
                variant="subtle"
                size="compact-xs"
                leftSection={<IconPencil size={14} />}
                onClick={() => {
                  setOptionsModalFullScreen(!!isMobile);
                  setOptionsModalOpen(true);
                }}
              >
                Edit
              </Button>
            </Group>
            <Group gap="sm">
              {form.getValues().options?.map((option) => {
                const showWarning =
                  (form.getValues().settings?.alternativeVoicings ||
                    form.getValues().settings?.inversions) &&
                  !chordSupportsCurrentVoicingModes(option as Chord);

                return (
                  <Tooltip
                    key={option.name}
                    disabled={!('intervals' in option)}
                    events={{ hover: true, focus: false, touch: true }}
                    multiline
                    maw={200}
                    label={
                      showWarning
                        ? unsupportedVoicingModesMessage(option as Chord)
                        : 'intervals' in option
                          ? option.intervals.map((interval, index) => (
                              <span key={interval}>
                                {index > 0 && ', '}
                                <MusicText raise={false}>{interval}</MusicText>
                              </span>
                            ))
                          : ''
                    }
                  >
                    <Badge
                      variant="light"
                      color={showWarning ? 'orange' : ''}
                      leftSection={
                        showWarning && <IconAlertTriangle size={12} />
                      }
                      key={option.name}
                      style={{ paddingRight: 4 }}
                      rightSection={
                        <ActionIcon
                          size={16}
                          color={showWarning ? 'orange' : ''}
                          variant="subtle"
                          onClick={() => {
                            form.setFieldValue(
                              'options',
                              form
                                .getValues()
                                .options?.filter(
                                  ({ name }) => name !== option.name
                                )
                            );
                          }}
                        >
                          <IconX size={11} />
                        </ActionIcon>
                      }
                    >
                      <MusicText raise={!('interval' in option)}>{option.name}</MusicText>
                    </Badge>
                  </Tooltip>
                );
              })}
            </Group>
            {form.errors.options && (
              <Input.Error>{form.errors.options}</Input.Error>
            )}
            {mode === QuizMode.chords && (
              <Stack gap="xs">
                <Switch
                  size="sm"
                  label={
                    <Group gap="xs">
                      Inversions{' '}
                      <Tooltip
                        label={`Only available for ${invertibleChordFamilies
                          .flatMap(({ chords }) => chords)
                          .map(({ name }) => name)
                          .join(', ')}.`}
                        events={{ hover: true, focus: false, touch: true }}
                        multiline
                        maw={200}
                      >
                        <IconInfoCircle size={14} />
                      </Tooltip>
                    </Group>
                  }
                  labelPosition="left"
                  {...form.getInputProps('settings.inversions', {
                    type: 'checkbox',
                  })}
                />
                {form.getValues().settings?.inversions && (
                  <Group gap="xs">
                    <Text c="dimmed" size="sm">
                      {form.getValues().settings?.inversionVoicings.length} of{' '}
                      {activeInversionPositions().length} positions selected
                    </Text>
                    <Button
                      variant="subtle"
                      size="compact-xs"
                      leftSection={<IconPencil size={12} />}
                      onClick={() => {
                        setInversionsModalFullScreen(!!isMobile);
                        setInversionsModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                  </Group>
                )}
                <Switch
                  size="sm"
                  label={
                    <Group gap="xs">
                      Alternative Vocings (Beta){' '}
                      <Tooltip
                        label="Beta: may produce less musical voicings."
                        events={{ hover: true, focus: false, touch: true }}
                        multiline
                        maw={200}
                      >
                        <IconInfoCircle size={14} />
                      </Tooltip>
                    </Group>
                  }
                  labelPosition="left"
                  {...form.getInputProps('settings.alternativeVoicings', {
                    type: 'checkbox',
                  })}
                />
                {form.getValues().settings?.alternativeVoicings && (
                  <Group gap="xs">
                    <Text c="dimmed" size="sm">
                      {form.getValues().settings?.voicings.length} voicings
                      selected
                    </Text>
                    <Button
                      variant="subtle"
                      size="compact-xs"
                      leftSection={<IconPencil size={12} />}
                      onClick={() => {
                        setVoicingsModalFullScreen(!!isMobile);
                        setVoicingsModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                  </Group>
                )}
              </Stack>
            )}
          </Stack>

          <Modal
            opened={optionsModalOpen}
            onClose={() => setOptionsModalOpen(false)}
            title="Choose options"
            size="lg"
            fullScreen={optionsModalFullScreen}
          >
            <OptionsGrid
              isDisabled={
                form.getValues().settings?.alternativeVoicings ||
                form.getValues().settings?.inversions
                  ? (option) =>
                      !chordSupportsCurrentVoicingModes(option as Chord) &&
                      !form
                        .getValues()
                        .options?.some(({ name }) => option.name === name)
                  : undefined
              }
              resolveColor={
                form.getValues().settings?.alternativeVoicings ||
                form.getValues().settings?.inversions
                  ? (option) =>
                      !chordSupportsCurrentVoicingModes(option as Chord)
                        ? 'orange'
                        : undefined
                  : undefined
              }
              quizMode={mode}
              {...form.getInputProps('options')}
            />
            <div className={classes.stickyFooter}>
              <Button fullWidth onClick={() => setOptionsModalOpen(false)}>
                Done
              </Button>
            </div>
          </Modal>

          <Modal
            opened={voicingsModalOpen}
            onClose={() => setVoicingsModalOpen(false)}
            title="Choose voicings"
            size="lg"
            fullScreen={voicingsModalFullScreen}
          >
            <VoicingList {...form.getInputProps('settings.voicings')} />
            <div className={classes.stickyFooter}>
              <Button fullWidth onClick={() => setVoicingsModalOpen(false)}>
                Done
              </Button>
            </div>
          </Modal>

          <Modal
            opened={inversionsModalOpen}
            onClose={() => setInversionsModalOpen(false)}
            title="Choose inversions"
            size="lg"
            fullScreen={inversionsModalFullScreen}
          >
            <InversionList
              positions={activeInversionPositions()}
              {...form.getInputProps('settings.inversionVoicings')}
            />
            <div className={classes.stickyFooter}>
              <Button
                fullWidth
                onClick={() => setInversionsModalOpen(false)}
              >
                Done
              </Button>
            </div>
          </Modal>

          <Stack gap="sm">
            <Title order={3}>Playback settings</Title>
            <SettingsForm form={form} {...form.getInputProps('settings')} />
          </Stack>
        </Stack>
      </Shell>
    </Form>
  );
}
