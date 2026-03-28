// Представляє користувача застосунку
export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public isPremium: boolean,
    public createdAt: Date,

    public avatar?: string,
    public sessions: number = 0,
    public minutes: number = 0,
    public streak: number = 0,
    public level: number = 1
  ) {}
}
