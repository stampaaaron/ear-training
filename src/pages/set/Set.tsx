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
  Title,
  Tooltip,
} from '@mantine/core';
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
import { possibleChordsForAlternativeVoicings } from '../../model/chordSet';
import { Chord } from '../../model/chord';
import { VoicingList } from '../../components/VoicingList';

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
  const [discardModalOpen, setDiscardModalOpen] = useState(false);

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
                onClick={() => setOptionsModalOpen(true)}
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
                    disabled={!('intervals' in option)}
                    label={
                      showWarning
                        ? 'Chord is not available for alternative voicings.'
                        : 'intervals' in option
                          ? option.intervals.join(',')
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
                      {option.name}
                    </Badge>
                  </Tooltip>
                );
              })}
            </Group>
            {form.errors.options && (
              <Input.Error>{form.errors.options}</Input.Error>
            )}
          </Stack>

          <Modal
            opened={optionsModalOpen}
            onClose={() => setOptionsModalOpen(false)}
            title="Choose options"
            size="lg"
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
          </Modal>

          <Stack gap="sm">
            <Title order={3}>Playback settings</Title>
            <SettingsForm form={form} {...form.getInputProps('settings')} />
          </Stack>
          {mode === QuizMode.chords && (
            <Switch
              label={
                <Group gap="xs">
                  Alternative Vocings (Beta){' '}
                  <Tooltip
                    label={
                      "It might create some voicings that aren't very musical. This feature is still in beta and will improved."
                    }
                  >
                    <IconInfoCircle />
                  </Tooltip>
                </Group>
              }
              labelPosition="left"
              {...form.getInputProps('settings.alternativeVoicings', {
                type: 'checkbox',
              })}
            />
          )}
          {form.getValues().settings?.alternativeVoicings && (
            <Stack gap="sm">
              <Title order={3}>Voicings</Title>
              <VoicingList {...form.getInputProps('settings.voicings')} />
            </Stack>
          )}

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
        </Stack>
      </Shell>
    </Form>
  );
}
