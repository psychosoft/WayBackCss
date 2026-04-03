# UI Regression Checklist

## Setup
1. Start app on `http://127.0.0.1:5173`.
2. Test all themes: `default`, `crt`, `c64`, `msdos`.
3. Test desktop (`1500x1100`) and mobile (`390x844`).
4. Before each theme run, reset scroll to top.
5. After each interaction, verify page did not jump unexpectedly.

## Global Acceptance
1. Colors follow the active theme (text, bg, border, hover, active, selected).
2. Similar controls have similar visual size and border shape.
3. No clipped or overflowing labels/values.
4. Dropdown/list items have no unintended inner borders/lines.
5. Focus outlines are visible and consistent with theme.
6. Interactions do not break layout or move content unexpectedly.

## Interaction Flow (per component)
1. Verify initial colors, size, borders.
2. Click to open.
3. Verify open panel/list style.
4. Select value/item.
5. Verify selected value is reflected.
6. Verify no scroll jump.
7. Focus with keyboard and verify outline.

## Components To Cover
1. Native HTML controls and table.
2. MUI: Switch, Select, Autocomplete, Slider, Rating, Tabs, Accordion, Table, Badge.
3. Ant Design: Select, DatePicker, Switch, Slider, Tabs, Radio, Checkbox, InputNumber, Table.
4. React Bootstrap: Dropdown, Buttons, Accordion, ListGroup, Form controls, Progress, Table.
5. Headless UI: Menu, Listbox, Combobox, Switch, Tabs, Checkbox, RadioGroup.

## Special Regression Targets
1. Headless Listbox/Combobox open + select must not scroll-jump.
2. React Bootstrap dropdown must be full-width, no value overflow, no inner value borders.
3. Badge text must remain readable in all themes.
4. Date/select overlays must keep consistent border and contrast.

## Reporting
1. Theme.
2. Component/state.
3. Expected vs actual.
4. Repro steps.
5. Screenshot path.
6. Severity: blocker/high/medium/low.

