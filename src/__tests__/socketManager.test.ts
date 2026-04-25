import { MockSocketManager } from "../socket/MockSocketManager";
import { SocketEvent } from "../models/SocketEvent";

jest.useFakeTimers();

describe("MockSocketManager", () => {
  test("connect changes state to Connected", () => {
    const socket = new MockSocketManager();
    const states: string[] = [];

    socket.onStateChange((state) => states.push(state));
    socket.connect("wss://mock");

    jest.advanceTimersByTime(500);

    expect(states).toContain("Connecting");
    expect(states).toContain("Connected");
  });

  test("disconnect changes state to Disconnected", () => {
    const socket = new MockSocketManager();

    socket.connect("wss://mock");
    jest.advanceTimersByTime(500);

    socket.disconnect();

    expect(socket.getState()).toBe("Disconnected");
  });

  test("onMessage receives emitted event", () => {
    const socket = new MockSocketManager();
    const handler = jest.fn();

    socket.onMessage(handler);

    const event = new SocketEvent(
      "1",
      "motivation",
      "Test message",
      new Date()
    );

    socket.emitTestMessage(event);

    expect(handler).toHaveBeenCalledWith(event);
  });

  test("simulateDisconnect reconnects automatically", () => {
    const socket = new MockSocketManager();
    const states: string[] = [];

    socket.onStateChange((state) => states.push(state));
    socket.connect("wss://mock");

    jest.advanceTimersByTime(500);

    socket.simulateDisconnect();

    expect(socket.getState()).toBe("Reconnecting");

    jest.advanceTimersByTime(1000);

    expect(socket.getState()).toBe("Connected");
    expect(states).toContain("Reconnecting");
  });

  test("send does not crash", () => {
    const socket = new MockSocketManager();

    expect(() => socket.send({ hello: "world" })).not.toThrow();
  });
});
