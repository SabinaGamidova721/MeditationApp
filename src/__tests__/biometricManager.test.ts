import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { BiometricManager } from "../biometrics/BiometricManager";
import { biometricStorage } from "../biometrics/biometricStorage";
import { MockBiometricManager } from "../biometrics/MockBiometricManager";

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

describe("BiometricManager", () => {
  test("checkAvailability returns unavailable without hardware", async () => {
    (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(false);

    const manager = new BiometricManager();
    const result = await manager.checkAvailability();

    expect(result.available).toBe(false);
    expect(result.type).toBe("None");
    expect(manager.getState()).toBe("Unavailable");
  });

  test("checkAvailability returns unavailable without enrolled profile", async () => {
    (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true);
    (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(false);

    const manager = new BiometricManager();
    const result = await manager.checkAvailability();

    expect(result.available).toBe(false);
    expect(manager.getState()).toBe("Unavailable");
  });

  test("checkAvailability detects fingerprint", async () => {
    (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true);
    (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(true);
    (
      LocalAuthentication.supportedAuthenticationTypesAsync as jest.Mock
    ).mockResolvedValue([LocalAuthentication.AuthenticationType.FINGERPRINT]);

    const manager = new BiometricManager();
    const result = await manager.checkAvailability();

    expect(result.available).toBe(true);
    expect(result.type).toBe("Fingerprint");
  });

  test("authenticate returns success", async () => {
    (LocalAuthentication.authenticateAsync as jest.Mock).mockResolvedValue({
      success: true,
    });

    const manager = new BiometricManager();
    const result = await manager.authenticate("Test reason");

    expect(result.success).toBe(true);
    expect(result.state).toBe("Success");
    expect(manager.getState()).toBe("Success");
  });

  test("authenticate returns failed when user cancels", async () => {
    (LocalAuthentication.authenticateAsync as jest.Mock).mockResolvedValue({
      success: false,
      error: "user_cancel",
    });

    const manager = new BiometricManager();
    const result = await manager.authenticate("Test reason");

    expect(result.success).toBe(false);
    expect(result.state).toBe("Failed");
    expect(manager.getState()).toBe("Failed");
  });

  test("isEnabledByUser reads saved true value", async () => {
    const manager = new BiometricManager();

    await manager.setEnabledByUser(true);

    const enabled = await manager.isEnabledByUser();

    expect(enabled).toBe(true);
  });

  test("isEnabledByUser reads saved false value", async () => {
    const manager = new BiometricManager();

    await manager.setEnabledByUser(false);

    const enabled = await manager.isEnabledByUser();

    expect(enabled).toBe(false);
  });

  test("lock timeout is saved and read correctly", async () => {
    await biometricStorage.setLockTimeout(45);

    const timeout = await biometricStorage.getLockTimeout();

    expect(timeout).toBe(45);
  });

  test("mock manager returns success scenario", async () => {
    const manager = new MockBiometricManager();

    const result = await manager.authenticate();

    expect(result.success).toBe(true);
    expect(manager.getState()).toBe("Success");
  });

  test("mock manager returns failed scenario", async () => {
    const manager = new MockBiometricManager(
      { available: true, type: "Fingerprint" },
      {
        success: false,
        state: "Failed",
        message: "Mock failed.",
      }
    );

    const result = await manager.authenticate();

    expect(result.success).toBe(false);
    expect(manager.getState()).toBe("Failed");
  });

  test("mock manager returns unavailable scenario", async () => {
    const manager = new MockBiometricManager({
      available: false,
      type: "None",
      reason: "No sensor.",
    });

    const result = await manager.authenticate();

    expect(result.success).toBe(false);
    expect(result.state).toBe("Unavailable");
    expect(manager.getState()).toBe("Unavailable");
  });

  test("mock manager saves enabled value", async () => {
    const manager = new MockBiometricManager();

    await manager.setEnabledByUser(true);

    const enabled = await manager.isEnabledByUser();

    expect(enabled).toBe(true);
  });
});
