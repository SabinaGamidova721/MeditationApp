import { SocketEvent } from "../models/SocketEvent";

export type SocketConnectionState =
  | "Disconnected"
  | "Connecting"
  | "Connected"
  | "Reconnecting";

type MessageHandler = (event: SocketEvent) => void;
type StateHandler = (state: SocketConnectionState) => void;

const parseSocketEvent = (raw: string): SocketEvent => {
  const parsed = JSON.parse(raw);

  return new SocketEvent(
    parsed.id,
    parsed.type,
    parsed.message,
    new Date(parsed.createdAt),
    parsed.payload
  );
};

export class SocketManager {
  private socket: WebSocket | null = null;
  private messageHandlers: MessageHandler[] = [];
  private stateHandlers: StateHandler[] = [];
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private manuallyDisconnected = false;
  private currentUrl = "";
  private state: SocketConnectionState = "Disconnected";

  constructor(
    private maxRetries: number = 1,
    private reconnectDelay: number = 1000
  ) {}

  getState() {
    return this.state;
  }

  connect(url: string) {
    this.currentUrl = url;
    this.manuallyDisconnected = false;
    this.setState("Connecting");

    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      this.reconnectAttempts = 0;
      this.setState("Connected");
    };

    this.socket.onmessage = (message) => {
      const event = parseSocketEvent(String(message.data));
      this.messageHandlers.forEach((handler) => handler(event));
    };

    this.socket.onerror = () => {
      this.handleConnectionLost();
    };

    this.socket.onclose = () => {
      this.handleConnectionLost();
    };
  }

  disconnect() {
    this.manuallyDisconnected = true;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    this.setState("Disconnected");
  }

  send(message: unknown) {
    if (!this.socket || this.state !== "Connected") {
      return;
    }

    this.socket.send(JSON.stringify(message));
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

  private handleConnectionLost() {
    if (this.manuallyDisconnected) {
      return;
    }

    if (this.reconnectAttempts < this.maxRetries) {
      this.reconnectAttempts += 1;
      this.setState("Reconnecting");

      this.reconnectTimer = setTimeout(() => {
        this.connect(this.currentUrl);
      }, this.reconnectDelay);

      return;
    }

    this.setState("Disconnected");
  }

  private setState(nextState: SocketConnectionState) {
    this.state = nextState;
    this.stateHandlers.forEach((handler) => handler(nextState));
  }
}
