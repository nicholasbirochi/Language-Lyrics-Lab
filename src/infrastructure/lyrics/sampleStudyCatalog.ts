import type { LyricsStudyRequest, LyricsStudyResult, StudyLanguage } from "../../domain/lyrics/types";

const samples: Record<Exclude<StudyLanguage, "auto">, LyricsStudyResult> = {
  en: {
    artistName: "Study Session",
    trackName: "English Warmup",
    detectedLanguage: "en",
    targetLanguage: "pt-BR",
    source: "sample",
    synced: true,
    lines: [
      {
        id: "en-1",
        startTimeMs: 0,
        originalText: "I am learning one line at a time",
        translatedText: "Eu estou aprendendo uma linha por vez"
      },
      {
        id: "en-2",
        startTimeMs: 4200,
        originalText: "Every word becomes easier to hear",
        translatedText: "Cada palavra fica mais facil de ouvir"
      },
      {
        id: "en-3",
        startTimeMs: 8600,
        originalText: "I repeat the sound and keep the meaning",
        translatedText: "Eu repito o som e mantenho o significado"
      }
    ]
  },
  de: {
    artistName: "Study Session",
    trackName: "German Warmup",
    detectedLanguage: "de",
    targetLanguage: "pt-BR",
    source: "sample",
    synced: true,
    lines: [
      {
        id: "de-1",
        startTimeMs: 0,
        originalText: "Ich lerne ein Wort nach dem anderen",
        translatedText: "Eu aprendo uma palavra depois da outra"
      },
      {
        id: "de-2",
        startTimeMs: 4200,
        originalText: "Heute hoere ich genauer zu",
        translatedText: "Hoje eu escuto com mais atencao"
      },
      {
        id: "de-3",
        startTimeMs: 8600,
        originalText: "Die Sprache wird jeden Tag klarer",
        translatedText: "A lingua fica mais clara a cada dia"
      }
    ]
  },
  es: {
    artistName: "Study Session",
    trackName: "Spanish Warmup",
    detectedLanguage: "es",
    targetLanguage: "pt-BR",
    source: "sample",
    synced: true,
    lines: [
      {
        id: "es-1",
        startTimeMs: 0,
        originalText: "Estoy aprendiendo una linea a la vez",
        translatedText: "Eu estou aprendendo uma linha por vez"
      },
      {
        id: "es-2",
        startTimeMs: 4200,
        originalText: "La cancion me ayuda a recordar",
        translatedText: "A cancao me ajuda a lembrar"
      },
      {
        id: "es-3",
        startTimeMs: 8600,
        originalText: "Escucho, repito y entiendo mejor",
        translatedText: "Eu escuto, repito e entendo melhor"
      }
    ]
  }
};

export const sampleStudyCatalog = {
  getSample(request: LyricsStudyRequest): LyricsStudyResult {
    const language = request.sourceLanguage === "auto" ? "en" : request.sourceLanguage;
    const sample = samples[language];

    return {
      ...sample,
      targetLanguage: request.targetLanguage,
      lines: sample.lines.map((line) => ({ ...line }))
    };
  }
};

