import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function MeditationCard({ item, onPress }: any) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.description}</Text>
      <Text style={styles.time}>{item.duration} min</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  desc: { color: "#94a3b8", marginVertical: 6 },
  time: { color: "#22c55e" },
});
