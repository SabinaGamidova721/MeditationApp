import { Session } from "../models/Session";
import { sessionApi } from "../api/sessionApi";
import { sessionStorage } from "../storage/sessionStorage";

const createSessionId = () => `session-${Date.now()}`;

export const sessionRepository = {
  async initialize() {
    const local = await sessionStorage.getAll();

    if (!local) {
      await sessionStorage.saveAll([]);
    }
  },

  async getSessions(): Promise<Session[]> {
    const sessions = await sessionStorage.getAll();

    return sessions.sort((a, b) => b.date.getTime() - a.date.getTime());
  },

  async getSessionById(id: string): Promise<Session | null> {
    return sessionStorage.getById(id);
  },

  async saveSession(session: Session) {
    await sessionStorage.saveOne(session);
  },

  async deleteSession(id: string) {
    const existing = await sessionStorage.getById(id);

    await sessionStorage.deleteOne(id);

    if (existing?.syncStatus === "synced") {
      try {
        await sessionApi.deleteSession(id);
      } catch {
        console.log("Delete sync failed");
      }
    }
  },

  async createCompletedSession(
    meditationId: string,
    durationInSeconds: number
  ): Promise<Session> {
    const session = new Session(
      createSessionId(),
      meditationId,
      true,
      durationInSeconds,
      new Date(),
      "pending"
    );

    await sessionStorage.saveOne(session);

    void this.syncSession(session.id);

    return session;
  },

  async syncSession(id: string): Promise<Session | null> {
    const session = await sessionStorage.getById(id);

    if (!session) return null;

    try {
      await sessionApi.createSession(session);

      const synced = new Session(
        session.id,
        session.meditationId,
        session.completed,
        session.duration,
        session.date,
        "synced"
      );

      await sessionStorage.saveOne(synced);

      return synced;
    } catch (error: any) {
      const message = String(error?.message ?? "");

      if (message.includes("No internet connection")) {
        console.log("Session remains pending because device is offline");

        const pending = new Session(
          session.id,
          session.meditationId,
          session.completed,
          session.duration,
          session.date,
          "pending"
        );

        await sessionStorage.saveOne(pending);

        return pending;
      }

      const failed = new Session(
        session.id,
        session.meditationId,
        session.completed,
        session.duration,
        session.date,
        "error"
      );

      await sessionStorage.saveOne(failed);

      return failed;
    }
  },

  async syncPendingSessions(): Promise<Session[]> {
    const sessions = await sessionStorage.getAll();
    const pending = sessions.filter((s) => s.syncStatus === "pending");

    for (const session of pending) {
      await this.syncSession(session.id);
    }

    return this.getSessions();
  },
};
