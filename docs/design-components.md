# FitTrack - Component Design Documentation

## Table of Contents
1. [Sidebar](#sidebar)
2. [Header](#header)
3. [Theme Toggle](#theme-toggle)
4. [Search Modal](#search-modal)
5. [Notification Dropdown](#notification-dropdown)
6. [Help Dropdown](#help-dropdown)
7. [User Profile Dropdown](#user-profile-dropdown)
8. [Filter Dropdown](#filter-dropdown)
9. [Date Picker](#date-picker)
10. [Date Select](#date-select)
11. [Edit Menu](#edit-menu)
12. [Tooltip](#tooltip)
13. [Info Component](#info-component)
14. [Banner](#banner)
15. [Dashboard Cards](#dashboard-cards)
16. [Charts](#charts)

---

## Sidebar

**File**: `src/partials/Sidebar.jsx`

### Structure
```
Sidebar
├── Backdrop (mobile only, bg-gray-900/30)
├── Sidebar Container
│   ├── Header
│   │   ├── Close Button (mobile)
│   │   └── Logo (violet SVG, 32x32)
│   └── Links
│       ├── Pages Group
│       │   ├── Dashboard (expandable)
│       │   ├── E-Commerce (expandable)
│       │   ├── Community (expandable)
│       │   └── ... more links
│       └── More Groups
└── Footer (optional)
```

### Styling Details
- **Width**: `w-64` (256px) / `lg:w-20` collapsed / `sidebar-expanded:!w-64`
- **Height**: `h-[100dvh]`
- **Background**: `bg-white dark:bg-gray-800`
- **Padding**: `p-4`
- **Shadow**: `shadow-xs` (default) or `border-r border-gray-200 dark:border-gray-700/60` (v2)
- **Border Radius**: `rounded-r-2xl` (default)
- **Mobile**: `-translate-x-64` hidden, `translate-x-0` shown
- **Transition**: `transition-all duration-200 ease-in-out`

### SidebarLinkGroup
**File**: `src/partials/SidebarLinkGroup.jsx`
- **Background when active**: `bg-linear-to-r from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]`
- **Padding**: `pl-4 pr-3 py-2`
- **Border radius**: `rounded-lg`
- **Spacing**: `mb-0.5`

### Active Link Styles
- **Active**: `text-violet-500`
- **Inactive**: `text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200`
- **Icon active**: `text-violet-500`
- **Icon inactive**: `text-gray-400 dark:text-gray-500`

### Label Visibility
- Labels hide on collapsed sidebar: `lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200`

---

## Header

**File**: `src/partials/Header.jsx`

### Structure
```
Header (sticky, backdrop blur)
├── Left Side
│   └── Hamburger Button (mobile only)
└── Right Side
    ├── Search Button → Opens ModalSearch
    ├── Notifications → DropdownNotifications
    ├── Help → DropdownHelp
    ├── ThemeToggle
    ├── Divider (hr)
    └── User Menu → DropdownProfile
```

### Styling Details
- **Height**: `h-16` (64px)
- **Position**: `sticky top-0 z-30`
- **Backdrop**: `before:backdrop-blur-md` with `before:bg-white/90 dark:before:bg-gray-800/90`
- **Desktop backdrop**: `lg:before:bg-gray-100/90 dark:lg:before:bg-gray-900/90`
- **Border**: `lg:border-b border-gray-200 dark:border-gray-700/60`

### Hamburger Button
- **Icon**: 3 horizontal bars (SVG, 24x24)
- **Color**: `text-gray-500 hover:text-gray-600 dark:hover:text-gray-400`
- **Visibility**: `lg:hidden`

### Icon Buttons (Search, Notifications, Help, Theme)
- **Size**: `w-8 h-8`
- **Layout**: `flex items-center justify-center`
- **Hover**: `hover:bg-gray-100 lg:hover:bg-gray-200 dark:hover:bg-gray-700/50`
- **Border radius**: `rounded-full`
- **Icon color**: `fill-current text-gray-500/80 dark:text-gray-400/80`

---

## Theme Toggle

**File**: `src/components/ThemeToggle.jsx`

### How It Works
1. Uses `useThemeProvider()` hook from ThemeContext
2. Hidden checkbox input (`sr-only`)
3. Label with two SVG icons (sun for light, moon for dark)
4. Toggles via `dark:hidden` and `hidden dark:block` CSS

### Sun Icon (Light Mode)
- **SVG**: 16x16, shows sun with rays
- **Visibility**: `dark:hidden` (shown in light mode)

### Moon Icon (Dark Mode)
- **SVG**: 16x16, shows crescent moon
- **Visibility**: `hidden dark:block` (shown in dark mode)

### Label Styling
- `flex items-center justify-center cursor-pointer w-8 h-8`
- `hover:bg-gray-100 lg:hover:bg-gray-200`
- `dark:hover:bg-gray-700/50 dark:lg:hover:bg-gray-800`
- `rounded-full`

### Theme Context (`utils/ThemeContext.jsx`)
- **Default**: Light mode (or persisted from localStorage)
- **Dark detection**: `localStorage.theme === 'dark'` or no preference
- **Toggle method**: `changeCurrentTheme()`
- **Effect**: Adds/removes `.dark` class on `<html>`, sets `colorScheme`
- **Transition prevention**: Adds `**:transition-none!` briefly during switch

---

## Search Modal

**File**: `src/components/ModalSearch.jsx`

### Structure
```
Modal
├── Backdrop (bg-gray-900/30 z-50)
└── Dialog
    ├── Search Form (input + icon button)
    ├── Recent Searches (list)
    └── Recent Pages (list)
```

### Styling
- **Container**: `max-w-2xl w-full max-h-full rounded-lg shadow-lg`
- **Background**: `bg-white dark:bg-gray-800`
- **Border**: `border border-transparent dark:border-gray-700/60`
- **Position**: `fixed inset-0 z-50 top-20 justify-center`
- **Input**: Full width, no border, `placeholder-gray-400 dark:placeholder-gray-500`

### Animations
- **Backdrop**: Fade in/out
- **Dialog**: Slide up (`translate-y-4` to `translate-y-0`)

---

## Notification Dropdown

**File**: `src/components/DropdownNotifications.jsx`

### Trigger Button
- **Icon**: Chat/bell SVG (16x16)
- **Red dot**: `absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-gray-100 dark:border-gray-900 rounded-full`

### Dropdown Panel
- **Width**: `min-w-80`
- **Position**: `absolute top-full right-0`
- **Background**: `bg-white dark:bg-gray-800`
- **Border**: `border border-gray-200 dark:border-gray-700/60`
- **Padding**: `py-1.5`
- **Border radius**: `rounded-lg`
- **Shadow**: `shadow-lg`

### Notification Items
- **List items**: Border bottom `border-gray-200 dark:border-gray-700/60`
- **Link hover**: `hover:bg-gray-50 dark:hover:bg-gray-700/20`
- **Date**: `text-xs font-medium text-gray-400 dark:text-gray-500`

---

## Help Dropdown

**File**: `src/components/DropdownHelp.jsx`

### Trigger Button
- **Icon**: Question mark in circle (16x16)

### Menu Items
- **Icon + Label**: `text-violet-500 hover:text-violet-600 dark:hover:text-violet-400`
- **Links**: Documentation, Support Site, Contact Us
- **Icons**: Small SVGs (12x12) in `text-violet-500`

---

## User Profile Dropdown

**File**: `src/components/DropdownProfile.jsx`

### Trigger
- **Avatar**: `w-8 h-8 rounded-full` (user-avatar-32.png)
- **Name**: `text-sm font-medium text-gray-600 dark:text-gray-100`
- **Chevron**: Down arrow SVG (12x12)

### Dropdown Panel
- **User info header**: Name + role, border bottom
- **Menu items**: Settings, Sign Out
- **Link style**: `text-violet-500 hover:text-violet-600 dark:hover:text-violet-400`

---

## Filter Dropdown

**File**: `src/components/DropdownFilter.jsx`

### Trigger Button
- **Style**: `btn px-2.5 bg-white dark:bg-gray-800 border-gray-200`
- **Icon**: Filter SVG (16x16)

### Filter Panel
- **Width**: `min-w-56`
- **Checkboxes**: `.form-checkbox` with labels
- **Footer**: Clear (red) + Apply (dark) buttons
- **Clear button**: `text-red-500` with white/dark bg
- **Apply button**: `bg-gray-900 text-gray-100` or `dark:bg-gray-100 dark:text-gray-800`

---

## Date Picker

**File**: `src/components/Datepicker.jsx`

### Implementation
- Uses **Radix UI Popover** + **React Day Picker**
- Date range selection (from/to)
- Formats via `date-fns` (`LLL dd, y`)

### Trigger Button
- **Style**: `btn px-2.5 min-w-[15.5rem] bg-white dark:bg-gray-800`
- **Border**: `border-gray-200 dark:border-gray-700/60`
- **Icon**: Calendar SVG

### Calendar Panel
**File**: `src/components/ui/calendar.jsx`
- **Selected**: `bg-violet-500 text-white`
- **Today**: `bg-violet-500 text-white`
- **Range middle**: `bg-violet-500/70 text-white`
- **Outside days**: `text-gray-400 dark:text-gray-500`
- **Weekday headers**: `text-gray-400 dark:text-gray-500 font-medium`

---

## Date Select

**File**: `src/components/DateSelect.jsx`

### Options
- Today, Last 7 Days, Last Month, Last 12 Months, All Time

### Trigger Button
- **Style**: `btn justify-between min-w-44 bg-white dark:bg-gray-800`
- **Icon**: Calendar SVG (16x16)
- **Chevron**: Down arrow

### Dropdown Items
- **Selected**: `text-violet-500` with checkmark icon
- **Hover**: `hover:bg-gray-50 dark:hover:bg-gray-700/20`

---

## Edit Menu

**File**: `src/components/DropdownEditMenu.jsx`

### Trigger
- **Icon**: 3-dot horizontal menu (32x32)
- **Active state**: `bg-gray-100 dark:bg-gray-700/60 text-gray-500`
- **Inactive**: `text-gray-400 hover:text-gray-500`

### Panel
- **Width**: `min-w-36`
- Children are `<li>` elements with `<Link>` inside

---

## Tooltip

**File**: `src/components/Tooltip.jsx`

### Positions
| Position | Outer Classes | Inner Classes |
|----------|--------------|---------------|
| Top | `bottom-full left-1/2 -translate-x-1/2` | `mb-2` |
| Bottom | `top-full left-1/2 -translate-x-1/2` | `mt-2` |
| Left | `right-full top-1/2 -translate-y-1/2` | `mr-2` |
| Right | `left-full top-1/2 -translate-y-1/2` | `ml-2` |

### Sizes
| Size | Min Width | Padding |
|------|-----------|---------|
| sm | `min-w-44` | `px-3 py-2` |
| md | `min-w-56` | `px-3 py-2` |
| lg | `min-w-72` | `px-3 py-2` |

### Color Themes
- **Light**: `bg-white text-gray-600 border-gray-200`
- **Dark**: `bg-gray-800 text-gray-100 border-gray-700/60`
- **Default**: `bg-white dark:bg-gray-800 dark:text-gray-100`

---

## Info Component

**File**: `src/utils/Info.jsx`

- Small info icon button (i in circle, 16x16)
- Shows tooltip on hover/focus
- Position: `bottom-full left-1/2 -translate-x-1/2`
- Background: `bg-white border border-gray-200 p-3 rounded-sm shadow-lg`

---

## Banner

**File**: `src/partials/Banner.jsx`

- **Position**: `fixed bottom-0 right-0 w-full md:bottom-8 md:right-12 md:w-auto z-50`
- **Background**: `bg-gray-800 border border-transparent dark:border-gray-700/60`
- **Text**: `text-gray-50 text-sm p-3 md:rounded-sm shadow-lg`
- **Close button**: X icon on right side

---

## Dashboard Cards

### Card 01-03 (Product Sales)
- **Grid**: `col-span-full sm:col-span-6 xl:col-span-4`
- **Content**: Product name, sales value, percentage badge, sparkline chart
- **Chart**: LineChart01 (128px height)
- **Badge positive**: `text-green-700 bg-green-500/20 rounded-full`
- **Badge negative**: `text-red-700 bg-red-500/20 rounded-full`
- **Value**: `text-3xl font-bold text-gray-800 dark:text-gray-100`

### Card 04 (Direct vs Indirect)
- **Grid**: `col-span-full sm:col-span-6`
- **Chart**: BarChart01 (248px height)
- **Header**: `px-5 py-4 border-b border-gray-100 dark:border-gray-700/60`

### Card 05 (Real Time Value)
- **Grid**: `col-span-full sm:col-span-6`
- **Chart**: RealtimeChart (248px height)
- **Header**: Includes Tooltip component
- **Updates**: Every 2 seconds with fake data

### Card 06 (Top Countries)
- **Grid**: `col-span-full sm:col-span-6 xl:col-span-4`
- **Chart**: DoughnutChart (260px height)
- **Colors**: violet-500, sky-500, violet-800

### Card 07 (Top Channels Table)
- **Grid**: `col-span-full xl:col-span-8`
- **Table header**: `text-xs uppercase text-gray-400 bg-gray-50 dark:bg-gray-700/50`
- **Table body**: `divide-y divide-gray-100 dark:divide-gray-700/60`
- **Company logos**: SVG icons (36x36)

### Card 08 (Sales Over Time)
- **Grid**: `col-span-full sm:col-span-6`
- **Chart**: LineChart02 (248px height)
- **3 datasets**: Current (violet), Previous (sky), Average (green)

### Card 09 (Sales vs Refunds)
- **Grid**: `col-span-full sm:col-span-6`
- **Chart**: BarChart02 (stacked, 248px height)
- **Header**: Includes Tooltip (large size)

### Card 10 (Customers Table)
- **Grid**: `col-span-full xl:col-span-6`
- **Avatars**: `w-10 h-10 rounded-full` (user images)
- **Spent values**: `text-green-500`
- **Country flags**: Emoji flags

### Card 11 (Reasons for Refunds)
- **Grid**: `col-span-full sm:col-span-6`
- **Chart**: BarChart03 (horizontal stacked, 48px height)
- **5 categories** with different colors

### Card 12 (Recent Activity)
- **Grid**: `col-span-full xl:col-span-6`
- **Groups**: "Today" and "Yesterday"
- **Activity icons**: 36x36 circles with colored backgrounds
- **Colors**: violet-500, red-500, green-500, sky-500

### Card 13 (Income/Expenses)
- **Grid**: `col-span-full xl:col-span-6`
- **Arrow icons**: Red (expense), Green (income)
- **Amounts**: Positive in green, negative in dark

---

## Charts

### Chart.js Configuration (`charts/ChartjsConfig.jsx`)

#### Default Settings
- **Font**: Inter, weight 500
- **Tooltip**: `borderWidth: 1`, `displayColors: false`, `mode: 'nearest'`, `intersect: false`, `cornerRadius: 8`, `padding: 8`

#### Chart Colors (Theme-Aware)
```javascript
{
  textColor: { light: '--color-gray-400', dark: '--color-gray-500' },
  gridColor: { light: '--color-gray-100', dark: '--color-gray-700' (60% opacity) },
  backdropColor: { light: '--color-white', dark: '--color-gray-800' },
  tooltipTitleColor: { light: '--color-gray-800', dark: '--color-gray-100' },
  tooltipBodyColor: { light: '--color-gray-500', dark: '--color-gray-400' },
  tooltipBgColor: { light: '--color-white', dark: '--color-gray-700' },
  tooltipBorderColor: { light: '--color-gray-200', dark: '--color-gray-600' },
}
```

#### Gradient Helper
```javascript
chartAreaGradient(ctx, chartArea, [
  { stop: 0, color: 'transparent' },
  { stop: 1, color: 'violet-500 at 20% opacity' }
])
```

### Chart Types

| Component | Type | Datasets | Height | Legend |
|-----------|------|----------|--------|--------|
| LineChart01 | Line (filled) | 2 (violet + gray) | 128px | None |
| LineChart02 | Line (no fill) | 3 (violet, sky, green) | 248px | HTML legend |
| BarChart01 | Bar (grouped) | 2 (sky + violet) | 248px | HTML legend |
| BarChart02 | Bar (stacked) | 2 (violet + light violet) | 248px | None |
| BarChart03 | Bar (horizontal stacked) | 5 (various colors) | 48px | HTML legend |
| DoughnutChart | Doughnut (80% cutout) | 1 (3 segments) | 260px | HTML legend |
| RealtimeChart | Line (filled) | 1 (violet) | 248px | None |

### HTML Legend Pattern
- Custom Chart.js plugin with `id: 'htmlLegend'`
- Creates `<ul>` with `<li>` elements
- Each item: `<button>` with color box + label
- Toggle visibility on click
- Values formatted via `formatValue()` or `formatThousands()`
