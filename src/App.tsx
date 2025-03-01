import { AppShell, createTheme, MantineProvider } from '@mantine/core';

import './styles.css';
import '@mantine/core/styles.css';
import { Quiz } from './pages/Quiz';

const theme = createTheme({});

function App() {
  return (
    <MantineProvider theme={theme}>
      <AppShell padding="md">
        <AppShell.Main>
          <Quiz />
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
