import {
  BiometricAuthResult,
  BiometricAuthState,
  BiometricAvailability,
} from "./BiometricTypes";

export class MockBiometricManager {
  private state: BiometricAuthState = "Idle";
  private enabled = false;

  constructor(
    private availability: BiometricAvailability = {
      available: true,
      type: "Fingerprint",
    },
    private authResult: BiometricAuthResult = {
      success: true,
      state: "Success",
      message: "Mock authentication successful.",
    }
  ) {}

  getState() {
    return this.state;
  }

  setMockAvailability(value: BiometricAvailability) {
    this.availability = value;
  }

  setMockAuthResult(value: BiometricAuthResult) {
    this.authResult = value;
  }

  async checkAvailability(): Promise<BiometricAvailability> {
    this.state = this.availability.available ? "Idle" : "Unavailable";
    return this.availability;
  }

  async authenticate(): Promise<BiometricAuthResult> {
    if (!this.availability.available) {
      this.state = "Unavailable";

      return {
        success: false,
        state: "Unavailable",
        message: "Mock biometric sensor unavailable.",
      };
    }

    this.state = "Authenticating";

    if (this.authResult.success) {
      this.state = "Success";
      return this.authResult;
    }

    this.state = "Failed";
    return this.authResult;
  }

  async isEnabledByUser(): Promise<boolean> {
    return this.enabled;
  }

  async setEnabledByUser(value: boolean) {
    this.enabled = value;
  }
}
