import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../context/AppContext";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function DetailsScreen({ route }: any) {
  const { meditation } = route.params;
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useContext(AppContext);

  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const selectPreset = (min: number) => {
    setSelectedDuration(min);
    setMinutes(min);
    setSeconds(0);
  };

  const addMinute = () => {
    if (minutes < 59) setMinutes(minutes + 1);
  };

  const removeMinute = () => {
    if (minutes > 0) setMinutes(minutes - 1);
  };

  const addSecond = () => {
    if (minutes === 59 && seconds === 50) return;

    if (seconds === 50) {
      setMinutes(minutes + 1);
      setSeconds(0);
    } else {
      setSeconds(seconds + 10);
    }
  };

  const removeSecond = () => {
    if (seconds > 0) {
      setSeconds(seconds - 10);
    } else if (minutes > 0) {
      setMinutes(minutes - 1);
      setSeconds(50);
    }
  };

  const reset = () => {
    setMinutes(0);
    setSeconds(0);
  };

  const totalSeconds = minutes * 60 + seconds;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        {selectedDuration === null ? (
          <TouchableOpacity
            onPress={() => navigation.navigate("Meditations" as never)}
          >
            <Text style={[styles.headerBtn, { color: theme.accent }]}>
              ← Home
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setSelectedDuration(null)}>
            <Text style={[styles.headerBtn, { color: theme.accent }]}>
              ← Back
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.title, { color: theme.text }]}>
        {meditation.title}
      </Text>

      <Text style={{ color: theme.text }}>
        {meditation.description}
      </Text>

      {selectedDuration === null ? (
        <>
          <Text style={{ color: theme.accent, marginTop: 20 }}>
            Choose duration:
          </Text>

        {meditation.durations.map((d: number) => (
          <TouchableOpacity
            key={d}
            style={[styles.btn, { backgroundColor: theme.card }]}
            onPress={() =>
              navigation.navigate("Player", { duration: d * 60 })
            }
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
              <TouchableOpacity onPress={removeMinute} style={styles.btn}>
                <Text>-</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={removeSecond} style={styles.btn}>
                <Text>-</Text>
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
              <TouchableOpacity onPress={addMinute} style={styles.btn}>
                <Text>+</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={addSecond} style={styles.btn}>
                <Text>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={reset}
            style={[styles.resetBtn]}
          >
            <Text style={styles.resetText}>RESET</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.startBtn, { backgroundColor: theme.accent }]}
            onPress={() =>
              navigation.navigate("Player", {
                duration: totalSeconds,
              })
            }
          >
            <Text style={{ color: "#fff" }}>START</Text>
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
  },

  option: {
    backgroundColor: "#e5e7eb",
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

  btn: {
    backgroundColor: "#d1d5db",
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
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
