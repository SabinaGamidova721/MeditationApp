import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import NetInfo from "@react-native-community/netinfo";
import { useAppContext } from "../context/AppContext";
import { sessionRepository } from "../repositories/sessionRepository";
import { userRepository } from "../repositories/userRepository";
import { meditationRepository } from "../repositories/meditationRepository";
import { Session } from "../models/Session";
import { Meditation } from "../models/Meditation";

export default function ProfileScreen() {
  const { theme, user, refreshUser } = useAppContext();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [meditationsMap, setMeditationsMap] = useState<
    Record<string, Meditation>
  >({});

  const loadSessions = useCallback(async () => {
    const items = await sessionRepository.getSessions();
    setSessions(items);
  }, []);

  const loadMeditations = useCallback(async () => {
    const items = await meditationRepository.getCachedMeditations();

    const map: Record<string, Meditation> = {};

    for (const item of items) {
      map[item.id] = item;
    }

    setMeditationsMap(map);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadSessions();
      void loadMeditations();

      const unsubscribe = NetInfo.addEventListener((state) => {
        if (state.isConnected) {
          void (async () => {
            await sessionRepository.syncPendingSessions();
            await loadSessions();
          })();
        }
      });

      return () => unsubscribe();
    }, [loadSessions, loadMeditations])
  );

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const handleDeleteSession = async (session: Session) => {
    await sessionRepository.deleteSession(session.id);
    await userRepository.removeCompletedSession(session.duration);
    await refreshUser();
    await loadSessions();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <Text style={{ color: theme.text }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.name, { color: theme.text }]}>{user.name}</Text>

        <Text style={{ color: theme.sub }}>{user.email}</Text>

        <View style={styles.stats}>
          <Text style={{ color: theme.accent }}>Sessions: {user.sessions}</Text>
          <Text style={{ color: theme.accent }}>Minutes: {user.minutes}</Text>
          <Text style={{ color: theme.accent }}>Streak: {user.streak} 🔥</Text>
          <Text style={{ color: theme.accent }}>Level: {user.level}</Text>
        </View>

        {user.isPremium && (
          <Text style={{ color: theme.accent, marginTop: 10 }}>
            ⭐ Premium User
          </Text>
        )}
      </View>

      <Text
        style={{
          color: theme.text,
          fontSize: 20,
          fontWeight: "700",
          marginTop: 24,
          marginBottom: 12,
        }}
      >
        Recent Sessions
      </Text>

      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <Text style={{ color: theme.sub }}>
            No sessions yet. Complete a meditation to create one.
          </Text>
        }
        renderItem={({ item }) => {
          const meditation = meditationsMap[item.meditationId];

          return (
            <View
              style={[
                styles.sessionCard,
                { backgroundColor: theme.card, borderColor: theme.bg },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: theme.text,
                    fontWeight: "600",
                    fontSize: 18,
                  }}
                >
                  {meditation?.title ?? `Meditation ID: ${item.meditationId}`}
                </Text>

                <Text style={{ color: theme.sub }}>
                  Actual duration: {formatDuration(item.duration)}
                </Text>

                <Text style={{ color: theme.sub }}>
                  Date: {formatDate(item.date)}
                </Text>

                <Text style={{ color: theme.accent }}>
                  Sync: {item.syncStatus}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => handleDeleteSession(item)}
                style={styles.deleteBtn}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  card: {
    width: "100%",
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

  sessionCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },

  deleteBtn: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
});
