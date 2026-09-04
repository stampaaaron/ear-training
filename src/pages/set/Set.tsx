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
import { possibleChordsForAlternativeVoicings } from '../../model/chordSet';
import { Chord } from '../../model/chord';
import { VoicingList } from '../../components/VoicingList';
import classes from './Set.module.css';

export function Set() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { set, mode, updateSet, deleteSet } = useSet(id ?? '');

  const { nextQuestion } = useQuiz(set);

  const isCreateForm = !set?.label;

  const chordSupportAlternativeVoicings = (chord: Chord) =>
    possibleChordsForAlternativeVoicings.some(
      ({ name }) => chord.name === name
    );

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
            !values.settings?.alternativeVoicings ||
            (value as Chord[])?.every(chordSupportAlternativeVoicings)
              ? undefined
              : "Some of your chords selected doesn't support alternative voicings"),
      },
    },
  });

  const [optionsModalOpen, setOptionsModalOpen] = useState(false);
  const [voicingsModalOpen, setVoicingsModalOpen] = useState(false);
  const [discardModalOpen, setDiscardModalOpen] = useState(false);
  const [optionsModalFullScreen, setOptionsModalFullScreen] =
    useState(false);
  const [voicingsModalFullScreen, setVoicingsModalFullScreen] =
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
                  form.getValues().settings?.alternativeVoicings &&
                  !chordSupportAlternativeVoicings(option as Chord);

                return (
                  <Tooltip
                    key={option.name}
                    disabled={!('intervals' in option)}
                    events={{ hover: true, focus: false, touch: true }}
                    multiline
                    maw={200}
                    label={
                      showWarning
                        ? 'Not available for alternative voicings.'
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
                form.getValues().settings?.alternativeVoicings
                  ? (option) =>
                      !chordSupportAlternativeVoicings(option as Chord) &&
                      !form
                        .getValues()
                        .options?.some(({ name }) => option.name === name)
                  : undefined
              }
              resolveColor={
                form.getValues().settings?.alternativeVoicings
                  ? (option) =>
                      !chordSupportAlternativeVoicings(option as Chord)
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

          <Stack gap="sm">
            <Title order={3}>Playback settings</Title>
            <SettingsForm form={form} {...form.getInputProps('settings')} />
          </Stack>
        </Stack>
      </Shell>
    </Form>
  );
}
