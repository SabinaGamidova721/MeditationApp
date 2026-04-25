import { CURRENT_USER } from "../data/mockUser";
import { User } from "../models/User";
import { userApi } from "../api/userApi";
import { userStorage } from "../storage/userStorage";

const cloneUser = (user: User) =>
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

const calculateStreak = (sessions: number) => {
  return Math.floor(sessions / 3);
};

const calculateLevel = (sessions: number) => {
  return Math.floor(sessions / 5) + 1;
};

export const userRepository = {
  async initialize() {
    const local = await userStorage.get();

    if (!local) {
      await userStorage.save(cloneUser(CURRENT_USER));
    }
  },

  async getUser(): Promise<User | null> {
    await this.initialize();
    return userStorage.get();
  },

  async refreshUserFromApi(): Promise<User> {
    const remote = await userApi.fetchUser();
    await userStorage.save(remote);
    return remote;
  },

  async saveUser(user: User) {
    await userStorage.save(user);
  },

  async deleteUser() {
    await userStorage.delete();
  },

  async addCompletedSession(durationInSeconds: number): Promise<User | null> {
    const user = await this.getUser();

    if (!user) return null;

    const nextSessions = user.sessions + 1;
    const nextMinutes = user.minutes + durationInSeconds;

    const updated = new User(
      user.id,
      user.name,
      user.email,
      user.isPremium,
      user.createdAt,
      user.avatar,
      nextSessions,
      nextMinutes,
      calculateStreak(nextSessions),
      calculateLevel(nextSessions)
    );

    await userStorage.save(updated);
    return updated;
  },

  async addBonusMinutes(bonusMinutes: number): Promise<User | null> {
    const user = await this.getUser();

    if (!user) return null;

    const updated = new User(
      user.id,
      user.name,
      user.email,
      user.isPremium,
      user.createdAt,
      user.avatar,
      user.sessions,
      user.minutes + bonusMinutes,
      user.streak,
      user.level
    );

    await userStorage.save(updated);
    return updated;
  },

  async removeCompletedSession(durationInSeconds: number): Promise<User | null> {
    const user = await this.getUser();

    if (!user) return null;

    const nextSessions = Math.max(0, user.sessions - 1);
    const nextMinutes = Math.max(0, user.minutes - durationInSeconds);

    const updated = new User(
      user.id,
      user.name,
      user.email,
      user.isPremium,
      user.createdAt,
      user.avatar,
      nextSessions,
      nextMinutes,
      calculateStreak(nextSessions),
      calculateLevel(nextSessions)
    );

    await userStorage.save(updated);
    return updated;
  },
};
