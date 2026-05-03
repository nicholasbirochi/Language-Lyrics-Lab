import type { LyricsLine } from "./types";

const timestampPattern = /\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]/g;

export function parseLrc(lrc: string): LyricsLine[] {
  const parsedLines: LyricsLine[] = [];

  lrc.split(/\r?\n/).forEach((rawLine, rawIndex) => {
    const timestamps = Array.from(rawLine.matchAll(timestampPattern));
    const text = rawLine.replace(timestampPattern, "").trim();

    if (timestamps.length === 0 || text.length === 0) {
      return;
    }

    timestamps.forEach((match, timestampIndex) => {
      const startTimeMs = toMilliseconds(match[1], match[2], match[3]);

      parsedLines.push({
        id: `${startTimeMs}-${rawIndex}-${timestampIndex}`,
        startTimeMs,
        originalText: text
      });
    });
  });

  return parsedLines.sort((left, right) => left.startTimeMs - right.startTimeMs);
}

function toMilliseconds(minutes: string, seconds: string, fraction = "0"): number {
  const normalizedFraction = fraction.padEnd(3, "0").slice(0, 3);

  return Number(minutes) * 60_000 + Number(seconds) * 1000 + Number(normalizedFraction);
}

