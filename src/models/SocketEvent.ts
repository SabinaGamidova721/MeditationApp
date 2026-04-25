import { MeditationCategory } from "./Meditation";

export type SocketEventType =
  | "new_meditation"
  | "motivation"
  | "server_status"
  | "session_bonus";

export type ServerStatus = "online" | "maintenance";

export class SocketEvent {
  constructor(
    public id: string,
    public type: SocketEventType,
    public message: string,
    public createdAt: Date,
    public payload?: {
      meditationId?: string;
      title?: string;
      description?: string;
      category?: MeditationCategory;
      durations?: number[];
      bonusMinutes?: number;
      status?: ServerStatus;
    }
  ) {}
}
