# WayBackCss

WayBackCss is a React playground for **runtime style injection**.

It lets you wrap arbitrary component trees and apply a retro visual layer (CRT/C64-style themes), then toggle an edit mode where elements can be dragged with persistent offsets.

## What this project does

- Injects styles across nested child elements at runtime
- Applies theme-driven color and typography overrides
- Supports a drag/edit overlay mode with visible frames/handles
- Keeps drag offsets when edit mode is turned off
- Tests cross-library styling behavior in one page:
  - Native HTML elements
  - MUI
  - Ant Design
  - React Bootstrap
  - Headless UI

## Theme modes

The demo includes theme presets controlled from the UI:

- `Default`
- `CRT`
- `Commodore 64`

Theme mode controls colors, borders, typography, and visual effects. The retro typing/caret behavior on headings is also theme-aware.

## Edit mode behavior

When edit mode is enabled:

- target elements get a visible frame
- drag handles appear
- moving an element stores an offset transform
- recently dragged elements are promoted above previous ones

When edit mode is disabled:

- frames/handles are hidden
- saved element offsets remain applied

## Tech stack

- React 19 + TypeScript
- Vite
- MUI
- Ant Design
- React Bootstrap
- Headless UI

## Getting started

## Prerequisites

- Node.js 20+
- npm 10+

## Install

```bash
npm install
```

## Run dev server

```bash
npm run dev
```

Then open the local Vite URL shown in terminal (usually `http://localhost:5173`).

## Build

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```

## Project structure

- `src/StyleInjector.tsx`: style injection + drag/edit mechanics
- `src/App.tsx`: demo content and controls
- `src/App.css`: global/theme styling and library-specific overrides
- `src/main.tsx`: app bootstrap and global stylesheet imports

## Notes

- This project intentionally uses strong CSS overrides to normalize third-party component libraries under a single retro theme.
- Some libraries generate dynamic classnames; selectors in `App.css` are written to remain resilient, but may require updates on major library upgrades.

## License

MIT
