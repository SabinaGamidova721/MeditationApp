import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import DetailsScreen from "../screens/DetailsScreen";
import HomeScreen from "../screens/HomeScreen";


const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: jest.fn(),
    addListener: jest.fn(() => jest.fn()),
  }),
}));


jest.mock("../context/AppContext", () => {
  const React = require("react");

  return {
    AppContext: React.createContext({
      darkMode: true,
      setDarkMode: jest.fn(),
      soundEnabled: true,
      setSoundEnabled: jest.fn(),
      theme: {
        bg: "#000",
        card: "#111",
        text: "#fff",
        sub: "#aaa",
        accent: "#0f0",
      },
      user: {},
      setUser: jest.fn(),
    }),
  };
});


const meditationMock = {
  title: "Test Meditation",
  description: "Relax",
  durations: [1, 5],
};


test("renders meditation details correctly", () => {
  const { getByText } = render(
    <DetailsScreen route={{ params: { meditation: meditationMock } }} />
  );

  expect(getByText("Test Meditation")).toBeTruthy();
  expect(getByText("Relax")).toBeTruthy();
});


test("selecting preset shows adjust mode", () => {
  const { getByText } = render(
    <DetailsScreen route={{ params: { meditation: meditationMock } }} />
  );

  fireEvent.press(getByText("1 min"));

  expect(getByText("Adjust time:")).toBeTruthy();
});


test("reset button resets time", () => {
  const { getByText } = render(
    <DetailsScreen route={{ params: { meditation: meditationMock } }} />
  );

  fireEvent.press(getByText("1 min"));
  fireEvent.press(getByText("RESET"));

  expect(getByText("0 min")).toBeTruthy();
});


test("start button navigates to player", () => {
  const { getByText } = render(
    <DetailsScreen route={{ params: { meditation: meditationMock } }} />
  );

  fireEvent.press(getByText("1 min"));
  fireEvent.press(getByText("START"));

  expect(mockNavigate).toHaveBeenCalledWith("Player", {
    duration: 60,
  });
});


test("home screen shows categories", () => {
  const { getByText } = render(<HomeScreen />);

  expect(getByText("Relax")).toBeTruthy();
  expect(getByText("Focus")).toBeTruthy();
  expect(getByText("Sleep")).toBeTruthy();
});


test("pressing open navigates to details", () => {
  const navigationMock = {
    navigate: jest.fn(),
  };

  const { getAllByText } = render(
    <HomeScreen navigation={navigationMock} />
  );

  fireEvent.press(getAllByText("Open →")[0]);

  expect(navigationMock.navigate).toHaveBeenCalledWith(
    "Details",
    expect.anything()
  );
});


test("seconds increase correctly", () => {
  const { getByText, getAllByText } = render(
    <DetailsScreen route={{ params: { meditation: meditationMock } }} />
  );

  fireEvent.press(getByText("1 min"));
  fireEvent.press(getAllByText("+")[1]);

  expect(getByText("10 sec")).toBeTruthy();
});


test("seconds overflow into minutes", () => {
  const { getByText, getAllByText } = render(
    <DetailsScreen route={{ params: { meditation: meditationMock } }} />
  );

  fireEvent.press(getByText("1 min"));

  for (let i = 0; i < 5; i++) {
    fireEvent.press(getAllByText("+")[1]);
  }

  fireEvent.press(getAllByText("+")[1]);

  expect(getByText("2 min")).toBeTruthy();
});
