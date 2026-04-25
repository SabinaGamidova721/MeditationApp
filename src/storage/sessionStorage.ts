import AsyncStorage from "@react-native-async-storage/async-storage";
import { Session, SyncStatus } from "../models/Session";

const SESSIONS_KEY = "APP_SESSIONS";

type StoredSession = {
  id: string;
  meditationId: string;
  completed: boolean;
  duration: number;
  date: string;
  syncStatus: SyncStatus;
};

const toStored = (item: Session): StoredSession => ({
  ...item,
  date: item.date.toISOString(),
});

const fromStored = (item: StoredSession): Session =>
  new Session(
    item.id,
    item.meditationId,
    item.completed,
    item.duration,
    new Date(item.date),
    item.syncStatus
  );

export const sessionStorage = {
  async saveAll(items: Session[]) {
    const payload = items.map(toStored);
    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(payload));
  },

  async getAll(): Promise<Session[]> {
    const raw = await AsyncStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];

    const parsed: StoredSession[] = JSON.parse(raw);
    return parsed.map(fromStored);
  },

  async getById(id: string): Promise<Session | null> {
    const items = await this.getAll();
    return items.find((item) => item.id === id) ?? null;
  },

  async saveOne(item: Session) {
    const items = await this.getAll();
    const index = items.findIndex((s) => s.id === item.id);

    if (index >= 0) {
      items[index] = item;
    } else {
      items.push(item);
    }

    await this.saveAll(items);
  },

  async deleteOne(id: string) {
    const items = await this.getAll();
    const updated = items.filter((item) => item.id !== id);
    await this.saveAll(updated);
  },
};
