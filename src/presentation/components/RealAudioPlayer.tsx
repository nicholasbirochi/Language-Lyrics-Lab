import { useEffect } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";

export type AudioSeekRequest = {
  id: number;
  timeMs: number;
};

type Props = {
  audioUrl: string;
  seekRequest: AudioSeekRequest | null;
  title: string;
  artist: string;
  onAudioUrlChange(audioUrl: string): void;
  onLoadedChange(loaded: boolean): void;
  onPlayingChange(playing: boolean): void;
  onTimeChange(currentTimeMs: number, durationMs: number): void;
};

export function RealAudioPlayer({
  audioUrl,
  seekRequest,
  title,
  artist,
  onAudioUrlChange,
  onLoadedChange,
  onPlayingChange,
  onTimeChange
}: Props) {
  const player = useAudioPlayer(null, { updateInterval: 250 });
  const playerStatus = useAudioPlayerStatus(player);
  const trimmedAudioUrl = audioUrl.trim();
  const canPlayAudio = trimmedAudioUrl.length > 0;

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      interruptionMode: "mixWithOthers"
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!canPlayAudio) {
      player.pause();
      onLoadedChange(false);
      onPlayingChange(false);
      return;
    }

    player.replace({ uri: trimmedAudioUrl });
  }, [canPlayAudio, onLoadedChange, onPlayingChange, player, trimmedAudioUrl]);

  useEffect(() => {
    if (!canPlayAudio) {
      onLoadedChange(false);
      onPlayingChange(false);
      return;
    }

    onLoadedChange(Boolean(playerStatus.isLoaded));
    onPlayingChange(Boolean(playerStatus.playing));
    onTimeChange(Math.max(0, playerStatus.currentTime * 1000), Math.max(0, playerStatus.duration * 1000));
  }, [
    canPlayAudio,
    onLoadedChange,
    onPlayingChange,
    onTimeChange,
    playerStatus.currentTime,
    playerStatus.duration,
    playerStatus.isLoaded,
    playerStatus.playing
  ]);

  useEffect(() => {
    if (!seekRequest || !canPlayAudio) {
      return;
    }

    player.seekTo(seekRequest.timeMs / 1000).catch(() => undefined);
  }, [canPlayAudio, player, seekRequest]);

  function handleTogglePlayback() {
    if (!canPlayAudio) {
      return;
    }

    if (playerStatus.playing) {
      player.pause();
      return;
    }

    player.setActiveForLockScreen(true, {
      title,
      artist
    });
    player.play();
  }

  function handleSeekBy(milliseconds: number) {
    if (!canPlayAudio) {
      return;
    }

    const nextTimeSeconds = Math.max(0, playerStatus.currentTime + milliseconds / 1000);
    player.seekTo(nextTimeSeconds).catch(() => undefined);
  }

  return (
    <View style={styles.panel}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Audio real por URL</Text>
        <TextInput
          autoCapitalize="none"
          keyboardType="url"
          onChangeText={onAudioUrlChange}
          placeholder="https://exemplo.com/audio.mp3"
          placeholderTextColor="#8D8C86"
          style={styles.input}
          value={audioUrl}
        />
      </View>

      <View style={styles.controls}>
        <Pressable
          accessibilityRole="button"
          disabled={!canPlayAudio}
          onPress={() => handleSeekBy(-5000)}
          style={[styles.controlButton, !canPlayAudio && styles.controlButtonDisabled]}
        >
          <Text style={styles.controlText}>-5s</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          disabled={!canPlayAudio}
          onPress={handleTogglePlayback}
          style={[styles.primaryButton, !canPlayAudio && styles.controlButtonDisabled]}
        >
          <Text style={styles.primaryButtonText}>{playerStatus.playing ? "Pausar audio" : "Tocar audio"}</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          disabled={!canPlayAudio}
          onPress={() => handleSeekBy(5000)}
          style={[styles.controlButton, !canPlayAudio && styles.controlButtonDisabled]}
        >
          <Text style={styles.controlText}>+5s</Text>
        </Pressable>
      </View>

      <View style={styles.statusRow}>
        <Text style={styles.statusText}>{playerStatus.isLoaded ? "Audio carregado" : "Aguardando audio"}</Text>
        <Text style={styles.statusText}>{formatSeconds(playerStatus.currentTime)}</Text>
      </View>
    </View>
  );
}

function formatSeconds(seconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D7DFDC",
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
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
    backgroundColor: "#F7FAF8",
    borderColor: "#C9D4CF",
    borderRadius: 7,
    borderWidth: 1,
    color: "#151A18",
    fontSize: 15,
    minHeight: 46,
    paddingHorizontal: 12
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
    paddingHorizontal: 10
  },
  controlButtonDisabled: {
    opacity: 0.45
  },
  controlText: {
    color: "#2D3B37",
    fontSize: 13,
    fontWeight: "900"
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#B6422C",
    borderRadius: 7,
    flex: 1.5,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 10
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900"
  },
  statusRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  statusText: {
    color: "#60756E",
    fontSize: 12,
    fontVariant: ["tabular-nums"],
    fontWeight: "800"
  }
});
