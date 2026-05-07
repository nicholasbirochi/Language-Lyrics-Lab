# Language Lyrics Lab

Open-source Expo app for language learning with synchronized lyrics, line-by-line translations, review modes, and flashcards.

The goal is to build a standalone web and iOS app where learners can study lyrics one line at a time, with the original lyric and a Brazilian Portuguese translation shown together. The project is not meant to modify any official music app. Future versions can follow currently playing music or connect to a personal music library when the provider terms and licensing model allow it.

## Platform

- Web: Expo + React Native Web
- iOS: Expo + React Native
- Study languages: English, German, and Spanish
- Target translation: Brazilian Portuguese
- Synchronized lyrics: initial LRCLIB adapter
- Optional real translation: LibreTranslate

## Getting Started

Requirements:

- Node.js with `npm` available in the terminal
- A legal source for any lyrics or audio used outside the sample catalog

Clone the repository and install dependencies:

```powershell
git clone https://github.com/nicholasbirochi/Language-Lyrics-Lab.git
cd Language-Lyrics-Lab
npm install
```

Run the web app:

```powershell
npm run web
```

Run the iOS app:

```powershell
npm run ios
```

On Windows, iOS development normally requires one of these routes:

- Expo Go on an iPhone using the Expo QR code
- A Mac for the iOS simulator
- EAS Build for generating an iOS build

## Environment

To enable real translation in the prototype, create a `.env` file from `.env.example`:

```powershell
Copy-Item .env.example .env
```

The app uses `EXPO_PUBLIC_LIBRETRANSLATE_URL` when that variable is configured. Without it, the app falls back to the offline demo translator for the initial sample catalog.

## Project Phases

1. Offline MVP with study lines and Brazilian Portuguese translations.
2. Real synchronized lyric search through LRCLIB.
3. Real translation through a configurable provider with an in-memory cache.
4. Manual review, flashcards, favorites, and session history.
5. Built-in player with active-line highlighting.
6. Manual `.lrc` lyric import.
7. Optional currently-playing integration through supported music APIs.

## Structure

```text
src/
  domain/          Pure rules: types, LRC parser, and domain models.
  application/     Use cases: build translated study lyrics.
  infrastructure/  External APIs: LRCLIB and translation providers.
  presentation/    Expo/React Native UI for web and iOS.
docs/              Architecture, setup notes, and roadmap.
```

## Lyrics Notice

Song lyrics can be protected by copyright. This project should only use APIs and content sources that are allowed for the intended use case. LRCLIB is useful for personal study prototypes, but any public or commercial app needs a careful review of each provider's license and terms.

## Current Status

The project already includes a full study flow in code:

- LRCLIB search from the form.
- Manual `.lrc` import.
- Real audio playback from a URL with `expo-audio`.
- Lyrics, review, and flashcard modes.
- Manual translation correction.
- Keywords for the active line.
- In-memory favorites and history during the session.
- Web persistence for favorites and history through `localStorage`.
- Web persistence for translation cache through `localStorage`.
- Simple simulated-time player and active-line highlighting.
- Fine sync adjustment in 250 ms steps.

Dependencies still need to be installed and the web/iOS targets still need to be validated on a machine with Node.js and `npm` available.
