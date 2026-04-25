import AsyncStorage from "@react-native-async-storage/async-storage";

const BIOMETRIC_ENABLED_KEY = "APP_BIOMETRIC_ENABLED";
const LOCK_TIMEOUT_KEY = "APP_LOCK_TIMEOUT_SECONDS";

export const biometricStorage = {
  async setEnabled(value: boolean) {
    await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, String(value));
  },

  async isEnabled(): Promise<boolean> {
    const raw = await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY);
    return raw === "true";
  },

  async setLockTimeout(seconds: number) {
    await AsyncStorage.setItem(LOCK_TIMEOUT_KEY, String(seconds));
  },

  async getLockTimeout(): Promise<number> {
    const raw = await AsyncStorage.getItem(LOCK_TIMEOUT_KEY);

    if (!raw) return 30;

    const value = Number(raw);

    return Number.isFinite(value) ? value : 30;
  },
};
