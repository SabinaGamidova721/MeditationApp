import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { MEDITATIONS } from "../data/mockMeditations";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen({ navigation }: any) {
  const { theme } = useContext(AppContext);
  const categories = ["Relax", "Focus", "Sleep"];

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.header, { color: theme.text }]}>
        Meditations
      </Text>

      {categories.map((cat) => (
        <View key={cat}>
          <Text style={[styles.category, { color: theme.accent }]}>
            {cat}
          </Text>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingLeft: 16,
            }}
            data={MEDITATIONS.filter((m) => m.category === cat)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.card, { backgroundColor: theme.card }]}>
                <Text style={[styles.title, { color: theme.text }]}>
                  {item.title}
                </Text>

                <Text style={{ color: theme.sub }}>
                  {item.description}
                </Text>

                <Text
                  style={{ color: theme.accent, marginTop: 10 }}
                  onPress={() =>
                    navigation.navigate("Details", { meditation: item })
                  }
                >
                  Open →
                </Text>
              </View>
            )}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 28, fontWeight: "bold" },
  category: { marginTop: 20, marginBottom: 10 },
  card: {
    width: 240,
    padding: 20,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  title: { fontWeight: "bold", fontSize: 16 },
});
