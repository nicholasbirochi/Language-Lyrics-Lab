import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import { buildStudyLyrics } from "../../application/lyrics/buildStudyLyrics";
import { extractKeywords } from "../../domain/lyrics/extractKeywords";
import { parseLrc } from "../../domain/lyrics/parseLrc";
import type { LyricsLine, LyricsStudyResult, StudyLanguage } from "../../domain/lyrics/types";
import { LrcLibLyricsProvider } from "../../infrastructure/lyrics/lrclibLyricsProvider";
import { sampleStudyCatalog } from "../../infrastructure/lyrics/sampleStudyCatalog";
import { createTranslationProvider } from "../../infrastructure/translation/createTranslationProvider";
import { FocusStudyPanel } from "../components/FocusStudyPanel";
import { LanguageSegment } from "../components/LanguageSegment";
import { LyricsLineCard } from "../components/LyricsLineCard";
import { RealAudioPlayer, type AudioSeekRequest } from "../components/RealAudioPlayer";
import { StudyModeSegment, type StudyMode } from "../components/StudyModeSegment";
import { useStoredState } from "../hooks/useStoredState";

type Status = "idle" | "loading" | "ready" | "fallback" | "empty" | "error";

type HistoryEntry = {
  id: string;
  artistName: string;
  trackName: string;
  language: StudyLanguage;
  source: LyricsStudyResult["source"];
};

const lyricsProvider = new LrcLibLyricsProvider();
const translationProvider = createTranslationProvider();

export function LyricsStudyScreen() {
  const [artist, setArtist] = useState("");
  const [track, setTrack] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState<StudyLanguage>("en");
  const [studyMode, setStudyMode] = useState<StudyMode>("lyrics");
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [manualLrc, setManualLrc] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [syncOffsetMs, setSyncOffsetMs] = useState(0);
  const [audioDurationMs, setAudioDurationMs] = useState(0);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioSeekRequest, setAudioSeekRequest] = useState<AudioSeekRequest | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFlashcardTranslation, setShowFlashcardTranslation] = useState(false);
  const [audioUrl, setAudioUrl] = useStoredState<string>("language-lyrics-lab:audio-url", "");
  const [favoriteLineIds, setFavoriteLineIds] = useStoredState<string[]>("language-lyrics-lab:favorites", []);
  const [history, setHistory] = useStoredState<HistoryEntry[]>("language-lyrics-lab:history", []);
  const [result, setResult] = useState<LyricsStudyResult>(() =>
    sampleStudyCatalog.getSample({
      artist: "",
      track: "",
      sourceLanguage: "en",
      targetLanguage: "pt-BR"
    })
  );

  const activeLine = result.lines[activeIndex] ?? result.lines[0];
  const durationMs = useMemo(() => getDurationMs(result.lines), [result.lines]);
  const displayDurationMs = Math.max(durationMs, audioDurationMs);
  const progressPercent =
    displayDurationMs > 0 ? Math.min(100, Math.max(0, (currentTimeMs / displayDurationMs) * 100)) : 0;
  const adjustedTimeMs = currentTimeMs + syncOffsetMs;
  const favoriteCount = favoriteLineIds.length;

  const sourceLabel = useMemo(() => {
    if (result.source === "lrclib") {
      return result.synced ? "LRCLIB sincronizada" : "LRCLIB";
    }

    if (result.source === "manual") {
      return "LRC manual";
    }

    return "Sessao de estudo";
  }, [result.source, result.synced]);

  const activeKeywords = useMemo(() => {
    if (!activeLine) {
      return [];
    }

    return extractKeywords(activeLine.originalText, result.detectedLanguage);
  }, [activeLine, result.detectedLanguage]);

  useEffect(() => {
    if (activeIndex < result.lines.length) {
      return;
    }

    setActiveIndex(0);
    setCurrentTimeMs(result.lines[0]?.startTimeMs ?? 0);
  }, [activeIndex, result.lines]);

  useEffect(() => {
    const nextActiveIndex = findActiveLineIndex(result.lines, adjustedTimeMs);

    if (nextActiveIndex !== activeIndex) {
      setActiveIndex(nextActiveIndex);
    }
  }, [activeIndex, adjustedTimeMs, result.lines]);

  useEffect(() => {
    if (!isPlaying || audioPlaying) {
      return;
    }

    const timerId = setInterval(() => {
      setCurrentTimeMs((time) => {
        const nextTime = time + 500;

        if (nextTime >= durationMs) {
          setIsPlaying(false);
          return durationMs;
        }

        return nextTime;
      });
    }, 500);

    return () => clearInterval(timerId);
  }, [audioPlaying, durationMs, isPlaying]);

  const handleAudioTimeChange = useCallback((audioCurrentTimeMs: number, nextAudioDurationMs: number) => {
    setCurrentTimeMs(audioCurrentTimeMs);

    if (nextAudioDurationMs > 0) {
      setAudioDurationMs(nextAudioDurationMs);
    }
  }, []);

  const handleAudioPlayingChange = useCallback((playing: boolean) => {
    setAudioPlaying(playing);

    if (playing) {
      setIsPlaying(false);
    }
  }, []);

  const handleAudioLoadedChange = useCallback((loaded: boolean) => {
    setAudioLoaded(loaded);

    if (!loaded) {
      setAudioDurationMs(0);
    }
  }, []);

  async function handleSearch() {
    const artistName = artist.trim();
    const trackName = track.trim();

    if (!artistName || !trackName) {
      applyStudyResult(
        sampleStudyCatalog.getSample({
          artist: "",
          track: "",
          sourceLanguage,
          targetLanguage: "pt-BR"
        }),
        "empty",
        "Informe artista e musica para buscar na LRCLIB.",
        false
      );
      return;
    }

    setStatus("loading");
    setFeedback(null);

    try {
      const nextResult = await buildStudyLyrics(
        {
          artist: artistName,
          track: trackName,
          sourceLanguage,
          targetLanguage: "pt-BR"
        },
        {
          lyricsProvider,
          translationProvider,
          sampleCatalog: sampleStudyCatalog
        }
      );

      if (nextResult.source === "sample") {
        applyStudyResult(
          nextResult,
          "fallback",
          "Nao encontrei essa letra na LRCLIB. Mantive uma sessao offline do idioma selecionado.",
          true
        );
        return;
      }

      applyStudyResult(nextResult, "ready", null, true);
    } catch {
      applyStudyResult(
        sampleStudyCatalog.getSample({
          artist: "",
          track: "",
          sourceLanguage,
          targetLanguage: "pt-BR"
        }),
        "error",
        "Nao consegui completar a busca agora. Mantive uma sessao offline.",
        false
      );
    }
  }

  async function handleImportManualLrc() {
    const parsedLines = parseLrc(manualLrc);

    if (parsedLines.length === 0) {
      setStatus("empty");
      setFeedback("Cole uma letra LRC com timestamps antes de importar.");
      return;
    }

    setStatus("loading");
    setFeedback(null);

    const translatedLines = await translationProvider
      .translateLines({
        lines: parsedLines.map((line) => line.originalText),
        sourceLanguage,
        targetLanguage: "pt-BR"
      })
      .catch(() => parsedLines.map(() => ""));

    applyStudyResult(
      {
        artistName: artist.trim() || "Manual",
        trackName: track.trim() || "LRC importado",
        detectedLanguage: sourceLanguage,
        targetLanguage: "pt-BR",
        source: "manual",
        synced: true,
        lines: parsedLines.map((line, index) => ({
          ...line,
          translatedText: translatedLines[index] || "Traducao pendente"
        }))
      },
      "ready",
      "LRC manual carregado para estudo.",
      true
    );
  }

  function handleLanguageChange(language: StudyLanguage) {
    setSourceLanguage(language);

    const sample = sampleStudyCatalog.getSample({
      artist: "",
      track: "",
      sourceLanguage: language,
      targetLanguage: "pt-BR"
    });

    if (!artist && !track && !manualLrc) {
      applyStudyResult(sample, "idle", null, false);
    }
  }

  function applyStudyResult(
    nextResult: LyricsStudyResult,
    nextStatus: Status,
    nextFeedback: string | null,
    addToHistory: boolean
  ) {
    setResult(nextResult);
    setActiveIndex(0);
    setCurrentTimeMs(nextResult.lines[0]?.startTimeMs ?? 0);
    setSyncOffsetMs(0);
    setIsPlaying(false);
    setShowFlashcardTranslation(false);
    setStatus(nextStatus);
    setFeedback(nextFeedback);

    if (addToHistory) {
      setHistory((currentHistory) => [
        {
          id: `${Date.now()}-${nextResult.source}`,
          artistName: nextResult.artistName,
          trackName: nextResult.trackName,
          language: nextResult.detectedLanguage,
          source: nextResult.source
        },
        ...currentHistory
      ].slice(0, 6));
    }
  }

  function handleSelectLine(index: number) {
    const line = result.lines[index];

    if (!line) {
      return;
    }

    setActiveIndex(index);
    setCurrentTimeMs(line.startTimeMs);
    setAudioSeekRequest({
      id: Date.now(),
      timeMs: line.startTimeMs
    });
    setShowFlashcardTranslation(false);
  }

  function handleGoPrevious() {
    handleSelectLine(Math.max(0, activeIndex - 1));
  }

  function handleGoNext() {
    handleSelectLine(Math.min(result.lines.length - 1, activeIndex + 1));
  }

  function handleTogglePlayback() {
    if (audioLoaded || audioPlaying) {
      setFeedback("Use os controles do audio real quando houver uma URL carregada.");
      return;
    }

    if (currentTimeMs >= durationMs) {
      setCurrentTimeMs(result.lines[0]?.startTimeMs ?? 0);
    }

    setIsPlaying((playing) => !playing);
  }

  function handleUpdateTranslation(lineId: string, translation: string) {
    setResult((currentResult) => ({
      ...currentResult,
      lines: currentResult.lines.map((line) =>
        line.id === lineId
          ? {
              ...line,
              translatedText: translation
            }
          : line
      )
    }));
  }

  function handleToggleFavorite(lineId: string) {
    setFavoriteLineIds((currentIds) =>
      currentIds.includes(lineId) ? currentIds.filter((id) => id !== lineId) : [...currentIds, lineId]
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboard}>
        <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Lyrics Translate Player</Text>
            <Text style={styles.title}>Estudo com musica</Text>
          </View>

          <View style={styles.searchPanel}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Artista</Text>
              <TextInput
                autoCapitalize="words"
                onChangeText={setArtist}
                placeholder="Ex: Coldplay"
                placeholderTextColor="#8D8C86"
                returnKeyType="next"
                style={styles.input}
                value={artist}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Musica</Text>
              <TextInput
                autoCapitalize="words"
                onChangeText={setTrack}
                placeholder="Ex: Yellow"
                placeholderTextColor="#8D8C86"
                returnKeyType="search"
                style={styles.input}
                value={track}
                onSubmitEditing={handleSearch}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Idioma</Text>
              <LanguageSegment value={sourceLanguage} onChange={handleLanguageChange} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Modo</Text>
              <StudyModeSegment value={studyMode} onChange={setStudyMode} />
            </View>

            <Pressable
              accessibilityRole="button"
              disabled={status === "loading"}
              onPress={handleSearch}
              style={({ pressed }) => [
                styles.searchButton,
                pressed && styles.searchButtonPressed,
                status === "loading" && styles.searchButtonDisabled
              ]}
            >
              {status === "loading" ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.searchButtonText}>Buscar letra</Text>
              )}
            </Pressable>
          </View>

          <View style={styles.manualPanel}>
            <Text style={styles.label}>Importar LRC manual</Text>
            <TextInput
              multiline
              onChangeText={setManualLrc}
              placeholder="[00:12.40] I am learning..."
              placeholderTextColor="#8D8C86"
              style={styles.manualInput}
              value={manualLrc}
            />
            <Pressable
              accessibilityRole="button"
              disabled={status === "loading"}
              onPress={handleImportManualLrc}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}
            >
              <Text style={styles.secondaryButtonText}>Carregar LRC</Text>
            </Pressable>
          </View>

          <RealAudioPlayer
            artist={result.artistName}
            audioUrl={audioUrl}
            seekRequest={audioSeekRequest}
            title={result.trackName}
            onAudioUrlChange={setAudioUrl}
            onLoadedChange={handleAudioLoadedChange}
            onPlayingChange={handleAudioPlayingChange}
            onTimeChange={handleAudioTimeChange}
          />

          <View style={styles.nowPlaying}>
            <View style={styles.trackInfo}>
              <Text style={styles.nowPlayingLabel}>{sourceLabel}</Text>
              <Text style={styles.track}>{result.trackName}</Text>
              <Text style={styles.artist}>{result.artistName}</Text>
            </View>
            <View style={styles.badgeColumn}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>PT-BR</Text>
              </View>
              <Text style={styles.favoriteCounter}>{favoriteCount} salvas</Text>
            </View>
          </View>

          <View style={styles.playerPanel}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
            <View style={styles.playerControls}>
              <Pressable accessibilityRole="button" onPress={handleGoPrevious} style={styles.playerButton}>
                <Text style={styles.playerButtonText}>Anterior</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={handleTogglePlayback} style={styles.playButton}>
                <Text style={styles.playButtonText}>{isPlaying ? "Pausar guia" : "Tocar guia"}</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={handleGoNext} style={styles.playerButton}>
                <Text style={styles.playerButtonText}>Proxima</Text>
              </Pressable>
            </View>
            <View style={styles.syncControls}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setSyncOffsetMs((offset) => offset - 250)}
                style={styles.syncButton}
              >
                <Text style={styles.syncButtonText}>-250 ms</Text>
              </Pressable>
              <View style={styles.syncOffsetBadge}>
                <Text style={styles.syncOffsetText}>{formatSignedMilliseconds(syncOffsetMs)}</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={() => setSyncOffsetMs((offset) => offset + 250)}
                style={styles.syncButton}
              >
                <Text style={styles.syncButtonText}>+250 ms</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={() => setSyncOffsetMs(0)} style={styles.syncButton}>
                <Text style={styles.syncButtonText}>Reset</Text>
              </Pressable>
            </View>
            <Text style={styles.playerNote}>
              {audioLoaded
                ? "Tempo sincronizado pelo audio real."
                : "Sem audio carregado, o botao guia simula o tempo das letras."}
            </Text>
          </View>

          {feedback ? (
            <Text style={[styles.notice, (status === "empty" || status === "error") && styles.noticeStrong]}>
              {feedback}
            </Text>
          ) : null}

          {activeLine ? (
            <FocusStudyPanel
              canGoNext={activeIndex < result.lines.length - 1}
              canGoPrevious={activeIndex > 0}
              index={activeIndex}
              keywords={activeKeywords}
              line={activeLine}
              mode={studyMode}
              showTranslation={showFlashcardTranslation}
              total={result.lines.length}
              onGoNext={handleGoNext}
              onGoPrevious={handleGoPrevious}
              onToggleTranslation={() => setShowFlashcardTranslation((visible) => !visible)}
            />
          ) : null}

          {studyMode !== "flashcards" ? (
            <View style={styles.lyricsList}>
              {result.lines.map((line, index) => (
                <LyricsLineCard
                  active={index === activeIndex}
                  editable={studyMode === "review"}
                  favorite={favoriteLineIds.includes(line.id)}
                  index={index}
                  key={line.id}
                  line={line}
                  onPress={() => handleSelectLine(index)}
                  onToggleFavorite={() => handleToggleFavorite(line.id)}
                  onUpdateTranslation={(translation) => handleUpdateTranslation(line.id, translation)}
                />
              ))}
            </View>
          ) : null}

          <View style={styles.historyPanel}>
            <Text style={styles.historyTitle}>Historico da sessao</Text>
            {history.length > 0 ? (
              history.map((entry) => (
                <View key={entry.id} style={styles.historyEntry}>
                  <Text style={styles.historyTrack}>{entry.trackName}</Text>
                  <Text style={styles.historyMeta}>
                    {entry.artistName} | {entry.language.toUpperCase()} | {entry.source}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyHistory}>Nenhuma busca carregada ainda.</Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function findActiveLineIndex(lines: LyricsLine[], currentTimeMs: number): number {
  if (lines.length === 0) {
    return 0;
  }

  for (let index = lines.length - 1; index >= 0; index -= 1) {
    if (currentTimeMs >= lines[index].startTimeMs) {
      return index;
    }
  }

  return 0;
}

function getDurationMs(lines: LyricsLine[]): number {
  const lastLine = lines[lines.length - 1];

  return lastLine ? lastLine.startTimeMs + 4000 : 0;
}

function formatSignedMilliseconds(value: number): string {
  if (value === 0) {
    return "0 ms";
  }

  return `${value > 0 ? "+" : ""}${value} ms`;
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#F4F6F4",
    flex: 1
  },
  keyboard: {
    flex: 1
  },
  page: {
    alignSelf: "center",
    gap: 18,
    maxWidth: 980,
    padding: 20,
    width: "100%"
  },
  header: {
    gap: 6,
    paddingTop: 10
  },
  eyebrow: {
    color: "#1F6F68",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase"
  },
  title: {
    color: "#151A18",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40
  },
  searchPanel: {
    backgroundColor: "#E8EDEA",
    borderColor: "#CCD7D2",
    borderRadius: 8,
    borderWidth: 1,
    gap: 14,
    padding: 14
  },
  inputGroup: {
    gap: 7
  },
  label: {
    color: "#3C4542",
    fontSize: 13,
    fontWeight: "800"
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#C9D4CF",
    borderRadius: 7,
    borderWidth: 1,
    color: "#151A18",
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 12
  },
  searchButton: {
    alignItems: "center",
    backgroundColor: "#B6422C",
    borderRadius: 7,
    justifyContent: "center",
    minHeight: 50,
    paddingHorizontal: 16
  },
  searchButtonPressed: {
    backgroundColor: "#943521"
  },
  searchButtonDisabled: {
    opacity: 0.75
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900"
  },
  manualPanel: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D7DFDC",
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 14
  },
  manualInput: {
    backgroundColor: "#F7FAF8",
    borderColor: "#C9D4CF",
    borderRadius: 7,
    borderWidth: 1,
    color: "#151A18",
    fontSize: 14,
    lineHeight: 20,
    minHeight: 96,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlignVertical: "top"
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: "#E8EDEA",
    borderRadius: 7,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 16
  },
  secondaryButtonPressed: {
    backgroundColor: "#D6E0DC"
  },
  secondaryButtonText: {
    color: "#263B36",
    fontSize: 14,
    fontWeight: "900"
  },
  nowPlaying: {
    alignItems: "center",
    backgroundColor: "#19211F",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    padding: 16
  },
  trackInfo: {
    flex: 1
  },
  nowPlayingLabel: {
    color: "#9FD5C8",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 5,
    textTransform: "uppercase"
  },
  track: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 26
  },
  artist: {
    color: "#D7D2C7",
    fontSize: 14,
    marginTop: 2
  },
  badgeColumn: {
    alignItems: "flex-end",
    gap: 6
  },
  badge: {
    alignItems: "center",
    backgroundColor: "#F4B942",
    borderRadius: 6,
    justifyContent: "center",
    minHeight: 36,
    minWidth: 62,
    paddingHorizontal: 10
  },
  badgeText: {
    color: "#211A0D",
    fontSize: 12,
    fontWeight: "900"
  },
  favoriteCounter: {
    color: "#CFE2DC",
    fontSize: 12,
    fontWeight: "800"
  },
  playerPanel: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D7DFDC",
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 14
  },
  progressTrack: {
    backgroundColor: "#DCE5E1",
    borderRadius: 4,
    height: 8,
    overflow: "hidden"
  },
  progressFill: {
    backgroundColor: "#1F6F68",
    height: "100%"
  },
  playerControls: {
    flexDirection: "row",
    gap: 10
  },
  syncControls: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  syncButton: {
    alignItems: "center",
    backgroundColor: "#E8EDEA",
    borderRadius: 7,
    justifyContent: "center",
    minHeight: 36,
    minWidth: 76,
    paddingHorizontal: 10
  },
  syncButtonText: {
    color: "#2D3B37",
    fontSize: 12,
    fontWeight: "900"
  },
  syncOffsetBadge: {
    alignItems: "center",
    backgroundColor: "#263B36",
    borderRadius: 7,
    justifyContent: "center",
    minHeight: 36,
    minWidth: 82,
    paddingHorizontal: 10
  },
  syncOffsetText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontVariant: ["tabular-nums"],
    fontWeight: "900"
  },
  playerButton: {
    alignItems: "center",
    backgroundColor: "#E8EDEA",
    borderRadius: 7,
    flex: 1,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 10
  },
  playerButtonText: {
    color: "#2D3B37",
    fontSize: 13,
    fontWeight: "900"
  },
  playButton: {
    alignItems: "center",
    backgroundColor: "#B6422C",
    borderRadius: 7,
    flex: 1,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 10
  },
  playButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900"
  },
  playerNote: {
    color: "#60756E",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 17
  },
  notice: {
    color: "#47615B",
    fontSize: 13,
    fontWeight: "700"
  },
  noticeStrong: {
    color: "#8A3A25"
  },
  lyricsList: {
    gap: 10
  },
  historyPanel: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D7DFDC",
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 14
  },
  historyTitle: {
    color: "#263B36",
    fontSize: 14,
    fontWeight: "900"
  },
  historyEntry: {
    borderColor: "#E0E8E4",
    borderRadius: 7,
    borderWidth: 1,
    gap: 3,
    padding: 10
  },
  historyTrack: {
    color: "#141A18",
    fontSize: 14,
    fontWeight: "900"
  },
  historyMeta: {
    color: "#60756E",
    fontSize: 12,
    fontWeight: "700"
  },
  emptyHistory: {
    color: "#60756E",
    fontSize: 13,
    fontWeight: "700"
  }
});
