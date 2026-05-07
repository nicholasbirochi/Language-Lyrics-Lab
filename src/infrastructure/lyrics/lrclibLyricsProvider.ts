import { parseLrc } from "../../domain/lyrics/parseLrc";
import type { LyricsProvider, LyricsStudyRequest, LyricsStudyResult } from "../../domain/lyrics/types";

type LrcLibResponse = {
  trackName?: string;
  artistName?: string;
  instrumental?: boolean;
  plainLyrics?: string | null;
  syncedLyrics?: string | null;
};

export class LrcLibLyricsProvider implements LyricsProvider {
  constructor(private readonly baseUrl = "https://lrclib.net") {}

  async searchSyncedLyrics(request: LyricsStudyRequest): Promise<LyricsStudyResult | null> {
    if (!request.artist.trim() || !request.track.trim()) {
      return null;
    }

    const params = new URLSearchParams({
      artist_name: request.artist.trim(),
      track_name: request.track.trim()
    });

    if (request.album?.trim()) {
      params.set("album_name", request.album.trim());
    }

    if (request.durationSeconds) {
      params.set("duration", String(request.durationSeconds));
    }

    const response = await fetch(`${this.baseUrl}/api/get?${params.toString()}`);

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as LrcLibResponse;

    if (data.instrumental) {
      return null;
    }

    const syncedLines = data.syncedLyrics ? parseLrc(data.syncedLyrics) : [];
    const plainLines = !data.syncedLyrics && data.plainLyrics ? toPlainLines(data.plainLyrics) : [];
    const lines = syncedLines.length > 0 ? syncedLines : plainLines;

    if (lines.length === 0) {
      return null;
    }

    return {
      artistName: data.artistName ?? request.artist,
      trackName: data.trackName ?? request.track,
      detectedLanguage: request.sourceLanguage,
      targetLanguage: request.targetLanguage,
      source: "lrclib",
      synced: syncedLines.length > 0,
      lines
    };
  }
}

function toPlainLines(plainLyrics: string) {
  return plainLyrics
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => ({
      id: `plain-${index}`,
      startTimeMs: index * 2500,
      originalText: line
    }));
}

