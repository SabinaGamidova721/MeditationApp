import { ReactNode, useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import BiometricLoginScreen from "../screens/BiometricLoginScreen";
import { biometricManager } from "../biometrics/BiometricManager";
import { biometricStorage } from "../biometrics/biometricStorage";

type Props = {
  children: ReactNode;
};

export default function AuthGate({ children }: Props) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [requiresLock, setRequiresLock] = useState(false);
  const [backgroundAt, setBackgroundAt] = useState<number | null>(null);

  useEffect(() => {
    void initializeAuth();

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [backgroundAt]);

  const initializeAuth = async () => {
    const enabled = await biometricManager.isEnabledByUser();

    if (!enabled) {
      setIsUnlocked(true);
      setRequiresLock(false);
      return;
    }

    setIsUnlocked(false);
    setRequiresLock(true);
  };

  const handleAppStateChange = async (state: AppStateStatus) => {
    if (state === "background" || state === "inactive") {
      setBackgroundAt(Date.now());
      return;
    }

    if (state === "active" && backgroundAt) {
      const timeout = await biometricStorage.getLockTimeout();
      const diffInSeconds = Math.floor((Date.now() - backgroundAt) / 1000);

      if (diffInSeconds >= timeout) {
        const enabled = await biometricManager.isEnabledByUser();

        if (enabled) {
          setIsUnlocked(false);
          setRequiresLock(true);
        }
      }
    }
  };

  if (requiresLock && !isUnlocked) {
    return <BiometricLoginScreen onUnlock={() => setIsUnlocked(true)} />;
  }

  return <>{children}</>;
}
