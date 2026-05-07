import type { StudyLanguage, TranslateLinesRequest, TranslationProvider } from "../../domain/lyrics/types";

type LibreTranslateResponse = {
  translatedText?: string;
};

export class LibreTranslateProvider implements TranslationProvider {
  constructor(
    private readonly baseUrl: string,
    private readonly apiKey?: string
  ) {}

  async translateLines(request: TranslateLinesRequest): Promise<string[]> {
    const source = toLibreTranslateLanguage(request.sourceLanguage);

    const translated = await Promise.all(
      request.lines.map(async (line) => {
        if (!line.trim()) {
          return "";
        }

        const response = await fetch(`${this.baseUrl.replace(/\/$/, "")}/translate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            q: line,
            source,
            target: "pt",
            format: "text",
            api_key: this.apiKey
          })
        });

        if (!response.ok) {
          return "";
        }

        const data = (await response.json()) as LibreTranslateResponse;
        return data.translatedText ?? "";
      })
    );

    return translated;
  }
}

function toLibreTranslateLanguage(language: StudyLanguage): string {
  return language === "auto" ? "auto" : language;
}
