// Neutral, professional color palette.
// Warm off-white base, charcoal text, soft stone accents, one muted
// slate-blue accent reserved for progress/active states.

export const colors = {
  background: '#F6F5F2',       // warm off-white
  surface: '#FFFFFF',          // cards
  surfaceMuted: '#EFEDE8',     // subtle panels / empty tiles

  border: '#E1DED7',
  borderStrong: '#C9C5BC',

  textPrimary: '#2A2926',      // near-black charcoal
  textSecondary: '#6B6862',    // warm gray
  textMuted: '#9B9790',

  accent: '#4A5568',           // muted slate blue-gray (primary actions)
  accentMuted: '#DDE1E6',      // accent tint for backgrounds
  accentDark: '#333B47',

  success: '#5B7A63',          // muted sage green (completed)
  successMuted: '#E4EAE5',

  warning: '#A9762F',          // muted ochre (optional use)

  overlay: 'rgba(20, 19, 17, 0.45)',

  white: '#FFFFFF',
  black: '#000000',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' },
  h2: { fontSize: 22, fontWeight: '700' },
  h3: { fontSize: 18, fontWeight: '600' },
  body: { fontSize: 15, fontWeight: '400' },
  bodyBold: { fontSize: 15, fontWeight: '600' },
  caption: { fontSize: 13, fontWeight: '400' },
  label: { fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
};
