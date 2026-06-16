# FitTrack - Layout, Utilities & Transitions Documentation

## Table of Contents
1. [Responsive Layout Patterns](#responsive-layout-patterns)
2. [Grid System Usage](#grid-system-usage)
3. [Utility Classes](#utility-classes)
4. [Transitions & Animations](#transitions--animations)
5. [State Management Patterns](#state-management-patterns)
6. [Utility Functions](#utility-functions)
7. [File Structure](#file-structure)
8. [CSS Architecture](#css-architecture)

---

## Responsive Layout Patterns

### Mobile-First Approach
All components use mobile-first responsive design with Tailwind breakpoints:

| Breakpoint | Width | Trigger |
|-----------|-------|---------|
| `xs` | 480px | **Custom** (defined in theme) |
| `sm` | 640px | Standard |
| `md` | 768px | Standard |
| `lg` | 1024px | Standard (sidebar collapse point) |
| `xl` | 1280px | Standard |
| `2xl` | 1536px | Standard (sidebar auto-expand) |

### Key Responsive Patterns

#### Sidebar Behavior
```
Mobile (< lg):    Hidden by default, slides in from left (overlay)
Desktop (lg):     Always visible, collapsed to w-20 (80px)
Desktop (2xl):    Auto-expanded to w-64 (256px)
```

#### Dashboard Grid
```
Mobile:           grid-cols-1 (stacked)
sm:               sm:col-span-6 (2 columns)
xl:               xl:col-span-4 (3 columns) or xl:col-span-8 (2/3 width)
```

#### Header
```
Mobile:           Hamburger + right icons
Desktop (lg):     No hamburger, bottom border
```

---

## Grid System Usage

### 12-Column Grid
The dashboard uses a 12-column grid system:

```css
grid grid-cols-12 gap-6
```

### Common Column Spans

| Pattern | Columns | Usage |
|---------|---------|-------|
| `col-span-full` | 12 | Full width (default) |
| `sm:col-span-6` | 6 | Half width on sm+ |
| `xl:col-span-4` | 4 | Third width on xl+ |
| `xl:col-span-6` | 6 | Half width on xl+ |
| `xl:col-span-8` | 8 | Two-thirds on xl+ |

### Dashboard Card Layout Examples

```
3 Product Cards (01-03):
┌──────────┬──────────┬──────────┐
│ col-4    │ col-4    │ col-4    │
└──────────┴──────────┴──────────┘

2 Bar Charts (04-05):
┌────────────────┬────────────────┐
│ col-6          │ col-6          │
└────────────────┴────────────────┘

Doughnut + Table:
┌──────────┬───────────────────────┐
│ col-4    │ col-8                 │
└──────────┴───────────────────────┘

Sales + Refunds:
┌────────────────┬────────────────┐
│ col-6          │ col-6          │
└────────────────┴────────────────┘

Customers + Activity:
┌────────────────┬────────────────┐
│ col-6          │ col-6          │
└────────────────┴────────────────┘
```

---

## Utility Classes

### Button Utility Classes

| Class | Padding | Font | Border | Shadow | Radius |
|-------|---------|------|--------|--------|--------|
| `.btn` | `px-3 py-2` | `font-medium text-sm` | `border border-transparent` | `shadow-xs` | `rounded-lg` |
| `.btn-lg` | `px-4 py-3` | same | same | same | same |
| `.btn-sm` | `px-2 py-1` | same | same | same | same |
| `.btn-xs` | `px-2 py-0.5` | same | same | same | same |

**Common button color patterns:**
```html
<!-- Primary dark -->
btn bg-gray-900 text-gray-100 hover:bg-gray-800
dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white

<!-- Secondary white -->
btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60
hover:border-gray-300 dark:hover:border-gray-600

<!-- Danger -->
btn-xs text-red-500 bg-white dark:bg-gray-800
border-gray-200 dark:border-gray-700/60 hover:border-gray-300
```

### Form Element Classes

| Class | Background | Border | Focus | Radius |
|-------|-----------|--------|-------|--------|
| `.form-input` | `bg-white dark:bg-gray-900/30` | `border-gray-200 dark:border-gray-700/60` | `focus:border-gray-300 dark:focus:border-gray-600` | `rounded-lg` |
| `.form-textarea` | same | same | same | same |
| `.form-select` | same | same | same (+ `pr-10`) | same |
| `.form-checkbox` | `text-violet-500` | `border-gray-300 dark:border-gray-700/60` | `focus-visible:ring-2 focus-visible:ring-violet-500/50` | `rounded-sm` |
| `.form-radio` | same | same | same | - |

**Form switch structure:**
```html
<div class="form-switch"> <!-- width: 44px -->
  <input type="checkbox" id="switch" />
  <label for="switch"> <!-- h-6 rounded-full -->
    <span></span> <!-- 20px knob -->
  </label>
</div>
```
- **Off state**: `bg-gray-400 dark:bg-gray-700`
- **On state**: `bg-violet-500`
- **Disabled**: `bg-gray-100 dark:bg-gray-700/20`

### Scrollbar Hiding
```css
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```
Applied on sidebar: `no-scrollbar` class to hide scrollbar.

---

## Transitions & Animations

### Transition Component
**File**: `src/utils/Transition.jsx`

Custom wrapper around `react-transition-group` with Tailwind-friendly API:

```jsx
<Transition
  show={isOpen}
  enter="transition ease-out duration-200 transform"
  enterStart="opacity-0 -translate-y-2"
  enterEnd="opacity-100 translate-y-0"
  leave="transition ease-out duration-200"
  leaveStart="opacity-100"
  leaveEnd="opacity-0"
>
  {children}
</Transition>
```

### Common Transition Patterns

#### Dropdown Open
```
Enter: transition ease-out duration-200 transform
EnterStart: opacity-0 -translate-y-2
EnterEnd: opacity-100 translate-y-0
Leave: transition ease-out duration-200
LeaveStart: opacity-100
LeaveEnd: opacity-0
```

#### Modal Open
```
Enter: transition ease-in-out duration-200
EnterStart: opacity-0 translate-y-4
EnterEnd: opacity-100 translate-y-0
Leave: transition ease-in-out duration-200
LeaveStart: opacity-100 translate-y-0
LeaveEnd: opacity-0 translate-y-4
```

#### Backdrop Fade
```
Enter: transition ease-out duration-200
EnterStart: opacity-0
EnterEnd: opacity-100
Leave: transition ease-out duration-100
LeaveStart: opacity-100
LeaveEnd: opacity-0
```

### Theme Switch Transition
- Briefly adds `**:transition-none!` to `<html>` to prevent flash
- Removed after 1ms timeout

### Sidebar Transitions
- **Slide**: `transition-all duration-200 ease-in-out`
- **Backdrop opacity**: `transition-opacity duration-200`

---

## State Management Patterns

### localStorage Persistence
The theme uses `localStorage` for:

| Key | Value | Used By |
|-----|-------|---------|
| `theme` | `'light'` or `'dark'` | ThemeContext |
| `sidebar-expanded` | `'true'` or `'false'` | Sidebar |

### Pattern Examples

#### Theme (Context-based)
```jsx
// ThemeContext.jsx
const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
const changeCurrentTheme = (newTheme) => {
  setTheme(newTheme);
  localStorage.setItem('theme', newTheme);
};
```

#### Sidebar (State-based)
```jsx
// Sidebar.jsx
const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
const [sidebarExpanded, setSidebarExpanded] = useState(
  storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
);

useEffect(() => {
  localStorage.setItem("sidebar-expanded", sidebarExpanded);
  document.querySelector("body").classList.toggle("sidebar-expanded", sidebarExpanded);
}, [sidebarExpanded]);
```

### Dropdown State Pattern
All dropdowns follow the same pattern:
1. `useState(false)` for open/close
2. `useRef` for trigger and dropdown elements
3. Click-outside listener via `document.addEventListener('click')`
4. ESC key listener via `document.addEventListener('keydown')`
5. Both listeners cleaned up on unmount

```jsx
const [dropdownOpen, setDropdownOpen] = useState(false);
const trigger = useRef(null);
const dropdown = useRef(null);

// Close on click outside
useEffect(() => {
  const clickHandler = ({ target }) => {
    if (!dropdown.current) return;
    if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
    setDropdownOpen(false);
  };
  document.addEventListener('click', clickHandler);
  return () => document.removeEventListener('click', clickHandler);
});

// Close on ESC
useEffect(() => {
  const keyHandler = ({ keyCode }) => {
    if (!dropdownOpen || keyCode !== 27) return;
    setDropdownOpen(false);
  };
  document.addEventListener('keydown', keyHandler);
  return () => document.removeEventListener('keydown', keyHandler);
});
```

---

## Utility Functions

### File: `src/utils/Utils.js`

#### `formatValue(value)`
Formats numbers as compact USD currency.
```js
formatValue(24780) → "$24.8K"
```
Uses `Intl.NumberFormat` with `style: 'currency'`, `currency: 'USD'`, `notation: 'compact'`.

#### `formatThousands(value)`
Formats numbers in compact notation without currency.
```js
formatThousands(1500) → "1.5K"
```

#### `getCssVariable(variable)`
Reads a CSS custom property from `:root`.
```js
getCssVariable('--color-violet-500') → "#8470ff"
```

#### `adjustColorOpacity(color, opacity)`
Adds alpha to hex, hsl, or oklch colors.
```js
adjustColorOpacity('#8470ff', 0.2) → "rgba(132, 112, 255, 0.2)"
```

#### `oklchToRGBA(oklchColor)`
Converts oklch color to rgba using DOM element trick.

### File: `src/lib/utils.ts`

#### `cn(...inputs)`
Merges Tailwind classes using `clsx` + `tailwind-merge`.
```js
cn('px-4 py-2', 'px-6') → 'px-6 py-2'  // last wins
cn('text-red-500', undefined, 'font-bold') → 'text-red-500 font-bold'
```

#### `formatDate(input)`
Formats date as "Month Day, Year".
```js
formatDate('2024-01-15') → "January 15, 2024"
```

#### `absoluteUrl(path)`
Constructs full URL from base path + env variable.

---

## File Structure

```
client/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/             # Static assets
│   ├── charts/             # Chart.js components & config
│   │   ├── BarChart01.jsx  # Grouped bar chart
│   │   ├── BarChart02.jsx  # Stacked bar chart
│   │   ├── BarChart03.jsx  # Horizontal stacked bar
│   │   ├── ChartjsConfig.jsx # Global Chart.js settings
│   │   ├── DoughnutChart.jsx  # Doughnut chart
│   │   ├── LineChart01.jsx    # Sparkline (no axes)
│   │   ├── LineChart02.jsx    # Full line chart with axes
│   │   └── RealtimeChart.jsx  # Real-time updating chart
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Primitives (calendar, popover)
│   │   ├── Datepicker.jsx  # Date range picker
│   │   ├── DateSelect.jsx  # Date period selector
│   │   ├── DropdownEditMenu.jsx
│   │   ├── DropdownFilter.jsx
│   │   ├── DropdownHelp.jsx
│   │   ├── DropdownNotifications.jsx
│   │   ├── DropdownProfile.jsx
│   │   ├── ModalSearch.jsx
│   │   ├── ThemeToggle.jsx
│   │   └── Tooltip.jsx
│   ├── css/                # Global styles
│   │   ├── additional-styles/
│   │   │   └── utility-patterns.css  # .btn, .form-*, .h1-.h4
│   │   └── style.css       # Main Tailwind config + theme tokens
│   ├── images/             # Image assets (avatars, icons)
│   ├── lib/                # Utility functions
│   │   └── utils.ts        # cn(), formatDate(), absoluteUrl()
│   ├── pages/              # Page components
│   │   └── Dashboard.jsx   # Main dashboard page
│   ├── partials/           # Layout partials
│   │   ├── dashboard/      # Dashboard card components (01-13)
│   │   ├── Banner.jsx
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── SidebarLinkGroup.jsx
│   ├── utils/              # App utilities
│   │   ├── Info.jsx        # Info tooltip component
│   │   ├── ThemeContext.jsx # Theme provider & hook
│   │   ├── Transition.jsx  # CSS transition wrapper
│   │   └── Utils.js        # Formatting & color utilities
│   ├── App.jsx             # Root component with routes
│   └── main.jsx            # App entry point
├── index.html              # HTML with dark mode script
├── postcss.config.cjs      # PostCSS config (Tailwind v4)
├── vite.config.js          # Vite config
└── package.json            # Dependencies
```

---

## CSS Architecture

### File: `src/css/style.css`

#### Structure
```css
/* 1. Font import */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=fallback');

/* 2. Tailwind base */
@import 'tailwindcss';

/* 3. Custom utility patterns */
@import './additional-styles/utility-patterns.css' layer(components);

/* 4. Tailwind forms plugin */
@plugin "@tailwindcss/forms" { strategy: base; }

/* 5. Custom variants */
@custom-variant dark (&:is(.dark *));
@custom-variant sidebar-expanded (&:is(.sidebar-expanded *));

/* 6. Theme tokens */
@theme {
  --shadow-sm: ...;
  --color-gray-*: ...;
  --color-violet-*: ...;
  --color-sky-*: ...;
  --color-green-*: ...;
  --color-red-*: ...;
  --color-yellow-*: ...;
  --font-inter: ...;
  --text-*: ...;
  --breakpoint-xs: 480px;
}

/* 7. Base layer overrides */
@layer base {
  *, ::after, ::before, ::backdrop, ::file-selector-button {
    border-color: var(--color-gray-200, currentColor);
  }
}
```

### Key CSS Patterns

#### Custom Dark Mode Variant
```css
@custom-variant dark (&:is(.dark *));
```
This means any element with `.dark` ancestor gets dark styles. Applied on `<html>`.

#### Sidebar Expanded Variant
```css
@custom-variant sidebar-expanded (&:is(.sidebar-expanded *));
```
Used for responsive label visibility in collapsed sidebar.

#### Border Color Compatibility
```css
@layer base {
  * { border-color: var(--color-gray-200, currentColor); }
}
```
Ensures consistent border colors across Tailwind v3→v4 migration.

### Tailwind v4 Features Used
- `@theme` block for design tokens
- `@custom-variant` for custom responsive variants
- `@plugin` for Tailwind plugins
- CSS-first configuration (no `tailwind.config.js` needed)
- `**:transition-none!` utility (important + arbitrary variant)
