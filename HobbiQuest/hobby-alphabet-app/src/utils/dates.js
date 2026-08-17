export function formatShortDate(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function formatLongDate(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
}

export function formatRelativeDate(iso) {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatShortDate(iso);
}

export const MOODS = ['😞', '😐', '🙂', '😄', '🤩'];

// ---- Calendar utilities ----

export function getDaysInMonth(year, month) {
  // month is 0-indexed
  return new Date(year, month + 1, 0).getDate();
}

export function getStartDayOfMonth(year, month) {
  // month is 0-indexed
  // Returns 0-6, where 0 = Sunday
  return new Date(year, month, 1).getDay();
}

export function formatMonthYear(year, month) {
  // month is 0-indexed
  const date = new Date(year, month, 1);
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

export function toDateString(date) {
  // Convert Date or ISO string to YYYY-MM-DD format
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getMonthsDays(year, month) {
  // Returns an array representing the full calendar grid for a month
  // Each entry is either a day number (1-31) or null (for empty cells)
  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getStartDayOfMonth(year, month);
  const days = [];

  // Fill in empty days before month starts
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  // Fill in the actual days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return days;
}

export function formatDayWithName(year, month, day) {
  // Returns "Monday, 17 August"
  const date = new Date(year, month, day);
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}
