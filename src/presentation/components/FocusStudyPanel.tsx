import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Keyword } from "../../domain/lyrics/extractKeywords";
import type { LyricsLine } from "../../domain/lyrics/types";
import type { StudyMode } from "./StudyModeSegment";

type Props = {
  canGoNext: boolean;
  canGoPrevious: boolean;
  index: number;
  keywords: Keyword[];
  line: LyricsLine;
  mode: StudyMode;
  showTranslation: boolean;
  total: number;
  onGoNext(): void;
  onGoPrevious(): void;
  onToggleTranslation(): void;
};

export function FocusStudyPanel({
  canGoNext,
  canGoPrevious,
  index,
  keywords,
  line,
  mode,
  showTranslation,
  total,
  onGoNext,
  onGoPrevious,
  onToggleTranslation
}: Props) {
  const translationVisible = mode !== "flashcards" || showTranslation;

  return (
    <View style={styles.panel}>
      <View style={styles.panelHeader}>
        <Text style={styles.panelLabel}>Linha atual</Text>
        <Text style={styles.counter}>
          {index + 1}/{total}
        </Text>
      </View>

      <Text style={styles.original}>{line.originalText}</Text>

      {translationVisible ? <Text style={styles.translation}>{line.translatedText}</Text> : null}

      <View style={styles.keywordRow}>
        {keywords.length > 0 ? (
          keywords.map((keyword) => (
            <View key={keyword.id} style={styles.keywordChip}>
              <Text style={styles.keywordText}>{keyword.text}</Text>
            </View>
          ))
        ) : (
          <View style={styles.keywordChip}>
            <Text style={styles.keywordText}>sem palavras-chave</Text>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <Pressable
          accessibilityRole="button"
          disabled={!canGoPrevious}
          onPress={onGoPrevious}
          style={[styles.controlButton, !canGoPrevious && styles.controlButtonDisabled]}
        >
          <Text style={styles.controlText}>Anterior</Text>
        </Pressable>

        {mode === "flashcards" ? (
          <Pressable accessibilityRole="button" onPress={onToggleTranslation} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>{showTranslation ? "Ocultar" : "Mostrar"}</Text>
          </Pressable>
        ) : null}

        <Pressable
          accessibilityRole="button"
          disabled={!canGoNext}
          onPress={onGoNext}
          style={[styles.controlButton, !canGoNext && styles.controlButtonDisabled]}
        >
          <Text style={styles.controlText}>Proxima</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: "#FFFFFF",
    borderColor: "#CAD7D2",
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 16
  },
  panelHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  panelLabel: {
    color: "#1F6F68",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  counter: {
    color: "#60756E",
    fontSize: 12,
    fontVariant: ["tabular-nums"],
    fontWeight: "900"
  },
  original: {
    color: "#121816",
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 29
  },
  translation: {
    color: "#47615B",
    fontSize: 17,
    lineHeight: 24
  },
  keywordRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  keywordChip: {
    backgroundColor: "#EEF3F1",
    borderColor: "#D5E0DB",
    borderRadius: 6,
    borderWidth: 1,
    minHeight: 30,
    justifyContent: "center",
    paddingHorizontal: 10
  },
  keywordText: {
    color: "#34514B",
    fontSize: 13,
    fontWeight: "800"
  },
  controls: {
    flexDirection: "row",
    gap: 10
  },
  controlButton: {
    alignItems: "center",
    backgroundColor: "#E8EDEA",
    borderRadius: 7,
    flex: 1,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 12
  },
  controlButtonDisabled: {
    opacity: 0.45
  },
  controlText: {
    color: "#2D3B37",
    fontSize: 14,
    fontWeight: "900"
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#B6422C",
    borderRadius: 7,
    flex: 1,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 12
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900"
  }
});
