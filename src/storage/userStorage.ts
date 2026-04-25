import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../models/User";

const USER_KEY = "APP_USER";

type StoredUser = {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  createdAt: string;
  avatar?: string;
  sessions: number;
  minutes: number;
  streak: number;
  level: number;
};

const toStored = (user: User): StoredUser => ({
  ...user,
  createdAt: user.createdAt.toISOString(),
});

const fromStored = (user: StoredUser): User =>
  new User(
    user.id,
    user.name,
    user.email,
    user.isPremium,
    new Date(user.createdAt),
    user.avatar,
    user.sessions,
    user.minutes,
    user.streak,
    user.level
  );

export const userStorage = {
  async save(user: User) {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(toStored(user)));
  },

  async get(): Promise<User | null> {
    const raw = await AsyncStorage.getItem(USER_KEY);
    if (!raw) return null;

    const parsed: StoredUser = JSON.parse(raw);
    return fromStored(parsed);
  },

  async delete() {
    await AsyncStorage.removeItem(USER_KEY);
  },
};
