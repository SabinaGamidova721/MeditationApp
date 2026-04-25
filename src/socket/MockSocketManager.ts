import { SocketEvent } from "../models/SocketEvent";
import { SocketConnectionState } from "./SocketManager";

type MessageHandler = (event: SocketEvent) => void;
type StateHandler = (state: SocketConnectionState) => void;

export class MockSocketManager {
  private messageHandlers: MessageHandler[] = [];
  private stateHandlers: StateHandler[] = [];
  private interval: ReturnType<typeof setInterval> | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private state: SocketConnectionState = "Disconnected";
  private counter = 0;
  private manuallyDisconnected = false;

  getState() {
    return this.state;
  }

  connect(url: string) {
    console.log("MOCK WS connect:", url);

    this.manuallyDisconnected = false;
    this.setState("Connecting");

    setTimeout(() => {
      if (this.manuallyDisconnected) return;

      this.setState("Connected");
      this.startMessages();
    }, 500);
  }

  disconnect() {
    this.manuallyDisconnected = true;

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.setState("Disconnected");
  }

  send(message: unknown) {
    console.log("MOCK WS send:", message);
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.push(handler);

    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    };
  }

  onStateChange(handler: StateHandler) {
    this.stateHandlers.push(handler);

    return () => {
      this.stateHandlers = this.stateHandlers.filter((h) => h !== handler);
    };
  }

  simulateDisconnect() {
    if (this.manuallyDisconnected) return;

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    this.setState("Reconnecting");

    this.reconnectTimer = setTimeout(() => {
      if (this.manuallyDisconnected) return;

      this.setState("Connected");
      this.startMessages();
    }, 1000);
  }

  emitTestMessage(event: SocketEvent) {
    this.messageHandlers.forEach((handler) => handler(event));
  }

  private startMessages() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(() => {
      const event = this.createEvent();
      this.messageHandlers.forEach((handler) => handler(event));

      if (this.counter === 3) {
        this.simulateDisconnect();
      }
    }, 4000);
  }

  private createEvent(): SocketEvent {
    this.counter += 1;

    if (this.counter % 4 === 0) {
      return new SocketEvent(
        `event-${Date.now()}`,
        "session_bonus",
        "Server sent bonus: +1 meditation minute",
        new Date(),
        {
          bonusMinutes: 1,
        }
      );
    }

    if (this.counter % 3 === 0) {
      return new SocketEvent(
        `event-${Date.now()}`,
        "server_status",
        "Server status changed: online",
        new Date(),
        {
          status: "online",
        }
      );
    }

    if (this.counter % 2 === 0) {
      return new SocketEvent(
        `event-${Date.now()}`,
        "new_meditation",
        "New meditation is available",
        new Date(),
        {
          meditationId: `live-${Date.now()}`,
          title: "Live Breathing",
          description: "A real-time meditation from server event",
          category: "Relax",
          durations: [1, 3, 5],
        }
      );
    }

    return new SocketEvent(
      `event-${Date.now()}`,
      "motivation",
      "Take a calm breath. You are doing great.",
      new Date()
    );
  }

  private setState(nextState: SocketConnectionState) {
    this.state = nextState;
    this.stateHandlers.forEach((handler) => handler(nextState));
  }
}

export const mockSocketManager = new MockSocketManager();
