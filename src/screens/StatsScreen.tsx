import { useCallback, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAppContext } from "../context/AppContext";
import { sessionRepository } from "../repositories/sessionRepository";
import { Session } from "../models/Session";

export default function StatsScreen() {
  const { theme, user, refreshUser } = useAppContext();
  const [sessions, setSessions] = useState<Session[]>([]);

  const loadStats = useCallback(async () => {
    const items = await sessionRepository.getSessions();
    setSessions(items);
    await refreshUser();
  }, [refreshUser]);

  useFocusEffect(
    useCallback(() => {
      void loadStats();
    }, [loadStats])
  );

  const syncedCount = sessions.filter((s) => s.syncStatus === "synced").length;
  const pendingCount = sessions.filter((s) => s.syncStatus === "pending").length;
  const errorCount = sessions.filter((s) => s.syncStatus === "error").length;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.title, { color: theme.text }]}>Statistics</Text>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.sub }]}>Total sessions</Text>
        <Text style={[styles.value, { color: theme.accent }]}>
          {sessions.length}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.sub }]}>User minutes</Text>
        <Text style={[styles.value, { color: theme.accent }]}>
          {user?.minutes ?? 0}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.sub }]}>User streak</Text>
        <Text style={[styles.value, { color: theme.accent }]}>
          {user?.streak ?? 0}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.sub }]}>User level</Text>
        <Text style={[styles.value, { color: theme.accent }]}>
          {user?.level ?? 1}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.sub }]}>Synced sessions</Text>
        <Text style={[styles.value, { color: theme.accent }]}>
          {syncedCount}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.sub }]}>Pending sessions</Text>
        <Text style={[styles.value, { color: theme.accent }]}>
          {pendingCount}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.sub }]}>Error sessions</Text>
        <Text style={[styles.value, { color: theme.accent }]}>
          {errorCount}
        </Text>
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

  label: {
    fontSize: 15,
  },

  value: {
    fontSize: 26,
    fontWeight: "700",
    marginTop: 4,
  },
});


