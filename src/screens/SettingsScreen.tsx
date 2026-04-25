import { View, Text, Switch, StyleSheet, TouchableOpacity } from "react-native";
import { useAppContext } from "../context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {
  const {
    darkMode,
    soundEnabled,
    toggleDarkMode,
    toggleSoundEnabled,
    theme,
  } = useAppContext();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

      <View style={styles.row}>
        <Text style={{ color: theme.sub, fontSize: 16 }}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={toggleDarkMode} />
      </View>

      <View style={styles.row}>
        <Text style={{ color: theme.sub, fontSize: 16 }}>Sound</Text>
        <Switch value={soundEnabled} onValueChange={toggleSoundEnabled} />
      </View>

      <TouchableOpacity
        style={[styles.clearBtn, { backgroundColor: theme.card }]}
        onPress={async () => {
          await AsyncStorage.clear();
          console.log("AsyncStorage cleared");
        }}
      >
        <Text style={{ color: theme.accent, fontWeight: "700" }}>
          Clear storage
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },

  row: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  clearBtn: {
    marginTop: 40,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
});
