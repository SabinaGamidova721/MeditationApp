import * as LocalAuthentication from "expo-local-authentication";
import {
  BiometricAuthResult,
  BiometricAuthState,
  BiometricAvailability,
  BiometricType,
} from "./BiometricTypes";
import { biometricStorage } from "./biometricStorage";

const mapBiometricType = (
  types: LocalAuthentication.AuthenticationType[]
): BiometricType => {
  if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
    return "Face ID";
  }

  if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
    return "Fingerprint";
  }

  if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
    return "Iris";
  }

  return "None";
};

export class BiometricManager {
  private state: BiometricAuthState = "Idle";

  getState() {
    return this.state;
  }

  private setState(nextState: BiometricAuthState) {
    this.state = nextState;
  }

  async checkAvailability(): Promise<BiometricAvailability> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();

      if (!hasHardware) {
        this.setState("Unavailable");

        return {
          available: false,
          type: "None",
          reason: "Biometric sensor is not available on this device.",
        };
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!isEnrolled) {
        this.setState("Unavailable");

        return {
          available: false,
          type: "None",
          reason: "Biometric sensor exists, but no biometric profile is enrolled.",
        };
      }

      const supportedTypes =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

      this.setState("Idle");

      return {
        available: true,
        type: mapBiometricType(supportedTypes),
      };
    } catch {
      this.setState("Unavailable");

      return {
        available: false,
        type: "None",
        reason: "System error while checking biometric availability.",
      };
    }
  }

  async authenticate(reason: string): Promise<BiometricAuthResult> {
    const availability = await this.checkAvailability();

    if (!availability.available) {
      this.setState("Unavailable");

      return {
        success: false,
        state: "Unavailable",
        message: availability.reason ?? "Biometric authentication is unavailable.",
      };
    }

    try {
      this.setState("Authenticating");

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason,
        cancelLabel: "Cancel",
        fallbackLabel: "Use password",
        disableDeviceFallback: false,
      });

      if (result.success) {
        this.setState("Success");

        return {
          success: true,
          state: "Success",
          message: "Authentication successful.",
        };
      }

      this.setState("Failed");

      return {
        success: false,
        state: "Failed",
        message: "Authentication was cancelled or failed.",
      };
    } catch {
      this.setState("Failed");

      return {
        success: false,
        state: "Failed",
        message: "System error during authentication.",
      };
    }
  }

  async isEnabledByUser(): Promise<boolean> {
    return biometricStorage.isEnabled();
  }

  async setEnabledByUser(value: boolean) {
    await biometricStorage.setEnabled(value);
  }
}

export const biometricManager = new BiometricManager();
