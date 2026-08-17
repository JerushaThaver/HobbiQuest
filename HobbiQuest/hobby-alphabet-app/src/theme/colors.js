// Warm, earthy, professional color palette.
// Cream base, brown/charcoal text, sage completion accent, ochre for ratings.

export const colors = {
  background: '#F5F1E8',       // warm cream
  surface: '#FFFDF8',          // cards
  surfaceMuted: '#EAE1D5',     // soft beige panels / empty tiles

  border: '#E1D5C4',
  borderStrong: '#D8C8B8',     // light brown

  textPrimary: '#3E3028',      // dark brown
  textSecondary: '#7A6A5C',    // warm gray-brown
  textMuted: '#A79688',

  accent: '#795548',           // primary brown
  accentMuted: '#EAE1D5',      // accent tint for backgrounds
  accentDark: '#3E3028',

  success: '#7A8664',          // muted olive/sage (completed)
  successMuted: '#E9ECE3',

  warning: '#B78335',          // warm ochre (ratings)

  overlay: 'rgba(62, 48, 40, 0.45)',

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
