# FitTrack - Design System Documentation

## Table of Contents
1. [Overview](#overview)
2. [Typography](#typography)
3. [Color Palette](#color-palette)
4. [Dark Mode System](#dark-mode-system)
5. [Layout Architecture](#layout-architecture)
6. [Spacing & Breakpoints](#spacing--breakpoints)
7. [Shadows & Borders](#shadows--borders)
8. [Components Overview](#components-overview)

---

## Overview

FitTrack uses the **Mosaic Tailwind Dashboard Template** as its base design system. It is built with **Tailwind CSS v4** using the new `@theme` directive for custom design tokens. The system supports both **light and dark modes** with automatic detection via `localStorage`.

### Tech Stack
- **Framework**: React 19 + Vite 6
- **CSS**: Tailwind CSS v4 + PostCSS
- **Routing**: React Router DOM v7
- **Charts**: Chart.js v4 + Moment.js adapter
- **UI Primitives**: Radix UI (Popover)
- **Animations**: react-transition-group
- **Utilities**: clsx, tailwind-merge, date-fns

---

## Typography

### Font Family
- **Primary Font**: `Inter` (Google Fonts)
- **Fallback**: `sans-serif`
- **Import**: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=fallback`
- **CSS Variable**: `--font-inter: "Inter", "sans-serif"`
- **Body class**: `font-inter` (applied on `<body>`)
- **Font Weights**: 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)

### Font Sizes (Custom Tailwind Theme)

| Token    | Size     | Line Height | Letter Spacing | Usage                    |
|----------|----------|-------------|----------------|--------------------------|
| `xs`     | 0.75rem  | 1.5         | default        | Small labels, captions   |
| `sm`     | 0.875rem | 1.5715      | default        | Secondary text, form text |
| `base`   | 1rem     | 1.5         | -0.01em        | Body text default        |
| `lg`     | 1.125rem | 1.5         | -0.01em        | Slightly larger body     |
| `xl`     | 1.25rem  | 1.5         | -0.01em        | Section sub-headers      |
| `2xl`    | 1.5rem   | 1.33        | -0.01em        | Page section headers     |
| `3xl`    | 1.88rem  | 1.33        | -0.01em        | Dashboard card titles    |
| `4xl`    | 2.25rem  | 1.25        | -0.02em        | Page titles (mobile)     |
| `5xl`    | 3rem     | 1.25        | -0.02em        | Page titles (desktop)    |
| `6xl`    | 3.75rem  | 1.2         | -0.02em        | Hero/Large headings      |

### Heading Utility Classes

| Class | Style | Responsive |
|-------|-------|-----------|
| `.h1` | `text-4xl font-extrabold tracking-tighter` | `md: text-5xl` |
| `.h2` | `text-3xl font-extrabold tracking-tighter` | `md: text-4xl` |
| `.h3` | `text-3xl font-extrabold` | - |
| `.h4` | `text-2xl font-extrabold tracking-tight` | - |

### Chart Typography
- **Font Family**: `"Inter", sans-serif`
- **Font Weight**: 500 (Medium)
- Set via `Chart.defaults.font.family` and `Chart.defaults.font.weight`

---

## Color Palette

### Gray Scale (Neutral)

| Token      | Hex Value | Light Mode Usage | Dark Mode Usage |
|-----------|-----------|-----------------|----------------|
| `gray-50`  | `#f9fafb` | Card backgrounds | - |
| `gray-100` | `#f3f4f6` | Page background, borders | - |
| `gray-200` | `#e5e7eb` | Borders, dividers | - |
| `gray-300` | `#bfc4cd` | Disabled text | - |
| `gray-400` | `#9ca3af` | Muted text, icons | Muted text |
| `gray-500` | `#6b7280` | Secondary text | Secondary text |
| `gray-600` | `#4b5563` | Body text | - |
| `gray-700` | `#374151` | - | Borders (60% opacity) |
| `gray-800` | `#1f2937` | - | Card backgrounds |
| `gray-900` | `#111827` | - | Page background |
| `gray-950` | `#030712` | - | Deep backgrounds |

### Primary - Violet

| Token        | Hex Value | Usage |
|-------------|-----------|-------|
| `violet-50`  | `#f1eeff` | Selected backgrounds |
| `violet-100` | `#e6e1ff` | Hover backgrounds |
| `violet-200` | `#d2cbff` | Light accents |
| `violet-300` | `#b7acff` | - |
| `violet-400` | `#9c8cff` | - |
| `violet-500` | `#8470ff` | **Primary actions, active states, links, sidebar active, logo fill** |
| `violet-600` | `#755ff8` | Hover state for primary |
| `violet-700` | `#5d47de` | - |
| `violet-800` | `#4634b1` | - |
| `violet-900` | `#2f227c` | - |
| `violet-950` | `#1c1357` | - |

### Accent - Sky Blue

| Token     | Hex Value | Usage |
|----------|-----------|-------|
| `sky-50`  | `#e3f3ff` | Light backgrounds |
| `sky-100` | `#d1ecff` | - |
| `sky-200` | `#b6e1ff` | - |
| `sky-300` | `#a0d7ff` | - |
| `sky-400` | `#7bc8ff` | - |
| `sky-500` | `#67bfff` | **Secondary accent, conversion rates, chart data** |
| `sky-600` | `#56b1f3` | Hover state |
| `sky-700` | `#3193da` | - |
| `sky-800` | `#1c71ae` | - |
| `sky-900` | `#124d79` | - |
| `sky-950` | `#0b324f` | - |

### Success - Green

| Token      | Hex Value | Usage |
|-----------|-----------|-------|
| `green-50`  | `#d2ffe2` | Positive badge backgrounds |
| `green-100` | `#b1fdcd` | - |
| `green-200` | `#8bf0b0` | - |
| `green-300` | `#67e294` | - |
| `green-400` | `#4bd37d` | - |
| `green-500` | `#3ec972` | **Positive values, success indicators** |
| `green-600` | `#34bd68` | - |
| `green-700` | `#239f52` | Positive text |
| `green-800` | `#15773a` | - |
| `green-900` | `#0f5429` | - |
| `green-950` | `#0a3f1e` | - |

### Danger - Red

| Token     | Hex Value | Usage |
|----------|-----------|-------|
| `red-50`  | `#ffe8e8` | Negative badge backgrounds |
| `red-100` | `#ffd1d1` | - |
| `red-200` | `#ffb2b2` | - |
| `red-300` | `#ff9494` | - |
| `red-400` | `#ff7474` | - |
| `red-500` | `#ff5656` | **Negative values, errors, delete, notification dots** |
| `red-600` | `#fa4949` | - |
| `red-700` | `#e63939` | Negative text |
| `red-800` | `#c52727` | - |
| `red-900` | `#941818` | - |
| `red-950` | `#600f0f` | - |

### Warning - Yellow

| Token       | Hex Value | Usage |
|------------|-----------|-------|
| `yellow-50`  | `#fff2c9` | Warning backgrounds |
| `yellow-100` | `#ffe7a0` | - |
| `yellow-200` | `#ffe081` | - |
| `yellow-300` | `#ffd968` | - |
| `yellow-400` | `#f7cd4c` | - |
| `yellow-500` | `#f0bb33` | **Warning indicators** |
| `yellow-600` | `#dfad2b` | - |
| `yellow-700` | `#bc9021` | - |
| `yellow-800` | `#816316` | - |
| `yellow-900` | `#4f3d0e` | - |
| `yellow-950` | `#342809` | - |

---

## Dark Mode System

### How It Works
1. **Initial Detection** (in `<head>` script):
   - Checks `localStorage.theme` for `'dark'`
   - Defaults to dark mode if no preference is stored
   - Adds/removes `.dark` class on `<html>`
   - Sets `colorScheme` property for native elements

2. **Theme Toggle** (`ThemeToggle.jsx`):
   - Uses `ThemeContext` from `utils/ThemeContext.jsx`
   - Checkbox-based toggle (sun/moon SVG icons)
   - Persists preference to `localStorage`
   - Prevents flash of transitions during switch via `**:transition-none!` class

3. **CSS Implementation**:
   - Custom variant: `@custom-variant dark (&:is(.dark *))`
   - All components use `dark:` prefixed classes
   - Example: `bg-white dark:bg-gray-800`

### Common Dark Mode Patterns

| Element | Light | Dark |
|---------|-------|------|
| Page background | `bg-gray-100` | `dark:bg-gray-900` |
| Card background | `bg-white` | `dark:bg-gray-800` |
| Body text | `text-gray-600` | `dark:text-gray-400` |
| Heading text | `text-gray-800` | `dark:text-gray-100` |
| Muted text | `text-gray-400` | `dark:text-gray-500` |
| Border | `border-gray-200` | `dark:border-gray-700/60` |
| Table header bg | `bg-gray-50` | `dark:bg-gray-700/50` |
| Hover bg | `hover:bg-gray-50` | `dark:hover:bg-gray-700/20` |

---

## Layout Architecture

### Overall Structure
```
┌─────────────────────────────────────────────────┐
│ Sidebar (fixed left) │ Main Content Area       │
│ - Width: 64 (w-64)   │ ┌─────────────────────┐  │
│ - Collapsed: w-20     │ │ Header (sticky top) │  │
│ - Expanded: w-64      │ ├─────────────────────┤  │
│ - Mobile: overlay     │ │                     │  │
│ - Background: white/  │ │ <main> content      │  │
│   dark:gray-800       │ │ px-4 sm:px-6 lg:px-8│  │
│                       │ │ py-8                │  │
│                       │ │ max-w-9xl           │  │
│                       │ │                     │  │
│                       │ └─────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Sidebar Details
- **Width**: `w-64` (256px) full, `lg:w-20` (80px) collapsed
- **Height**: `h-[100dvh]` (full viewport)
- **Position**: `absolute` on mobile (overlay), `static` on desktop
- **Background**: `bg-white dark:bg-gray-800`
- **Padding**: `p-4`
- **Shadow**: `shadow-xs` (default variant) or `border-r` (v2 variant)
- **Border Radius**: `rounded-r-2xl` (default variant)
- **Mobile behavior**: Slide from left with backdrop (`bg-gray-900/30`)
- **Close**: ESC key or click outside
- **State**: Persisted in `localStorage` (`sidebar-expanded`)
- **Custom CSS variant**: `sidebar-expanded` on `<body>` for responsive classes

### Header Details
- **Height**: `h-16` (64px)
- **Position**: `sticky top-0 z-30`
- **Background**: Frosted glass effect (`before:backdrop-blur-md`)
- **Light backdrop**: `max-lg:before:bg-white/90`
- **Dark backdrop**: `dark:max-lg:before:bg-gray-800/90`
- **Desktop backdrop**: `lg:before:bg-gray-100/90` / `dark:lg:before:bg-gray-900/90`
- **Border**: Bottom border on default variant

### Main Content Area
- **Layout**: `flex flex-col flex-1`
- **Overflow**: `overflow-y-auto overflow-x-hidden`
- **Padding**: `px-4 sm:px-6 lg:px-8 py-8`
- **Max width**: `max-w-9xl`
- **Dashboard grid**: `grid grid-cols-12 gap-6`

---

## Spacing & Breakpoints

### Custom Breakpoints
- `xs`: **480px** (extra small devices)
- Standard Tailwind breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px)

### Common Spacing Patterns
- **Card padding**: `px-5 pt-5` or `px-5 py-4`
- **Section gap**: `space-y-8`
- **Grid gap**: `gap-6`
- **Button spacing**: `space-x-3`
- **Inner content padding**: `p-3`

---

## Shadows & Borders

### Custom Shadow
- `--shadow-sm`: `0 1px 1px 0 rgb(0 0 0 / 0.05), 0 1px 2px 0 rgb(0 0 0 / 0.02)`
- Used as `shadow-xs` (Tailwind v4 equivalent of `shadow-sm`)
- Applied on: Cards, sidebar, dropdowns

### Border Patterns
- **Default border color**: `var(--color-gray-200)` (set via base layer)
- **Card borders**: `border border-gray-200 dark:border-gray-700/60`
- **Table dividers**: `divide-y divide-gray-100 dark:divide-gray-700/60`
- **Card border radius**: `rounded-xl` (cards), `rounded-lg` (dropdowns, buttons, inputs)

---

## Components Overview

### Buttons
| Class | Padding | Usage |
|-------|---------|-------|
| `.btn` | `px-3 py-2` | Standard button |
| `.btn-lg` | `px-4 py-3` | Large button |
| `.btn-sm` | `px-2 py-1` | Small button |
| `.btn-xs` | `px-2 py-0.5` | Extra small button |
- **Base style**: `font-medium text-sm inline-flex items-center justify-center border border-transparent rounded-lg leading-5 shadow-xs transition`

### Form Elements
- **Base classes**: `.form-input`, `.form-textarea`, `.form-select`, `.form-checkbox`, `.form-radio`
- **Background**: `bg-white dark:bg-gray-900/30`
- **Border**: `border-gray-200 dark:border-gray-700/60`
- **Focus**: `focus:ring-0 focus:ring-offset-0` (no ring, border color change)
- **Border radius**: `rounded-lg`
- **Switch**: Custom `.form-switch` (44px wide, 20px knob)

### Cards
- **Container**: `flex flex-col bg-white dark:bg-gray-800 shadow-xs rounded-xl`
- **Header**: `px-5 py-4 border-b border-gray-100 dark:border-gray-700/60`
- **Content**: `p-3` or `px-5 pt-5`
- **Grid span**: `col-span-full sm:col-span-6 xl:col-span-4`

### Dropdowns
- **Trigger**: `w-8 h-8 flex items-center justify-center rounded-full`
- **Hover**: `hover:bg-gray-100 lg:hover:bg-gray-200 dark:hover:bg-gray-700/50`
- **Panel**: `bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 rounded-lg shadow-lg`
- **Animation**: Enter/Leave transitions via `Transition` component

### Charts
- **Library**: Chart.js v4
- **Chart types**: Line, Bar, Doughnut, Realtime
- **Gradient helper**: `chartAreaGradient()` for line chart fill gradients
- **Dark mode support**: All chart colors update reactively via ThemeContext
- **Custom HTML legends**: Built via Chart.js plugins

### Tooltip
- **Positions**: top, bottom, left, right
- **Sizes**: sm (min-w-44), md (min-w-56), lg (min-w-72)
- **Colors**: light, dark, default (auto)
- **Animation**: Fade + translate
