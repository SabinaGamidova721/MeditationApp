import { delay } from "./utils";
import { Meditation } from "../models/Meditation";
import { MEDITATIONS } from "../data/mockMeditations";

/*
API-контракт:

GET /meditations
Повертає: Meditation[]
Тіло/параметри: немає

GET /meditations/:id
Повертає: Meditation | null
Параметри: id у path
*/

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

let remoteMeditations = MEDITATIONS.map(cloneMeditation);

export const meditationApi = {
  async fetchMeditations(): Promise<Meditation[]> {
    console.log("API GET /meditations");
    await delay(800);
    return remoteMeditations.map(cloneMeditation);
  },

  async fetchMeditationById(id: string): Promise<Meditation | null> {
    console.log(`API GET /meditations/${id}`);
    await delay(400);

    const item = remoteMeditations.find((m) => m.id === id);
    return item ? cloneMeditation(item) : null;
  },
};
