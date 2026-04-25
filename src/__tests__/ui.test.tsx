import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";

import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import StatsScreen from "../screens/StatsScreen";
import LiveScreen from "../screens/LiveScreen";

const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => {
  const React = require("react");

  return {
    useFocusEffect: (callback: any) => {
      React.useEffect(() => {
        return callback();
      }, [callback]);
    },

    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: jest.fn(),
      popToTop: jest.fn(),
      addListener: jest.fn(() => jest.fn()),
    }),
  };
});

jest.mock("../repositories/meditationRepository", () => ({
  meditationRepository: {
    getCachedMeditations: jest.fn(() =>
      Promise.resolve([
        {
          id: "1",
          title: "Morning Calm",
          description: "Start your day relaxed",
          category: "Relax",
          durations: [1, 5],
          isFavorite: false,
          createdAt: new Date(),
        },
        {
          id: "2",
          title: "Deep Focus",
          description: "Boost concentration",
          category: "Focus",
          durations: [10],
          isFavorite: false,
          createdAt: new Date(),
        },
        {
          id: "3",
          title: "Sleep Meditation",
          description: "Fall asleep faster",
          category: "Sleep",
          durations: [10],
          isFavorite: false,
          createdAt: new Date(),
        },
      ])
    ),
    refreshMeditations: jest.fn(() =>
      Promise.resolve([
        {
          id: "1",
          title: "Morning Calm",
          description: "Start your day relaxed",
          category: "Relax",
          durations: [1, 5],
          isFavorite: false,
          createdAt: new Date(),
        },
      ])
    ),
    saveMeditation: jest.fn(),
  },
}));

jest.mock("../repositories/sessionRepository", () => ({
  sessionRepository: {
    getSessions: jest.fn(() =>
      Promise.resolve([
        {
          id: "s1",
          meditationId: "1",
          completed: true,
          duration: 60,
          date: new Date(),
          syncStatus: "synced",
        },
        {
          id: "s2",
          meditationId: "1",
          completed: true,
          duration: 30,
          date: new Date(),
          syncStatus: "pending",
        },
      ])
    ),
  },
}));

jest.mock("../repositories/userRepository", () => ({
  userRepository: {
    addCompletedSession: jest.fn(() => Promise.resolve(null)),
  },
}));

jest.mock("../socket/MockSocketManager", () => ({
  mockSocketManager: {
    connect: jest.fn(),
    disconnect: jest.fn(),
    send: jest.fn(),
    simulateDisconnect: jest.fn(),
    onMessage: jest.fn(() => jest.fn()),
    onStateChange: jest.fn((handler) => {
      handler("Connected");
      return jest.fn();
    }),
  },
}));

const mockRefreshUser = jest.fn();

jest.mock("../context/AppContext", () => ({
  useAppContext: () => ({
    darkMode: true,
    soundEnabled: true,
    toggleDarkMode: jest.fn(),
    toggleSoundEnabled: jest.fn(),
    refreshUser: mockRefreshUser,
    user: {
      name: "Anna",
      email: "anna@mail.com",
      isPremium: true,
      sessions: 12,
      minutes: 340,
      streak: 5,
      level: 2,
    },
    theme: {
      bg: "#000",
      card: "#111",
      text: "#fff",
      sub: "#aaa",
      accent: "#0f0",
    },
  }),
}));

describe("UI", () => {
  test("HomeScreen shows title", async () => {
    const { getByText } = render(
      <HomeScreen navigation={{ navigate: mockNavigate }} />
    );

    await waitFor(() => {
      expect(getByText("Meditations")).toBeTruthy();
    });
  });

  test("HomeScreen shows categories", async () => {
    const { getByText } = render(
      <HomeScreen navigation={{ navigate: mockNavigate }} />
    );

    await waitFor(() => {
      expect(getByText("Relax")).toBeTruthy();
      expect(getByText("Focus")).toBeTruthy();
      expect(getByText("Sleep")).toBeTruthy();
    });
  });

  test("HomeScreen shows meditation from repository", async () => {
    const { getByText } = render(
      <HomeScreen navigation={{ navigate: mockNavigate }} />
    );

    await waitFor(() => {
      expect(getByText("Morning Calm")).toBeTruthy();
    });
  });

  test("pressing Open navigates to Details", async () => {
    const { getAllByText } = render(
      <HomeScreen navigation={{ navigate: mockNavigate }} />
    );

    await waitFor(() => {
      expect(getAllByText("Open →").length).toBeGreaterThan(0);
    });

    fireEvent.press(getAllByText("Open →")[0]);

    expect(mockNavigate).toHaveBeenCalledWith("Details", {
      meditationId: expect.any(String),
    });
  });

  test("SettingsScreen renders settings title", () => {
    const { getByText } = render(<SettingsScreen />);

    expect(getByText("Settings")).toBeTruthy();
  });

  test("SettingsScreen renders dark mode option", () => {
    const { getByText } = render(<SettingsScreen />);

    expect(getByText("Dark Mode")).toBeTruthy();
  });

  test("SettingsScreen renders sound option", () => {
    const { getByText } = render(<SettingsScreen />);

    expect(getByText("Sound")).toBeTruthy();
  });

  test("StatsScreen renders statistics title", async () => {
    const { getByText } = render(<StatsScreen />);

    await waitFor(() => {
      expect(getByText("Statistics")).toBeTruthy();
    });
  });

  test("StatsScreen renders total sessions", async () => {
    const { getByText } = render(<StatsScreen />);

    await waitFor(() => {
      expect(getByText("Total sessions")).toBeTruthy();
    });
  });

  test("StatsScreen renders pending sessions", async () => {
    const { getByText } = render(<StatsScreen />);

    await waitFor(() => {
      expect(getByText("Pending sessions")).toBeTruthy();
    });
  });

  test("LiveScreen renders title", async () => {
    const { getByText } = render(<LiveScreen />);

    await waitFor(() => {
      expect(getByText("Live Events")).toBeTruthy();
    });
  });

  test("LiveScreen renders websocket state", async () => {
    const { getByText } = render(<LiveScreen />);

    await waitFor(() => {
      expect(getByText("WebSocket state:")).toBeTruthy();
    });
  });

  test("LiveScreen renders connected state", async () => {
    const { getByText } = render(<LiveScreen />);

    await waitFor(() => {
      expect(getByText("Connected")).toBeTruthy();
    });
  });

  test("LiveScreen has reconnect button", () => {
    const { getByText } = render(<LiveScreen />);

    expect(getByText("Simulate reconnect")).toBeTruthy();
  });
});
