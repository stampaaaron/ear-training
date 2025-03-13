import { AppShell, createTheme, MantineProvider } from '@mantine/core';

import './styles.css';
import '@mantine/core/styles.css';
import { Quiz } from './pages/Quiz';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Home } from './pages/Home';
import { Settings } from './pages/Settings';

const theme = createTheme({});

function App() {
  return (
    <BrowserRouter basename="/ear-training">
      <MantineProvider theme={theme}>
        <AppShell bg="blue" py="lg">
          <AppShell.Main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </AppShell.Main>
        </AppShell>
      </MantineProvider>
    </BrowserRouter>
  );
}

export default App;
