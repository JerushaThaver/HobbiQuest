// Sage green & cream aesthetic
// Primary brand color: muted sage green
// Background: warm cream, text: charcoal, accents: sage green

export const colors = {
  background: '#F9F8F6',       // warm cream background
  surface: '#FFFFFF',          // white cards
  surfaceMuted: '#F0EDE9',     // soft beige/cream for empty states

  border: '#E8E3DB',           // subtle border
  borderStrong: '#DDD5CA',     // stronger border

  textPrimary: '#2C2C2C',      // dark charcoal
  textSecondary: '#6B7060',    // muted warm gray-green
  textMuted: '#9A9485',        // lighter muted

  accent: '#7A8664',           // PRIMARY: muted sage green
  accentMuted: '#E8EBE1',      // light sage tint
  accentDark: '#5C6A4C',       // darker sage for active states

  success: '#7A8664',          // same as accent (sage)
  successMuted: '#E8EBE1',     // light sage

  warning: '#B8956A',          // warm tan/ochre for ratings

  overlay: 'rgba(44, 44, 44, 0.45)',

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
