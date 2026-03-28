// Представляє медитацію (контент, який користувач проходить)

// Тип медитації (категорія)
export type MeditationCategory = "Relax" | "Focus" | "Sleep";

export class Meditation {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public category: MeditationCategory,
    public durations: number[],
    public isFavorite: boolean,
    public createdAt: Date
  ) {}
}
