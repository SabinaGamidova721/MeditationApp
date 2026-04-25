import { delay } from "./utils";
import { Session } from "../models/Session";
import NetInfo from "@react-native-community/netinfo";

/*
API-контракт:

POST /sessions
Повертає: { success: true }
Тіло:
{
  id: string;
  meditationId: string;
  completed: boolean;
  duration: number;
  date: string;
}

DELETE /sessions/:id
Повертає: { success: true }
Параметри: id у path
*/

let remoteSessions: Session[] = [];

export const sessionApi = {
  async createSession(session: Session): Promise<{ success: true }> {
    console.log("API POST /sessions", session);

    await delay(700);

    const netState = await NetInfo.fetch();

    if (!netState.isConnected) {
      console.log("API POST /sessions failed: offline");
      throw new Error("No internet connection");
    }

    remoteSessions.push(
      new Session(
        session.id,
        session.meditationId,
        session.completed,
        session.duration,
        new Date(session.date),
        "synced"
      )
    );

    return { success: true };
  },

  async deleteSession(id: string): Promise<{ success: true }> {
    console.log(`API DELETE /sessions/${id}`);

    await delay(300);

    const netState = await NetInfo.fetch();

    if (!netState.isConnected) {
      console.log("API DELETE /sessions failed: offline");
      throw new Error("No internet connection");
    }

    remoteSessions = remoteSessions.filter((s) => s.id !== id);

    return { success: true };
  },
};
