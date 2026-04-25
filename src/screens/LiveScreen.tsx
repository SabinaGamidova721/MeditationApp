// import { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
// } from "react-native";
// import { useAppContext } from "../context/AppContext";
// import { SocketEvent } from "../models/SocketEvent";
// import { SocketConnectionState } from "../socket/SocketManager";
// import { mockSocketManager } from "../socket/MockSocketManager";
// import { userRepository } from "../repositories/userRepository";

// export default function LiveScreen() {
//   const { theme, refreshUser } = useAppContext();

//   const [connectionState, setConnectionState] =
//     useState<SocketConnectionState>("Disconnected");

//   const [events, setEvents] = useState<SocketEvent[]>([]);

//   useEffect(() => {
//     const unsubscribeMessage = mockSocketManager.onMessage(async (event) => {
//       setEvents((prev) => [event, ...prev]);

//       if (event.type === "session_bonus" && event.payload?.bonusMinutes) {
//         await userRepository.addCompletedSession(
//           event.payload.bonusMinutes * 60
//         );

//         await refreshUser();
//       }
//     });

//     const unsubscribeState = mockSocketManager.onStateChange((state) => {
//       setConnectionState(state);
//     });

//     mockSocketManager.connect("wss://mock.zenflow/live");

//     return () => {
//       unsubscribeMessage();
//       unsubscribeState();
//       mockSocketManager.disconnect();
//     };
//   }, [refreshUser]);

//   return (
//     <View style={[styles.container, { backgroundColor: theme.bg }]}>
//       <Text style={[styles.title, { color: theme.text }]}>Live Events</Text>

//       <View style={[styles.statusCard, { backgroundColor: theme.card }]}>
//         <Text style={{ color: theme.sub }}>WebSocket state:</Text>
//         <Text style={[styles.status, { color: theme.accent }]}>
//           {connectionState}
//         </Text>
//       </View>

//       <TouchableOpacity
//         style={[styles.button, { backgroundColor: theme.accent }]}
//         onPress={() => mockSocketManager.simulateDisconnect()}
//       >
//         <Text style={styles.buttonText}>Simulate reconnect</Text>
//       </TouchableOpacity>

//       <FlatList
//         data={events}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={{ paddingBottom: 40 }}
//         ListEmptyComponent={
//           <Text style={{ color: theme.sub, marginTop: 20 }}>
//             Waiting for server events...
//           </Text>
//         }
//         renderItem={({ item }) => (
//           <View style={[styles.eventCard, { backgroundColor: theme.card }]}>
//             <Text style={[styles.eventType, { color: theme.accent }]}>
//               {item.type}
//             </Text>

//             <Text style={{ color: theme.text, marginTop: 4 }}>
//               {item.message}
//             </Text>

//             <Text style={{ color: theme.sub, marginTop: 6 }}>
//               {item.createdAt.toLocaleTimeString()}
//             </Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },

//   title: {
//     fontSize: 28,
//     fontWeight: "700",
//     marginBottom: 16,
//   },

//   statusCard: {
//     padding: 16,
//     borderRadius: 16,
//     marginBottom: 12,
//   },

//   status: {
//     fontSize: 20,
//     fontWeight: "700",
//     marginTop: 4,
//   },

//   button: {
//     padding: 14,
//     borderRadius: 14,
//     alignItems: "center",
//     marginBottom: 16,
//   },

//   buttonText: {
//     color: "#fff",
//     fontWeight: "700",
//   },

//   eventCard: {
//     padding: 16,
//     borderRadius: 16,
//     marginBottom: 12,
//   },

//   eventType: {
//     fontWeight: "700",
//     fontSize: 16,
//   },
// });



import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useAppContext } from "../context/AppContext";
import { SocketEvent } from "../models/SocketEvent";
import { SocketConnectionState } from "../socket/SocketManager";
import { mockSocketManager } from "../socket/MockSocketManager";
import { userRepository } from "../repositories/userRepository";

export default function LiveScreen() {
  const { theme, refreshUser } = useAppContext();

  const [connectionState, setConnectionState] =
    useState<SocketConnectionState>("Disconnected");

  const [events, setEvents] = useState<SocketEvent[]>([]);

  useEffect(() => {
    const unsubscribeMessage = mockSocketManager.onMessage(async (event) => {
      setEvents((prev) => [event, ...prev]);

      if (event.type === "session_bonus" && event.payload?.bonusMinutes) {
        await userRepository.addBonusMinutes(event.payload.bonusMinutes);
        await refreshUser();
      }
    });

    const unsubscribeState = mockSocketManager.onStateChange((state) => {
      setConnectionState(state);
    });

    mockSocketManager.connect("wss://mock.zenflow/live");

    return () => {
      unsubscribeMessage();
      unsubscribeState();
      mockSocketManager.disconnect();
    };
  }, [refreshUser]);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.title, { color: theme.text }]}>Live Events</Text>

      <View style={[styles.statusCard, { backgroundColor: theme.card }]}>
        <Text style={{ color: theme.sub }}>WebSocket state:</Text>
        <Text style={[styles.status, { color: theme.accent }]}>
          {connectionState}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.accent }]}
        onPress={() => mockSocketManager.simulateDisconnect()}
      >
        <Text style={styles.buttonText}>Simulate reconnect</Text>
      </TouchableOpacity>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <Text style={{ color: theme.sub, marginTop: 20 }}>
            Waiting for server events...
          </Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.eventCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.eventType, { color: theme.accent }]}>
              {item.type}
            </Text>

            <Text style={{ color: theme.text, marginTop: 4 }}>
              {item.message}
            </Text>

            <Text style={{ color: theme.sub, marginTop: 6 }}>
              {item.createdAt.toLocaleTimeString()}
            </Text>
          </View>
        )}
      />
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

  statusCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },

  status: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 4,
  },

  button: {
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 16,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },

  eventCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },

  eventType: {
    fontWeight: "700",
    fontSize: 16,
  },
});

