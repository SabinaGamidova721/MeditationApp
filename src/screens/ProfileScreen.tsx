import { View, Text, StyleSheet } from "react-native";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function ProfileScreen() {
  const { theme, user } = useContext(AppContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        
        <Text style={[styles.name, { color: theme.text }]}>
          {user.name}
        </Text>

        <Text style={{ color: theme.sub }}>
          {user.email}
        </Text>

        <View style={styles.stats}>
          <Text style={{ color: theme.accent }}>
            Sessions: {user.sessions}
          </Text>

          <Text style={{ color: theme.accent }}>
            Minutes: {user.minutes}
          </Text>

          <Text style={{ color: theme.accent }}>
            Streak: {user.streak} 🔥
          </Text>

          <Text style={{ color: theme.accent }}>
            Level: {user.level}
          </Text>
        </View>

        {user.isPremium && (
          <Text style={{ color: theme.accent, marginTop: 10 }}>
            ⭐ Premium User
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "85%",
    padding: 20,
    borderRadius: 20,
  },

  name: {
    fontSize: 26,
    fontWeight: "bold",
  },

  stats: {
    marginTop: 20,
    gap: 6,
  },
});
