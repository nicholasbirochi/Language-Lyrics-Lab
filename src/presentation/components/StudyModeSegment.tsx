import { Pressable, StyleSheet, Text, View } from "react-native";

export type StudyMode = "lyrics" | "review" | "flashcards";

type StudyModeOption = {
  value: StudyMode;
  label: string;
};

const options: StudyModeOption[] = [
  { value: "lyrics", label: "Letra" },
  { value: "review", label: "Revisao" },
  { value: "flashcards", label: "Cards" }
];

type Props = {
  value: StudyMode;
  onChange(value: StudyMode): void;
};

export function StudyModeSegment({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected }}
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.option, selected && styles.optionSelected]}
          >
            <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#DCE5E1",
    borderRadius: 8,
    flexDirection: "row",
    gap: 4,
    padding: 4
  },
  option: {
    alignItems: "center",
    borderRadius: 6,
    flex: 1,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: 10
  },
  optionSelected: {
    backgroundColor: "#1F6F68"
  },
  optionText: {
    color: "#43534E",
    fontSize: 13,
    fontWeight: "700"
  },
  optionTextSelected: {
    color: "#FFFFFF"
  }
});
