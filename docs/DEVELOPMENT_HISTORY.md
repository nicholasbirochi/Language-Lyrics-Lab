# Development History

Language Lyrics Lab began as a study-focused experiment: can music lyrics become a practical language-learning interface without depending on any official music app or unsafe content workflow?

The project evolved from that question into a cross-platform Expo prototype with synchronized lyrics, line-by-line translation, review flows, flashcards, and a provider-based architecture.

## Starting Point

The first goal was intentionally narrow: create a standalone app where a learner could see an original lyric line and a Brazilian Portuguese translation together. The early product direction avoided modifying or cloning any existing streaming service. Instead, it focused on a safer path: build an independent learning app that can use allowed lyric, translation, and audio sources.

This decision shaped the project from the beginning:

- The app would be built as its own product.
- Lyrics and audio would come from configurable or user-provided sources.
- External integrations would be optional and reviewed before becoming core features.
- The learning workflow would matter more than music playback alone.

## Stack Selection

Expo was chosen because it supports a shared React Native codebase for both web and iOS. That made it a good fit for a prototype that needed to move quickly while still keeping a mobile path open.

The initial stack became:

- Expo for app runtime and platform tooling.
- React Native Web for browser support.
- TypeScript for typed domain and application logic.
- LRCLIB as the first synchronized lyrics provider.
- LibreTranslate as the first configurable real translation provider.
- `expo-audio` for real audio playback by URL.

## Architecture Foundation

The project was split into four layers to keep the codebase understandable as features grew:

- `domain`: pure lyric types, timestamp parsing, and keyword extraction.
- `application`: use cases that compose lyrics, translations, and study models.
- `infrastructure`: LRCLIB and translation provider implementations.
- `presentation`: Expo and React Native screens, components, state, and controls.

This separation made the app easier to extend. For example, the UI does not need to know whether translations come from the demo catalog, LibreTranslate, a cache, or a future provider.

## First Working Study Flow

The first usable flow centered on sample lyrics. This allowed the interface and learning model to be designed before relying on network providers.

The prototype then added:

- A sample catalog for English, German, and Spanish study sessions.
- Original lyric lines with Brazilian Portuguese translations underneath.
- Active-line highlighting.
- A simple simulated player based on timestamps.
- Study language selection.

This made the product idea visible early: it was not just a lyrics viewer, but a line-by-line study surface.

## LRCLIB Integration

After the offline flow worked, the project added a real lyrics provider through LRCLIB. This introduced a search flow based on artist and track names and made the app capable of loading synchronized lyrics beyond the sample catalog.

The integration also required better fallback behavior. If a lyric could not be found or a provider failed, the app would keep a study session available instead of leaving the learner at a dead end.

## Translation Layer

The translation system grew in stages:

1. A demo provider handled the initial offline catalog.
2. A LibreTranslate provider added real translation support through environment variables.
3. An in-memory cache avoided translating identical lines repeatedly in the same session.
4. A persistent web cache saved translations in `localStorage`.

The main technical rule was to preserve line alignment. Even when translations are batched or cached, each original line must still match its translated line.

## Review and Flashcards

Once the lyrics and translations were usable, the app moved toward actual learning tools.

The study experience added:

- Lyrics mode for reading line by line.
- Review mode for focused practice.
- Flashcard mode with translation reveal.
- Manual translation correction.
- Keyword extraction for the active line.
- Favorites for important phrases.
- Session history by language.

These features turned the prototype into a small learning workflow instead of a passive display.

## Audio and Synchronization

The app then added real audio playback by URL with `expo-audio`. This gave the learner a way to connect timed lyric lines to real listening practice.

Synchronization features followed:

- Active-line updates based on current playback time.
- A simulated player fallback when no audio URL is loaded.
- Fine sync adjustment in 250 ms steps.
- Manual `.lrc` import for user-provided timestamped lyrics.

This made the app flexible enough to support both provider-based lyrics and manually imported study material.

## Persistence

The first persistence layer targeted the web version through `localStorage`.

The app currently persists:

- Favorite phrases.
- Per-language history.
- Audio URL.
- Translation cache.

Native persistence remains planned for the iOS path, where a storage adapter should replace direct web-only assumptions.

## Publication Preparation

Before publishing the repository, the project was renamed to Language Lyrics Lab to avoid branding confusion and make the portfolio purpose clearer.

The documentation was rewritten in English and organized around:

- Setup instructions.
- Architecture.
- Roadmap.
- Development history.
- Usage and licensing notes.

The first public repository version focuses on clarity: it shows the product idea, the technical architecture, current capabilities, and the remaining validation work.

## Current State

Language Lyrics Lab is now a working prototype in code, but it still needs dependency installation and runtime validation on a machine with Node.js and `npm` available.

The next development checkpoint is:

```powershell
npm install
npm run typecheck
npm run web
```

After those checks pass, the project can move from prototype publication toward web MVP hardening, tests, mobile persistence, and portfolio polish.

## What This Project Demonstrates

This repository is designed to show:

- Cross-platform app planning with Expo and React Native.
- Layered TypeScript architecture.
- External API integration through provider interfaces.
- State and persistence decisions for web and future native targets.
- Practical UX thinking for language learning workflows.
- Awareness of licensing and content-source constraints.
- Clear technical documentation for a portfolio project.
