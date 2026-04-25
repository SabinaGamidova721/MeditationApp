import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useAppContext } from "../context/AppContext";
import { meditationRepository } from "../repositories/meditationRepository";
import { Meditation, MeditationCategory } from "../models/Meditation";

export default function HomeScreen({ navigation }: any) {
  const { theme } = useAppContext();
  const [meditations, setMeditations] = useState<Meditation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories: MeditationCategory[] = ["Relax", "Focus", "Sleep"];

  const loadMeditations = useCallback(async () => {
    setIsLoading(true);

    const localData = await meditationRepository.getCachedMeditations();
    setMeditations(localData);

    try {
      const freshData = await meditationRepository.refreshMeditations();
      setMeditations(freshData);
    } catch (e) {
      console.log("Refresh meditations error", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadMeditations();
    }, [loadMeditations])
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.header, { color: theme.text }]}>
        Meditations
      </Text>

      <Text style={{ color: theme.sub, marginBottom: 12 }}>
        Local storage → then API refresh
      </Text>

      {isLoading && meditations.length === 0 ? (
        <ActivityIndicator size="large" color={theme.accent} />
      ) : (
        categories.map((cat) => {
          const items = meditations.filter((m) => m.category === cat);

          return (
            <View key={cat}>
              <Text style={[styles.category, { color: theme.accent }]}>
                {cat}
              </Text>

              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 6 }}
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View
                    style={[styles.card, { backgroundColor: theme.card }]}
                  >
                    <Text style={[styles.title, { color: theme.text }]}>
                      {item.title}
                    </Text>

                    <Text style={{ color: theme.sub }}>
                      {item.description}
                    </Text>

                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("Details", {
                          meditationId: item.id,
                        })
                      }
                    >
                      <Text
                        style={{
                          color: theme.accent,
                          marginTop: 10,
                          fontWeight: "600",
                        }}
                      >
                        Open →
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                ListEmptyComponent={
                  <Text style={{ color: theme.sub }}>
                    No meditations in this category
                  </Text>
                }
              />
            </View>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 28, fontWeight: "bold" },
  category: { marginTop: 20, marginBottom: 10, fontSize: 18 },
  card: {
    width: 240,
    padding: 20,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  title: { fontWeight: "bold", fontSize: 16, marginBottom: 8 },
});
