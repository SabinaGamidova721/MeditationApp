import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

import { meditationRepository } from "../repositories/meditationRepository";
import { sessionRepository } from "../repositories/sessionRepository";
import { userRepository } from "../repositories/userRepository";
import { Meditation } from "../models/Meditation";

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

describe("Repositories", () => {
  test("meditationRepository initializes default meditations", async () => {
    await meditationRepository.initialize();

    const items = await meditationRepository.getCachedMeditations();

    expect(items.length).toBeGreaterThan(0);
  });

  test("meditationRepository saves one meditation", async () => {
    const meditation = new Meditation(
      "test",
      "Test Meditation",
      "Description",
      "Relax",
      [1],
      false,
      new Date()
    );

    await meditationRepository.saveMeditation(meditation);

    const saved = await meditationRepository.getCachedMeditationById("test");

    expect(saved?.title).toBe("Test Meditation");
  });

  test("meditationRepository deletes meditation", async () => {
    const meditation = new Meditation(
      "delete-test",
      "Delete Test",
      "Description",
      "Focus",
      [5],
      false,
      new Date()
    );

    await meditationRepository.saveMeditation(meditation);
    await meditationRepository.deleteMeditation("delete-test");

    const saved = await meditationRepository.getCachedMeditationById(
      "delete-test"
    );

    expect(saved).toBeNull();
  });

  test("userRepository initializes user", async () => {
    await userRepository.initialize();

    const user = await userRepository.getUser();

    expect(user?.name).toBe("Anna");
  });


  test("userRepository adds completed session stats", async () => {
  await userRepository.initialize();

  const updated = await userRepository.addCompletedSession(70);

  expect(updated?.sessions).toBe(1);
  expect(updated?.minutes).toBe(70);
  expect(updated?.streak).toBe(0);
  expect(updated?.level).toBe(1);
});

  test("sessionRepository creates pending session", async () => {
    await sessionRepository.createCompletedSession("1", 60);

    const sessions = await sessionRepository.getSessions();

    expect(sessions.length).toBe(1);
    expect(sessions[0].syncStatus).toBe("pending");
  });

  test("sessionRepository syncs session when online", async () => {
    (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true });

    const created = await sessionRepository.createCompletedSession("1", 60);

    await sessionRepository.syncSession(created.id);

    const saved = await sessionRepository.getSessionById(created.id);

    expect(saved?.syncStatus).toBe("synced");
  });

  test("sessionRepository keeps pending when offline", async () => {
    (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: false });

    const created = await sessionRepository.createCompletedSession("1", 60);

    await sessionRepository.syncSession(created.id);

    const saved = await sessionRepository.getSessionById(created.id);

    expect(saved?.syncStatus).toBe("pending");
  });
});
