import {
  Button,
  Flex,
  Menu,
  RangeSlider,
  Slider,
  Space,
  Stack,
  Text,
} from '@mantine/core';
import { Form, UseFormReturnType } from '@mantine/form';
import { Settings } from '../store/settings';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { IconX, IconPlus, IconGripVertical } from '@tabler/icons-react';
import { Frequency } from 'tone';
import { playbackModeTranslationMap, PlaybackMode } from '../player';
import { arrayRange } from '../utils';

type SettingsForm = Settings;

type Props<F extends { settings?: SettingsForm }> = {
  form: UseFormReturnType<F>;
  value?: SettingsForm;
  onChange: (values: SettingsForm) => void;
};

export function SettingsForm<F extends { settings?: SettingsForm }>({
  form,
}: Props<F>) {
  return (
    <Form
      form={form}
      onSubmitCapture={(e) => {
        e.preventDefault();
      }}
    >
      <Stack gap="xl">
        <Stack gap="xs">
          <Text>
            Note to note delay: {form.getValues().settings?.noteToNoteDelay}s
          </Text>
          <Slider
            {...form.getInputProps('settings.noteToNoteDelay')}
            label={(value) => `${value} Seconds`}
            min={0.1}
            max={5}
            step={0.1}
            marks={arrayRange(0, 5).map((value) => ({
              label: `${value}s`,
              value: value,
            }))}
          />
        </Stack>
        <Stack gap="xs">
          <Text>
            How long the notes should ring out:{' '}
            {form.getValues().settings?.releaseDelay}s
          </Text>
          <Slider
            {...form.getInputProps('settings.releaseDelay')}
            label={(value) => `${value} Seconds`}
            min={1}
            max={10}
            step={0.5}
            marks={arrayRange(1, 10).map((value) => ({
              label: `${value}s`,
              value: value,
            }))}
          />
        </Stack>
        <Stack gap="xs">
          <Text>
            Note range (start note): (
            {Frequency(
              form.getValues().settings?.startNoteRange[0],
              'midi'
            ).toNote()}{' '}
            -{' '}
            {Frequency(
              form.getValues().settings?.startNoteRange[1],
              'midi'
            ).toNote()}
            )
          </Text>
          <RangeSlider
            {...form.getInputProps('settings.startNoteRange')}
            minRange={1}
            min={36} // C2
            max={84} // C6
            marks={arrayRange(36, 84, 12).map((value) => ({
              label: Frequency(value, 'midi').toNote(),
              value: value,
            }))}
            label={(value) => Frequency(value, 'midi').toNote()}
            step={1}
          />
        </Stack>

        <Stack>
          <Text>Playback order</Text>
          <div>
            <DragDropContext
              onDragEnd={({ destination, source }) => {
                form.reorderListItem('playBackModes', {
                  from: source.index,
                  to: destination?.index || 0,
                });
              }}
            >
              <div>
                <Droppable droppableId="dnd-list" direction="vertical">
                  {(provided) => (
                    <Flex
                      {...provided.droppableProps}
                      direction="column"
                      justify="center"
                      ref={provided.innerRef}
                    >
                      {form
                        .getValues()
                        .settings?.playBackModes.map((mode, index) => (
                          <Draggable
                            key={`${mode}-${index}`}
                            index={index}
                            draggableId={`${mode}-${index}`}
                          >
                            {(provided) => (
                              <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                              >
                                <Button.Group key={`${mode}-${index}`}>
                                  <Button.GroupSection variant="default" p="sm">
                                    <IconGripVertical size={16} />
                                  </Button.GroupSection>
                                  <Button.GroupSection variant="default">
                                    {index + 1}
                                  </Button.GroupSection>
                                  <Button.GroupSection
                                    flex={1}
                                    variant="default"
                                  >
                                    {playbackModeTranslationMap[mode]}
                                  </Button.GroupSection>
                                  <Button
                                    variant="outline"
                                    bg="white"
                                    p="xs"
                                    onClick={() =>
                                      form.removeListItem(
                                        'playBackModes',
                                        index
                                      )
                                    }
                                  >
                                    <IconX size={20} />
                                  </Button>
                                </Button.Group>
                                <Space h="md" />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </Flex>
                  )}
                </Droppable>
              </div>
            </DragDropContext>
            <Flex justify="flex-end">
              <Menu trigger="click-hover">
                <Menu.Target>
                  <Button
                    ml="auto"
                    variant="subtle"
                    rightSection={<IconPlus />}
                  >
                    Add playback mode
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  {Object.values(PlaybackMode).map((mode) => (
                    <Menu.Item
                      key={mode}
                      onClick={() => form.insertListItem('playBackModes', mode)}
                    >
                      {playbackModeTranslationMap[mode]}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            </Flex>
          </div>
        </Stack>
      </Stack>
    </Form>
  );
}
