# freear

A free, browser-based ear trainer. Train your relative pitch on intervals,
chords and scales: a sound plays, you pick the answer from a set of options,
and get instant feedback.

- **Intervals** — from a unison up through compound intervals
- **Chords** — seventh chords across major, minor, dominant, diminished,
  augmented and sus qualities, including tensions and alternate voicings
- **Scales** — pentatonic, major-mode, minor, dominant and symmetric scales

Pick a mode, build your own practice sets with the options you want to drill,
and go. Everything runs client-side — no account, no server, no data leaving
your browser.

## Tech stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/), built with [Vite](https://vite.dev/)
- [Mantine](https://mantine.dev/) for UI components
- [Tone.js](https://tonejs.github.io/) for audio playback
- [Zustand](https://zustand-demo.pmnd.rs/) for state, persisted in the browser
- [React Router](https://reactrouter.com/) for routing
- Installable as a PWA ([vite-plugin-pwa](https://vite-pwa-org.netlify.app/))

## Local development

### Prerequisites

This repo includes a [dev container](https://containers.dev/) config
(`.devcontainer/`) — the recommended way to get set up. Open the repo in
VS Code or GitHub Codespaces and reopen in container; Node is preinstalled,
just run `corepack enable` once inside for pnpm.

Without the dev container, you'll need:

- [Node.js](https://nodejs.org/) 18 or newer
- [pnpm](https://pnpm.io/) (the pinned version in `package.json` is picked up automatically once you run `corepack enable`)

### Setup

```bash
pnpm install
pnpm dev
```

The dev server starts at `http://localhost:5173` with hot module reloading.

### Other scripts

| Command        | Description                              |
| -------------- | ----------------------------------------- |
| `pnpm dev`     | Start the Vite dev server                 |
| `pnpm build`   | Type-check and build for production       |
| `pnpm preview` | Preview the production build locally      |
| `pnpm lint`    | Run ESLint over the project               |

## Contributing

Found a bug or have a feature request? [Open a GitHub issue](https://github.com/stampaaaron/ear-training/issues).
