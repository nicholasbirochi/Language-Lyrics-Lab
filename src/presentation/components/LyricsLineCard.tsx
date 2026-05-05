import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import type { LyricsLine } from "../../domain/lyrics/types";

type Props = {
  active: boolean;
  editable: boolean;
  favorite: boolean;
  line: LyricsLine;
  index: number;
  onPress(): void;
  onToggleFavorite(): void;
  onUpdateTranslation(translation: string): void;
};

export function LyricsLineCard({
  active,
  editable,
  favorite,
  line,
  index,
  onPress,
  onToggleFavorite,
  onUpdateTranslation
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.container, active && styles.containerActive]}
    >
      <Text style={styles.time}>{formatTime(line.startTimeMs)}</Text>
      <View style={styles.textGroup}>
        <Text style={styles.original}>{line.originalText}</Text>
        {editable ? (
          <TextInput
            multiline
            onChangeText={onUpdateTranslation}
            placeholder="Traducao em portugues"
            placeholderTextColor="#78908A"
            style={styles.translationInput}
            value={line.translatedText}
          />
        ) : (
          <Text style={styles.translation}>{line.translatedText}</Text>
        )}
      </View>
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" onPress={onToggleFavorite} style={styles.favoriteButton}>
          <Text style={[styles.favoriteText, favorite && styles.favoriteTextActive]}>{favorite ? "Salvo" : "Salvar"}</Text>
        </Pressable>
        <Text style={styles.index}>{String(index + 1).padStart(2, "0")}</Text>
      </View>
    </Pressable>
  );
}

function formatTime(startTimeMs: number): string {
  const totalSeconds = Math.floor(startTimeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderColor: "#D7DFDC",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 14
  },
  containerActive: {
    backgroundColor: "#F4FAF7",
    borderColor: "#1F6F68"
  },
  time: {
    color: "#60756E",
    fontSize: 12,
    fontVariant: ["tabular-nums"],
    fontWeight: "800",
    minWidth: 40,
    paddingTop: 3
  },
  textGroup: {
    flex: 1,
    gap: 5
  },
  original: {
    color: "#141A18",
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 23
  },
  translation: {
    color: "#47615B",
    fontSize: 15,
    lineHeight: 21
  },
  translationInput: {
    backgroundColor: "#F7FAF8",
    borderColor: "#C9D7D1",
    borderRadius: 7,
    borderWidth: 1,
    color: "#22332F",
    fontSize: 15,
    lineHeight: 21,
    minHeight: 44,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  actions: {
    alignItems: "flex-end",
    gap: 8
  },
  favoriteButton: {
    alignItems: "center",
    backgroundColor: "#EEF3F1",
    borderRadius: 6,
    minHeight: 30,
    justifyContent: "center",
    paddingHorizontal: 8
  },
  favoriteText: {
    color: "#47615B",
    fontSize: 11,
    fontWeight: "900"
  },
  favoriteTextActive: {
    color: "#B6422C"
  },
  index: {
    color: "#94A09B",
    fontSize: 12,
    fontVariant: ["tabular-nums"],
    fontWeight: "700",
    paddingTop: 3
  }
});
