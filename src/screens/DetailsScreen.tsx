import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAppContext } from "../context/AppContext";
import { meditationRepository } from "../repositories/meditationRepository";
import { Meditation } from "../models/Meditation";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function DetailsScreen({ route }: any) {
  const { meditationId } = route.params;
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useAppContext();

  const [meditation, setMeditation] = useState<Meditation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    void loadMeditation();
  }, [meditationId]);

  const loadMeditation = async () => {
    setIsLoading(true);

    const localItem = await meditationRepository.getCachedMeditationById(
      meditationId
    );
    setMeditation(localItem);

    try {
      const remoteItem = await meditationRepository.refreshMeditationById(
        meditationId
      );

      if (remoteItem) {
        setMeditation(remoteItem);
      }
    } catch (e) {
      console.log("Refresh meditation error", e);
    } finally {
      setIsLoading(false);
    }
  };

  const selectPreset = (min: number) => {
    setSelectedDuration(min);
    setMinutes(min);
    setSeconds(0);
  };

  const addMinute = () => {
    if (minutes < 59) setMinutes((prev) => prev + 1);
  };

  const removeMinute = () => {
    if (minutes > 0) setMinutes((prev) => prev - 1);
  };

  const addSecond = () => {
    if (minutes === 59 && seconds === 50) return;

    if (seconds === 50) {
      setMinutes((prev) => prev + 1);
      setSeconds(0);
    } else {
      setSeconds((prev) => prev + 10);
    }
  };

  const removeSecond = () => {
    if (seconds > 0) {
      setSeconds((prev) => prev - 10);
    } else if (minutes > 0) {
      setMinutes((prev) => prev - 1);
      setSeconds(50);
    }
  };

  const reset = () => {
    setMinutes(0);
    setSeconds(0);
  };

  const totalSeconds = minutes * 60 + seconds;

  if (isLoading && !meditation) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: theme.bg, justifyContent: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  if (!meditation) {
    return (
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <Text style={{ color: theme.text }}>Meditation not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        {selectedDuration === null ? (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.headerBtn, { color: theme.accent }]}>
              ← Back
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setSelectedDuration(null)}>
            <Text style={[styles.headerBtn, { color: theme.accent }]}>
              ← Presets
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.title, { color: theme.text }]}>
        {meditation.title}
      </Text>

      <Text style={{ color: theme.sub }}>{meditation.description}</Text>

      {selectedDuration === null ? (
        <>
          <Text style={{ color: theme.accent, marginTop: 20 }}>
            Choose duration:
          </Text>

          {meditation.durations.map((d: number) => (
            <TouchableOpacity
              key={d}
              style={[styles.optionBtn, { backgroundColor: theme.card }]}
              onPress={() => selectPreset(d)}
            >
              <Text style={{ color: theme.text }}>{d} min</Text>
            </TouchableOpacity>
          ))}
        </>
      ) : (
        <>
          <Text style={{ color: theme.accent, marginTop: 20 }}>
            Adjust time:
          </Text>

          <View style={styles.adjustRow}>
            <View>
              <TouchableOpacity
                onPress={removeMinute}
                style={[styles.adjustBtn, { backgroundColor: theme.card }]}
              >
                <Text style={{ color: theme.text }}>-</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={removeSecond}
                style={[styles.adjustBtn, { backgroundColor: theme.card }]}
              >
                <Text style={{ color: theme.text }}>-</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.timeBlock}>
              <Text style={{ color: theme.text, fontSize: 18 }}>
                {minutes} min
              </Text>
              <Text style={{ color: theme.text, fontSize: 18 }}>
                {seconds} sec
              </Text>
            </View>

            <View>
              <TouchableOpacity
                onPress={addMinute}
                style={[styles.adjustBtn, { backgroundColor: theme.card }]}
              >
                <Text style={{ color: theme.text }}>+</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={addSecond}
                style={[styles.adjustBtn, { backgroundColor: theme.card }]}
              >
                <Text style={{ color: theme.text }}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={reset} style={[styles.resetBtn]}>
            <Text style={styles.resetText}>RESET</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.startBtn, { backgroundColor: theme.accent }]}
            onPress={() =>
              navigation.navigate("Player", {
                meditationId: meditation.id,
                duration: totalSeconds,
              })
            }
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>START</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    marginBottom: 10,
  },

  headerBtn: {
    fontSize: 16,
  },

  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "700",
  },

  optionBtn: {
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },

  adjustRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    alignItems: "center",
  },

  adjustBtn: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
    minWidth: 52,
    alignItems: "center",
  },

  timeBlock: {
    alignItems: "center",
    gap: 8,
  },

  resetBtn: {
    marginTop: 30,
    backgroundColor: "#ef4444",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
  },

  resetText: {
    color: "#fff",
    fontWeight: "600",
  },

  startBtn: {
    marginTop: 15,
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
  },
});
