// Представляє сесію медитації користувача
export class Session {
  constructor(
    public id: string,
    public meditationId: string,
    public completed: boolean,
    public duration: number,
    public date: Date
  ) {}
}
