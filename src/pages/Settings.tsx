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
import { Shell } from '../layout/Shell';
import { useForm } from '@mantine/form';
import { useStore } from '@nanostores/react';
import { $settings, defaultSettings } from '../store/settings';
import { Frequency } from 'tone';
import { arrayRange } from '../utils';
import { PlaybackMode, playbackModeTranslationMap } from '../player';
import { IconPlus, IconX } from '@tabler/icons-react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';

type SettingsForm = NonNullable<typeof $settings.value>;

export function Settings() {
  const settings = useStore($settings);

  const form = useForm<SettingsForm>({
    initialValues: settings,
    onValuesChange: $settings.set,
  });

  return (
    <Shell
      title="Settings"
      rightSection={
        <Button
          variant="subtle"
          p="xs"
          onClick={() => {
            $settings.set(defaultSettings);
            form.setValues(defaultSettings);
          }}
        >
          Reset
        </Button>
      }
      backUrl=".."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Stack gap="xl">
          <Stack gap="xs">
            <Text>Note to note delay: {form.getValues().noteToNoteDelay}s</Text>
            <Slider
              {...form.getInputProps('noteToNoteDelay')}
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
              {form.getValues().releaseDelay}s
            </Text>
            <Slider
              {...form.getInputProps('releaseDelay')}
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
              Start note range (
              {Frequency(form.getValues().startNoteRange[0], 'midi').toNote()} -{' '}
              {Frequency(form.getValues().startNoteRange[1], 'midi').toNote()})
            </Text>
            <RangeSlider
              {...form.getInputProps('startNoteRange')}
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
                        {form.getValues().playBackModes.map((mode, index) => (
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
                                  <Button.GroupSection variant="default">
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
              <Menu trigger="click-hover">
                <Menu.Target>
                  <Button variant="subtle" rightSection={<IconPlus />}>
                    Add
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
            </div>
          </Stack>
        </Stack>
      </form>
    </Shell>
  );
}
