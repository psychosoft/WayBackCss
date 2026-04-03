import { useMemo, useState } from "react";
import "./App.css";
import StyleInjector from "./StyleInjector";
import heroImage from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import { Disclosure, Menu, Switch as HeadlessSwitch } from "@headlessui/react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Autocomplete,
  Avatar,
  Button,
  ButtonGroup,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  LinearProgress,
  Rating,
  Radio,
  RadioGroup,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Slider,
  Switch,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Typography,
} from "@mui/material";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import {
  Alert as AntAlert,
  Checkbox as AntCheckbox,
  Button as AntButton,
  ConfigProvider as AntConfigProvider,
  DatePicker as AntDatePicker,
  Divider as AntDivider,
  Input as AntInput,
  InputNumber as AntInputNumber,
  Progress as AntProgress,
  Radio as AntRadio,
  Select as AntSelect,
  Segmented as AntSegmented,
  Slider as AntSlider,
  Switch as AntSwitch,
  Tag as AntTag,
  Tabs as AntTabs,
} from "antd";
import type { ThemeConfig as AntThemeConfig } from "antd";
import {
  Accordion as RbAccordion,
  Alert as RbAlert,
  Badge as RbBadge,
  Button as RbButton,
  Card as RbCard,
  Dropdown as RbDropdown,
  Form as RbForm,
  ListGroup as RbListGroup,
  ProgressBar as RbProgressBar,
} from "react-bootstrap";

type ThemeMode = "default" | "crt" | "c64" | "msdos";

function App() {
  const [editMode, setEditMode] = useState(false);
  const [transparentChildren, setTransparentChildren] = useState(true);
  const [theme, setTheme] = useState<ThemeMode>("c64");
  const [textAnimation, setTextAnimation] = useState(true);
  const [muiTab, setMuiTab] = useState(0);
  const [muiRating, setMuiRating] = useState<number | null>(3);
  const [muiSlider, setMuiSlider] = useState<number>(40);
  const [muiSelect, setMuiSelect] = useState("beta");
  const [muiAutoValue, setMuiAutoValue] = useState("Gamma");
  const [muiRadio, setMuiRadio] = useState("alpha");
  const [muiToggle, setMuiToggle] = useState("one");
  const [headlessEnabled, setHeadlessEnabled] = useState(true);
  const [antSlider, setAntSlider] = useState<number>(35);
  const [antRadio, setAntRadio] = useState("alpha");
  const [antSegment, setAntSegment] = useState("Alpha");

  const themeColors: Record<ThemeMode, { text: string; background: string }> = {
    default: { text: "#0f172a", background: "#e2e8f0" },
    crt: { text: "#c8ffd2", background: "#122a18" },
    c64: { text: "#8f97ff", background: "#40318d" },
    msdos: { text: "#c0c0c0", background: "#000000" },
  };

  const { text: textColor, background: backgroundColor } = themeColors[theme];

  const antTheme: AntThemeConfig = useMemo(() => {
    if (theme === "crt") {
      return {
        token: {
          colorPrimary: "#86ff9d",
          colorInfo: "#86ff9d",
          colorSuccess: "#86ff9d",
          colorBgBase: "#14271a",
          colorBgContainer: "#1b2f1f",
          colorTextBase: "#bbffbb",
          colorText: "#bbffbb",
          colorBorder: "#7ab787",
          borderRadius: 0,
          fontFamily: "VT323, Cascadia Mono, Consolas, monospace",
          fontSize: 24,
          lineHeight: 1.1,
        },
        components: {
          Alert: {
            withDescriptionPadding: 10,
          },
          Tabs: {
            inkBarColor: "#86ff9d",
            itemActiveColor: "#bbffbb",
            itemSelectedColor: "#bbffbb",
            itemHoverColor: "#ccffd0",
          },
          Button: {
            defaultBg: "#2a3f2a",
            defaultColor: "#deffde",
            defaultBorderColor: "#8fc88f",
            primaryColor: "#08240d",
          },
          Input: {
            activeBorderColor: "#86ff9d",
            hoverBorderColor: "#86ff9d",
          },
          Select: {
            activeBorderColor: "#86ff9d",
            hoverBorderColor: "#86ff9d",
          },
          DatePicker: {
            activeBorderColor: "#86ff9d",
            hoverBorderColor: "#86ff9d",
          },
          Progress: {
            defaultColor: "#86ff9d",
            remainingColor: "#2f4f35",
          },
          Slider: {
            trackBg: "#86ff9d",
            trackHoverBg: "#a2ffb4",
            railBg: "#2f4f35",
            railHoverBg: "#3d6446",
            handleColor: "#bbffbb",
            handleActiveColor: "#e0ffe6",
          },
          Switch: {
            colorPrimary: "#86ff9d",
            colorPrimaryHover: "#a2ffb4",
          },
        },
      };
    }

    if (theme === "c64") {
      return {
        token: {
          colorPrimary: "#8f97ff",
          colorInfo: "#8f97ff",
          colorSuccess: "#8f97ff",
          colorBgBase: "#40318d",
          colorBgContainer: "#4d5ac4",
          colorTextBase: "#cfd5ff",
          colorText: "#cfd5ff",
          colorBorder: "#aab0ff",
          borderRadius: 0,
          fontFamily: `"C64 Pro Mono", "Press Start 2P", "Lucida Console", "Consolas", monospace`,
          fontSize: 12,
          lineHeight: 1.5,
        },
        components: {
          Tabs: {
            inkBarColor: "#aab0ff",
            itemActiveColor: "#cfd5ff",
            itemSelectedColor: "#cfd5ff",
          },
          Button: {
            defaultBg: "#5c66cd",
            defaultColor: "#d3d7ff",
            defaultBorderColor: "#aab0ff",
          },
          Progress: {
            defaultColor: "#aab0ff",
            remainingColor: "#5964c7",
          },
          Slider: {
            trackBg: "#aab0ff",
            trackHoverBg: "#c6cbff",
            railBg: "#5964c7",
            railHoverBg: "#6672d8",
            handleColor: "#d3d7ff",
            handleActiveColor: "#ffffff",
          },
          Switch: {
            colorPrimary: "#aab0ff",
            colorPrimaryHover: "#c6cbff",
          },
        },
      };
    }

    if (theme === "msdos") {
      return {
        token: {
          colorPrimary: "#c0c0c0",
          colorInfo: "#c0c0c0",
          colorSuccess: "#c0c0c0",
          colorBgBase: "#000000",
          colorBgContainer: "#050505",
          colorTextBase: "#c0c0c0",
          colorText: "#c0c0c0",
          colorBorder: "#a0a0a0",
          borderRadius: 0,
          fontFamily: "'Px437 IBM VGA8', VT323, Consolas, 'Lucida Console', monospace",
          fontSize: 24,
          lineHeight: 1.08,
        },
        components: {
          Tabs: {
            inkBarColor: "#c0c0c0",
            itemActiveColor: "#c0c0c0",
            itemSelectedColor: "#c0c0c0",
          },
          Button: {
            defaultBg: "#000000",
            defaultColor: "#c0c0c0",
            defaultBorderColor: "#a0a0a0",
          },
          Progress: {
            defaultColor: "#c0c0c0",
            remainingColor: "#1a1a1a",
          },
          Slider: {
            trackBg: "#c0c0c0",
            railBg: "#1a1a1a",
            handleColor: "#c0c0c0",
          },
          Switch: {
            colorPrimary: "#c0c0c0",
          },
        },
      };
    }

    return {};
  }, [theme]);

  const muiTheme = useMemo(() => {
    if (theme === "crt") {
      return createTheme({
        palette: {
          mode: "dark",
          primary: { main: "#86ff9d" },
          success: { main: "#86ff9d" },
          text: { primary: "#bbffbb", secondary: "#9fe3a9" },
          background: { default: "#0f2314", paper: "#1b2f1f" },
        },
        typography: {
          fontFamily: "VT323, Cascadia Mono, Consolas, monospace",
          fontSize: 20,
        },
        shape: { borderRadius: 0 },
        components: {
          MuiAlert: {
            styleOverrides: {
              root: {
                backgroundColor: "#1f3525",
                color: "#bbffbb",
                border: "2px solid #86ff9d",
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                backgroundColor: "#27482f",
                color: "#deffde",
                border: "1px solid #86ff9d",
              },
            },
          },
          MuiSwitch: {
            styleOverrides: {
              switchBase: {
                color: "#86ff9d",
                "&.Mui-checked": { color: "#b8ffc5" },
              },
              track: {
                backgroundColor: "#2f4f35",
                opacity: 1,
              },
            },
          },
          MuiAccordion: {
            styleOverrides: {
              root: {
                backgroundColor: "#1f3525",
                color: "#bbffbb",
                border: "1px solid #86ff9d",
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                color: "#bbffbb",
                backgroundColor: "#1f3525",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#86ff9d",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#a2ffb4",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#b8ffc5",
                },
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: { color: "#9fe3a9" },
            },
          },
          MuiTabs: {
            styleOverrides: {
              indicator: { backgroundColor: "#86ff9d" },
            },
          },
          MuiMenu: {
            styleOverrides: {
              paper: {
                backgroundColor: "#1f3525",
                color: "#bbffbb",
                border: "2px solid #86ff9d",
              },
              list: {
                backgroundColor: "#1f3525",
                color: "#bbffbb",
              },
            },
          },
          MuiMenuItem: {
            styleOverrides: {
              root: {
                backgroundColor: "#1f3525",
                color: "#bbffbb",
                "&.Mui-selected": {
                  backgroundColor: "#2a4632",
                  color: "#deffde",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "#31533a",
                },
                "&:hover": {
                  backgroundColor: "#27412e",
                },
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: {
                color: "#9fe3a9",
                "&.Mui-selected": { color: "#bbffbb" },
              },
            },
          },
          MuiLinearProgress: {
            styleOverrides: {
              root: { backgroundColor: "#2f4f35" },
              bar: { backgroundColor: "#86ff9d" },
            },
          },
        },
      });
    }

    if (theme === "c64") {
      return createTheme({
        palette: {
          mode: "dark",
          primary: { main: "#aab0ff" },
          success: { main: "#aab0ff" },
          text: { primary: "#cfd5ff", secondary: "#aab0ff" },
          background: { default: "#40318d", paper: "#4d5ac4" },
        },
        typography: {
          fontFamily:
            '"C64 Pro Mono", "Press Start 2P", "Lucida Console", "Consolas", monospace',
          fontSize: 11,
        },
        shape: { borderRadius: 0 },
        components: {
          MuiAlert: {
            styleOverrides: {
              root: {
                backgroundColor: "#4d5ac4",
                color: "#cfd5ff",
                border: "2px solid #aab0ff",
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                backgroundColor: "#5f6cd3",
                color: "#eef0ff",
                border: "1px solid #aab0ff",
              },
            },
          },
          MuiSwitch: {
            styleOverrides: {
              switchBase: {
                color: "#cfd5ff",
                "&.Mui-checked": { color: "#eef0ff" },
              },
              track: {
                backgroundColor: "#5f6cd3",
                opacity: 1,
              },
            },
          },
          MuiAccordion: {
            styleOverrides: {
              root: {
                backgroundColor: "#4d5ac4",
                color: "#cfd5ff",
                border: "1px solid #aab0ff",
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                color: "#cfd5ff",
                backgroundColor: "#4d5ac4",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#aab0ff",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#c3c8ff",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#eef0ff",
                },
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: { color: "#aab0ff" },
            },
          },
          MuiTabs: {
            styleOverrides: {
              indicator: { backgroundColor: "#aab0ff" },
            },
          },
          MuiMenu: {
            styleOverrides: {
              paper: {
                backgroundColor: "#4d5ac4",
                color: "#cfd5ff",
                border: "2px solid #aab0ff",
              },
              list: {
                backgroundColor: "#4d5ac4",
                color: "#cfd5ff",
              },
            },
          },
          MuiMenuItem: {
            styleOverrides: {
              root: {
                backgroundColor: "#4d5ac4",
                color: "#cfd5ff",
                "&.Mui-selected": {
                  backgroundColor: "#5f6cd3",
                  color: "#eef0ff",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "#6976dd",
                },
                "&:hover": {
                  backgroundColor: "#5966ce",
                },
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: {
                color: "#aab0ff",
                "&.Mui-selected": { color: "#eef0ff" },
              },
            },
          },
          MuiLinearProgress: {
            styleOverrides: {
              root: { backgroundColor: "#5964c7" },
              bar: { backgroundColor: "#aab0ff" },
            },
          },
        },
      });
    }

    if (theme === "msdos") {
      return createTheme({
        palette: {
          mode: "dark",
          primary: { main: "#c0c0c0" },
          success: { main: "#c0c0c0" },
          text: { primary: "#c0c0c0", secondary: "#8a8a8a" },
          background: { default: "#000000", paper: "#020202" },
        },
        typography: {
          fontFamily: "'Px437 IBM VGA8', VT323, Consolas, 'Lucida Console', monospace",
          fontSize: 21,
        },
        shape: { borderRadius: 0 },
        components: {
          MuiAlert: {
            styleOverrides: {
              root: {
                backgroundColor: "#000000",
                color: "#c0c0c0",
                border: "2px solid #a0a0a0",
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                backgroundColor: "#000000",
                color: "#c0c0c0",
                border: "2px solid #a0a0a0",
              },
            },
          },
          MuiSwitch: {
            styleOverrides: {
              switchBase: {
                color: "#c0c0c0",
                "&.Mui-checked": { color: "#c0c0c0" },
              },
              track: {
                backgroundColor: "#1a1a1a",
                opacity: 1,
              },
            },
          },
          MuiAccordion: {
            styleOverrides: {
              root: {
                backgroundColor: "#000000",
                color: "#c0c0c0",
                border: "2px solid #a0a0a0",
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                color: "#c0c0c0",
                backgroundColor: "#121212",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#a0a0a0",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#a0a0a0",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#c0c0c0",
                },
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: { color: "#c0c0c0" },
            },
          },
          MuiTabs: {
            styleOverrides: {
              indicator: { backgroundColor: "#c0c0c0" },
            },
          },
          MuiMenu: {
            styleOverrides: {
              paper: {
                backgroundColor: "#000000",
                color: "#c0c0c0",
                border: "2px solid #a0a0a0",
              },
              list: {
                backgroundColor: "#000000",
                color: "#c0c0c0",
              },
            },
          },
          MuiMenuItem: {
            styleOverrides: {
              root: {
                backgroundColor: "#000000",
                color: "#c0c0c0",
                "&.Mui-selected": {
                  backgroundColor: "#2a2a2a",
                  color: "#f0f0f0",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "#333333",
                },
                "&:hover": {
                  backgroundColor: "#1a1a1a",
                },
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: {
                color: "#8a8a8a",
                "&.Mui-selected": { color: "#c0c0c0" },
              },
            },
          },
          MuiLinearProgress: {
            styleOverrides: {
              root: { backgroundColor: "#1a1a1a" },
              bar: { backgroundColor: "#c0c0c0" },
            },
          },
        },
      });
    }

    return createTheme();
  }, [theme]);

  return (
    <main className={`page theme-${theme}`}>
      <section className="controls">
        <h1>Style Injector Demo</h1>
        <p>Select a theme and verify styles are injected into nested children.</p>
        <button
          type="button"
          className={`edit-toggle ${editMode ? "on" : "off"}`}
          onClick={() => setEditMode((prev) => !prev)}
        >
          {editMode ? "Disable edit mode" : "Enable edit mode"}
        </button>
        <label className="option-toggle option-toggle-inline">
          <input
            type="checkbox"
            checked={transparentChildren}
            onChange={(event) => setTransparentChildren(event.target.checked)}
          />
          Transparent nested backgrounds
        </label>
        <label className="option-toggle">
          Theme
          <select
            value={theme}
            onChange={(event) => setTheme(event.target.value as ThemeMode)}
          >
            <option value="default">Default</option>
            <option value="crt">CRT Terminal</option>
            <option value="c64">Commodore 64</option>
            <option value="msdos">MS-DOS</option>
          </select>
        </label>
        <label className="option-toggle option-toggle-inline">
          <input
            type="checkbox"
            checked={textAnimation}
            onChange={(event) => setTextAnimation(event.target.checked)}
          />
          Terminal typing animation
        </label>
      </section>

      <StyleInjector
        textColor={textColor}
        backgroundColor={backgroundColor}
        editMode={editMode}
        transparentChildren={transparentChildren}
        textAnimation={textAnimation}
      >
        <section className="preview">
          <h2>Injected Container</h2>
          <p>
            This area contains many HTML elements so you can test how style
            injection behaves across real-world markup.
          </p>

          <div className="stack-row">
            <button type="button">Primary action</button>
            <button type="button">Secondary action</button>
            <a href="https://example.com" target="_blank" rel="noreferrer">
              External link
            </a>
            <span>Inline text span</span>
            <mark>Marked content</mark>
            <small>Small helper text</small>
          </div>

          <div className="media-grid">
            <figure className="card">
              <img src={heroImage} alt="Decorative 3D shape" width={170} />
              <figcaption>PNG image from local assets</figcaption>
            </figure>
            <figure className="card">
              <img src={reactLogo} alt="React logo" width={72} />
              <img src={viteLogo} alt="Vite logo" width={72} />
              <figcaption>SVG images displayed together</figcaption>
            </figure>
            <figure className="card">
              <picture>
                <source media="(min-width: 780px)" srcSet={heroImage} />
                <img src={viteLogo} alt="Responsive picture element demo" />
              </picture>
              <figcaption>Picture/source responsive image test</figcaption>
            </figure>
          </div>

          <section className="gallery-strip">
            <img src={heroImage} alt="Gallery 1" />
            <img src={reactLogo} alt="Gallery 2" />
            <img src={viteLogo} alt="Gallery 3" />
            <img src={heroImage} alt="Gallery 4" />
          </section>

          <div className="card-grid">
            <article className="card">
              <h3>Card A</h3>
              <p>Nested element with text and background color set by injector.</p>
              <button type="button">Action</button>
            </article>
            <article className="card">
              <h3>Card B</h3>
              <ul>
                <li>List item one</li>
                <li>List item two</li>
                <li>
                  Nested list
                  <ol>
                    <li>First</li>
                    <li>Second</li>
                  </ol>
                </li>
              </ul>
            </article>
          </div>

          <section className="advanced-layout">
            <article className="card">
              <header>
                <h3>Mini Dashboard</h3>
                <p>Semantic layout with nav + main + aside.</p>
              </header>
              <nav aria-label="Widget tabs" className="tab-row">
                <button type="button">Overview</button>
                <button type="button">Traffic</button>
                <button type="button">Errors</button>
              </nav>
              <div className="dashboard-grid">
                <main>
                  <svg
                    viewBox="0 0 220 90"
                    role="img"
                    aria-label="Simple line chart"
                  >
                    <polyline
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      points="5,70 35,58 65,52 95,28 125,42 155,16 185,30 215,22"
                    />
                  </svg>
                </main>
                <aside>
                  <p>
                    <strong>Uptime:</strong> 99.98%
                  </p>
                  <p>
                    <strong>Latency:</strong> 122ms
                  </p>
                </aside>
              </div>
            </article>

            <article className="card">
              <h3>Command Palette Mock</h3>
              <label>
                Search command
                <input type="search" placeholder="Type a command..." />
              </label>
              <menu className="command-list">
                <li>
                  <kbd>Ctrl</kbd> + <kbd>K</kbd> Open command palette
                </li>
                <li>
                  <kbd>Ctrl</kbd> + <kbd>S</kbd> Save current item
                </li>
                <li>
                  <kbd>Alt</kbd> + <kbd>Enter</kbd> Run selected action
                </li>
              </menu>
              <output>Result: 3 commands available</output>
            </article>
          </section>

          <form className="form-grid" onSubmit={(event) => event.preventDefault()}>
            <label>
              Text input
              <input type="text" placeholder="Type here" />
            </label>
            <label>
              Email input
              <input type="email" placeholder="name@example.com" />
            </label>
            <label>
              Password input
              <input type="password" value="secret123" readOnly />
            </label>
            <label>
              Number input
              <input type="number" min={0} max={100} defaultValue={42} />
            </label>
            <label>
              Date input
              <input type="date" defaultValue="2026-04-03" />
            </label>
            <label>
              Range input
              <input type="range" min={0} max={100} defaultValue={65} />
            </label>
            <label>
              Dropdown
              <select defaultValue="beta">
                <option value="alpha">Alpha</option>
                <option value="beta">Beta</option>
                <option value="gamma">Gamma</option>
              </select>
            </label>
            <label>
              Multi-select
              <select multiple defaultValue={["one", "three"]}>
                <option value="one">One</option>
                <option value="two">Two</option>
                <option value="three">Three</option>
              </select>
            </label>
            <fieldset>
              <legend>Radio group</legend>
              <label>
                <input type="radio" name="size" defaultChecked /> Small
              </label>
              <label>
                <input type="radio" name="size" /> Large
              </label>
            </fieldset>
            <fieldset>
              <legend>Checkboxes</legend>
              <label>
                <input type="checkbox" defaultChecked /> Receive updates
              </label>
              <label>
                <input type="checkbox" /> Enable alerts
              </label>
            </fieldset>
            <label className="full">
              Textarea
              <textarea rows={4} defaultValue="Long-form text goes here." />
            </label>
          </form>

          <table className="data-table">
            <caption>Example data table</caption>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Status</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Typography</td>
                <td>Ready</td>
                <td>92</td>
              </tr>
              <tr>
                <td>Spacing</td>
                <td>In progress</td>
                <td>77</td>
              </tr>
              <tr>
                <td>Accessibility</td>
                <td>Ready</td>
                <td>88</td>
              </tr>
            </tbody>
          </table>

          <details>
            <summary>Expandable details block</summary>
            <p>
              This detail section confirms injected styles also apply to
              semantic disclosure elements.
            </p>
          </details>

          <blockquote>
            "Injected style tests should include visual, semantic, and
            interactive elements."
          </blockquote>

          <dl className="definition-list">
            <dt>Term</dt>
            <dd>A word or phrase being defined.</dd>
            <dt>Definition</dt>
            <dd>An explanation of meaning.</dd>
          </dl>

          <div className="metrics-row">
            <label>
              Progress
              <progress value={68} max={100}>
                68%
              </progress>
            </label>
            <label>
              Meter
              <meter min={0} max={10} value={7}>
                7 out of 10
              </meter>
            </label>
          </div>

          <pre>
            <code>{`const injected = { color: "${textColor}", backgroundColor: "${backgroundColor}" };`}</code>
          </pre>

          <dialog open className="demo-dialog">
            <p>Dialog element preview for modal-like content.</p>
            <form method="dialog">
              <button type="submit">Close</button>
            </form>
          </dialog>

          <section className="mui-lab card">
            <h3>MUI Component Compatibility (Open Source)</h3>
            <p>
              Testing style injection against Material UI components rendered as
              React abstractions.
            </p>
            <MuiThemeProvider theme={muiTheme}>
              <Alert severity="success">
                MUI alert rendered inside StyleInjector
              </Alert>
              <Tabs value={muiTab} onChange={(_, value) => setMuiTab(value)}>
                <Tab label="Panel One" />
                <Tab label="Panel Two" />
                <Tab label="Panel Three" />
              </Tabs>
              <div className="mui-row">
                <Chip label="Status chip" />
                <Chip label="Clickable chip" clickable />
                <Switch defaultChecked />
                <Avatar sx={{ width: 26, height: 26 }}>M</Avatar>
              </div>
              <ButtonGroup size="small" variant="outlined">
                <Button>MUI One</Button>
                <Button>Two</Button>
                <Button>Three</Button>
              </ButtonGroup>
              <ToggleButtonGroup
                size="small"
                value={muiToggle}
                exclusive
                onChange={(_, value) => {
                  if (value) setMuiToggle(value);
                }}
              >
                <ToggleButton value="one">Mode One</ToggleButton>
                <ToggleButton value="two">Mode Two</ToggleButton>
                <ToggleButton value="three">Mode Three</ToggleButton>
              </ToggleButtonGroup>
              <FormGroup row>
                <FormControlLabel control={<Checkbox defaultChecked />} label="MUI check A" />
                <FormControlLabel control={<Checkbox />} label="MUI check B" />
              </FormGroup>
              <RadioGroup
                row
                value={muiRadio}
                onChange={(event) => setMuiRadio(event.target.value)}
              >
                <FormControlLabel value="alpha" control={<Radio />} label="Alpha" />
                <FormControlLabel value="beta" control={<Radio />} label="Beta" />
                <FormControlLabel value="gamma" control={<Radio />} label="Gamma" />
              </RadioGroup>
              <Accordion>
                <AccordionSummary>
                  <Typography>Accordion title</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    This checks nested MUI containers, typography and transitions.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <TextField size="small" label="MUI text field" variant="outlined" />
              <FormControl size="small">
                <InputLabel id="mui-select-label">MUI dropdown</InputLabel>
                <Select
                  labelId="mui-select-label"
                  label="MUI dropdown"
                  value={muiSelect}
                  onChange={(event) => setMuiSelect(event.target.value)}
                >
                  <MenuItem value="alpha">Alpha</MenuItem>
                  <MenuItem value="beta">Beta</MenuItem>
                  <MenuItem value="gamma">Gamma</MenuItem>
                </Select>
              </FormControl>
              <Autocomplete
                size="small"
                options={["Alpha", "Beta", "Gamma", "Delta"]}
                value={muiAutoValue}
                onChange={(_, value) => setMuiAutoValue(value ?? "Alpha")}
                renderInput={(params) => <TextField {...params} label="MUI autocomplete" />}
              />
              <div className="mui-row">
                <label>
                  MUI slider
                  <Slider
                    value={muiSlider}
                    onChange={(_, value) => setMuiSlider(value as number)}
                  />
                </label>
                <label>
                  MUI rating
                  <Rating
                    value={muiRating}
                    onChange={(_, value) => setMuiRating(value)}
                  />
                </label>
              </div>
              <LinearProgress variant="determinate" value={68} />
              <CircularProgress size={30} />
            </MuiThemeProvider>
          </section>

          <section className="library-grid">
            <section className="lib-card card">
              <h3>Ant Design (MIT)</h3>
              <AntConfigProvider theme={antTheme}>
                <AntAlert
                  type="info"
                  showIcon
                  title="Ant Design components inside StyleInjector"
                />
                <div className="lib-row">
                  <AntButton type="primary">Primary</AntButton>
                  <AntButton>Default</AntButton>
                  <AntSwitch defaultChecked />
                  <AntTag>Tag</AntTag>
                </div>
                <div className="lib-row">
                  <AntCheckbox defaultChecked>Ant check A</AntCheckbox>
                  <AntCheckbox>Ant check B</AntCheckbox>
                </div>
                <AntRadio.Group
                  value={antRadio}
                  onChange={(event) => setAntRadio(event.target.value)}
                  options={[
                    { label: "Alpha", value: "alpha" },
                    { label: "Beta", value: "beta" },
                    { label: "Gamma", value: "gamma" },
                  ]}
                />
                <AntInput placeholder="Antd input field" />
                <AntInputNumber
                  style={{ width: "100%" }}
                  min={0}
                  max={99}
                  defaultValue={42}
                />
                <AntSegmented
                  block
                  value={antSegment}
                  onChange={(value) => setAntSegment(String(value))}
                  options={["Alpha", "Beta", "Gamma"]}
                />
                <AntSelect
                  defaultValue="beta"
                  getPopupContainer={(trigger) => trigger.parentElement ?? trigger}
                  options={[
                    { value: "alpha", label: "Alpha" },
                    { value: "beta", label: "Beta" },
                    { value: "gamma", label: "Gamma" },
                  ]}
                />
                <AntTabs
                  items={[
                    { key: "1", label: "Tab 1", children: "Antd tab panel one" },
                    { key: "2", label: "Tab 2", children: "Antd tab panel two" },
                  ]}
                />
                <AntSlider
                  value={antSlider}
                  onChange={(value) => setAntSlider(value)}
                />
                <AntDivider style={{ margin: "8px 0" }} />
                <AntProgress percent={72} />
                <AntDatePicker
                  getPopupContainer={(trigger) => trigger.parentElement ?? trigger}
                />
              </AntConfigProvider>
            </section>

            <section className="lib-card card">
              <h3>React Bootstrap (MIT)</h3>
              <RbAlert variant="success">
                React Bootstrap alert <RbBadge bg="secondary">New</RbBadge>
              </RbAlert>
              <div className="lib-row">
                <RbButton variant="primary">Primary</RbButton>
                <RbButton variant="outline-light">Outline</RbButton>
                <RbDropdown>
                  <RbDropdown.Toggle variant="outline-light" size="sm">
                    Dropdown
                  </RbDropdown.Toggle>
                  <RbDropdown.Menu>
                    <RbDropdown.Item href="#/action-1">Action</RbDropdown.Item>
                    <RbDropdown.Item href="#/action-2">Another action</RbDropdown.Item>
                    <RbDropdown.Item href="#/action-3">Something else</RbDropdown.Item>
                  </RbDropdown.Menu>
                </RbDropdown>
              </div>
              <RbForm.Group className="mb-2">
                <RbForm.Label>RB input</RbForm.Label>
                <RbForm.Control placeholder="Type with Bootstrap control" />
              </RbForm.Group>
              <div className="rb-check-group">
                <RbForm.Check
                  className="rb-check-line"
                  type="checkbox"
                  label="RB check"
                  defaultChecked
                />
                <RbForm.Check
                  className="rb-check-line"
                  type="radio"
                  name="rb-radio"
                  label="RB radio A"
                  defaultChecked
                />
                <RbForm.Check
                  className="rb-check-line"
                  type="radio"
                  name="rb-radio"
                  label="RB radio B"
                />
              </div>
              <RbProgressBar now={68} label="68%" />
              <RbCard>
                <RbCard.Body>
                  <RbCard.Title>Bootstrap Card</RbCard.Title>
                  <RbCard.Text>
                    Nested card styles and typographic defaults.
                  </RbCard.Text>
                </RbCard.Body>
              </RbCard>
              <RbAccordion defaultActiveKey="0">
                <RbAccordion.Item eventKey="0">
                  <RbAccordion.Header>RB accordion</RbAccordion.Header>
                  <RbAccordion.Body>Accordion body content for styling test.</RbAccordion.Body>
                </RbAccordion.Item>
              </RbAccordion>
              <RbListGroup>
                <RbListGroup.Item>Item One</RbListGroup.Item>
                <RbListGroup.Item>Item Two</RbListGroup.Item>
                <RbListGroup.Item>Item Three</RbListGroup.Item>
              </RbListGroup>
            </section>

            <section className="lib-card card">
              <h3>Headless UI (MIT)</h3>
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="headless-btn">
                      {open ? "Hide details" : "Show details"}
                    </Disclosure.Button>
                    <Disclosure.Panel className="headless-panel">
                      Headless UI disclosure panel content.
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="headless-btn">
                      {open ? "Hide advanced panel" : "Show advanced panel"}
                    </Disclosure.Button>
                    <Disclosure.Panel className="headless-panel">
                      <div className="lib-row">
                        <button type="button">Confirm</button>
                        <button type="button">Cancel</button>
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
              <Menu as="div" className="headless-menu">
                <Menu.Button className="headless-btn">Menu</Menu.Button>
                <Menu.Items anchor="bottom" className="headless-menu-items">
                  <Menu.Item>
                    <button type="button">Edit</button>
                  </Menu.Item>
                  <Menu.Item>
                    <button type="button">Duplicate</button>
                  </Menu.Item>
                  <Menu.Item>
                    <button type="button">Archive</button>
                  </Menu.Item>
                  <Menu.Item>
                    <button type="button">Delete</button>
                  </Menu.Item>
                </Menu.Items>
              </Menu>
              <label className="headless-switch-row">
                Headless switch
                <HeadlessSwitch
                  checked={headlessEnabled}
                  onChange={setHeadlessEnabled}
                  className={`headless-switch ${headlessEnabled ? "on" : "off"}`}
                >
                  <span className="sr-only">Enable headless switch</span>
                  <span aria-hidden="true" className="headless-switch-thumb" />
                </HeadlessSwitch>
              </label>
            </section>
          </section>
        </section>
      </StyleInjector>
    </main>
  );
}

export default App;
