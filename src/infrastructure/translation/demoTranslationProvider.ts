import type { TranslateLinesRequest, TranslationProvider } from "../../domain/lyrics/types";

const phrasebook = new Map<string, string>([
  ["I am learning one line at a time", "Eu estou aprendendo uma linha por vez"],
  ["Every word becomes easier to hear", "Cada palavra fica mais facil de ouvir"],
  ["I repeat the sound and keep the meaning", "Eu repito o som e mantenho o significado"],
  ["Ich lerne ein Wort nach dem anderen", "Eu aprendo uma palavra depois da outra"],
  ["Heute hoere ich genauer zu", "Hoje eu escuto com mais atencao"],
  ["Die Sprache wird jeden Tag klarer", "A lingua fica mais clara a cada dia"],
  ["Estoy aprendiendo una linea a la vez", "Eu estou aprendendo uma linha por vez"],
  ["La cancion me ayuda a recordar", "A cancao me ajuda a lembrar"],
  ["Escucho, repito y entiendo mejor", "Eu escuto, repito e entendo melhor"]
]);

export class DemoTranslationProvider implements TranslationProvider {
  async translateLines(request: TranslateLinesRequest): Promise<string[]> {
    return request.lines.map((line) => phrasebook.get(line) ?? "");
  }
}

