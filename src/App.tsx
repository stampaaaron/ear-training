import { basicTensions } from './notes';
import {
  AppShell,
  Button,
  Card,
  createTheme,
  MantineProvider,
  SimpleGrid,
} from '@mantine/core';

import './styles.css';
import '@mantine/core/styles.css';
import { playChord } from './player';

const theme = createTheme({});

function App() {
  return (
    <MantineProvider theme={theme}>
      <AppShell padding="md">
        <AppShell.Main>
          <Card shadow="sm">
            <SimpleGrid cols={2}>
              {basicTensions.map((chord) => (
                <Button onClick={() => playChord(chord.intervals)}>
                  {chord.name}
                </Button>
              ))}
            </SimpleGrid>
          </Card>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
