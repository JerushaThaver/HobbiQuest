# Hobby Alphabet

A mobile app for doing one hobby per letter of the alphabet, with a photo
captured for each one. Built with Expo + React Native.

## Features
- A–Z grid showing progress at a glance (photo thumbnail once completed)
- Camera capture or photo library picker per letter
- Hobby name, star rating, and notes per entry
- Built-in hobby suggestions for tricky letters (Q, X, Z, etc.)
- Progress bar (x / 26 complete)
- Local persistence via AsyncStorage — works fully offline
- Neutral, professional color theme (warm off-white, charcoal, muted slate/sage accents)

## Setup

1. Install [Node.js](https://nodejs.org) (LTS) if you don't have it.
2. Install the Expo CLI tooling (no global install needed — `npx` handles it).
3. From this project folder, install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npx expo start
   ```

5. Test on your phone:
   - Install the **Expo Go** app (iOS App Store / Google Play).
   - Scan the QR code shown in your terminal or browser with your phone
     camera (iOS) or the Expo Go app (Android).
   - The app will load on your device. Camera permissions will be requested
     the first time you tap "Camera."

   Alternatively, press `i` in the terminal for an iOS simulator, or `a` for
   an Android emulator, if you have Xcode / Android Studio set up.

## Project structure

```
App.js                        Navigation entry point
src/
  screens/
    HomeScreen.js              A–Z progress grid
    HobbyDetailScreen.js       Photo capture + entry form for one letter
  components/
    LetterTile.js               Single tile in the grid
    ProgressBar.js              x / 26 progress indicator
  theme/
    colors.js                   Color palette, spacing, typography tokens
  data/
    hobbySuggestions.js         Suggested hobbies per letter
  utils/
    storage.js                  AsyncStorage read/write helpers
```

## Notes on data
Entries are stored locally on-device with AsyncStorage under a single key
(`hobby-alphabet:entries`), keyed by letter. There's no backend — this is a
fully local-first app. If you want cloud sync across devices later, that's a
good next step (e.g. Firebase, Supabase, or a simple custom API), and the
storage layer in `src/utils/storage.js` is written so it's easy to swap out.

## Ideas for what to build next
- Export progress as a PDF/photo collage once all 26 are done
- Reminders/notifications if no entry has been added in a while
- Badges for milestones (5, 13, 26 letters complete)
- Random "what should I try next" letter picker
