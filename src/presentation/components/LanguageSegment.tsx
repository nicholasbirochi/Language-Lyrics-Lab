import { Pressable, StyleSheet, Text, View } from "react-native";

import type { StudyLanguage } from "../../domain/lyrics/types";

type LanguageOption = {
  value: StudyLanguage;
  label: string;
};

const options: LanguageOption[] = [
  { value: "en", label: "Ingles" },
  { value: "de", label: "Alemao" },
  { value: "es", label: "Espanhol" },
  { value: "auto", label: "Auto" }
];

type Props = {
  value: StudyLanguage;
  onChange(value: StudyLanguage): void;
};

export function LanguageSegment({ value, onChange }: Props) {
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
    minHeight: 40,
    justifyContent: "center",
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
