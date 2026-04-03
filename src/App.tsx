import { useEffect, useMemo, useState } from "react";
import "./App.css";
import StyleInjector from "./StyleInjector";
import heroImage from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import {
  Checkbox as HeadlessCheckbox,
  Combobox as HeadlessCombobox,
  ComboboxButton as HeadlessComboboxButton,
  ComboboxInput as HeadlessComboboxInput,
  ComboboxOption as HeadlessComboboxOption,
  ComboboxOptions as HeadlessComboboxOptions,
  Field as HeadlessField,
  Fieldset as HeadlessFieldset,
  Input as HeadlessInput,
  Label as HeadlessLabel,
  Legend as HeadlessLegend,
  Disclosure,
  Listbox as HeadlessListbox,
  Menu,
  MenuButton as HeadlessMenuButton,
  MenuItem as HeadlessMenuItem,
  MenuItems as HeadlessMenuItems,
  Popover as HeadlessPopover,
  PopoverButton as HeadlessPopoverButton,
  PopoverPanel as HeadlessPopoverPanel,
  RadioGroup as HeadlessRadioGroup,
  SwitchDescription as HeadlessSwitchDescription,
  SwitchGroup as HeadlessSwitchGroup,
  SwitchLabel as HeadlessSwitchLabel,
  Switch as HeadlessSwitch,
  Tab as HeadlessTab,
  TabGroup as HeadlessTabGroup,
  TabList as HeadlessTabList,
  TabPanel as HeadlessTabPanel,
  TabPanels as HeadlessTabPanels,
  Textarea as HeadlessTextarea,
} from "@headlessui/react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle as MuiAlertTitle,
  Badge as MuiBadge,
  Autocomplete,
  Avatar,
  Breadcrumbs as MuiBreadcrumbs,
  Button,
  ButtonGroup,
  Checkbox,
  Chip,
  Card as MuiCard,
  CardActions as MuiCardActions,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  FormControlLabel,
  FormGroup,
  List as MuiList,
  ListItem as MuiListItem,
  ListItemText as MuiListItemText,
  LinearProgress,
  Link as MuiLink,
  Rating,
  Radio,
  RadioGroup,
  MenuItem,
  Pagination as MuiPagination,
  FormControl,
  InputLabel,
  Select,
  Skeleton as MuiSkeleton,
  Slider,
  Snackbar,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Switch,
  Tab,
  Table as MuiTable,
  TableBody as MuiTableBody,
  TableCell as MuiTableCell,
  TableContainer as MuiTableContainer,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Tooltip as MuiTooltip,
  Typography,
  IconButton,
} from "@mui/material";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import {
  Alert as AntAlert,
  Badge as AntBadge,
  Checkbox as AntCheckbox,
  Button as AntButton,
  Collapse as AntCollapse,
  ConfigProvider as AntConfigProvider,
  DatePicker as AntDatePicker,
  Descriptions as AntDescriptions,
  Divider as AntDivider,
  Empty as AntEmpty,
  Input as AntInput,
  InputNumber as AntInputNumber,
  Progress as AntProgress,
  Radio as AntRadio,
  Select as AntSelect,
  Segmented as AntSegmented,
  Slider as AntSlider,
  Popover as AntPopover,
  Statistic as AntStatistic,
  Steps as AntSteps,
  Switch as AntSwitch,
  Table as AntTable,
  Tag as AntTag,
  Tabs as AntTabs,
  Timeline as AntTimeline,
  Tooltip as AntTooltip,
} from "antd";
import type { ThemeConfig as AntThemeConfig } from "antd";
import {
  Accordion as RbAccordion,
  Alert as RbAlert,
  Badge as RbBadge,
  Breadcrumb as RbBreadcrumb,
  Button as RbButton,
  ButtonToolbar as RbButtonToolbar,
  Card as RbCard,
  CloseButton as RbCloseButton,
  Dropdown as RbDropdown,
  FloatingLabel as RbFloatingLabel,
  Form as RbForm,
  InputGroup as RbInputGroup,
  ListGroup as RbListGroup,
  Nav as RbNav,
  Placeholder as RbPlaceholder,
  Pagination as RbPagination,
  ProgressBar as RbProgressBar,
  Tab as RbTab,
  Table as RbTable,
  Tabs as RbTabs,
  Figure as RbFigure,
  Toast as RbToast,
  ToastContainer as RbToastContainer,
} from "react-bootstrap";

type ThemeMode = "default" | "crt" | "c64" | "msdos";

function AsciiSpinner({ label = "loading" }: { label?: string }) {
  const frames = ["/", "-", "\\", "|"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % frames.length);
    }, 90);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="ascii-spinner" aria-label={label} title={label}>
      {frames[index]}
    </span>
  );
}

function App() {
  const [editMode, setEditMode] = useState(false);
  const [transparentChildren, setTransparentChildren] = useState(true);
  const [theme, setTheme] = useState<ThemeMode>("c64");
  const [textAnimation, setTextAnimation] = useState(true);
  const [muiTab, setMuiTab] = useState(0);
  const [muiPage, setMuiPage] = useState(2);
  const [muiRating, setMuiRating] = useState<number | null>(3);
  const [muiSlider, setMuiSlider] = useState<number>(40);
  const [muiSelect, setMuiSelect] = useState("beta");
  const [muiAutoValue, setMuiAutoValue] = useState("Gamma");
  const [muiRadio, setMuiRadio] = useState("alpha");
  const [muiToggle, setMuiToggle] = useState("one");
  const [muiSnackOpen, setMuiSnackOpen] = useState(false);
  const [headlessEnabled, setHeadlessEnabled] = useState(true);
  const [headlessListboxValue, setHeadlessListboxValue] = useState("starter");
  const [headlessSelectValue, setHeadlessSelectValue] = useState("Alpha");
  const [headlessPlanValue, setHeadlessPlanValue] = useState("pro");
  const [headlessCommand, setHeadlessCommand] = useState("deploy");
  const [headlessFlag, setHeadlessFlag] = useState(true);
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

  useEffect(() => {
    const themeClasses = ["theme-default", "theme-crt", "theme-c64", "theme-msdos"];
    document.body.classList.remove(...themeClasses);
    document.body.classList.add(`theme-${theme}`);

    return () => {
      document.body.classList.remove(...themeClasses);
    };
  }, [theme]);

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
                <MuiAlertTitle>Success</MuiAlertTitle>
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
                <MuiBadge badgeContent={4} color="primary">
                  <Avatar sx={{ width: 26, height: 26 }}>M</Avatar>
                </MuiBadge>
              </div>
              <ButtonGroup size="small" variant="outlined">
                <Button>MUI One</Button>
                <Button>Two</Button>
                <Button>Three</Button>
              </ButtonGroup>
              <Stack direction="row" spacing={1}>
                <IconButton size="small" aria-label="refresh">
                  R
                </IconButton>
                <IconButton size="small" aria-label="settings">
                  S
                </IconButton>
              </Stack>
              <MuiTooltip title="MUI tooltip preview">
                <Button size="small" variant="outlined">
                  Hover tooltip
                </Button>
              </MuiTooltip>
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
                renderInput={(params) => (
                  <TextField {...params} placeholder="MUI autocomplete" />
                )}
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
              <MuiDivider />
              <AsciiSpinner label="mui loading" />
              <Stepper activeStep={1} alternativeLabel>
                <Step>
                  <StepLabel>Collect</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Validate</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Publish</StepLabel>
                </Step>
              </Stepper>
              <MuiPagination
                page={muiPage}
                count={5}
                onChange={(_, value) => setMuiPage(value)}
                size="small"
              />
              <MuiBreadcrumbs aria-label="mui breadcrumb">
                <MuiLink underline="hover" href="#">
                  Home
                </MuiLink>
                <MuiLink underline="hover" href="#">
                  MUI
                </MuiLink>
                <Typography color="text.primary">Status</Typography>
              </MuiBreadcrumbs>
              <MuiSkeleton variant="text" width="80%" />
              <MuiSkeleton variant="rectangular" height={18} />
              <MuiList dense>
                <MuiListItem>
                  <MuiListItemText primary="MUI list item alpha" secondary="secondary text" />
                </MuiListItem>
                <MuiListItem>
                  <MuiListItemText primary="MUI list item beta" />
                </MuiListItem>
              </MuiList>
              <MuiTableContainer>
                <MuiTable size="small">
                  <MuiTableHead>
                    <MuiTableRow>
                      <MuiTableCell>Metric</MuiTableCell>
                      <MuiTableCell>Status</MuiTableCell>
                      <MuiTableCell align="right">Value</MuiTableCell>
                    </MuiTableRow>
                  </MuiTableHead>
                  <MuiTableBody>
                    <MuiTableRow>
                      <MuiTableCell>Throughput</MuiTableCell>
                      <MuiTableCell>Stable</MuiTableCell>
                      <MuiTableCell align="right">128/s</MuiTableCell>
                    </MuiTableRow>
                    <MuiTableRow>
                      <MuiTableCell>Errors</MuiTableCell>
                      <MuiTableCell>Low</MuiTableCell>
                      <MuiTableCell align="right">0.2%</MuiTableCell>
                    </MuiTableRow>
                  </MuiTableBody>
                </MuiTable>
              </MuiTableContainer>
              <MuiCard variant="outlined">
                <MuiCardContent>
                  <Typography variant="subtitle2">MUI card block</Typography>
                  <Typography variant="body2">
                    Card/content/actions to validate nested theming and borders.
                  </Typography>
                </MuiCardContent>
                <MuiCardActions>
                  <Button size="small" onClick={() => setMuiSnackOpen(true)}>
                    Open Snackbar
                  </Button>
                </MuiCardActions>
              </MuiCard>
              <Snackbar
                open={muiSnackOpen}
                autoHideDuration={2200}
                onClose={() => setMuiSnackOpen(false)}
                message="MUI snackbar sample"
              />
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
                  <AntTooltip title="Ant tooltip sample">
                    <AntBadge count={5}>
                      <AntButton>Badge</AntButton>
                    </AntBadge>
                  </AntTooltip>
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
                <AntSteps
                  size="small"
                  current={1}
                  items={[
                    { title: "Prepare" },
                    { title: "Style" },
                    { title: "Verify" },
                  ]}
                />
                <AntPopover content="Ant popover sample" trigger="click">
                  <AntButton>Open Popover</AntButton>
                </AntPopover>
                <div className="lib-row">
                  <AntStatistic title="Ant stat" value={1128} />
                  <AntEmpty description="No records" image={AntEmpty.PRESENTED_IMAGE_SIMPLE} />
                </div>
                <AntDivider style={{ margin: "8px 0" }} />
                <AntProgress percent={72} />
                <AntDatePicker
                  getPopupContainer={(trigger) => trigger.parentElement ?? trigger}
                />
                <AntCollapse
                  items={[
                    {
                      key: "ant-collapse-1",
                      label: "Ant collapse panel",
                      children: "Collapsible Ant Design panel content.",
                    },
                  ]}
                />
                <AntDescriptions
                  size="small"
                  column={1}
                  items={[
                    { key: "d1", label: "Host", children: "Node-01" },
                    { key: "d2", label: "Region", children: "eu-north" },
                  ]}
                />
                <AntTable
                  size="small"
                  pagination={false}
                  rowKey="name"
                  columns={[
                    { title: "Name", dataIndex: "name", key: "name" },
                    { title: "State", dataIndex: "state", key: "state" },
                    { title: "Score", dataIndex: "score", key: "score" },
                  ]}
                  dataSource={[
                    { name: "Widget A", state: "Ready", score: 88 },
                    { name: "Widget B", state: "Review", score: 73 },
                  ]}
                />
                <AntTimeline
                  items={[
                    { content: "Create project structure" },
                    { content: "Apply theme overrides" },
                    { content: "Run compatibility checks" },
                  ]}
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
              <RbButtonToolbar className="mb-2">
                <RbButton variant="outline-light" size="sm">
                  Tool A
                </RbButton>
                <RbButton variant="outline-light" size="sm">
                  Tool B
                </RbButton>
              </RbButtonToolbar>
              <RbForm.Group className="mb-2">
                <RbForm.Label>RB input</RbForm.Label>
                <RbForm.Control placeholder="Type with Bootstrap control" />
              </RbForm.Group>
              <RbFloatingLabel label="RB floating label" className="mb-2">
                <RbForm.Control placeholder="floating label input" />
              </RbFloatingLabel>
              <RbInputGroup size="sm" className="mb-2">
                <RbInputGroup.Text>@</RbInputGroup.Text>
                <RbForm.Control placeholder="RB input group" />
              </RbInputGroup>
              <RbPlaceholder as="div" animation="glow">
                <RbPlaceholder xs={6} />
              </RbPlaceholder>
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
              <div className="lib-row">
                <AsciiSpinner label="rb loading one" />
                <AsciiSpinner label="rb loading two" />
              </div>
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
              <RbTable size="sm" bordered>
                <thead>
                  <tr>
                    <th>Entry</th>
                    <th>Type</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Alpha</td>
                    <td>Core</td>
                    <td>14</td>
                  </tr>
                  <tr>
                    <td>Beta</td>
                    <td>Addon</td>
                    <td>6</td>
                  </tr>
                </tbody>
              </RbTable>
              <RbPagination size="sm">
                <RbPagination.Prev />
                <RbPagination.Item active>{1}</RbPagination.Item>
                <RbPagination.Item>{2}</RbPagination.Item>
                <RbPagination.Next />
              </RbPagination>
              <RbBreadcrumb>
                <RbBreadcrumb.Item href="#">Home</RbBreadcrumb.Item>
                <RbBreadcrumb.Item href="#">Library</RbBreadcrumb.Item>
                <RbBreadcrumb.Item active>Bootstrap</RbBreadcrumb.Item>
              </RbBreadcrumb>
              <RbTabs defaultActiveKey="rb-home" className="mb-2">
                <RbTab eventKey="rb-home" title="Home">
                  Bootstrap tab home content.
                </RbTab>
                <RbTab eventKey="rb-profile" title="Profile">
                  Bootstrap tab profile content.
                </RbTab>
              </RbTabs>
              <RbNav variant="tabs" defaultActiveKey="#home">
                <RbNav.Item>
                  <RbNav.Link href="#home">RB Home</RbNav.Link>
                </RbNav.Item>
                <RbNav.Item>
                  <RbNav.Link href="#profile">RB Profile</RbNav.Link>
                </RbNav.Item>
              </RbNav>
              <RbToastContainer position="top-end" className="position-static">
                <RbToast show>
                  <RbToast.Header closeButton={false}>
                    <strong className="me-auto">RB Toast</strong>
                  </RbToast.Header>
                  <RbToast.Body>Toast component style check.</RbToast.Body>
                </RbToast>
              </RbToastContainer>
              <RbCloseButton />
              <RbFigure>
                <RbFigure.Image
                  width={120}
                  height={80}
                  alt="RB figure preview"
                  src={heroImage}
                />
                <RbFigure.Caption>RB figure/caption style check.</RbFigure.Caption>
              </RbFigure>
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
                <HeadlessMenuButton className="headless-btn">Menu</HeadlessMenuButton>
                <HeadlessMenuItems className="headless-menu-items">
                  <HeadlessMenuItem as="button" type="button">
                    Edit
                  </HeadlessMenuItem>
                  <HeadlessMenuItem as="button" type="button">
                    Duplicate
                  </HeadlessMenuItem>
                  <HeadlessMenuItem as="button" type="button">
                    Archive
                  </HeadlessMenuItem>
                  <HeadlessMenuItem as="button" type="button">
                    Delete
                  </HeadlessMenuItem>
                </HeadlessMenuItems>
              </Menu>
              <HeadlessPopover className="headless-menu">
                <HeadlessPopoverButton className="headless-btn">
                  Popover
                </HeadlessPopoverButton>
                <HeadlessPopoverPanel anchor="bottom" className="headless-panel">
                  Headless popover panel content.
                </HeadlessPopoverPanel>
              </HeadlessPopover>
              <HeadlessSwitchGroup as="div" className="headless-switch-row">
                <HeadlessSwitchLabel>Headless switch</HeadlessSwitchLabel>
                <HeadlessSwitch
                  checked={headlessEnabled}
                  onChange={setHeadlessEnabled}
                  className={`headless-switch ${headlessEnabled ? "on" : "off"}`}
                >
                  <span className="sr-only">Enable headless switch</span>
                  <span aria-hidden="true" className="headless-switch-thumb" />
                </HeadlessSwitch>
                <HeadlessSwitchDescription>Toggle state preview</HeadlessSwitchDescription>
              </HeadlessSwitchGroup>
              <div className="headless-picker">
                <span>Headless listbox</span>
                <HeadlessListbox
                  as="div"
                  className="headless-listbox-root"
                  value={headlessListboxValue}
                  onChange={setHeadlessListboxValue}
                >
                  <HeadlessListbox.Button className="headless-btn">
                    {headlessListboxValue}
                  </HeadlessListbox.Button>
                  <HeadlessListbox.Options modal={false} className="headless-menu-items">
                    <HeadlessListbox.Option value="starter">starter</HeadlessListbox.Option>
                    <HeadlessListbox.Option value="business">business</HeadlessListbox.Option>
                    <HeadlessListbox.Option value="enterprise">enterprise</HeadlessListbox.Option>
                  </HeadlessListbox.Options>
                </HeadlessListbox>
              </div>
              <HeadlessRadioGroup
                value={headlessPlanValue}
                onChange={setHeadlessPlanValue}
                className="headless-radio-group"
              >
                <HeadlessRadioGroup.Label>Headless radio group</HeadlessRadioGroup.Label>
                <div className="lib-row">
                  {["basic", "pro", "max"].map((plan) => (
                    <HeadlessRadioGroup.Option key={plan} value={plan} className="headless-btn">
                      {plan}
                    </HeadlessRadioGroup.Option>
                  ))}
                </div>
              </HeadlessRadioGroup>
              <HeadlessField className="headless-field">
                <HeadlessLabel className="headless-label">Headless checkbox</HeadlessLabel>
                <HeadlessCheckbox
                  checked={headlessFlag}
                  onChange={setHeadlessFlag}
                  className="headless-btn headless-checkbox"
                >
                  {headlessFlag ? "enabled" : "disabled"}
                </HeadlessCheckbox>
              </HeadlessField>
              <div className="headless-picker">
                <span>Headless combobox</span>
                <HeadlessCombobox
                  as="div"
                  className="headless-combobox-root"
                  value={headlessCommand}
                  onChange={(value) => setHeadlessCommand(value ?? "deploy")}
                >
                  <div className="headless-combobox">
                    <HeadlessComboboxInput
                      className="headless-btn"
                      aria-label="Command"
                      displayValue={(value: string) => value}
                    />
                    <HeadlessComboboxButton
                      className="headless-combobox-toggle"
                      aria-label="Toggle command list"
                    >
                      v
                    </HeadlessComboboxButton>
                  </div>
                  <HeadlessComboboxOptions modal={false} className="headless-combobox-options">
                    <HeadlessComboboxOption value="deploy">deploy</HeadlessComboboxOption>
                    <HeadlessComboboxOption value="rollback">rollback</HeadlessComboboxOption>
                    <HeadlessComboboxOption value="restart">restart</HeadlessComboboxOption>
                  </HeadlessComboboxOptions>
                </HeadlessCombobox>
                <small>Type or pick a command.</small>
              </div>
              <HeadlessField className="headless-field">
                <HeadlessLabel className="headless-label">Headless select</HeadlessLabel>
                <HeadlessListbox
                  as="div"
                  className="headless-listbox-root"
                  value={headlessSelectValue}
                  onChange={setHeadlessSelectValue}
                >
                  <HeadlessListbox.Button className="headless-btn">
                    {headlessSelectValue}
                  </HeadlessListbox.Button>
                  <HeadlessListbox.Options modal={false} className="headless-menu-items">
                    <HeadlessListbox.Option value="Alpha">Alpha</HeadlessListbox.Option>
                    <HeadlessListbox.Option value="Beta">Beta</HeadlessListbox.Option>
                    <HeadlessListbox.Option value="Gamma">Gamma</HeadlessListbox.Option>
                  </HeadlessListbox.Options>
                </HeadlessListbox>
              </HeadlessField>
              <HeadlessField className="headless-field">
                <HeadlessLabel className="headless-label">Headless text input</HeadlessLabel>
                <HeadlessInput className="headless-btn" defaultValue="headless input" />
              </HeadlessField>
              <HeadlessField className="headless-field">
                <HeadlessLabel className="headless-label">Headless textarea</HeadlessLabel>
                <HeadlessTextarea className="headless-btn" defaultValue="headless notes" />
              </HeadlessField>
              <HeadlessFieldset className="headless-field">
                <HeadlessLegend className="headless-label">Headless fieldset</HeadlessLegend>
                <HeadlessField className="headless-field">
                  <HeadlessLabel className="headless-label">Alias</HeadlessLabel>
                  <HeadlessInput className="headless-btn" defaultValue="retro-user" />
                </HeadlessField>
              </HeadlessFieldset>
              <HeadlessTabGroup>
                <HeadlessTabList className="lib-row">
                  {["Status", "Logs", "Usage"].map((label) => (
                    <HeadlessTab
                      key={label}
                      className={({ selected }) =>
                        `headless-btn ${selected ? "headless-btn-active" : ""}`
                      }
                    >
                      {label}
                    </HeadlessTab>
                  ))}
                </HeadlessTabList>
                <HeadlessTabPanels>
                  <HeadlessTabPanel className="headless-panel">
                    Status panel body.
                  </HeadlessTabPanel>
                  <HeadlessTabPanel className="headless-panel">
                    Logs panel body.
                  </HeadlessTabPanel>
                  <HeadlessTabPanel className="headless-panel">
                    Usage panel body.
                  </HeadlessTabPanel>
                </HeadlessTabPanels>
              </HeadlessTabGroup>
            </section>
          </section>
        </section>
      </StyleInjector>
    </main>
  );
}

export default App;
