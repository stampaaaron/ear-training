import { AppShell, createTheme, MantineProvider } from '@mantine/core';
import './styles.css';
import '@mantine/core/styles.css';
import { Quiz } from './pages/quiz/Quiz';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Landing } from './pages/Landing';
import { Modes } from './pages/Modes';
import { Settings } from './pages/Settings';
import { NewSet } from './pages/set/NewSet';
import { Cadence } from './pages/cadance/Cadence';
import { Sets } from './pages/set/Sets';
import { Set } from './pages/set/Set';
import { AudioProvider } from './pages/AudioProvider';

const theme = createTheme({});

function App() {
  return (
    <BrowserRouter>
      <MantineProvider theme={theme}>
        <AudioProvider>
          <AppShell bg="blue" padding="lg">
            <AppShell.Main>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/modes" element={<Modes />} />
                <Route path="/sets">
                  <Route path="" element={<Sets />} />
                  <Route path=":id" element={<Set />} />
                  <Route path="new" element={<NewSet />} />
                </Route>
                <Route path="/quiz">
                  <Route path="" element={<Quiz />} />
                </Route>
                <Route path="/cadence">
                  <Route path="" element={<Cadence />} />
                </Route>
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </AppShell.Main>
          </AppShell>
        </AudioProvider>
      </MantineProvider>
    </BrowserRouter>
  );
}

export default App;
