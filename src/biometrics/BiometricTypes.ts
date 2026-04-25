export type BiometricAuthState =
  | "Idle"
  | "Authenticating"
  | "Success"
  | "Failed"
  | "Unavailable";

export type BiometricType =
  | "Face ID"
  | "Touch ID"
  | "Fingerprint"
  | "Iris"
  | "None";

export type BiometricAvailability = {
  available: boolean;
  type: BiometricType;
  reason?: string;
};

export type BiometricAuthResult = {
  success: boolean;
  state: BiometricAuthState;
  message: string;
};
