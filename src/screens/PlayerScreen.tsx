import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useEffect, useRef, useState, useContext } from "react";
import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../context/AppContext";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PlayerScreen({ route }: any) {
  const { duration } = route.params;
  const { theme, soundEnabled } = useContext(AppContext);
  const navigation = useNavigation<NavigationProp>();

  const [time, setTime] = useState(duration);
  const [finished, setFinished] = useState(false);

  const musicRef = useRef<any>(null);
  const notificationRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);
  const finishingRef = useRef(false);

  useEffect(() => {
    startMusic();
    startTimer();

    const unsubscribe = navigation.addListener("beforeRemove", () => {
      stopAll();
    });

    return () => {
      unsubscribe();
      stopAll();
    };
  }, []);

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setTime((t: number) => {
        if (t <= 1 && !finishingRef.current) {
          finishingRef.current = true;
          finishMeditation();
          return 0;
        }
        return t > 0 ? t - 1 : 0;
      });
    }, 1000);
  };

  const startMusic = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/meditation.mp3"),
      { isLooping: true, volume: 0 }
    );

    musicRef.current = sound;
    await sound.playAsync();

    fadeIn(sound);
  };

  const fadeIn = async (sound: any) => {
    for (let v = 0; v <= 1; v += 0.05) {
      await sound.setVolumeAsync(v);
      await delay(80);
    }
  };

  const fadeOut = async (sound: any) => {
    for (let v = 1; v >= 0; v -= 0.05) {
      await sound.setVolumeAsync(v);
      await delay(80);
    }
  };

  const finishMeditation = async () => {
    clearInterval(intervalRef.current);

    if (musicRef.current) {
      await fadeOut(musicRef.current);
      await musicRef.current.stopAsync();
      await musicRef.current.unloadAsync();
      musicRef.current = null;
    }

    if (soundEnabled) {
      await playNotification();
    }

    setFinished(true);
  };

  const playNotification = async () => {
    if (notificationRef.current) return;

    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/notification.mp3"),
      { volume: 0 }
    );

    notificationRef.current = sound;

    await sound.playAsync();

    for (let v = 0; v <= 1; v += 0.1) {
      await sound.setVolumeAsync(v);
      await delay(80);
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
    } catch {}
  };

  const delay = (ms: number) =>
    new Promise((res) => setTimeout(res, ms));

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
          <Text style={[styles.navText, { color: theme.accent }]}>
            ← Back
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            await stopAll();
            navigation.navigate("Meditations");
            navigation.navigate("Player", { duration: 120 });
            navigation.goBack();
          }}
        >
          <Text style={[styles.navText, { color: theme.accent }]}>
            Home
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={{ color: theme.text, fontSize: 60 }}>
        {format(time)}
      </Text>

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
          <Text style={{ color: "#fff" }}>RESET</Text>
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
