import type { TranslateLinesRequest, TranslationProvider } from "../../domain/lyrics/types";

type TranslationCache = Record<string, string>;

export class PersistentTranslationProvider implements TranslationProvider {
  constructor(
    private readonly inner: TranslationProvider,
    private readonly storageKey = "language-lyrics-lab:translation-cache"
  ) {}

  async translateLines(request: TranslateLinesRequest): Promise<string[]> {
    const cache = this.readCache();
    const translatedLines = new Array<string>(request.lines.length).fill("");
    const misses: string[] = [];
    const missIndexes: number[] = [];

    request.lines.forEach((line, index) => {
      const cachedTranslation = cache[createCacheKey(request, line)];

      if (cachedTranslation !== undefined) {
        translatedLines[index] = cachedTranslation;
        return;
      }

      misses.push(line);
      missIndexes.push(index);
    });

    if (misses.length === 0) {
      return translatedLines;
    }

    const translatedMisses = await this.inner.translateLines({
      ...request,
      lines: misses
    });

    translatedMisses.forEach((translation, missIndex) => {
      const originalIndex = missIndexes[missIndex];
      const originalLine = misses[missIndex];
      const normalizedTranslation = translation ?? "";

      translatedLines[originalIndex] = normalizedTranslation;

      if (normalizedTranslation) {
        cache[createCacheKey(request, originalLine)] = normalizedTranslation;
      }
    });

    this.writeCache(cache);

    return translatedLines;
  }

  private readCache(): TranslationCache {
    const storage = getStorage();

    if (!storage) {
      return {};
    }

    try {
      const rawCache = storage.getItem(this.storageKey);

      return rawCache ? (JSON.parse(rawCache) as TranslationCache) : {};
    } catch {
      return {};
    }
  }

  private writeCache(cache: TranslationCache) {
    const storage = getStorage();

    if (!storage) {
      return;
    }

    try {
      storage.setItem(this.storageKey, JSON.stringify(cache));
    } catch {
      // Storage can fail in private windows or restricted environments.
    }
  }
}

function createCacheKey(request: TranslateLinesRequest, line: string): string {
  return [request.sourceLanguage, request.targetLanguage, line.trim()].join("|");
}

function getStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
