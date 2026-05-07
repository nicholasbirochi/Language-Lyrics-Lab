import type {
  LyricsProvider,
  LyricsStudyRequest,
  LyricsStudyResult,
  TranslationProvider
} from "../../domain/lyrics/types";

type SampleCatalog = {
  getSample(request: LyricsStudyRequest): LyricsStudyResult;
};

type BuildStudyLyricsDeps = {
  lyricsProvider: LyricsProvider;
  translationProvider: TranslationProvider;
  sampleCatalog: SampleCatalog;
};

export async function buildStudyLyrics(
  request: LyricsStudyRequest,
  deps: BuildStudyLyricsDeps
): Promise<LyricsStudyResult> {
  const lyrics = await deps.lyricsProvider.searchSyncedLyrics(request).catch(() => null);
  const baseResult = lyrics ?? deps.sampleCatalog.getSample(request);

  const translatedLines = await deps.translationProvider
    .translateLines({
      lines: baseResult.lines.map((line) => line.originalText),
      sourceLanguage: baseResult.detectedLanguage,
      targetLanguage: request.targetLanguage
    })
    .catch(() => baseResult.lines.map((line) => line.translatedText ?? ""));

  return {
    ...baseResult,
    lines: baseResult.lines.map((line, index) => ({
      ...line,
      translatedText: translatedLines[index] || line.translatedText || "Traducao pendente"
    }))
  };
}

