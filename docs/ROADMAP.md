# Roadmap

Language Lyrics Lab is moving from a working study prototype toward a reliable cross-platform learning app. The roadmap is organized by product maturity instead of isolated features, so each milestone has a clear purpose and validation target.

## Current Release: 0.1 Prototype

Status: implemented, not yet validated with installed dependencies on this machine.

The current version proves the core idea: learners can study synchronized lyrics line by line, compare the original text with a Brazilian Portuguese translation, review difficult phrases, and practice with flashcards.

Completed:

- Expo project configured for web and iOS.
- Layered architecture with `domain`, `application`, `infrastructure`, and `presentation`.
- LRC parser for timestamped lyric lines.
- LRCLIB lyrics provider.
- Offline sample catalog for English, German, and Spanish.
- Demo translation provider for the initial sample catalog.
- LibreTranslate provider behind environment configuration.
- In-memory translation cache.
- Web `localStorage` translation cache.
- Manual translation correction.
- Lyrics, review, and flashcard study modes.
- Active-line keyword extraction.
- Favorite phrases and session history.
- Web persistence for favorites and history.
- Manual `.lrc` import through pasted text.
- Real audio playback by URL with `expo-audio`.
- Simulated-time player fallback.
- Active-line highlighting.
- Fine sync adjustment in 250 ms steps.
- English documentation for setup, architecture, roadmap, and development history.

Validation still required:

- Install Node.js and `npm` on the development machine.
- Run `npm install`.
- Run `npm run typecheck`.
- Run `npm run web`.
- Validate the mobile layout in a narrow viewport.
- Validate iOS behavior through Expo Go, simulator, or EAS Build.

## 0.2 Web MVP Hardening

Goal: make the web version reliable enough for repeated personal study sessions.

Planned:

- Add loading, empty, and error state polish across all data flows.
- Improve form validation for artist, track, manual LRC, and audio URL input.
- Add a small set of parser tests for LRC edge cases.
- Add tests for `buildStudyLyrics` orchestration.
- Add tests for translation caching behavior.
- Add a lightweight sample walkthrough to the README.
- Validate browser persistence across refreshes.
- Validate audio playback with legal test audio URLs and CORS-enabled hosts.

Exit criteria:

- `npm run typecheck` passes.
- Core domain and application tests pass.
- Web app runs with no blocking console errors.
- A learner can complete a full study session from search/import to review.

## 0.3 Translation Quality

Goal: make translations useful for real study, while keeping provider choice flexible.

Planned:

- Add provider-level timeout handling.
- Add clearer fallback behavior when real translation fails.
- Add batch size configuration for translation requests.
- Store manually corrected translations separately from provider translations.
- Add a review marker for lines that need manual correction.
- Prepare the translation provider interface for future services.

Exit criteria:

- Translation failures do not block the study session.
- Manual corrections survive web refreshes.
- The app keeps original and translated lines aligned.

## 0.4 Mobile and iOS Persistence

Goal: make the iOS path practical instead of only theoretically supported by Expo.

Planned:

- Add a storage adapter that can use web `localStorage` or native persistent storage.
- Persist favorite phrases on iOS.
- Persist per-language history on iOS.
- Persist translation cache on iOS.
- Review touch target sizes and scroll behavior on mobile.
- Validate safe-area behavior on iPhone layouts.

Exit criteria:

- Favorites, history, and translation cache survive app restarts on iOS.
- The main study screen remains usable on small mobile screens.

## 0.5 Study Experience

Goal: turn the prototype into a more complete learning workflow.

Planned:

- Add a dedicated favorites view.
- Add a history view grouped by language.
- Add simple spaced-review metadata for saved lines.
- Add phrase difficulty markers.
- Add export of favorite phrases to a plain text or CSV format.
- Add search/filter inside saved phrases.

Exit criteria:

- A learner can return to previous material without repeating the same search.
- Favorite phrases become a reusable study asset.

## 0.6 Player and Local Media

Goal: improve synchronization and support local study assets.

Planned:

- Add local audio file support.
- Add a clearer audio loading state.
- Add visual sync calibration controls.
- Persist per-track sync offset.
- Improve behavior when lyrics and audio durations do not match.

Exit criteria:

- A learner can study with either a URL-based audio source or supported local media.
- Sync adjustments are saved and can be reused.

## 0.7 Integrations and Licensing

Goal: evaluate external integrations without compromising legal or product safety.

Planned:

- Review LRCLIB usage terms for the target use case.
- Review translation provider terms.
- Study supported music APIs for currently playing tracks.
- Evaluate Navidrome for personal music libraries.
- Document what content can and cannot be used in a public version.

Exit criteria:

- The project has a clear policy for lyrics, audio, and provider usage.
- Any future integration has documented constraints before implementation.

## 1.0 Portfolio Release

Goal: present the app as a polished portfolio project.

Planned:

- Add screenshots or a short demo recording.
- Add a concise architecture diagram.
- Add a production-oriented README section.
- Add a license file after choosing the correct license.
- Add GitHub topics for discoverability.
- Add CI for typecheck and tests.

Exit criteria:

- The repository explains the problem, solution, architecture, setup, and roadmap clearly.
- CI validates the code on every push.
- The project can be reviewed by another developer without extra context.

## Later Ideas

These ideas are intentionally outside the MVP path:

- User accounts and cloud sync.
- Multi-target translations beyond Brazilian Portuguese.
- Vocabulary decks generated from active lyrics.
- More advanced natural language processing for keywords.
- Offline-first packaged study packs.
- Public deployment for the web version.
