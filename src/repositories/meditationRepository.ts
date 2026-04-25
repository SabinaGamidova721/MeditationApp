import { MEDITATIONS } from "../data/mockMeditations";
import { Meditation } from "../models/Meditation";
import { meditationApi } from "../api/meditationApi";
import { meditationStorage } from "../storage/meditationStorage";

const cloneMeditation = (item: Meditation) =>
  new Meditation(
    item.id,
    item.title,
    item.description,
    item.category,
    [...item.durations],
    item.isFavorite,
    new Date(item.createdAt)
  );

export const meditationRepository = {
  async initialize() {
    const local = await meditationStorage.getAll();

    if (local.length === 0) {
      await meditationStorage.saveAll(MEDITATIONS.map(cloneMeditation));
    }
  },

  async getCachedMeditations(): Promise<Meditation[]> {
    await this.initialize();
    return meditationStorage.getAll();
  },

  async refreshMeditations(): Promise<Meditation[]> {
    const remote = await meditationApi.fetchMeditations();
    await meditationStorage.saveAll(remote);
    return remote;
  },

  async getCachedMeditationById(id: string): Promise<Meditation | null> {
    await this.initialize();
    return meditationStorage.getById(id);
  },

  async refreshMeditationById(id: string): Promise<Meditation | null> {
    const remote = await meditationApi.fetchMeditationById(id);

    if (remote) {
      await meditationStorage.saveOne(remote);
    }

    return remote;
  },

  async saveMeditation(item: Meditation) {
    await meditationStorage.saveOne(item);
  },

  async deleteMeditation(id: string) {
    await meditationStorage.deleteOne(id);
  },
};
