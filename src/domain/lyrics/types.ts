export type StudyLanguage = "auto" | "en" | "de" | "es";

export type TargetLanguage = "pt-BR";

export type LyricsSource = "lrclib" | "sample" | "manual";

export type LyricsLine = {
  id: string;
  startTimeMs: number;
  originalText: string;
  translatedText?: string;
};

export type LyricsStudyRequest = {
  artist: string;
  track: string;
  album?: string;
  durationSeconds?: number;
  sourceLanguage: StudyLanguage;
  targetLanguage: TargetLanguage;
};

export type LyricsStudyResult = {
  artistName: string;
  trackName: string;
  detectedLanguage: StudyLanguage;
  targetLanguage: TargetLanguage;
  source: LyricsSource;
  synced: boolean;
  lines: LyricsLine[];
};

export type LyricsProvider = {
  searchSyncedLyrics(request: LyricsStudyRequest): Promise<LyricsStudyResult | null>;
};

export type TranslateLinesRequest = {
  lines: string[];
  sourceLanguage: StudyLanguage;
  targetLanguage: TargetLanguage;
};

export type TranslationProvider = {
  translateLines(request: TranslateLinesRequest): Promise<string[]>;
};

