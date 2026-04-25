import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import { useAppContext } from "../context/AppContext";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PlayerScreen({ route }: any) {
  const { duration, meditationId } = route.params;
  const { theme, soundEnabled, recordCompletedSession } = useAppContext();
  const navigation = useNavigation<NavigationProp>();

  const [time, setTime] = useState(duration);
  const [finished, setFinished] = useState(false);

  const musicRef = useRef<any>(null);
  const notificationRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);
  const finishingRef = useRef(false);

  useEffect(() => {
    void initializeScreen();

    const unsubscribe = navigation.addListener("beforeRemove", () => {
      void stopAll();
    });

    return () => {
      unsubscribe();
      void stopAll();
    };
  }, []);

  const initializeScreen = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
    } catch (e) {
      console.log("Audio mode error", e);
    }

    if (soundEnabled) {
      await startMusic();
    }

    startTimer();
  };

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setTime((t: number) => {
        if (t <= 1 && !finishingRef.current) {
          finishingRef.current = true;
          void finishMeditation();
          return 0;
        }

        return t > 0 ? t - 1 : 0;
      });
    }, 1000);
  };

  const startMusic = async () => {
    try {
      console.log("Trying to start meditation music");

      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/meditation.mp3"),
        {
          isLooping: true,
          volume: 0.6,
          shouldPlay: true,
        }
      );

      musicRef.current = sound;

      if (Platform.OS !== "web") {
        await sound.playAsync();
      }

      console.log("Meditation music started");
    } catch (e) {
      console.log("Meditation music start error", e);
    }
  };

  const finishMeditation = async () => {
    clearInterval(intervalRef.current);

    if (musicRef.current) {
      try {
        await musicRef.current.stopAsync();
        await musicRef.current.unloadAsync();
      } catch (e) {
        console.log("Music stop error", e);
      } finally {
        musicRef.current = null;
      }
    }

    await recordCompletedSession(meditationId, duration);

    if (soundEnabled) {
      await playNotification();
    }

    setFinished(true);
  };

  const playNotification = async () => {
    try {
      console.log("Trying to play notification sound");

      if (notificationRef.current) return;

      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/notification.mp3"),
        {
          volume: 1,
          shouldPlay: true,
        }
      );

      notificationRef.current = sound;

      if (Platform.OS !== "web") {
        await sound.playAsync();
      }

      console.log("Notification sound played");
    } catch (e) {
      console.log("Notification sound error", e);
    }
  };

  const stopAll = async () => {
    clearInterval(intervalRef.current);

    try {
      if (musicRef.current) {
        await musicRef.current.stopAsync();
        await musicRef.current.unloadAsync();
        musicRef.current = null;
      }

      if (notificationRef.current) {
        await notificationRef.current.stopAsync();
        await notificationRef.current.unloadAsync();
        notificationRef.current = null;
      }
    } catch (e) {
      console.log("Stop audio error", e);
    }
  };

  const format = (t: number) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={async () => {
            await stopAll();
            navigation.goBack();
          }}
        >
          <Text style={[styles.navText, { color: theme.accent }]}>← Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            await stopAll();
            navigation.popToTop();
          }}
        >
          <Text style={[styles.navText, { color: theme.accent }]}>Home</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ color: theme.text, fontSize: 60 }}>{format(time)}</Text>

      {finished && (
        <TouchableOpacity
          style={{
            marginTop: 40,
            backgroundColor: theme.accent,
            padding: 16,
            borderRadius: 16,
          }}
          onPress={async () => {
            await stopAll();
            navigation.goBack();
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>RESET</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  topBar: {
    position: "absolute",
    top: 50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  navText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
