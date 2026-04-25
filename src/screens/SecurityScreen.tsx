import { useCallback, useState } from "react";
import { View, Text, StyleSheet, Switch, TextInput } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAppContext } from "../context/AppContext";
import { biometricManager } from "../biometrics/BiometricManager";
import { biometricStorage } from "../biometrics/biometricStorage";
import { BiometricAvailability } from "../biometrics/BiometricTypes";

export default function SecurityScreen() {
  const { theme } = useAppContext();

  const [availability, setAvailability] = useState<BiometricAvailability>({
    available: false,
    type: "None",
  });

  const [enabled, setEnabled] = useState(false);
  const [lockTimeout, setLockTimeout] = useState("30");
  const [message, setMessage] = useState("");

  useFocusEffect(
    useCallback(() => {
      void loadSecuritySettings();
    }, [])
  );

  const loadSecuritySettings = async () => {
    const result = await biometricManager.checkAvailability();
    const savedEnabled = await biometricManager.isEnabledByUser();
    const savedTimeout = await biometricStorage.getLockTimeout();

    setAvailability(result);
    setEnabled(savedEnabled);
    setLockTimeout(String(savedTimeout));

    if (!result.available) {
      setMessage(result.reason ?? "Biometric authentication unavailable.");
    } else {
      setMessage("Biometric authentication is available.");
    }
  };

  const toggleBiometric = async (value: boolean) => {
    if (value && !availability.available) {
      setEnabled(false);
      setMessage("Cannot enable biometrics: sensor is unavailable.");
      return;
    }

    await biometricManager.setEnabledByUser(value);
    setEnabled(value);

    setMessage(
      value
        ? "Biometric authentication enabled."
        : "Biometric authentication disabled."
    );
  };

  const saveTimeout = async (value: string) => {
    setLockTimeout(value);

    const parsed = Number(value);

    if (Number.isFinite(parsed) && parsed > 0) {
      await biometricStorage.setLockTimeout(parsed);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.title, { color: theme.text }]}>Security</Text>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={{ color: theme.sub }}>Supported biometric type:</Text>

        <Text style={[styles.value, { color: theme.accent }]}>
          {availability.type}
        </Text>

        <Text style={{ color: theme.sub, marginTop: 12 }}>
          Available: {availability.available ? "Yes" : "No"}
        </Text>

        {message.length > 0 && (
          <Text style={{ color: theme.text, marginTop: 12 }}>{message}</Text>
        )}
      </View>

      <View style={[styles.rowCard, { backgroundColor: theme.card }]}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 16 }}>
            Enable biometrics
          </Text>
          <Text style={{ color: theme.sub, marginTop: 4 }}>
            Use biometrics instead of password.
          </Text>
        </View>

        <Switch value={enabled} onValueChange={toggleBiometric} />
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={{ color: theme.text, fontSize: 16 }}>
          Lock timeout in seconds
        </Text>

        <Text style={{ color: theme.sub, marginTop: 4 }}>
          After this time in background, app will ask for authentication again.
        </Text>

        <TextInput
          value={lockTimeout}
          onChangeText={saveTimeout}
          keyboardType="numeric"
          style={[
            styles.input,
            {
              color: theme.text,
              borderColor: theme.sub,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
  },

  card: {
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
  },

  rowCard: {
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  value: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 6,
  },

  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
});
