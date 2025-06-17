import { AppShell, createTheme, MantineProvider } from '@mantine/core';
import './styles.css';
import '@mantine/core/styles.css';
import { Quiz } from './pages/quiz/Quiz';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Home } from './pages/Home';
import { Settings } from './pages/Settings';
import { NewQuiz } from './pages/quiz/NewQuiz';
import { Sets } from './pages/Sets';
import { Cadence } from './pages/cadance/Cadence';

const theme = createTheme({});

function App() {
  return (
    <BrowserRouter basename="/ear-training">
      <MantineProvider theme={theme}>
        <AppShell bg="blue" py="lg">
          <AppShell.Main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sets" element={<Sets />} />
              <Route path="/quiz">
                <Route path="" element={<Quiz />} />
                <Route path="new" element={<NewQuiz />} />
              </Route>
              <Route path="/cadence">
                <Route path="" element={<Cadence />} />
              </Route>
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </AppShell.Main>
        </AppShell>
      </MantineProvider>
    </BrowserRouter>
  );
}

export default App;
