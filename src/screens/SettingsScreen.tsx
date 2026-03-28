import { View, Text, Switch } from "react-native";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function SettingsScreen() {
  const {
    darkMode,
    setDarkMode,
    theme,
  } = useContext(AppContext);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: theme.bg }}>
      <Text style={{ color: theme.text, fontSize: 24 }}>Settings</Text>

      <View style={{ marginTop: 20 }}>
        <Text style={{ color: theme.sub }}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>
    </View>
  );
}
