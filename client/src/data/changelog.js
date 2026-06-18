const changelog = [
  {
    version: '1.3.0',
    date: '2026-06-18',
    tag: 'Latest',
    highlights: ['Trainer removal', 'UX improvements', 'Changelog page'],
    changes: [
      { type: 'feature', text: 'Users can now remove their assigned trainer from Browse Trainers page' },
      { type: 'feature', text: 'Changelog page added inside Settings to track version updates' },
      { type: 'feature', text: 'Notification alerts for new updates with link to changelog' },
      { type: 'improvement', text: 'Hero section CTA contrast improved for better accessibility (WCAG compliant)' },
      { type: 'improvement', text: 'Consistent section spacing across public pages' },
      { type: 'improvement', text: 'Mobile CTA buttons now full-width for better tap targets' },
      { type: 'fix', text: 'Online status indicator now correctly shows green dot for logged-in user' },
      { type: 'fix', text: 'Sidebar icons now visible when sidebar is collapsed' },
    ],
  },
  {
    version: '1.2.0',
    date: '2026-06-15',
    tag: null,
    highlights: ['Sidebar redesign', 'Theme support'],
    changes: [
      { type: 'feature', text: 'Unified shadcn-style sidebar across User, Trainer, and Admin panels' },
      { type: 'feature', text: 'Collapsible nav groups with chevron animation' },
      { type: 'feature', text: 'User dropdown in sidebar footer with Profile, Settings, Logout' },
      { type: 'improvement', text: 'Sidebar is now theme-aware with proper light/dark mode support' },
      { type: 'improvement', text: 'Notification dropdown loading skeleton replaced with proper placeholders' },
    ],
  },
  {
    version: '1.1.0',
    date: '2026-06-10',
    tag: null,
    highlights: ['Nutrition dual-input', 'Food database'],
    changes: [
      { type: 'feature', text: 'Dual-mode food input: Quick Add and Search Database in Nutrition page' },
      { type: 'feature', text: 'Local Pakistani food database with meal-type suggestions' },
      { type: 'feature', text: 'LocalStorage-powered recent food suggestions per meal type' },
      { type: 'improvement', text: 'Nutrition page split layout for better data visibility' },
    ],
  },
  {
    version: '1.0.0',
    date: '2026-06-01',
    tag: 'Initial',
    highlights: ['Full launch'],
    changes: [
      { type: 'feature', text: 'User dashboard with workout, nutrition, water, sleep, and goals tracking' },
      { type: 'feature', text: 'Trainer panel with client management and workout templates' },
      { type: 'feature', text: 'Admin panel with user management, trainer requests, and feedbacks' },
      { type: 'feature', text: 'Progress tracking with body measurements and photos' },
      { type: 'feature', text: 'Achievement system with gamification' },
      { type: 'feature', text: 'Browse trainers and send connection requests' },
      { type: 'feature', text: 'Dark/light theme with persistent toggle' },
    ],
  },
];

export default changelog;

export const getLatestVersion = () => changelog[0]?.version || '1.0.0';

export const getLatestChanges = () => changelog[0]?.changes?.slice(0, 3) || [];
