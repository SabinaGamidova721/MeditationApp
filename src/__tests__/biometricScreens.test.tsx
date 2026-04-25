import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import BiometricLoginScreen from "../screens/BiometricLoginScreen";
import SecurityScreen from "../screens/SecurityScreen";

jest.mock("@react-navigation/native", () => {
  const React = require("react");

  return {
    useFocusEffect: (callback: any) => {
      React.useEffect(() => {
        return callback();
      }, [callback]);
    },
  };
});

jest.mock("../context/AppContext", () => ({
  useAppContext: () => ({
    theme: {
      bg: "#000",
      card: "#111",
      text: "#fff",
      sub: "#aaa",
      accent: "#0f0",
    },
  }),
}));

describe("Biometric UI", () => {
  test("BiometricLoginScreen renders locked title", async () => {
    const { getByText } = render(
      <BiometricLoginScreen onUnlock={jest.fn()} />
    );

    await waitFor(() => {
      expect(getByText("ZenFlow Locked")).toBeTruthy();
    });
  });

  test("BiometricLoginScreen renders biometric button", async () => {
    const { getByText } = render(
      <BiometricLoginScreen onUnlock={jest.fn()} />
    );

    await waitFor(() => {
      expect(getByText("Unlock with biometrics")).toBeTruthy();
    });
  });

  test("BiometricLoginScreen unlocks with password", async () => {
    const onUnlock = jest.fn();

    const { getByPlaceholderText, getByText } = render(
      <BiometricLoginScreen onUnlock={onUnlock} />
    );

    fireEvent.changeText(getByPlaceholderText("Enter password"), "1234");
    fireEvent.press(getByText("Unlock with password"));

    expect(onUnlock).toHaveBeenCalled();
  });

  test("SecurityScreen renders title", async () => {
    const { getByText } = render(<SecurityScreen />);

    await waitFor(() => {
      expect(getByText("Security")).toBeTruthy();
    });
  });

  test("SecurityScreen renders biometric switch label", async () => {
    const { getByText } = render(<SecurityScreen />);

    await waitFor(() => {
      expect(getByText("Enable biometrics")).toBeTruthy();
    });
  });

  test("SecurityScreen renders lock timeout setting", async () => {
    const { getByText } = render(<SecurityScreen />);

    await waitFor(() => {
      expect(getByText("Lock timeout in seconds")).toBeTruthy();
    });
  });
});
