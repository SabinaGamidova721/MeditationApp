import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CURRENT_USER } from "../data/mockUser";

export const AppContext = createContext<any>(null);

export function AppProvider({ children }: any) {
  const [darkMode, setDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [user, setUser] = useState(CURRENT_USER);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("darkMode");
      const savedSound = await AsyncStorage.getItem("sound");

      if (savedTheme !== null) {
        setDarkMode(savedTheme === "true");
      }

      if (savedSound !== null) {
        setSoundEnabled(savedSound === "true");
      }
    } catch (e) {
      console.log("Load error", e);
    } finally {
      setIsLoaded(true);
    }
  };

  const toggleDarkMode = async () => {
    const value = !darkMode;
    setDarkMode(value);
    await AsyncStorage.setItem("darkMode", String(value));
  };

  const toggleSound = async () => {
    const value = !soundEnabled;
    setSoundEnabled(value);
    await AsyncStorage.setItem("sound", String(value));
  };

  const theme = darkMode
    ? {
        bg: "#020617",
        card: "#1e293b",
        text: "#ffffff",
        sub: "#94a3b8",
        accent: "#22c55e",
      }
    : {
        bg: "#f1f5f9",
        card: "#ffffff",
        text: "#020617",
        sub: "#475569",
        accent: "#16a34a",
      };

  if (!isLoaded) return null;

  return (
    <AppContext.Provider
      value={{
        darkMode,
        setDarkMode: toggleDarkMode,
        soundEnabled,
        setSoundEnabled: toggleSound,
        theme,
        user,
        setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

