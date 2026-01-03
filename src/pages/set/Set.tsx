import { createSearchParams, To, useNavigate, useParams } from 'react-router';
import { Shell } from '../../layout/Shell';
import { QuizSet, useSet } from '../../store/sets';
import {
  Accordion,
  ActionIcon,
  Button,
  Group,
  Input,
  Menu,
  Pill,
  Stack,
  Title,
} from '@mantine/core';
import { usePlayer } from '../../player';
import { useQuiz } from '../../store/quiz';
import { IconDots, IconTrash } from '@tabler/icons-react';
import { QuizOption } from '../../model/quiz';
import { SettingsForm } from '../../components/SettingsForm';
import { OptionsGrid } from '../../components/OptionsGrid';
import { Form, hasLength, isNotEmpty, useForm } from '@mantine/form';
import { defaultSettings } from '../../store/settings';

enum ConfigSection {
  options = 'options',
  playback = 'playback',
}

export function Set() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { nextQuestion } = useQuiz();

  const { set, mode, updateSet, deleteSet } = useSet(id ?? '');

  const isCreateForm = !set?.label;

  const form = useForm<QuizSet<QuizOption>>({
    initialValues: set && {
      ...set,
      settings: set?.settings ?? defaultSettings,
    },
    validate: {
      label: isNotEmpty('Title must be set.'),
      options: hasLength(
        { min: 2 },
        'At least two options have to be seleced.'
      ),
    },
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
          <Accordion multiple defaultValue={[ConfigSection.playback]}>
            <Accordion.Item value={ConfigSection.options}>
              <Accordion.Control>
                <Stack gap="sm">
                  <Title order={3}>Options</Title>
                  <Group gap="sm">
                    {form
                      .getValues()
                      .options?.map(({ name }) => (
                        <Pill key={name}>{name}</Pill>
                      ))}
                  </Group>
                  {form.errors.options && (
                    <Input.Error>{form.errors.options}</Input.Error>
                  )}
                </Stack>
              </Accordion.Control>
              <Accordion.Panel>
                <OptionsGrid
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
