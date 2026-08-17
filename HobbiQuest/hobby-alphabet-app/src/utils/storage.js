import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'hobby-alphabet:data:v2';

// Data shape:
// {
//   A: {
//     hobbies: [
//       {
//         id: string,
//         name: string,
//         category: string,
//         tracking: boolean,
//         rating: number,        // 0-5
//         notes: string,
//         photos: [{ id, uri, date }],
//         sessions: [{ id, date, mood, note, photos: [{id, uri}] }],
//         createdAt: ISOString,
//       },
//       ...
//     ]
//   },
//   ...
// }

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function loadData() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.warn('Failed to load data', e);
    return {};
  }
}

async function saveData(data) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  } catch (e) {
    console.warn('Failed to save data', e);
    throw e;
  }
}

export async function getHobbiesForLetter(letter) {
  const data = await loadData();
  return data[letter]?.hobbies || [];
}

export async function getHobby(letter, hobbyId) {
  const hobbies = await getHobbiesForLetter(letter);
  return hobbies.find((h) => h.id === hobbyId) || null;
}

export async function addPhotoToHobby(letter, hobbyId, uri) {
  const data = await loadData();
  const hobbies = data[letter]?.hobbies || [];
  const idx = hobbies.findIndex((h) => h.id === hobbyId);
  if (idx === -1) return null;
  const newPhoto = { id: makeId(), uri, date: new Date().toISOString() };
  hobbies[idx].photos = [newPhoto, ...(hobbies[idx].photos || [])];
  data[letter].hobbies = hobbies;
  await saveData(data);
  return newPhoto;
}

export async function addHobby(letter, hobby) {
  const data = await loadData();
  if (!data[letter]) data[letter] = { hobbies: [] };
  const newHobby = {
    id: makeId(),
    name: hobby.name || '',
    category: hobby.category || 'Other',
    tracking: !!hobby.tracking,
    rating: hobby.rating || 0,
    notes: hobby.notes || '',
    photos: hobby.photoUri ? [{ id: makeId(), uri: hobby.photoUri, date: new Date().toISOString() }] : [],
    sessions: [],
    createdAt: new Date().toISOString(),
  };
  data[letter].hobbies.push(newHobby);
  await saveData(data);
  return newHobby;
}

export async function updateHobby(letter, hobbyId, updates) {
  const data = await loadData();
  const hobbies = data[letter]?.hobbies || [];
  const idx = hobbies.findIndex((h) => h.id === hobbyId);
  if (idx === -1) return null;
  hobbies[idx] = { ...hobbies[idx], ...updates };
  data[letter].hobbies = hobbies;
  await saveData(data);
  return hobbies[idx];
}

export async function deleteHobby(letter, hobbyId) {
  const data = await loadData();
  if (!data[letter]) return;
  data[letter].hobbies = (data[letter].hobbies || []).filter((h) => h.id !== hobbyId);
  await saveData(data);
}

export async function addSession(letter, hobbyId, session) {
  const data = await loadData();
  const hobbies = data[letter]?.hobbies || [];
  const idx = hobbies.findIndex((h) => h.id === hobbyId);
  if (idx === -1) return null;

  const newSession = {
    id: makeId(),
    date: session.date || new Date().toISOString(),
    mood: session.mood || null,
    note: session.note || '',
    photos: session.photoUri ? [{ id: makeId(), uri: session.photoUri }] : [],
  };
  hobbies[idx].sessions = [newSession, ...(hobbies[idx].sessions || [])];

  // Roll new session photos up into the hobby's overall photo history too
  if (newSession.photos.length > 0) {
    hobbies[idx].photos = [
      ...newSession.photos.map((p) => ({ ...p, date: newSession.date })),
      ...(hobbies[idx].photos || []),
    ];
  }

  data[letter].hobbies = hobbies;
  await saveData(data);
  return newSession;
}

// ---- Aggregate helpers ----

export async function getAllHobbiesFlat() {
  const data = await loadData();
  const flat = [];
  Object.keys(data).forEach((letter) => {
    (data[letter].hobbies || []).forEach((hobby) => {
      flat.push({ ...hobby, letter });
    });
  });
  return flat;
}

export async function getStats() {
  const flat = await getAllHobbiesFlat();
  const data = await loadData();

  const lettersCompleted = Object.keys(data).filter(
    (letter) => (data[letter].hobbies || []).length > 0
  ).length;

  const hobbiesTracked = flat.filter((h) => h.tracking).length;
  const totalSessions = flat.reduce((sum, h) => sum + (h.sessions?.length || 0), 0);
  const ratings = flat.filter((h) => h.rating > 0).map((h) => h.rating);
  const avgRating = ratings.length
    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
    : null;

  return {
    hobbiesAdded: flat.length,
    hobbiesTracked,
    lettersCompleted,
    totalSessions,
    avgRating,
  };
}

export async function getRecentActivity(limit = 5) {
  const flat = await getAllHobbiesFlat();
  const events = [];
  flat.forEach((hobby) => {
    (hobby.sessions || []).forEach((session) => {
      events.push({
        letter: hobby.letter,
        hobbyId: hobby.id,
        hobbyName: hobby.name,
        date: session.date,
        note: session.note,
      });
    });
  });
  events.sort((a, b) => new Date(b.date) - new Date(a.date));
  return events.slice(0, limit);
}

export async function clearAllData() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear data', e);
  }
}

// ---- Tracker & Calendar Helpers ----

export async function getTrackedHobbies() {
  const flat = await getAllHobbiesFlat();
  return flat.filter((h) => h.tracking).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getActivitiesForDate(dateStr) {
  // dateStr should be YYYY-MM-DD format
  const flat = await getAllHobbiesFlat();
  const activities = [];

  flat.forEach((hobby) => {
    (hobby.sessions || []).forEach((session) => {
      const sessionDate = new Date(session.date);
      const sessionDateStr = sessionDate.toISOString().split('T')[0];
      if (sessionDateStr === dateStr) {
        activities.push({
          id: session.id,
          hobbyId: hobby.id,
          letter: hobby.letter,
          hobbyName: hobby.name,
          category: hobby.category,
          date: session.date,
          note: session.note,
          mood: session.mood,
          photos: session.photos || [],
          rating: hobby.rating || 0,
        });
      }
    });
  });

  return activities.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function getDatesWithActivities(year, month) {
  // month is 0-indexed (0 = January)
  const flat = await getAllHobbiesFlat();
  const datesWithActivity = new Set();

  flat.forEach((hobby) => {
    (hobby.sessions || []).forEach((session) => {
      const sessionDate = new Date(session.date);
      if (sessionDate.getFullYear() === year && sessionDate.getMonth() === month) {
        const day = sessionDate.getDate();
        datesWithActivity.add(day);
      }
    });
  });

  return Array.from(datesWithActivity).sort((a, b) => a - b);
}

export async function getSessionStats(letter, hobbyId) {
  const hobby = await getHobby(letter, hobbyId);
  if (!hobby) return null;

  const sessions = hobby.sessions || [];
  const totalPhotos = sessions.reduce((sum, s) => sum + (s.photos?.length || 0), 0);

  let lastSessionDate = null;
  if (sessions.length > 0) {
    lastSessionDate = new Date(sessions[0].date);
  }

  return {
    sessionCount: sessions.length,
    totalPhotos,
    lastSessionDate,
  };
}

// ---- Achievement & Stats Helpers ----

export const ACHIEVEMENTS = [
  {
    id: 'first-step',
    name: 'First Step',
    description: 'Add your first hobby.',
    icon: '🏅',
    condition: (data) => {
      const flat = Object.keys(data)
        .flatMap((letter) => data[letter]?.hobbies || []);
      return flat.length >= 1;
    },
    progress: (data) => {
      const flat = Object.keys(data)
        .flatMap((letter) => data[letter]?.hobbies || []);
      return { current: flat.length, target: 1 };
    },
  },
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Complete 5 letters.',
    icon: '🌱',
    condition: (data) => Object.keys(data).filter((k) => (data[k]?.hobbies?.length || 0) > 0).length >= 5,
    progress: (data) => {
      const completed = Object.keys(data).filter((k) => (data[k]?.hobbies?.length || 0) > 0).length;
      return { current: completed, target: 5 };
    },
  },
  {
    id: 'hobby-explorer',
    name: 'Hobby Explorer',
    description: 'Add 10 different hobbies.',
    icon: '⭐',
    condition: (data) => {
      const flat = Object.keys(data)
        .flatMap((letter) => data[letter]?.hobbies || []);
      return flat.length >= 10;
    },
    progress: (data) => {
      const flat = Object.keys(data)
        .flatMap((letter) => data[letter]?.hobbies || []);
      return { current: flat.length, target: 10 };
    },
  },
  {
    id: 'seven-day-streak',
    name: '7 Day Streak',
    description: 'Log a hobby for 7 consecutive days.',
    icon: '🔥',
    condition: (data) => calculateLongestStreak(data) >= 7,
    progress: (data) => {
      const streak = calculateLongestStreak(data);
      return { current: streak, target: 7 };
    },
  },
  {
    id: 'memory-keeper',
    name: 'Memory Keeper',
    description: 'Add 25 hobby photos.',
    icon: '📸',
    condition: (data) => {
      const flat = Object.keys(data)
        .flatMap((letter) => data[letter]?.hobbies || []);
      const totalPhotos = flat.reduce((sum, h) => sum + (h.photos?.length || 0), 0);
      return totalPhotos >= 25;
    },
    progress: (data) => {
      const flat = Object.keys(data)
        .flatMap((letter) => data[letter]?.hobbies || []);
      const totalPhotos = flat.reduce((sum, h) => sum + (h.photos?.length || 0), 0);
      return { current: totalPhotos, target: 25 };
    },
  },
  {
    id: 'committed',
    name: 'Committed',
    description: 'Track a hobby for 30 days.',
    icon: '🎯',
    condition: (data) => {
      const flat = Object.keys(data)
        .flatMap((letter) => data[letter]?.hobbies || []);
      return flat.some((h) => {
        if (!h.tracking || !h.createdAt) return false;
        const createdDate = new Date(h.createdAt);
        const daysSinceCreated = (Date.now() - createdDate) / (1000 * 60 * 60 * 24);
        return daysSinceCreated >= 30;
      });
    },
    progress: (data) => {
      const flat = Object.keys(data)
        .flatMap((letter) => data[letter]?.hobbies || []);
      const maxDays = Math.max(
        ...flat.map((h) => {
          if (!h.createdAt) return 0;
          const createdDate = new Date(h.createdAt);
          return (Date.now() - createdDate) / (1000 * 60 * 60 * 24);
        }),
        0
      );
      return { current: Math.floor(maxDays), target: 30 };
    },
  },
  {
    id: 'halfway-there',
    name: 'Halfway There',
    description: 'Complete 13 letters.',
    icon: '🔤',
    condition: (data) =>
      Object.keys(data).filter((k) => (data[k]?.hobbies?.length || 0) > 0).length >= 13,
    progress: (data) => {
      const completed = Object.keys(data).filter((k) => (data[k]?.hobbies?.length || 0) > 0).length;
      return { current: completed, target: 13 };
    },
  },
  {
    id: 'alphabet-master',
    name: 'Alphabet Master',
    description: 'Complete all 26 letters.',
    icon: '👑',
    condition: (data) =>
      Object.keys(data).filter((k) => (data[k]?.hobbies?.length || 0) > 0).length === 26,
    progress: (data) => {
      const completed = Object.keys(data).filter((k) => (data[k]?.hobbies?.length || 0) > 0).length;
      return { current: completed, target: 26 };
    },
  },
];

function calculateLongestStreak(data) {
  const flat = Object.keys(data)
    .flatMap((letter) => data[letter]?.hobbies || []);
  
  const allDates = [];
  flat.forEach((hobby) => {
    (hobby.sessions || []).forEach((session) => {
      const dateStr = new Date(session.date).toISOString().split('T')[0];
      if (!allDates.includes(dateStr)) {
        allDates.push(dateStr);
      }
    });
  });

  if (allDates.length === 0) return 0;

  allDates.sort();
  let longestStreak = 1;
  let currentStreak = 1;
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  for (let i = 1; i < allDates.length; i++) {
    const prevDate = new Date(allDates[i - 1]);
    const currDate = new Date(allDates[i]);
    const dayDiff = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));

    if (dayDiff === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return longestStreak;
}

export async function getUnlockedAchievements() {
  const data = await loadData();
  return ACHIEVEMENTS.filter((ach) => ach.condition(data));
}

export async function getAllAchievementsWithProgress() {
  const data = await loadData();
  return ACHIEVEMENTS.map((ach) => ({
    ...ach,
    unlocked: ach.condition(data),
    progress: ach.progress(data),
  }));
}

export async function getMostActiveHobbies(limit = 3) {
  const flat = await getAllHobbiesFlat();
  return flat
    .map((h) => ({
      ...h,
      sessionCount: (h.sessions || []).length,
    }))
    .sort((a, b) => b.sessionCount - a.sessionCount)
    .slice(0, limit);
}

export async function getCategoryStats() {
  const flat = await getAllHobbiesFlat();
  const categoryMap = {};

  flat.forEach((hobby) => {
    const cat = hobby.category || 'Other';
    if (!categoryMap[cat]) categoryMap[cat] = 0;
    categoryMap[cat]++;
  });

  return Object.entries(categoryMap)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getCurrentStreak() {
  const data = await loadData();
  const flat = Object.keys(data)
    .flatMap((letter) => data[letter]?.hobbies || []);

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const allDates = new Set();
  flat.forEach((hobby) => {
    (hobby.sessions || []).forEach((session) => {
      const dateStr = new Date(session.date).toISOString().split('T')[0];
      allDates.add(dateStr);
    });
  });

  if (!allDates.has(todayStr) && !allDates.has(yesterdayStr)) return 0;

  const sortedDates = Array.from(allDates).sort().reverse();
  let streak = 0;

  for (const dateStr of sortedDates) {
    const date = new Date(dateStr);
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - streak);
    expectedDate.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
