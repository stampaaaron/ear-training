import { createSearchParams, To, useNavigate, useParams } from 'react-router';
import { Shell } from '../../layout/Shell';
import { QuizSet, useSet } from '../../store/sets';
import {
  Accordion,
  ActionIcon,
  Badge,
  Button,
  Group,
  Input,
  Menu,
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

enum ConfigSection {
  options = 'options',
  playback = 'playback',
  voicings = 'voicings',
}

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

  const [openSections, setOpenSections] = useState([ConfigSection.playback]);
  form.watch('settings.alternativeVoicings', ({ value }) => {
    if (value) {
      setOpenSections([...openSections, ConfigSection.voicings]);
    } else {
      setOpenSections(openSections.filter((s) => s !== ConfigSection.voicings));
    }
  });

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
      >
        <Stack>
          <Accordion
            multiple
            value={openSections}
            onChange={(sections) =>
              setOpenSections(sections as ConfigSection[])
            }
          >
            <Accordion.Item value={ConfigSection.options}>
              <Accordion.Control>
                <Stack gap="sm">
                  <Title order={3}>Options</Title>
                  <Group gap="sm">
                    {form.getValues().options?.map((option) => {
                      const showWarning =
                        form.getValues().settings?.alternativeVoicings &&
                        !chordSupportAlternativeVoicings(option as Chord);

                      return (
                        <Tooltip
                          disabled={!showWarning}
                          label={
                            'Chord is not available for alternative voicings.'
                          }
                        >
                          <Badge
                            variant="outline"
                            color={showWarning ? 'orange' : undefined}
                            leftSection={
                              showWarning && <IconAlertTriangle size={12} />
                            }
                            key={option.name}
                            rightSection={
                              showWarning && (
                                <ActionIcon
                                  size="xs"
                                  color="orange"
                                  variant="subtle"
                                  onClick={(e) => {
                                    e.stopPropagation();
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
                                  <IconX />
                                </ActionIcon>
                              )
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
              </Accordion.Control>
              <Accordion.Panel>
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
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value={ConfigSection.playback}>
              <Accordion.Control>
                <Title order={3}>Playback settings</Title>
              </Accordion.Control>
              <Accordion.Panel>
                <SettingsForm form={form} {...form.getInputProps('settings')} />
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
          {mode === QuizMode.chords && (
            <Switch
              label={
                <Group gap={0}>
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
          {/* {form.getValues().settings?.alternativeVoicings && (
            <Accordion defaultValue={ConfigSection.voicings}>
              <Accordion.Item value={ConfigSection.voicings}>
                <Accordion.Control>
                  <Stack>
                    <Title order={3}>Voicings</Title>
                  </Stack>
                </Accordion.Control>
                <Accordion.Panel>
                  <Checkbox.Group>
                    <Table>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th></Table.Th>
                          {[
                            ...Array(
                              Math.max(
                                ...alternativeVoicings.map((v) => v.length)
                              )
                            ).keys(),
                          ].map((v) => (
                            <Table.Th>Octave {v + 1}</Table.Th>
                          ))}
                        </Table.Tr>
                      </Table.Thead>
                      {alternativeVoicings.map((voicing) => (
                        <Table.Tr>
                          <Table.Td>
                            <Checkbox />
                          </Table.Td>

                          {voicing.map((intervals) => (
                            <Table.Td>
                              <Group>
                                {intervals.map((i) => (
                                  <Badge variant="outline">{i}</Badge>
                                ))}
                              </Group>
                            </Table.Td>
                          ))}
                        </Table.Tr>
                      ))}
                    </Table>
                  </Checkbox.Group>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          )} */}

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
