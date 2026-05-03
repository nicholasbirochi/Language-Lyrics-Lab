import type { StudyLanguage } from "./types";

export type Keyword = {
  id: string;
  text: string;
  count: number;
};

const stopwords: Record<Exclude<StudyLanguage, "auto">, Set<string>> = {
  en: new Set([
    "a",
    "am",
    "and",
    "are",
    "at",
    "be",
    "for",
    "i",
    "in",
    "is",
    "it",
    "me",
    "my",
    "of",
    "on",
    "the",
    "to",
    "you"
  ]),
  de: new Set([
    "am",
    "auf",
    "das",
    "dem",
    "den",
    "der",
    "die",
    "du",
    "ein",
    "eine",
    "ich",
    "im",
    "ist",
    "mit",
    "und",
    "zu"
  ]),
  es: new Set([
    "a",
    "al",
    "de",
    "del",
    "el",
    "en",
    "es",
    "la",
    "las",
    "lo",
    "los",
    "me",
    "mi",
    "que",
    "un",
    "una",
    "y"
  ])
};

export function extractKeywords(text: string, language: StudyLanguage, limit = 6): Keyword[] {
  const normalizedLanguage = language === "auto" ? "en" : language;
  const ignoredWords = stopwords[normalizedLanguage];
  const counts = new Map<string, number>();

  tokenize(text).forEach((token) => {
    if (token.length < 3 || ignoredWords.has(token)) {
      return;
    }

    counts.set(token, (counts.get(token) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .sort(([leftText, leftCount], [rightText, rightCount]) => {
      if (rightCount !== leftCount) {
        return rightCount - leftCount;
      }

      return leftText.localeCompare(rightText);
    })
    .slice(0, limit)
    .map(([keyword, count]) => ({
      id: `${normalizedLanguage}-${keyword}`,
      text: keyword,
      count
    }));
}

function tokenize(text: string): string[] {
  return (
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .match(/[a-z]+(?:'[a-z]+)?/g) ?? []
  );
}
