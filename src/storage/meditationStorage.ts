import AsyncStorage from "@react-native-async-storage/async-storage";
import { Meditation } from "../models/Meditation";

const MEDITATIONS_KEY = "APP_MEDITATIONS";

type StoredMeditation = {
  id: string;
  title: string;
  description: string;
  category: "Relax" | "Focus" | "Sleep";
  durations: number[];
  isFavorite: boolean;
  createdAt: string;
};

const toStored = (item: Meditation): StoredMeditation => ({
  ...item,
  createdAt: item.createdAt.toISOString(),
});

const fromStored = (item: StoredMeditation): Meditation =>
  new Meditation(
    item.id,
    item.title,
    item.description,
    item.category,
    item.durations,
    item.isFavorite,
    new Date(item.createdAt)
  );

export const meditationStorage = {
  async saveAll(items: Meditation[]) {
    const payload = items.map(toStored);
    await AsyncStorage.setItem(MEDITATIONS_KEY, JSON.stringify(payload));
  },

  async getAll(): Promise<Meditation[]> {
    const raw = await AsyncStorage.getItem(MEDITATIONS_KEY);
    if (!raw) return [];

    const parsed: StoredMeditation[] = JSON.parse(raw);
    return parsed.map(fromStored);
  },

  async getById(id: string): Promise<Meditation | null> {
    const items = await this.getAll();
    return items.find((item) => item.id === id) ?? null;
  },

  async saveOne(item: Meditation) {
    const items = await this.getAll();
    const index = items.findIndex((m) => m.id === item.id);

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
