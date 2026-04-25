import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useAppContext } from "../context/AppContext";
import { biometricManager } from "../biometrics/BiometricManager";
import {
  BiometricAuthState,
  BiometricAvailability,
} from "../biometrics/BiometricTypes";

type Props = {
  onUnlock: () => void;
};

export default function BiometricLoginScreen({ onUnlock }: Props) {
  const { theme } = useAppContext();

  const [availability, setAvailability] = useState<BiometricAvailability>({
    available: false,
    type: "None",
  });

  const [authState, setAuthState] = useState<BiometricAuthState>("Idle");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    void loadAvailability();
  }, []);

  const loadAvailability = async () => {
    const result = await biometricManager.checkAvailability();
    setAvailability(result);

    if (!result.available) {
      setAuthState("Unavailable");
      setMessage(result.reason ?? "Biometric authentication is unavailable.");
    }
  };

  const authenticateWithBiometrics = async () => {
    setAuthState("Authenticating");
    setMessage("Authenticating...");

    const result = await biometricManager.authenticate(
      "Unlock ZenFlow with biometrics"
    );

    setAuthState(result.state);
    setMessage(result.message);

    if (result.success) {
      onUnlock();
    }
  };

  const loginWithPassword = () => {
    if (password.trim().length >= 4) {
      setAuthState("Success");
      setMessage("Password accepted.");
      onUnlock();
      return;
    }

    setAuthState("Failed");
    setMessage("Password must contain at least 4 characters.");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.title, { color: theme.text }]}>ZenFlow Locked</Text>

      <Text style={{ color: theme.sub, marginBottom: 16 }}>
        Use biometrics or password to unlock the app.
      </Text>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={{ color: theme.sub }}>Biometric type:</Text>

        <Text style={[styles.value, { color: theme.accent }]}>
          {availability.type}
        </Text>

        <Text style={{ color: theme.sub, marginTop: 10 }}>
          State: {authState}
        </Text>

        {message.length > 0 && (
          <Text style={{ color: theme.text, marginTop: 10 }}>{message}</Text>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: availability.available
                ? theme.accent
                : "#64748b",
            },
          ]}
          onPress={authenticateWithBiometrics}
          disabled={!availability.available}
        >
          <Text style={styles.buttonText}>Unlock with biometrics</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={{ color: theme.sub, marginBottom: 8 }}>
          Password fallback
        </Text>

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          placeholderTextColor={theme.sub}
          secureTextEntry
          style={[
            styles.input,
            {
              color: theme.text,
              borderColor: theme.sub,
            },
          ]}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.accent }]}
          onPress={loginWithPassword}
        >
          <Text style={styles.buttonText}>Unlock with password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 8,
  },

  card: {
    padding: 18,
    borderRadius: 18,
    marginTop: 16,
  },

  value: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 4,
  },

  button: {
    marginTop: 18,
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },

  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
});
