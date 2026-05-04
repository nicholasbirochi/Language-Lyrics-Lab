import type { TranslateLinesRequest, TranslationProvider } from "../../domain/lyrics/types";

export class CachedTranslationProvider implements TranslationProvider {
  private readonly cache = new Map<string, string>();

  constructor(private readonly inner: TranslationProvider) {}

  async translateLines(request: TranslateLinesRequest): Promise<string[]> {
    const translatedLines = new Array<string>(request.lines.length).fill("");
    const misses: string[] = [];
    const missIndexes: number[] = [];

    request.lines.forEach((line, index) => {
      const key = createCacheKey(request, line);
      const cachedTranslation = this.cache.get(key);

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
        this.cache.set(createCacheKey(request, originalLine), normalizedTranslation);
      }
    });

    return translatedLines;
  }
}

function createCacheKey(request: TranslateLinesRequest, line: string): string {
  return [request.sourceLanguage, request.targetLanguage, line.trim()].join("|");
}

