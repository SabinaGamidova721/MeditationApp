import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { User } from "../models/User";
import { meditationRepository } from "../repositories/meditationRepository";
import { sessionRepository } from "../repositories/sessionRepository";
import { userRepository } from "../repositories/userRepository";

type Theme = {
  bg: string;
  card: string;
  text: string;
  sub: string;
  accent: string;
};

type AppContextType = {
  darkMode: boolean;
  soundEnabled: boolean;
  theme: Theme;
  user: User | null;
  toggleDarkMode: () => Promise<void>;
  toggleSoundEnabled: () => Promise<void>;
  refreshUser: () => Promise<void>;
  recordCompletedSession: (
    meditationId: string,
    durationInSeconds: number
  ) => Promise<void>;
};

const darkTheme: Theme = {
  bg: "#020617",
  card: "#1e293b",
  text: "#ffffff",
  sub: "#94a3b8",
  accent: "#22c55e",
};

const lightTheme: Theme = {
  bg: "#f1f5f9",
  card: "#ffffff",
  text: "#020617",
  sub: "#475569",
  accent: "#16a34a",
};

export const AppContext = createContext<AppContextType | null>(null);

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }

  return context;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    void loadApp();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        console.log("Internet restored → syncing pending sessions");
        void sessionRepository.syncPendingSessions();
      }
    });

    return () => unsubscribe();
  }, []);

  const loadApp = async () => {
    try {
      await meditationRepository.initialize();
      await sessionRepository.initialize();
      await userRepository.initialize();

      const savedTheme = await AsyncStorage.getItem("darkMode");
      const savedSound = await AsyncStorage.getItem("sound");

      if (savedTheme !== null) {
        setDarkMode(savedTheme === "true");
      }

      if (savedSound !== null) {
        setSoundEnabled(savedSound === "true");
      }

      const savedUser = await userRepository.getUser();
      setUser(savedUser);

      void sessionRepository.syncPendingSessions();
    } catch (e) {
      console.log("App load error", e);
    } finally {
      setIsLoaded(true);
    }
  };

  const toggleDarkMode = useCallback(async () => {
    const nextValue = !darkMode;
    setDarkMode(nextValue);
    await AsyncStorage.setItem("darkMode", String(nextValue));
  }, [darkMode]);

  const toggleSoundEnabled = useCallback(async () => {
    const nextValue = !soundEnabled;
    setSoundEnabled(nextValue);
    await AsyncStorage.setItem("sound", String(nextValue));
  }, [soundEnabled]);

  const refreshUser = useCallback(async () => {
    const freshUser = await userRepository.getUser();
    setUser(freshUser);
  }, []);

  const recordCompletedSession = useCallback(
    async (meditationId: string, durationInSeconds: number) => {
      await sessionRepository.createCompletedSession(
        meditationId,
        durationInSeconds
      );

      const updatedUser = await userRepository.addCompletedSession(
        durationInSeconds
      );

      setUser(updatedUser);
    },
    []
  );

  const theme = darkMode ? darkTheme : lightTheme;

  if (!isLoaded) return null;

  return (
    <AppContext.Provider
      value={{
        darkMode,
        soundEnabled,
        theme,
        user,
        toggleDarkMode,
        toggleSoundEnabled,
        refreshUser,
        recordCompletedSession,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
